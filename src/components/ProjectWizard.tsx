import { useState } from "react";
import type { BepDocument, BepMode } from "../types/bep";
import { emptyDocument } from "../types/bep";
import {
  DELIVERY_METHODS,
  PROJECT_SECTORS,
  BIM_ROLES,
  PARTIES,
  MILESTONE_NAMES,
} from "../lib/options";
import { PENN_STATE_BIM_USES } from "../lib/options";
import { Combobox, Field } from "./ui";

export interface WizardData {
  name: string;
  mode: BepMode;
  sector: string;
  deliveryMethod: string;
  owner: string;
  goals: string[];
  bimUses: { name: string; phase: string; priority: string; responsibleParty: string }[];
  roles: { role: string; person: string; organization: string }[];
  milestones: { name: string; deliverable: string; format: string }[];
}

const PHASES = ["Planning", "Design", "Construction", "Operations", "Handover"];
const PRIORITIES = ["high", "medium", "low"];

interface Props {
  initial: WizardData;
  onChange: (d: WizardData) => void;
  onSubmit: (doc: BepDocument) => void;
  onCancel: () => void;
}

const STEPS = ["Basics", "BIM Goals & Uses", "Roles", "Delivery"];

export function ProjectWizard({ initial, onChange, onSubmit, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(initial);

  const update = (patch: Partial<WizardData>) => {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next);
  };

  const buildDoc = (): BepDocument => {
    const doc = emptyDocument(data.mode, data.name || "Untitled Project");
    const p = doc.projectInformation;
    p.projectName = data.name;
    p.sector = data.sector;
    p.deliveryMethod = data.deliveryMethod;
    p.owner = data.owner;
    doc.bimGoals.goals = data.goals.filter((g) => g.trim());
    doc.bimGoals.uses = data.bimUses
      .filter((u) => u.name.trim())
      .map((u, i) => ({
        id: `use-${i}`,
        name: u.name,
        description: "",
        phase: u.phase.toLowerCase(),
        responsibleParty: u.responsibleParty,
        priority: u.priority as "high" | "medium" | "low",
        competence: "",
        gaps: "",
      }));
    doc.responsibilities.roles = data.roles
      .filter((r) => r.role.trim())
      .map((r, i) => ({
        id: `role-${i}`,
        role: r.role,
        person: r.person,
        organization: r.organization,
        email: "",
        scope: "",
        dedicated: true,
      }));
    doc.delivery.milestones = data.milestones
      .filter((m) => m.name.trim())
      .map((m, i) => ({
        id: `ms-${i}`,
        name: m.name,
        date: "",
        deliverable: m.deliverable,
        recipient: data.owner || "Appointing Party",
        format: m.format,
        responsibleAuthor: "",
        notes: "",
      }));
    return doc;
  };

  const canNext = () => {
    if (step === 0) return data.name.trim().length > 0;
    return true;
  };

  return (
    <div className="wizard">
      <div className="wizard-head">
        <div className="wizard-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`wizard-step ${i === step ? "active" : i < step ? "done" : ""}`}>
              <span className="wizard-step-num">{i + 1}</span>
              <span className="wizard-step-label">{s}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>

      <div className="wizard-body">
        {step === 0 && (
          <div className="grid">
            <Field label="Project name">
              <Combobox value={data.name} onChange={(v) => update({ name: v })} options={["North Campus Extension", "Riverside Hospital", "Central Plaza Tower"]} />
            </Field>
            <Field label="BEP mode">
              <select className="input" value={data.mode} onChange={(e) => update({ mode: e.target.value as BepMode })}>
                <option value="pre-appointment">Pre-appointment (tender)</option>
                <option value="delivery">Delivery (post-contract)</option>
              </select>
            </Field>
            <Field label="Sector">
              <Combobox value={data.sector} onChange={(v) => update({ sector: v })} options={PROJECT_SECTORS} />
            </Field>
            <Field label="Delivery method">
              <Combobox value={data.deliveryMethod} onChange={(v) => update({ deliveryMethod: v })} options={DELIVERY_METHODS} />
            </Field>
            <Field label="Owner / client">
              <Combobox value={data.owner} onChange={(v) => update({ owner: v })} options={PARTIES} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div>
            <h4>BIM goals</h4>
            {data.goals.map((g, i) => (
              <div key={i} className="row" style={{ marginBottom: 6 }}>
                <input className="input" value={g} onChange={(e) => update({ goals: data.goals.map((x, j) => (j === i ? e.target.value : x)) })} />
                <button className="btn btn-icon" onClick={() => update({ goals: data.goals.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <button className="btn btn-add" onClick={() => update({ goals: [...data.goals, ""] })}>+ Add goal</button>

            <h4>BIM Uses (add the ones that apply)</h4>
            {data.bimUses.map((u, i) => (
              <div key={i} className="card" style={{ padding: 10 }}>
                <div className="row">
                  <Combobox value={u.name} onChange={(v) => update({ bimUses: data.bimUses.map((x, j) => (j === i ? { ...x, name: v } : x)) })} options={PENN_STATE_BIM_USES} />
                  <select className="input" style={{ maxWidth: 140 }} value={u.phase} onChange={(e) => update({ bimUses: data.bimUses.map((x, j) => (j === i ? { ...x, phase: e.target.value } : x)) })}>
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select className="input" style={{ maxWidth: 110 }} value={u.priority} onChange={(e) => update({ bimUses: data.bimUses.map((x, j) => (j === i ? { ...x, priority: e.target.value } : x)) })}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                  <Combobox value={u.responsibleParty} onChange={(v) => update({ bimUses: data.bimUses.map((x, j) => (j === i ? { ...x, responsibleParty: v } : x)) })} options={PARTIES} />
                  <button className="btn btn-icon" onClick={() => update({ bimUses: data.bimUses.filter((_, j) => j !== i) })}>✕</button>
                </div>
              </div>
            ))}
            <button className="btn btn-add" onClick={() => update({ bimUses: [...data.bimUses, { name: "", phase: "Design", priority: "medium", responsibleParty: "" }] })}>+ Add BIM Use</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4>Team roles</h4>
            {data.roles.map((r, i) => (
              <div key={i} className="row" style={{ marginBottom: 6 }}>
                <Combobox value={r.role} onChange={(v) => update({ roles: data.roles.map((x, j) => (j === i ? { ...x, role: v } : x)) })} options={BIM_ROLES} />
                <input className="input" placeholder="Person" value={r.person} onChange={(e) => update({ roles: data.roles.map((x, j) => (j === i ? { ...x, person: e.target.value } : x)) })} />
                <Combobox value={r.organization} onChange={(v) => update({ roles: data.roles.map((x, j) => (j === i ? { ...x, organization: v } : x)) })} options={PARTIES} />
                <button className="btn btn-icon" onClick={() => update({ roles: data.roles.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <button className="btn btn-add" onClick={() => update({ roles: [...data.roles, { role: "", person: "", organization: "" }] })}>+ Add role</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h4>Delivery milestones</h4>
            {data.milestones.map((m, i) => (
              <div key={i} className="row" style={{ marginBottom: 6 }}>
                <Combobox value={m.name} onChange={(v) => update({ milestones: data.milestones.map((x, j) => (j === i ? { ...x, name: v } : x)) })} options={MILESTONE_NAMES} />
                <input className="input" placeholder="Deliverable" value={m.deliverable} onChange={(e) => update({ milestones: data.milestones.map((x, j) => (j === i ? { ...x, deliverable: e.target.value } : x)) })} />
                <input className="input" placeholder="Format (e.g. IFC, COBie)" value={m.format} onChange={(e) => update({ milestones: data.milestones.map((x, j) => (j === i ? { ...x, format: e.target.value } : x)) })} />
                <button className="btn btn-icon" onClick={() => update({ milestones: data.milestones.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <button className="btn btn-add" onClick={() => update({ milestones: [...data.milestones, { name: "", deliverable: "", format: "" }] })}>+ Add milestone</button>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(step + 1)}>Next →</button>
        ) : (
          <button className="btn btn-primary" onClick={() => onSubmit(buildDoc())}>Create project</button>
        )}
      </div>
    </div>
  );
}
