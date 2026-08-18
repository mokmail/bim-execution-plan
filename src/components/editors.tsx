import { PENN_STATE_BIM_USES } from "../lib/templates";
import type { BepDocument, SoftwareItem } from "../types/bep";
import { Field, TextField, TextArea, Select, Checkbox, Combobox, AddButton, RemoveButton } from "./ui";
import {
  DELIVERY_METHODS,
  PROJECT_SECTORS,
  CONTRACT_ROUTES,
  CLASSIFICATION_SYSTEMS,
  LOD_SPECIFICATIONS,
  IFC_VERSIONS,
  MVD_OPTIONS,
  EXCHANGE_FORMATS,
  EXCHANGE_LOD,
  SOFTWARE_DISCIPLINES,
  AUTHORING_SOFTWARE,
  COORDINATION_SOFTWARE,
  CDE_PLATFORMS,
  SECURITY_STANDARDS,
  SECURITY_CLASSIFICATIONS,
  STANDARDS_OPTIONS,
  WORK_STAGE_REFERENCES,
  UNITS,
  COORDINATE_SYSTEMS,
  BIM_ROLES,
  PARTIES,
  COMPETENCE_LEVELS,
  WORKFLOW_STATES,
  MEETING_CADENCES,
  COMMUNICATION_CHANNELS,
  ESCALATION_PROCEDURES,
  TRANSITION_AUTHORITIES,
  CLASH_TOLERANCES,
  MODEL_BREAKDOWNS,
  FEDERATION_STRATEGIES,
  MODEL_OWNERSHIP,
  QC_VALIDATION_PROCEDURES,
  QC_CHECKLISTS,
  QC_RESPONSIBILITIES,
  AUDIT_FREQUENCIES,
  QC_REPORTING,
  NON_CONFORMANCE_PROCESSES,
  EXCHANGE_NAMES,
  DELIVERABLE_NAMES,
  MILESTONE_NAMES,
  LOD_ELEMENTS,
  LOD_STAGES,
  LOD_LEVELS,
  RESPONSIBLE_ROLES,
  SECURITY_ACCESS_CONTROL,
  DATA_PROTECTION,
  SECURE_STORAGE,
  SECURITY_RESPONSIBILITIES,
  TRAINING_NEEDS,
  COMPETENCE_REQUIREMENTS,
  TRAINING_PLANS,
  ONBOARDING,
  LESSONS_LEARNED,
  NAMING_CONVENTIONS,
  PROPERTY_SETS,
} from "../lib/options";

// Generic helper to update a BepDocument immutably.
type SetDoc = (updater: (d: BepDocument) => BepDocument) => void;

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- 1. Document Control ----------
export function DocumentControlEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const d = doc.documentControl;
  const up = (patch: Partial<typeof d>) =>
    setDoc((x) => ({ ...x, documentControl: { ...x.documentControl, ...patch } }));
  return (
    <div className="grid">
      <Field label="Document number">
        <TextField value={d.documentNumber} onChange={(v) => up({ documentNumber: v })} />
      </Field>
      <Field label="Revision">
        <TextField value={d.revision} onChange={(v) => up({ revision: v })} />
      </Field>
      <Field label="Status">
        <Select
          value={d.status}
          onChange={(v) => up({ status: v })}
          options={[
            { value: "draft", label: "Draft" },
            { value: "for-review", label: "For review" },
            { value: "approved", label: "Approved" },
            { value: "superseded", label: "Superseded" },
          ]}
        />
      </Field>
      <Field label="Author">
        <TextField value={d.author} onChange={(v) => up({ author: v })} />
      </Field>
      <Field label="Approver">
        <TextField value={d.approver} onChange={(v) => up({ approver: v })} />
      </Field>
      <Field label="Distribution">
        <TextField value={d.distribution} onChange={(v) => up({ distribution: v })} />
      </Field>
      <Field label="Canonical location (CDE link)" hint="Single source of truth — a key anti-failure practice.">
        <TextField value={d.canonicalLocation} onChange={(v) => up({ canonicalLocation: v })} />
      </Field>
      {d.changes.length > 0 && (
        <div className="full">
          <h4>Change history</h4>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Version</th><th>Description</th><th>Author</th></tr>
            </thead>
            <tbody>
              {d.changes.map((c, i) => (
                <tr key={i}><td>{c.date}</td><td>{c.version}</td><td>{c.description}</td><td>{c.author}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- 2. Project Information ----------
export function ProjectInformationEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const p = doc.projectInformation;
  const up = (patch: Partial<typeof p>) =>
    setDoc((x) => ({ ...x, projectInformation: { ...x.projectInformation, ...patch } }));
  return (
    <div className="grid">
      <Field label="Project number"><TextField value={p.projectNumber} onChange={(v) => up({ projectNumber: v })} /></Field>
      <Field label="Project name"><TextField value={p.projectName} onChange={(v) => { up({ projectName: v }); }} /></Field>
      <Field label="Owner / client"><TextField value={p.owner} onChange={(v) => up({ owner: v })} /></Field>
      <Field label="Location"><TextField value={p.location} onChange={(v) => up({ location: v })} /></Field>
      <Field label="Sector">
        <Combobox value={p.sector} onChange={(v) => up({ sector: v })} options={PROJECT_SECTORS} />
      </Field>
      <Field label="Delivery method">
        <Combobox value={p.deliveryMethod} onChange={(v) => up({ deliveryMethod: v })} options={DELIVERY_METHODS} />
      </Field>
      <Field label="Contract route">
        <Combobox value={p.contractRoute} onChange={(v) => up({ contractRoute: v })} options={CONTRACT_ROUTES} />
      </Field>
      <Field label="Start date"><TextField value={p.startDate} onChange={(v) => up({ startDate: v })} /></Field>
      <Field label="End date"><TextField value={p.endDate} onChange={(v) => up({ endDate: v })} /></Field>
      <Field label="Duration / key dates"><TextField value={p.duration} onChange={(v) => up({ duration: v })} /></Field>
      <div className="full">
        <Field label="Project description"><TextArea value={p.description} onChange={(v) => up({ description: v })} /></Field>
      </div>
    </div>
  );
}

// ---------- 3. BIM Goals & Uses ----------
export function BimGoalsEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const g = doc.bimGoals;
  const setGoals = (goals: string[]) => setDoc((x) => ({ ...x, bimGoals: { ...x.bimGoals, goals } }));
  const setUses = (uses: typeof g.uses) => setDoc((x) => ({ ...x, bimGoals: { ...x.bimGoals, uses } }));
  return (
    <div>
      <h4>Project BIM goals</h4>
      {g.goals.map((goal, i) => (
        <div key={i} className="row">
          <TextField value={goal} onChange={(v) => setGoals(g.goals.map((x, j) => (j === i ? v : x)))} />
          <RemoveButton onClick={() => setGoals(g.goals.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton label="Add goal" onClick={() => setGoals([...g.goals, ""])} />
      <h4>BIM Uses</h4>
      {g.uses.length === 0 && <p className="muted">No BIM uses yet.</p>}
      {g.uses.map((u) => (
        <div key={u.id} className="card">
          <div className="row">
            <Field label="BIM Use name"><Combobox value={u.name} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, name: v } : x))} options={PENN_STATE_BIM_USES} /></Field>
            <Field label="Phase">
              <Select value={u.phase} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, phase: v } : x))}
                options={[
                  { value: "planning", label: "Planning" },
                  { value: "design", label: "Design" },
                  { value: "construction", label: "Construction" },
                  { value: "operations", label: "Operations" },
                  { value: "handover", label: "Handover" },
                ]} />
            </Field>
            <Field label="Priority">
              <Select value={u.priority} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, priority: v } : x))}
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]} />
            </Field>
            <RemoveButton onClick={() => setUses(g.uses.filter((x) => x.id !== u.id))} />
          </div>
          <Field label="Responsible party"><Combobox value={u.responsibleParty} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, responsibleParty: v } : x))} options={PARTIES} /></Field>
          <Field label="Competence required"><Combobox value={u.competence} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, competence: v } : x))} options={COMPETENCE_LEVELS} /></Field>
          <Field label="Gaps / deficiencies"><TextArea rows={2} value={u.gaps} onChange={(v) => setUses(g.uses.map((x) => x.id === u.id ? { ...x, gaps: v } : x))} /></Field>
        </div>
      ))}
      <AddButton label="Add BIM Use" onClick={() => setUses([...g.uses, { id: uid("use"), name: "", description: "", phase: "design", responsibleParty: "", priority: "medium", competence: "", gaps: "" }])} />
    </div>
  );
}

// ---------- 4. Roles & Responsibilities ----------
export function RolesEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const r = doc.responsibilities;
  const setRoles = (roles: typeof r.roles) => setDoc((x) => ({ ...x, responsibilities: { ...x.responsibilities, roles } }));
  const setRaci = (raci: typeof r.raci) => setDoc((x) => ({ ...x, responsibilities: { ...x.responsibilities, raci } }));
  const setActivities = (a: string[]) => setDoc((x) => ({ ...x, responsibilities: { ...x.responsibilities, raciActivities: a } }));
  return (
    <div>
      <h4>Team roles</h4>
      {r.roles.map((role) => (
        <div key={role.id} className="card">
          <div className="row">
            <Field label="Role"><Combobox value={role.role} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, role: v } : x))} options={BIM_ROLES} /></Field>
            <Field label="Person"><TextField value={role.person} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, person: v } : x))} /></Field>
            <Field label="Organization"><Combobox value={role.organization} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, organization: v } : x))} options={PARTIES} /></Field>
            <RemoveButton onClick={() => setRoles(r.roles.filter((x) => x.id !== role.id))} />
          </div>
          <div className="row">
            <Field label="Email"><TextField value={role.email} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, email: v } : x))} /></Field>
            <div className="field">
              <span className="field-label">Dedicated role</span>
              <Checkbox checked={role.dedicated} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, dedicated: v } : x))} label="Dedicated" />
            </div>
          </div>
          <Field label="Scope of responsibility"><TextArea rows={2} value={role.scope} onChange={(v) => setRoles(r.roles.map((x) => x.id === role.id ? { ...x, scope: v } : x))} /></Field>
        </div>
      ))}
      <AddButton label="Add role" onClick={() => setRoles([...r.roles, { id: uid("role"), role: "", person: "", organization: "", email: "", scope: "", dedicated: false }])} />
      {r.roles.length > 0 && (
        <>
          <h4>RACI matrix</h4>
          <Field label="Activities (one per line)">
            <TextArea value={r.raciActivities.join("\n")} rows={4} onChange={(v) => setActivities(v.split("\n").map((s) => s.trim()).filter(Boolean))} />
          </Field>
          {r.raciActivities.length > 0 && (
            <table className="table">
              <thead>
                <tr><th>Activity</th>{r.roles.map((role) => <th key={role.id}>{role.role}</th>)}</tr>
              </thead>
              <tbody>
                {r.raciActivities.map((act) => (
                  <tr key={act}>
                    <td>{act}</td>
                    {r.roles.map((role) => {
                      const val = (r.raci[act] || {})[role.id] || "–";
                      return (
                        <td key={role.id}>
                          <select
                            className="input raci-input"
                            value={val}
                            onChange={(e) => setRaci({
                              ...r.raci,
                              [act]: { ...(r.raci[act] || {}), [role.id]: e.target.value as any },
                            })}
                          >
                            {["R", "A", "C", "I", "–"].map((x) => <option key={x} value={x}>{x}</option>)}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

// ---------- 5. Collaboration ----------
export function CollaborationEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const c = doc.collaboration;
  const up = (patch: Partial<typeof c>) => setDoc((x) => ({ ...x, collaboration: { ...x.collaboration, ...patch } }));
  return (
    <div className="grid">
      <Field label="CDE platform">
        <Combobox value={c.cdePlatform} onChange={(v) => up({ cdePlatform: v })} options={CDE_PLATFORMS} />
      </Field>
      <Field label="Naming convention"><Combobox value={c.namingConvention} onChange={(v) => up({ namingConvention: v })} options={NAMING_CONVENTIONS} /></Field>
      <div className="full">
        <Field label="Workflow states"><Combobox value={c.workflowStates} onChange={(v) => up({ workflowStates: v })} options={WORKFLOW_STATES} /></Field>
      </div>
      <div className="full"><Field label="File/folder structure"><TextArea value={c.fileStructure} onChange={(v) => up({ fileStructure: v })} /></Field></div>
      <Field label="Transition authority"><Combobox value={c.transitionAuthority} onChange={(v) => up({ transitionAuthority: v })} options={TRANSITION_AUTHORITIES} /></Field>
      <Field label="Meeting cadence"><Combobox value={c.meetingCadence} onChange={(v) => up({ meetingCadence: v })} options={MEETING_CADENCES} /></Field>
      <Field label="Communication channels"><Combobox value={c.communicationChannels} onChange={(v) => up({ communicationChannels: v })} options={COMMUNICATION_CHANNELS} /></Field>
      <div className="full"><Field label="Escalation procedure"><Combobox value={c.escalationProcedure} onChange={(v) => up({ escalationProcedure: v })} options={ESCALATION_PROCEDURES} /></Field></div>
    </div>
  );
}

// ---------- 6. Data Exchange ----------
export function DataExchangeEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const d = doc.dataExchange;
  const up = (patch: Partial<typeof d>) => setDoc((x) => ({ ...x, dataExchange: { ...x.dataExchange, ...patch } }));
  const setExchanges = (exchanges: typeof d.exchanges) => setDoc((x) => ({ ...x, dataExchange: { ...x.dataExchange, exchanges } }));
  return (
    <div>
      <div className="row">
        <Field label="IFC version">
          <Combobox value={d.ifcVersion} onChange={(v) => up({ ifcVersion: v })} options={IFC_VERSIONS} />
        </Field>
        <Field label="Model View Definition (MVD)">
          <Combobox value={d.mvd} onChange={(v) => up({ mvd: v })} options={MVD_OPTIONS} />
        </Field>
      </div>
      <h4>Information exchanges</h4>
      {d.exchanges.length === 0 && <p className="muted">No exchanges defined yet.</p>}
      {d.exchanges.map((e) => (
        <div key={e.id} className="card">
          <div className="row">
            <Field label="Name"><Combobox value={e.name} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, name: v } : x))} options={EXCHANGE_NAMES} /></Field>
            <Field label="Format">
              <Combobox value={e.format} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, format: v } : x))} options={EXCHANGE_FORMATS} />
            </Field>
            <Field label="Version"><TextField value={e.formatVersion} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, formatVersion: v } : x))} /></Field>
            <RemoveButton onClick={() => setExchanges(d.exchanges.filter((x) => x.id !== e.id))} />
          </div>
          <div className="row">
            <Field label="Recipient"><Combobox value={e.recipient} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, recipient: v } : x))} options={PARTIES} /></Field>
            <Field label="Level of detail">
              <Combobox value={e.levelOfDetail} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, levelOfDetail: v } : x))} options={EXCHANGE_LOD} />
            </Field>
            <Field label="Responsible author"><Combobox value={e.responsibleAuthor} onChange={(v) => setExchanges(d.exchanges.map((x) => x.id === e.id ? { ...x, responsibleAuthor: v } : x))} options={RESPONSIBLE_ROLES} /></Field>
          </div>
        </div>
      ))}
      <AddButton label="Add exchange" onClick={() => setExchanges([...d.exchanges, { id: uid("ex"), name: "", format: "IFC", formatVersion: "", recipient: "", levelOfDetail: "", responsibleAuthor: "" }])} />
    </div>
  );
}

// ---------- 7. Software & Hardware ----------
function SoftwareList({
  title,
  items,
  softwareOptions,
  onChange,
}: {
  title: string;
  items: SoftwareItem[];
  softwareOptions: string[];
  onChange: (items: SoftwareItem[]) => void;
}) {
  return (
    <div>
      <h4>{title}</h4>
      {items.map((s) => (
        <div key={s.id} className="row">
          <Combobox value={s.discipline} placeholder="Discipline" onChange={(v) => onChange(items.map((x) => x.id === s.id ? { ...x, discipline: v } : x))} options={SOFTWARE_DISCIPLINES} />
          <Combobox value={s.software} placeholder="Software" onChange={(v) => onChange(items.map((x) => x.id === s.id ? { ...x, software: v } : x))} options={softwareOptions} />
          <TextField value={s.version} placeholder="Version" onChange={(v) => onChange(items.map((x) => x.id === s.id ? { ...x, version: v } : x))} />
          <RemoveButton onClick={() => onChange(items.filter((x) => x.id !== s.id))} />
        </div>
      ))}
      <AddButton label={`Add ${title.toLowerCase()}`} onClick={() => onChange([...items, { id: uid("sw"), discipline: "", software: "", version: "", purpose: "" }])} />
    </div>
  );
}

export function SoftwareEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const s = doc.software;
  const set = (patch: Partial<typeof s>) => setDoc((x) => ({ ...x, software: { ...x.software, ...patch } }));
  return (
    <div>
      <SoftwareList title="Authoring software" items={s.authoring} softwareOptions={AUTHORING_SOFTWARE} onChange={(items) => set({ authoring: items })} />
      <SoftwareList title="Coordination / clash detection" items={s.coordination} softwareOptions={COORDINATION_SOFTWARE} onChange={(items) => set({ coordination: items })} />
      <SoftwareList title="Analysis / simulation" items={s.analysis} softwareOptions={[...AUTHORING_SOFTWARE, ...COORDINATION_SOFTWARE]} onChange={(items) => set({ analysis: items })} />
      <div className="full"><Field label="Hardware requirements"><TextArea value={s.hardware} onChange={(v) => set({ hardware: v })} /></Field></div>
    </div>
  );
}

// ---------- 8. Standards & Conventions ----------
export function StandardsEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const st = doc.standards;
  const up = (patch: Partial<typeof st>) => setDoc((x) => ({ ...x, standards: { ...x.standards, ...patch } }));
  return (
    <div className="grid">
      <div className="full"><Field label="Applicable standards">
        <Combobox value={st.standards} onChange={(v) => up({ standards: v })} options={STANDARDS_OPTIONS} />
      </Field></div>
      <Field label="Classification system">
        <Combobox value={st.classification} onChange={(v) => up({ classification: v })} options={CLASSIFICATION_SYSTEMS} />
      </Field>
      <Field label="Units">
        <Combobox value={st.units} onChange={(v) => up({ units: v })} options={UNITS} />
      </Field>
      <Field label="Coordinates / geolocation">
        <Combobox value={st.coordinates} onChange={(v) => up({ coordinates: v })} options={COORDINATE_SYSTEMS} />
      </Field>
      <div className="full"><Field label="Naming conventions"><Combobox value={st.namingConventions} onChange={(v) => up({ namingConventions: v })} options={NAMING_CONVENTIONS} /></Field></div>
      <div className="full"><Field label="Property sets / data templates"><Combobox value={st.propertySets} onChange={(v) => up({ propertySets: v })} options={PROPERTY_SETS} /></Field></div>
    </div>
  );
}

// ---------- 9. Level of Development ----------
export function LodEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const l = doc.lod;
  const up = (patch: Partial<typeof l>) => setDoc((x) => ({ ...x, lod: { ...x.lod, ...patch } }));
  const setMatrix = (matrix: typeof l.matrix) => setDoc((x) => ({ ...x, lod: { ...x.lod, matrix } }));
  return (
    <div>
      <div className="row">
        <Field label="LOD specification">
          <Combobox value={l.specification} onChange={(v) => up({ specification: v })} options={LOD_SPECIFICATIONS} />
        </Field>
        <Field label="LOIN framework"><TextField value={l.loinFramework} onChange={(v) => up({ loinFramework: v })} /></Field>
      </div>
      <h4>LOD / LOIN matrix</h4>
      {l.matrix.length === 0 && <p className="muted">No matrix entries yet.</p>}
      {l.matrix.map((row) => (
        <div key={row.id} className="row">
          <Combobox value={row.element} placeholder="Element / system" onChange={(v) => setMatrix(l.matrix.map((x) => x.id === row.id ? { ...x, element: v } : x))} options={LOD_ELEMENTS} />
          <Combobox value={row.stage} placeholder="Stage" onChange={(v) => setMatrix(l.matrix.map((x) => x.id === row.id ? { ...x, stage: v } : x))} options={LOD_STAGES} />
          <Combobox value={row.level} placeholder="LOD / LOIN" onChange={(v) => setMatrix(l.matrix.map((x) => x.id === row.id ? { ...x, level: v } : x))} options={LOD_LEVELS} />
          <Combobox value={row.responsibleParty} placeholder="Responsible" onChange={(v) => setMatrix(l.matrix.map((x) => x.id === row.id ? { ...x, responsibleParty: v } : x))} options={RESPONSIBLE_ROLES} />
          <RemoveButton onClick={() => setMatrix(l.matrix.filter((x) => x.id !== row.id))} />
        </div>
      ))}
      <AddButton label="Add matrix row" onClick={() => setMatrix([...l.matrix, { id: uid("lod"), element: "", stage: "", level: "", responsibleParty: "" }])} />
    </div>
  );
}

// ---------- 10. Model Management ----------
export function ModelManagementEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const m = doc.modelManagement;
  const up = (patch: Partial<typeof m>) => setDoc((x) => ({ ...x, modelManagement: { ...x.modelManagement, ...patch } }));
  return (
    <div className="grid">
      <Field label="Model breakdown structure"><Combobox value={m.breakdown} onChange={(v) => up({ breakdown: v })} options={MODEL_BREAKDOWNS} /></Field>
      <Field label="Clash tolerance"><Combobox value={m.clashTolerance} onChange={(v) => up({ clashTolerance: v })} options={CLASH_TOLERANCES} /></Field>
      <div className="full"><Field label="Federation strategy"><Combobox value={m.federationStrategy} onChange={(v) => up({ federationStrategy: v })} options={FEDERATION_STRATEGIES} /></Field></div>
      <Field label="Coordination cadence"><Combobox value={m.coordinationCadence} onChange={(v) => up({ coordinationCadence: v })} options={MEETING_CADENCES} /></Field>
      <Field label="Model ownership / version control"><Combobox value={m.ownership} onChange={(v) => up({ ownership: v })} options={MODEL_OWNERSHIP} /></Field>
      <div className="full"><Field label="BCF issue workflow"><Combobox value={m.bcfWorkflow} onChange={(v) => up({ bcfWorkflow: v })} options={["BCF topics: Open → In Progress → Closed", "BCF issues logged and tracked per coordination cycle", "BCF + clash detection workflow"]} /></Field></div>
    </div>
  );
}

// ---------- 11. Quality Control ----------
export function QualityControlEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const q = doc.qualityControl;
  const up = (patch: Partial<typeof q>) => setDoc((x) => ({ ...x, qualityControl: { ...x.qualityControl, ...patch } }));
  return (
    <div className="grid">
      <div className="full"><Field label="Model validation / checking procedure"><Combobox value={q.validationProcedure} onChange={(v) => up({ validationProcedure: v })} options={QC_VALIDATION_PROCEDURES} /></Field></div>
      <div className="full"><Field label="Quality control checklists"><Combobox value={q.checklists} onChange={(v) => up({ checklists: v })} options={QC_CHECKLISTS} /></Field></div>
      <Field label="QC responsibility"><Combobox value={q.qcResponsibility} onChange={(v) => up({ qcResponsibility: v })} options={QC_RESPONSIBILITIES} /></Field>
      <Field label="Audit / review frequency"><Combobox value={q.auditFrequency} onChange={(v) => up({ auditFrequency: v })} options={AUDIT_FREQUENCIES} /></Field>
      <div className="full"><Field label="Non-conformance / issue resolution"><Combobox value={q.nonConformance} onChange={(v) => up({ nonConformance: v })} options={NON_CONFORMANCE_PROCESSES} /></Field></div>
      <div className="full"><Field label="Reporting"><Combobox value={q.reporting} onChange={(v) => up({ reporting: v })} options={QC_REPORTING} /></Field></div>
    </div>
  );
}

// ---------- 12. Delivery ----------
export function DeliveryEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const d = doc.delivery;
  const up = (patch: Partial<typeof d>) => setDoc((x) => ({ ...x, delivery: { ...x.delivery, ...patch } }));
  const setMilestones = (ms: typeof d.milestones) => setDoc((x) => ({ ...x, delivery: { ...x.delivery, milestones: ms } }));
  return (
    <div>
      <Field label="Work stage reference (e.g. RIBA Plan of Work)">
        <Combobox value={d.workStageReference} onChange={(v) => up({ workStageReference: v })} options={WORK_STAGE_REFERENCES} />
      </Field>
      <h4>Milestones & information exchanges</h4>
      {d.milestones.length === 0 && <p className="muted">No milestones yet.</p>}
      {d.milestones.map((m) => (
        <div key={m.id} className="card">
          <div className="row">
            <Field label="Milestone"><Combobox value={m.name} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, name: v } : x))} options={MILESTONE_NAMES} /></Field>
            <Field label="Date"><TextField value={m.date} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, date: v } : x))} /></Field>
            <RemoveButton onClick={() => setMilestones(d.milestones.filter((x) => x.id !== m.id))} />
          </div>
          <div className="row">
            <Field label="Deliverable"><Combobox value={m.deliverable} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, deliverable: v } : x))} options={DELIVERABLE_NAMES} /></Field>
            <Field label="Recipient"><Combobox value={m.recipient} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, recipient: v } : x))} options={PARTIES} /></Field>
            <Field label="Format"><Combobox value={m.format} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, format: v } : x))} options={EXCHANGE_FORMATS} /></Field>
          </div>
          <Field label="Responsible author"><Combobox value={m.responsibleAuthor} onChange={(v) => setMilestones(d.milestones.map((x) => x.id === m.id ? { ...x, responsibleAuthor: v } : x))} options={RESPONSIBLE_ROLES} /></Field>
        </div>
      ))}
      <AddButton label="Add milestone" onClick={() => setMilestones([...d.milestones, { id: uid("ms"), name: "", date: "", deliverable: "", recipient: "", format: "", responsibleAuthor: "", notes: "" }])} />
    </div>
  );
}

// ---------- 13. Security ----------
export function SecurityEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const s = doc.security;
  const up = (patch: Partial<typeof s>) => setDoc((x) => ({ ...x, security: { ...x.security, ...patch } }));
  return (
    <div className="grid">
      <Field label="Security standard">
        <Combobox value={s.standard} onChange={(v) => up({ standard: v })} options={SECURITY_STANDARDS} />
      </Field>
      <Field label="Security classification">
        <Combobox value={s.classification} onChange={(v) => up({ classification: v })} options={SECURITY_CLASSIFICATIONS} />
      </Field>
      <div className="full"><Field label="Access control & permissions"><Combobox value={s.accessControl} onChange={(v) => up({ accessControl: v })} options={SECURITY_ACCESS_CONTROL} /></Field></div>
      <div className="full"><Field label="Data protection / confidentiality"><Combobox value={s.dataProtection} onChange={(v) => up({ dataProtection: v })} options={DATA_PROTECTION} /></Field></div>
      <div className="full"><Field label="Secure storage & transmission"><Combobox value={s.secureStorage} onChange={(v) => up({ secureStorage: v })} options={SECURE_STORAGE} /></Field></div>
      <div className="full"><Field label="Security responsibilities & incident response"><Combobox value={s.responsibilities} onChange={(v) => up({ responsibilities: v })} options={SECURITY_RESPONSIBILITIES} /></Field></div>
    </div>
  );
}

// ---------- 14. Training ----------
export function TrainingEditor({ doc, setDoc }: { doc: BepDocument; setDoc: SetDoc }) {
  const t = doc.training;
  const up = (patch: Partial<typeof t>) => setDoc((x) => ({ ...x, training: { ...x.training, ...patch } }));
  return (
    <div className="grid">
      <Field label="Training needs assessment"><Combobox value={t.needsAssessment} onChange={(v) => up({ needsAssessment: v })} options={TRAINING_NEEDS} /></Field>
      <Field label="Competence requirements"><Combobox value={t.competencies} onChange={(v) => up({ competencies: v })} options={COMPETENCE_REQUIREMENTS} /></Field>
      <div className="full"><Field label="Training plan & schedule"><Combobox value={t.plan} onChange={(v) => up({ plan: v })} options={TRAINING_PLANS} /></Field></div>
      <div className="full"><Field label="Onboarding for new members"><Combobox value={t.onboarding} onChange={(v) => up({ onboarding: v })} options={ONBOARDING} /></Field></div>
      <div className="full"><Field label="Knowledge transfer / lessons learned"><Combobox value={t.lessonsLearned} onChange={(v) => up({ lessonsLearned: v })} options={LESSONS_LEARNED} /></Field></div>
    </div>
  );
}
