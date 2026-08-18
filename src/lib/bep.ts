import type {
  BepDocument,
  BepBundle,
  VersionSnapshot,
} from "../types/bep";

// ---------- Versioning ----------
function nextVersion(prev?: string): string {
  if (!prev) return "0.1";
  const parts = prev.split(".");
  const minor = parseInt(parts[1] ?? "0", 10) + 1;
  return `${parts[0]}.${minor}`;
}

export function commitVersion(
  bundle: BepBundle,
  author: string,
  note: string,
): BepBundle {
  const next = nextVersion(bundle.current.documentControl.revision);
  const snapshot: VersionSnapshot = {
    version: next,
    date: new Date().toISOString(),
    author: author || "unknown",
    note,
    document: JSON.parse(JSON.stringify(bundle.current)),
  };
  const doc = bundle.current;
  doc.documentControl.revision = next;
  doc.documentControl.changes = [
    ...doc.documentControl.changes,
    {
      date: new Date().toISOString().slice(0, 10),
      version: next,
      description: note,
      author: author || "unknown",
    },
  ];
  doc.updatedAt = new Date().toISOString();
  return {
    current: doc,
    changelog: [snapshot, ...bundle.changelog],
  };
}

export function exportBundleJson(bundle: BepBundle): string {
  return JSON.stringify(bundle, null, 2);
}

export function importBundleJson(json: string): BepBundle {
  const parsed = JSON.parse(json);
  if (!parsed.current || !Array.isArray(parsed.changelog)) {
    throw new Error("Not a valid .bep bundle: missing current/changelog");
  }
  return parsed as BepBundle;
}

// ---------- Local persistence ----------
export function saveBundleLocal(bundle: BepBundle, key: string) {
  localStorage.setItem(key, exportBundleJson(bundle));
}
export function loadBundleLocal(key: string): BepBundle | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return importBundleJson(raw);
  } catch {
    return null;
  }
}
export function listLocalProjects(): { key: string; name: string; updated: string }[] {
  const out: { key: string; name: string; updated: string }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("bep.project.")) {
      const bundle = loadBundleLocal(key);
      if (bundle) {
        out.push({
          key,
          name: bundle.current.projectName,
          updated: bundle.current.updatedAt,
        });
      }
    }
  }
  return out.sort((a, b) => (a.updated < b.updated ? 1 : -1));
}
export function projectKey(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `bep.project.${slug || "untitled"}`;
}

// ---------- JSON Schema validation ----------
// Lightweight structural validation covering required fields & shapes.
export interface ValidationIssue {
  path: string;
  severity: "error" | "warning";
  message: string;
}

export function validateBep(doc: BepDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (path: string, message: string, severity: "error" | "warning" = "warning") =>
    issues.push({ path, message, severity });

  if (doc.mode !== "pre-appointment" && doc.mode !== "delivery") {
    push("mode", "mode must be pre-appointment or delivery", "error");
  }
  if (!doc.projectName.trim()) push("projectName", "Project name is required", "error");
  if (doc.documentControl.revision.trim() === "") {
    push("documentControl.revision", "Revision is empty", "warning");
  }
  if (doc.bimGoals.goals.length === 0) {
    push("bimGoals.goals", "No BIM goals defined", "warning");
  }
  if (doc.responsibilities.roles.length === 0) {
    push("responsibilities.roles", "No roles assigned", "warning");
  }
  if (doc.dataExchange.exchanges.length === 0) {
    push("dataExchange.exchanges", "No information exchanges defined", "warning");
  }
  if (doc.delivery.milestones.length === 0) {
    push("delivery.milestones", "No delivery milestones", "warning");
  }
  if (doc.lod.matrix.length === 0) {
    push("lod.matrix", "No LOD/LOIN matrix entries", "warning");
  }
  if (!doc.collaboration.cdePlatform.trim()) {
    push("collaboration.cdePlatform", "No CDE platform selected", "warning");
  }
  if (!doc.security.standard.trim()) {
    push("security.standard", "No security standard referenced", "warning");
  }

  // Cross-field checks
  const roleIds = new Set(doc.responsibilities.roles.map((r) => r.id));
  for (const [activity, cells] of Object.entries(doc.responsibilities.raci)) {
    for (const [roleId, val] of Object.entries(cells)) {
      if (!roleIds.has(roleId)) {
        push(
          `responsibilities.raci.${activity}.${roleId}`,
          `RACI references unknown role '${roleId}'`,
          "error",
        );
      }
      if (val !== "R" && val !== "A" && val !== "C" && val !== "I" && val !== "–") {
        push(
          `responsibilities.raci.${activity}.${roleId}`,
          `Invalid RACI value '${val}'`,
          "error",
        );
      }
    }
  }

  return issues;
}

export function errorsOnly(issues: ValidationIssue[]): ValidationIssue[] {
  return issues.filter((i) => i.severity === "error");
}

// ---------- Compliance checklist (ISO 19650-2 / NBIMS-US V4 essentials) ----------
export interface ComplianceItem {
  id: string;
  code: string;
  label: string;
  section: string;
  satisfied: (doc: BepDocument) => boolean;
}

export const complianceChecklist: ComplianceItem[] = [
  {
    id: "c1",
    code: "ISO 19650-2 §5.3.2",
    label: "Pre-appointment BEP exists for tendering stage",
    section: "Mode",
    satisfied: (d) => d.mode === "pre-appointment",
  },
  {
    id: "c2",
    code: "ISO 19650-2 §5.4.1",
    label: "Delivery-phase BEP developed from pre-appointment BEP",
    section: "Mode",
    satisfied: (d) => d.mode === "delivery",
  },
  {
    id: "c3",
    code: "ISO 19650-1 §5",
    label: "Roles and responsibilities defined for information delivery",
    section: "Roles",
    satisfied: (d) => d.responsibilities.roles.length > 0,
  },
  {
    id: "c4",
    code: "ISO 19650-1 §5.5",
    label: "Common Data Environment (CDE) specified",
    section: "Collaboration",
    satisfied: (d) => d.collaboration.cdePlatform.trim().length > 0,
  },
  {
    id: "c5",
    code: "ISO 19650-2 §5.4.1",
    label: "MIDP/TIDP structure defined (delivery milestones present)",
    section: "Delivery",
    satisfied: (d) => d.delivery.milestones.length > 0,
  },
  {
    id: "c6",
    code: "ISO 19650-1 §5.4",
    label: "Information exchanges and formats specified",
    section: "Data exchange",
    satisfied: (d) => d.dataExchange.exchanges.length > 0,
  },
  {
    id: "c7",
    code: "ISO 19650-5",
    label: "Security-minded approach addressed",
    section: "Security",
    satisfied: (d) => d.security.standard.trim().length > 0,
  },
  {
    id: "c8",
    code: "NBIMS-US V4",
    label: "Level of Development / Information Need defined per element",
    section: "LOD",
    satisfied: (d) => d.lod.matrix.length > 0,
  },
  {
    id: "c9",
    code: "ISO 19650-2",
    label: "Quality control / model checking procedure defined",
    section: "Quality",
    satisfied: (d) => d.qualityControl.validationProcedure.trim().length > 0,
  },
];

export function complianceStatus(doc: BepDocument): { item: ComplianceItem; met: boolean }[] {
  return complianceChecklist.map((item) => ({ item, met: item.satisfied(doc) }));
}

// ---------- Export: markdown → pandoc → DOCX/PDF ----------
export function bepToMarkdown(doc: BepDocument): string {
  const md: string[] = [];
  md.push(`# BIM Execution Plan — ${doc.projectName}`);
  md.push("");
  md.push(
    `*Mode: ${doc.mode} • Revision ${doc.documentControl.revision} • Status: ${doc.documentControl.status} • Updated ${doc.updatedAt.slice(0, 10)}*`,
  );
  md.push("");

  md.push("## 1. Document Control");
  md.push(`- **Document number:** ${doc.documentControl.documentNumber || "—"}`);
  md.push(`- **Revision:** ${doc.documentControl.revision}`);
  md.push(`- **Status:** ${doc.documentControl.status}`);
  md.push(`- **Author:** ${doc.documentControl.author || "—"}`);
  md.push(`- **Approver:** ${doc.documentControl.approver || "—"}`);
  md.push(`- **Distribution:** ${doc.documentControl.distribution || "—"}`);
  md.push(`- **Canonical location (CDE):** ${doc.documentControl.canonicalLocation || "—"}`);
  if (doc.documentControl.changes.length) {
    md.push("");
    md.push("**Change history:**");
    md.push("| Date | Version | Description | Author |");
    md.push("|---|---|---|---|");
    for (const c of doc.documentControl.changes) {
      md.push(`| ${c.date} | ${c.version} | ${c.description} | ${c.author} |`);
    }
  }
  md.push("");

  md.push("## 2. Project Information");
  const p = doc.projectInformation;
  md.push(`- **Project number:** ${p.projectNumber || "—"}`);
  md.push(`- **Project name:** ${p.projectName || "—"}`);
  md.push(`- **Owner/client:** ${p.owner || "—"}`);
  md.push(`- **Location:** ${p.location || "—"}`);
  md.push(`- **Description:** ${p.description || "—"}`);
  md.push(`- **Duration:** ${p.duration || "—"} (${p.startDate || "?"} → ${p.endDate || "?"})`);
  md.push(`- **Sector:** ${p.sector || "—"}`);
  md.push(`- **Delivery method:** ${p.deliveryMethod || "—"}`);
  md.push(`- **Contract route:** ${p.contractRoute || "—"}`);
  md.push("");

  md.push("## 3. BIM Goals & BIM Uses");
  md.push(`**Goals:** ${doc.bimGoals.goals.length ? doc.bimGoals.goals.join("; ") : "—"}`);
  if (doc.bimGoals.uses.length) {
    md.push("");
    md.push("| BIM Use | Phase | Responsible | Priority |");
    md.push("|---|---|---|---|");
    for (const u of doc.bimGoals.uses) {
      md.push(`| ${u.name} | ${u.phase} | ${u.responsibleParty} | ${u.priority} |`);
    }
  }
  md.push("");

  md.push("## 4. Roles & Responsibilities");
  if (doc.responsibilities.roles.length) {
    md.push("| Role | Person | Organization | Scope | Dedicated |");
    md.push("|---|---|---|---|---|");
    for (const r of doc.responsibilities.roles) {
      md.push(`| ${r.role} | ${r.person} | ${r.organization} | ${r.scope} | ${r.dedicated ? "Yes" : "No"} |`);
    }
    if (doc.responsibilities.raciActivities.length) {
      md.push("");
      md.push("**RACI matrix:**");
      const raciRoles = doc.responsibilities.roles.map((r) => r.role);
      md.push(`| Activity | ${raciRoles.join(" | ")} |`);
      md.push(`|${raciRoles.map(() => "---").join("|")}|`);
      for (const act of doc.responsibilities.raciActivities) {
        const cells = doc.responsibilities.raci[act] || {};
        const row = doc.responsibilities.roles
          .map((r) => cells[r.id] || "–")
          .join(" | ");
        md.push(`| ${act} | ${row} |`);
      }
    }
  } else {
    md.push("—");
  }
  md.push("");

  md.push("## 5. Collaboration Procedures");
  md.push(`- **CDE platform:** ${doc.collaboration.cdePlatform || "—"}`);
  md.push(`- **File structure:** ${doc.collaboration.fileStructure || "—"}`);
  md.push(`- **Naming convention:** ${doc.collaboration.namingConvention || "—"}`);
  md.push(`- **Workflow states:** ${doc.collaboration.workflowStates}`);
  md.push(`- **Transition authority:** ${doc.collaboration.transitionAuthority || "—"}`);
  md.push(`- **Meeting cadence:** ${doc.collaboration.meetingCadence || "—"}`);
  md.push(`- **Communication channels:** ${doc.collaboration.communicationChannels || "—"}`);
  md.push(`- **Escalation:** ${doc.collaboration.escalationProcedure || "—"}`);
  md.push("");

  md.push("## 6. Data Exchange Formats");
  md.push(`- **IFC version:** ${doc.dataExchange.ifcVersion || "—"}`);
  md.push(`- **MVD:** ${doc.dataExchange.mvd || "—"}`);
  if (doc.dataExchange.exchanges.length) {
    md.push("");
    md.push("| Exchange | Format | Version | Recipient | LOD | Author |");
    md.push("|---|---|---|---|---|---|");
    for (const e of doc.dataExchange.exchanges) {
      md.push(`| ${e.name} | ${e.format} | ${e.formatVersion} | ${e.recipient} | ${e.levelOfDetail} | ${e.responsibleAuthor} |`);
    }
  }
  md.push("");

  md.push("## 7. Software & Hardware");
  const sw = doc.software;
  const swRows = [...sw.authoring, ...sw.coordination, ...sw.analysis];
  if (swRows.length) {
    md.push("| Discipline | Software | Version | Purpose |");
    md.push("|---|---|---|---|");
    for (const s of swRows) {
      md.push(`| ${s.discipline} | ${s.software} | ${s.version} | ${s.purpose} |`);
    }
  }
  md.push(`- **Hardware:** ${sw.hardware || "—"}`);
  md.push("");

  md.push("## 8. Standards & Conventions");
  md.push(`- **Standards:** ${doc.standards.standards || "—"}`);
  md.push(`- **Classification:** ${doc.standards.classification || "—"}`);
  md.push(`- **Naming conventions:** ${doc.standards.namingConventions || "—"}`);
  md.push(`- **Property sets:** ${doc.standards.propertySets || "—"}`);
  md.push(`- **Units:** ${doc.standards.units || "—"}`);
  md.push(`- **Coordinates:** ${doc.standards.coordinates || "—"}`);
  md.push("");

  md.push("## 9. Level of Development / Information Need");
  md.push(`- **Specification:** ${doc.lod.specification || "—"}`);
  md.push(`- **LOIN framework:** ${doc.lod.loinFramework || "—"}`);
  if (doc.lod.matrix.length) {
    md.push("");
    md.push("| Element | Stage | Level | Responsible |");
    md.push("|---|---|---|---|");
    for (const row of doc.lod.matrix) {
      md.push(`| ${row.element} | ${row.stage} | ${row.level} | ${row.responsibleParty} |`);
    }
  }
  md.push("");

  md.push("## 10. Model Management & Coordination");
  md.push(`- **Model breakdown:** ${doc.modelManagement.breakdown || "—"}`);
  md.push(`- **Federation strategy:** ${doc.modelManagement.federationStrategy || "—"}`);
  md.push(`- **Clash tolerance:** ${doc.modelManagement.clashTolerance || "—"}`);
  md.push(`- **Coordination cadence:** ${doc.modelManagement.coordinationCadence || "—"}`);
  md.push(`- **Ownership/version control:** ${doc.modelManagement.ownership || "—"}`);
  md.push(`- **BCF workflow:** ${doc.modelManagement.bcfWorkflow || "—"}`);
  md.push("");

  md.push("## 11. Quality Control");
  md.push(`- **Validation procedure:** ${doc.qualityControl.validationProcedure || "—"}`);
  md.push(`- **Checklists:** ${doc.qualityControl.checklists || "—"}`);
  md.push(`- **QC responsibility:** ${doc.qualityControl.qcResponsibility || "—"}`);
  md.push(`- **Audit frequency:** ${doc.qualityControl.auditFrequency || "—"}`);
  md.push(`- **Non-conformance:** ${doc.qualityControl.nonConformance || "—"}`);
  md.push(`- **Reporting:** ${doc.qualityControl.reporting || "—"}`);
  md.push("");

  md.push("## 12. Delivery Milestones & Information Exchanges");
  md.push(`- **Work stage reference:** ${doc.delivery.workStageReference || "—"}`);
  if (doc.delivery.milestones.length) {
    md.push("");
    md.push("| Milestone | Date | Deliverable | Recipient | Format | Author |");
    md.push("|---|---|---|---|---|---|");
    for (const m of doc.delivery.milestones) {
      md.push(`| ${m.name} | ${m.date} | ${m.deliverable} | ${m.recipient} | ${m.format} | ${m.responsibleAuthor} |`);
    }
  }
  md.push("");

  md.push("## 13. Security");
  md.push(`- **Classification:** ${doc.security.classification || "—"}`);
  md.push(`- **Access control:** ${doc.security.accessControl || "—"}`);
  md.push(`- **Data protection:** ${doc.security.dataProtection || "—"}`);
  md.push(`- **Secure storage/transmission:** ${doc.security.secureStorage || "—"}`);
  md.push(`- **Responsibilities:** ${doc.security.responsibilities || "—"}`);
  md.push(`- **Standard:** ${doc.security.standard || "—"}`);
  md.push("");

  md.push("## 14. Training");
  md.push(`- **Needs assessment:** ${doc.training.needsAssessment || "—"}`);
  md.push(`- **Training plan:** ${doc.training.plan || "—"}`);
  md.push(`- **Competencies:** ${doc.training.competencies || "—"}`);
  md.push(`- **Onboarding:** ${doc.training.onboarding || "—"}`);
  md.push(`- **Lessons learned:** ${doc.training.lessonsLearned || "—"}`);
  md.push("");

  return md.join("\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
