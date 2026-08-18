import { useMemo, useRef, useState } from "react";
import "./App.css";
import type { BepDocument, BepBundle, BepMode } from "./types/bep";
import { emptyDocument } from "./types/bep";
import {
  commitVersion,
  validateBep,
  complianceStatus,
  bepToMarkdown,
  downloadFile,
  exportBundleJson,
  importBundleJson,
  saveBundleLocal,
  loadBundleLocal,
  listLocalProjects,
  projectKey,
} from "./lib/bep";
import { templates, getTemplate } from "./lib/templates";
import { sections, sectionForField } from "./components/sections";

type View = "projects" | "editor";

const STORAGE_AUTOSAVE = "bep.autosave";

function App() {
  const [view, setView] = useState<View>("projects");
  const [activeProjectKey, setActiveProjectKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("projectInformation");
  const [bundle, setBundle] = useState<BepBundle | null>(null);
  const [startMode, setStartMode] = useState<BepMode>("pre-appointment");
  const [templateId, setTemplateId] = useState("penn-state");
  const [newProjectName, setNewProjectName] = useState("");
  const [issues, setIssues] = useState<ReturnType<typeof validateBep>>([]);
  const [projects, setProjects] = useState(listLocalProjects);
  const [authorName, setAuthorName] = useState(localStorage.getItem("bep.author") || "");
  const [toast, setToast] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const setDoc = (updater: (d: BepDocument) => BepDocument) => {
    setBundle((b) => {
      if (!b) return b;
      const next = updater(b.current);
      const nextBundle: BepBundle = { ...b, current: next };
      if (activeProjectKey) saveBundleLocal(nextBundle, activeProjectKey);
      localStorage.setItem(STORAGE_AUTOSAVE, exportBundleJson(nextBundle));
      setIssues(validateBep(next));
      return nextBundle;
    });
  };

  const refreshProjects = () => setProjects(listLocalProjects());

  const openEditor = (b: BepBundle, key: string | null) => {
    setBundle(b);
    setIssues(validateBep(b.current));
    setActiveProjectKey(key);
    setView("editor");
  };

  const createProject = (mode: BepMode) => {
    const name = newProjectName.trim() || "Untitled Project";
    const template = getTemplate(templateId) ?? templates[0];
    const doc = template.build(mode, name);
    const b: BepBundle = { current: doc, changelog: [] };
    saveBundleLocal(b, projectKey(name));
    refreshProjects();
    openEditor(b, projectKey(name));
    showToast(`Created "${name}" from ${template.name}`);
  };

  const createBlank = (mode: BepMode) => {
    const name = newProjectName.trim() || "Untitled Project";
    const doc = emptyDocument(mode, name);
    const b: BepBundle = { current: doc, changelog: [] };
    saveBundleLocal(b, projectKey(name));
    refreshProjects();
    openEditor(b, projectKey(name));
    showToast(`Created blank "${name}"`);
  };

  const doCommit = () => {
    if (!bundle) return;
    const note = prompt("Version note:");
    if (note === null) return;
    const author = authorName || "unknown";
    const next = commitVersion(bundle, author, note);
    setBundle(next);
    if (activeProjectKey) saveBundleLocal(next, activeProjectKey);
    localStorage.setItem(STORAGE_AUTOSAVE, exportBundleJson(next));
    refreshProjects();
    showToast(`Saved revision ${next.current.documentControl.revision}`);
  };

  const exportJson = () => {
    if (!bundle) return;
    downloadFile(
      `${slug(bundle.current.projectName)}-bep.json`,
      exportBundleJson(bundle),
      "application/json",
    );
  };

  const exportDocument = () => {
    if (!bundle) return;
    const md = bepToMarkdown(bundle.current);
    downloadFile(`${slug(bundle.current.projectName)}-bep.md`, md, "text/markdown");
    showToast("Markdown exported — convert to DOCX/PDF with pandoc (see docs)");
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const b = importBundleJson(String(reader.result));
        openEditor(b, null);
        showToast("Imported BEP bundle");
      } catch (e: any) {
        showToast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  const compliance = useMemo(
    () => (bundle ? complianceStatus(bundle.current) : []),
    [bundle],
  );
  const complianceCount = compliance.filter((c) => c.met).length;
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const openAutosave = () => {
    const raw = localStorage.getItem(STORAGE_AUTOSAVE);
    if (!raw) return;
    try {
      const b = importBundleJson(raw);
      openEditor(b, null);
    } catch {}
  };

  // ---------------- Render ----------------
  if (view === "projects") {
    return (
      <div className="app projects-view">
        <header className="topbar">
          <h1>BIM Execution Plan Studio</h1>
          <span className="subtitle">Author, version and validate ISO 19650-aligned BEPs</span>
        </header>

        <div className="projects-layout">
          <section className="panel">
            <h2>New project</h2>
            <label className="field">
              <span className="field-label">Project name</span>
              <input className="input" value={newProjectName} placeholder="e.g. North Campus Extension" onChange={(e) => setNewProjectName(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">BEP mode</span>
              <select className="input" value={startMode} onChange={(e) => setStartMode(e.target.value as BepMode)}>
                <option value="pre-appointment">Pre-appointment (tender)</option>
                <option value="delivery">Delivery (post-contract)</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">Template</span>
              <select className="input" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <p className="muted">{getTemplate(templateId)?.description}</p>
            <div className="row gap">
              <button className="btn btn-primary" onClick={() => createProject(startMode)}>Create project</button>
              <button className="btn" onClick={() => createBlank(startMode)}>Blank</button>
            </div>

            <h2>Import</h2>
            <div className="row gap">
              <button className="btn" onClick={() => fileInput.current?.click()}>Import .bep JSON</button>
              <button className="btn" onClick={openAutosave}>Resume autosave</button>
              <input
                ref={fileInput}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={(e) => e.target.files && onImportFile(e.target.files[0])}
              />
            </div>
          </section>

          <section className="panel">
            <h2>Projects</h2>
            {projects.length === 0 && <p className="muted">No projects yet. Create one to begin.</p>}
            {projects.map((p) => (
              <div key={p.key} className="project-row">
                <div>
                  <strong>{p.name}</strong>
                  <div className="muted">Updated {new Date(p.updated).toLocaleString()}</div>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const b = loadBundleLocal(p.key);
                    if (b) openEditor(b, p.key);
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  if (!bundle) return null;

  const doc = bundle.current;
  const active = sections.find((s) => s.id === activeSection) ?? sections[0];
  const Editor = active.Component;

  return (
    <div className="app editor-view">
      <aside className="sidebar">
        <div className="sidebar-head">
          <button className="btn btn-ghost" onClick={() => { setView("projects"); refreshProjects(); }}>← Projects</button>
        </div>
        <div className="project-title">
          <strong>{doc.projectName}</strong>
          <span className="pill pill-mode">{doc.mode}</span>
          <span className="pill">Rev {doc.documentControl.revision}</span>
        </div>
        <nav className="sections-nav">
          {sections.map((s) => {
            const sectionIssues = issues.filter((i) => sectionForField(i.path) === s.id);
            const hasError = sectionIssues.some((i) => i.severity === "error");
            const hasWarn = sectionIssues.some((i) => i.severity === "warning");
            return (
              <button
                key={s.id}
                className={`nav-item ${activeSection === s.id ? "active" : ""}`}
                onClick={() => setActiveSection(s.id)}
              >
                <span className="nav-num">{s.num}</span>
                <span className="nav-label">{s.short}</span>
                {hasError && <span className="dot dot-error" title="Has errors" />}
                {!hasError && hasWarn && <span className="dot dot-warn" title="Has warnings" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-ghost" onClick={() => { setView("projects"); refreshProjects(); }}>Save &amp; exit</button>
        </div>
      </aside>

      <main className="content">
        <header className="editor-head">
          <div>
            <h2>{active.num}. {active.title}</h2>
            <span className="muted">{doc.projectName} · {doc.mode}</span>
          </div>
          <div className="head-actions">
            <button className="btn btn-ghost" onClick={exportDocument} title="Export markdown (convert with pandoc)">Export</button>
            <button className="btn btn-ghost" onClick={exportJson} title="Download full .bep JSON bundle">.bep</button>
            <button className="btn btn-primary" onClick={doCommit}>Commit revision</button>
          </div>
        </header>

        <div className="editor-body">
          <div className="editor-main">
            <Editor doc={doc} setDoc={setDoc} />
          </div>

          <aside className="inspector">
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
              {errors.length === 0 && warnings.length === 0 && <p className="ok">No issues</p>}
              {errors.map((e, i) => <div key={i} className="issue issue-error">{e.path}: {e.message}</div>)}
              {warnings.map((w, i) => <div key={i} className="issue issue-warn">{w.path}: {w.message}</div>)}
            </div>
            <div className="inspector-block">
              <h3>Version history ({bundle.changelog.length})</h3>
              {bundle.changelog.length === 0 && <p className="muted">No revisions committed yet.</p>}
              <ul className="version-list">
                {bundle.changelog.map((v, i) => (
                  <li key={i}>
                    <strong>v{v.version}</strong> · {new Date(v.date).toLocaleString()}
                    <div className="muted">{v.note || "—"}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="inspector-block">
              <h3>Author</h3>
              <input
                className="input"
                value={authorName}
                placeholder="Your name"
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  localStorage.setItem("bep.author", e.target.value);
                }}
              />
            </div>
          </aside>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function slug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bep";
}

export default App;
