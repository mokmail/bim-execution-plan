import { useRef, useState } from "react";
import type { BepDocument } from "../types/bep";
import { checkIfcApi, type IfcCheckResult } from "../lib/api";

// IFC/IDS model-checker UI. Upload an .ifc model; it validates against the
// checks auto-built from the open BEP's Data Exchange + LOD sections.
export function IfcChecker({ doc }: { doc: BepDocument }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IfcCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Build checks from the BEP's declared IFC version, exchange formats, and LOD matrix.
  const buildChecks = () => {
    const entities = new Set<string>();
    for (const row of doc.lod.matrix) {
      // Map LOD element names to IFC entity guesses.
      const ent = guessIfcEntity(row.element);
      if (ent) entities.add(ent);
    }
    // Add common entities from exchange names if present.
    for (const e of doc.dataExchange.exchanges) {
      const lower = e.name.toLowerCase();
      if (lower.includes("wall")) entities.add("IfcWall");
      if (lower.includes("slab") || lower.includes("floor")) entities.add("IfcSlab");
      if (lower.includes("door")) entities.add("IfcDoor");
      if (lower.includes("window")) entities.add("IfcWindow");
      if (lower.includes("roof")) entities.add("IfcRoof");
    }
    const requiredProperties: Record<string, string[]> = {};
    // If a LOD level is set, require a representative property on the entity.
    for (const row of doc.lod.matrix) {
      const ent = guessIfcEntity(row.element);
      if (ent && row.level) {
        const list = (requiredProperties[ent] = requiredProperties[ent] || []);
        if (!list.includes("FireRating") && row.level.startsWith("LOD 3")) list.push("FireRating");
      }
    }
    return {
      ifcVersion: doc.dataExchange.ifcVersion || "IFC 4",
      entities: [...entities],
      requiredProperties,
    };
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const checks = buildChecks();
      const eff = checks.entities.length > 0 ? checks : { ...checks, entities: DEFAULT_ENTITIES };
      const res = await checkIfcApi(file, eff);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "IFC check failed");
    } finally {
      setBusy(false);
    }
  };

  const checks = buildChecks();
  const hasEntities = checks.entities.length > 0;
  const entities = hasEntities ? checks.entities : DEFAULT_ENTITIES;

  return (
    <div className="ifc-checker">
      <h3>IFC / IDS model check</h3>
      <p className="muted ifc-hint">
        Upload an .ifc model to validate it against this BEP's data-exchange requirements.
      </p>

      <div className="ifc-actions">
        <button className="btn" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Checking…" : "Upload .ifc model"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".ifc,.IFC"
          style={{ display: "none" }}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {!hasEntities && (
        <p className="muted ifc-hint">
          No LOD/exchange entities found in this BEP — checking common building elements. Add LOD matrix rows to target specific entities.
        </p>
      )}

      <div className="ifc-checks-preview">
        {entities.length > 0 && (
          <div className="ifc-tags">
            {entities.map((e) => <span key={e} className="chip chip-on">{e}</span>)}
          </div>
        )}
        {checks.ifcVersion && <span className="muted ifc-ver">IFC: {checks.ifcVersion}</span>}
      </div>

      {error && <div className="banner-error ifc-error">{error}</div>}

      {result && (
        <div className={`ifc-result ${result.valid ? "ok" : "fail"}`}>
          <div className="ifc-result-head">
            <strong>{result.valid ? "✓ Model conforms" : "✗ Issues found"}</strong>
            <span className="muted">
              {result.summary.passed}/{result.summary.total} checks passed
            </span>
          </div>
          <ul className="ifc-result-list">
            {result.results.map((r, i) => (
              <li key={i} className={r.ok ? "ok" : "fail"}>
                <span className="compliance-mark">{r.ok ? "✓" : "✕"}</span>
                <span>
                  {r.check}
                  {r.detail && <span className="muted"> — {r.detail}</span>}
                  {r.missing && r.missing.length > 0 && (
                    <span className="muted"> — missing: {r.missing.join(", ")}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {result.issues.length > 0 && (
            <div className="ifc-issues">
              {result.issues.map((m, i) => <div key={i} className="ifc-issue">• {m}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Best-effort mapping from LOD element labels to IFC entity types.
function guessIfcEntity(label: string): string | null {
  const l = (label || "").toLowerCase();
  if (/wall/.test(l)) return "IfcWall";
  if (/slab|floor/.test(l)) return "IfcSlab";
  if (/door/.test(l)) return "IfcDoor";
  if (/window/.test(l)) return "IfcWindow";
  if (/roof/.test(l)) return "IfcRoof";
  if (/column/.test(l)) return "IfcColumn";
  if (/beam/.test(l)) return "IfcBeam";
  if (/stair/.test(l)) return "IfcStair";
  if (/space|room/.test(l)) return "IfcSpace";
  if (/curtain/.test(l)) return "IfcCurtainWall";
  if (/duct/.test(l)) return "IfcDuctSegment";
  if (/pipe/.test(l)) return "IfcPipeSegment";
  return null;
}

// Fallback set of common building elements checked when the BEP has no LOD/exchange entities.
const DEFAULT_ENTITIES = [
  "IfcWall",
  "IfcSlab",
  "IfcDoor",
  "IfcWindow",
  "IfcColumn",
  "IfcBeam",
];
