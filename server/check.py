#!/usr/bin/env python3
"""
IFC/IDS model-checking service.

Validates an IFC model against a set of information requirements (either an IDS
XML file or the BEP's structured checks) using ifcopenshell. Per the research:
linking BEP deliverables to model-checking and IDS/IFC exchange is the emerging
frontier, and Python/ifcopenshell is the canonical AEC validation stack.

Usage:
  python check.py <ifc_file> <checks.json>
  python check.py <ifc_file> <ids_file.ids>

Where checks.json is:
  { "ifcVersion": "IFC 4",
    "elements": ["IfcWall", "IfcSlab"],
    "requiredProperties": { "IfcWall": ["IsExternal", "FireRating"] } }

Prints JSON to stdout: { "valid": bool, "summary": {...}, "issues": [...] }
"""
import json
import os
import sys

import ifcopenshell
import ifcopenshell.validate  # noqa: F401


def check_ifc_version(ifc_file, expected):
    schema = (ifc_file.schema or "").lower()
    want = (expected or "").lower()
    if not want:
        return True
    # IFC 2x3 -> IFC2X3, IFC 4 -> IFC4, IFC 4.3 -> IFC4X3
    norm = {
        "ifc 2x3": "ifc2x3", "ifc2x3": "ifc2x3",
        "ifc 4": "ifc4", "ifc4": "ifc4",
        "ifc 4.3": "ifc4x3", "ifc4x3": "ifc4x3",
    }
    return norm.get(want) is not None and norm.get(want) == schema


def run_checks(ifc_file, checks):
    issues = []
    results = []

    # 1. Schema/version check
    ok = check_ifc_version(ifc_file, checks.get("ifcVersion"))
    results.append({"check": "IFC version", "ok": ok,
                    "detail": f"schema={ifc_file.schema}"})
    if not ok:
        issues.append(f"IFC schema {ifc_file.schema} does not match required {checks.get('ifcVersion')}")

    # 2. Entity presence
    for ent in checks.get("entities", []):
        count = ifc_file.by_type(ent)
        ok = len(count) > 0
        results.append({"check": f"entity {ent}", "ok": ok, "count": len(count)})
        if not ok:
            issues.append(f"No {ent} instances found")

    # 3. Required properties on entities
    for ent, props in (checks.get("requiredProperties") or {}).items():
        elements = ifc_file.by_type(ent)
        if not elements:
            issues.append(f"No {ent} to check properties against")
            results.append({"check": f"props on {ent}", "ok": False, "count": 0})
            continue
        found = set()
        for el in elements[:50]:  # sample to bound runtime
            for rel in el.IsDefinedBy or []:
                if rel.is_a("IfcRelDefinesByProperties"):
                    pset = rel.RelatingPropertyDefinition
                    if pset.is_a("IfcPropertySet"):
                        for p in (pset.HasProperties or []):
                            found.add(p.Name)
        missing = [p for p in props if p not in found]
        ok = len(missing) == 0
        results.append({"check": f"props on {ent}", "ok": ok,
                        "found": sorted(found), "missing": missing})
        for m in missing:
            issues.append(f"{ent} missing property {m}")

    summary = {"total": len(results), "passed": sum(1 for r in results if r["ok"]),
               "failed": sum(1 for r in results if not r["ok"])}
    return {"valid": summary["failed"] == 0, "summary": summary,
            "results": results, "issues": issues}


def check_ids(ifc_file, ids_file):
    """Validate IFC against an IDS (Information Delivery Specification) XML file."""
    try:
        import ifcopenshell.util.ids as ids
        requirement = ids.Requirement(ids_file)
        results = ids.validate(ifc_file, requirement)
        issues = []
        for spec in results.specifications:
            for attr in spec.applicability:
                if not attr.fulfilled:
                    issues.append(f"applicability not met: {spec.name}")
            for attr in spec.requirements:
                if not attr.fulfilled:
                    issues.append(f"requirement not met: {spec.name}: {attr.path}")
        return {"valid": len(issues) == 0, "summary": {"total": len(results.specifications),
                "passed": sum(1 for s in results.specifications if s.fulfilled),
                "failed": sum(1 for s in results.specifications if not s.fulfilled)},
                "results": [], "issues": issues}
    except ImportError as e:
        return {"valid": False, "summary": {}, "results": [],
                "issues": [f"IDS validation unavailable: {e}"]}


def main():
    import sys
    if len(sys.argv) < 3:
        print(json.dumps({"valid": False, "issues": ["usage: check.py <ifc> <checks.json|ids>"]}))
        sys.exit(2)
    ifc_path = sys.argv[1]
    req_path = sys.argv[2]
    if not os.path.exists(ifc_path):
        print(json.dumps({"valid": False, "issues": [f"IFC file not found: {ifc_path}"]}))
        sys.exit(1)
    ifc_file = ifcopenshell.open(ifc_path)
    if req_path.lower().endswith(".ids"):
        result = check_ids(ifc_file, req_path)
    else:
        with open(req_path) as f:
            checks = json.load(f)
        result = run_checks(ifc_file, checks)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
