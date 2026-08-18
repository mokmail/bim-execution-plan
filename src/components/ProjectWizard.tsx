import { useEffect, useRef, useState } from "react";
import type { BepDocument } from "../types/bep";
import { sections, sectionForField } from "./sections";
import { validateBep, complianceStatus } from "../lib/bep";

interface Props {
  doc: BepDocument;
  isNew: boolean;
  authorName?: string;
  onAuthorChange?: (v: string) => void;
  onDocChange: (d: BepDocument) => void;
  onSubmit: (d: BepDocument, commitRevision: boolean) => void;
  onCancel: () => void;
}

// Single-interface wizard covering all 14 BEP sections.
// Reuses the section editors from sections.tsx; works for both
// create (blank/template doc) and edit (pre-filled existing doc).
export function ProjectWizard({ doc, isNew, authorName, onAuthorChange, onDocChange, onSubmit, onCancel }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [commitOnSave, setCommitOnSave] = useState(!isNew);
  const nameInput = useRef<HTMLInputElement>(null);

  // Auto-focus the project name when creating a new plan.
  useEffect(() => {
    if (isNew) nameInput.current?.focus();
  }, [isNew]);

  const active = sections[stepIdx];
  const Editor = active.Component;
  const issues = validateBep(doc);
  const compliance = complianceStatus(doc);
  const complianceCount = compliance.filter((c) => c.met).length;

  const setDoc = (updater: (d: BepDocument) => BepDocument) => onDocChange(updater(doc));

  const goTo = (i: number) => {
    if (i >= 0 && i < sections.length) setStepIdx(i);
  };

  return (
    <div className="wizard wizard-full">
      <div className="wizard-head">
        <div className="wizard-title">
          <span className="wizard-name-label">{isNew ? "New BIM Execution Plan" : "Project"}</span>
          <input
            ref={nameInput}
            className="input wizard-name-input"
            placeholder="Project name — e.g. North Campus Extension"
            value={doc.projectName}
            onChange={(e) => {
              const v = e.target.value;
              onDocChange({ ...doc, projectName: v, projectInformation: { ...doc.projectInformation, projectName: v } });
            }}
          />
          <span className="pill pill-mode">{doc.mode}</span>
          <span className="pill">{complianceCount}/{compliance.length} compliance</span>
        </div>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>

      <div className="wizard-body-full">
        <aside className="wizard-index">
          <div className="wizard-index-label">Sections</div>
          {sections.map((s, i) => {
            const sectionIssues = issues.filter((is) => sectionForField(is.path) === s.id);
            const hasErr = sectionIssues.some((x) => x.severity === "error");
            const hasWarn = sectionIssues.some((x) => x.severity === "warning");
            return (
              <button
                key={s.id}
                className={`wizard-index-item ${i === stepIdx ? "active" : ""}`}
                onClick={() => goTo(i)}
              >
                <span className="wizard-index-num">{s.num}</span>
                <span className="wizard-index-label">{s.short}</span>
                {hasErr && <span className="dot dot-error" />}
                {!hasErr && hasWarn && <span className="dot dot-warn" />}
              </button>
            );
          })}
        </aside>

        <div className="wizard-section">
          <h3 className="wizard-section-title">{active.num}. {active.title}</h3>
          <Editor doc={doc} setDoc={setDoc} />
        </div>

        <aside className="wizard-inspector">
          <div className="inspector-block">
            <h3>Compliance <span className="muted">({complianceCount}/{compliance.length})</span></h3>
            <ul className="compliance-list">
              {compliance.map((c) => (
                <li key={c.item.id} className={c.met ? "ok" : "missing"}>
                  <span className="compliance-mark">{c.met ? "✓" : "○"}</span>
                  <span>
                    <span className="compliance-code">{c.item.code}</span>
                    <span className="compliance-label">{c.item.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="inspector-block">
            <h3>Validation</h3>
            {issues.length === 0 && <p className="ok">No issues</p>}
            {issues.slice(0, 6).map((e, i) => (
              <div key={i} className={`issue ${e.severity === "error" ? "issue-error" : "issue-warn"}`}>{e.path}: {e.message}</div>
            ))}
          </div>
        </aside>
      </div>

      <div className="wizard-footer">
        <div className="row gap">
          <label className="checkbox" title="Log a versioned snapshot on save">
            <input type="checkbox" checked={commitOnSave} onChange={(e) => setCommitOnSave(e.target.checked)} />
            <span>Commit revision on save</span>
          </label>
          {!isNew && (
            <input
              className="input author-input"
              value={authorName || ""}
              placeholder="Author name"
              onChange={(e) => onAuthorChange?.(e.target.value)}
            />
          )}
        </div>
        <div className="row gap">
          <button className="btn" disabled={stepIdx === 0} onClick={() => goTo(stepIdx - 1)}>← Back</button>
          <button className="btn" disabled={stepIdx === sections.length - 1} onClick={() => goTo(stepIdx + 1)}>Next →</button>
          <button className="btn btn-primary" onClick={() => onSubmit(doc, commitOnSave)}>
            {isNew ? "Create project" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
