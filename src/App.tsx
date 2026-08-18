import { useEffect, useMemo, useRef, useState } from "react";
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
} from "./lib/bep";
import {
  listProjectsApi,
  getBundleApi,
  saveBundleApi,
  createProjectApi,
  deleteProjectApi,
  healthApi,
  projectIdFromName,
  type ProjectMeta,
} from "./lib/api";
import { templates, getTemplate } from "./lib/templates";
import { sections, sectionForField } from "./components/sections";
import { ProjectWizard, type WizardData } from "./components/ProjectWizard";

type View = "projects" | "editor";

function App() {
  const [view, setView] = useState<View>("projects");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("projectInformation");
  const [bundle, setBundle] = useState<BepBundle | null>(null);
  const [startMode, setStartMode] = useState<BepMode>("pre-appointment");
  const [templateId, setTemplateId] = useState("penn-state");
  const [newProjectName, setNewProjectName] = useState("");
  const [issues, setIssues] = useState<ReturnType<typeof validateBep>>([]);
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [serverOk, setServerOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState(localStorage.getItem("bep.author") || "");
  const [toast, setToast] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>(defaultWizardData);
  const fileInput = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Check backend health on load.
  useEffect(() => {
    (async () => {
      try {
        await healthApi();
        setServerOk(true);
      } catch {
        setServerOk(false);
      }
    })();
  }, []);

  const refreshProjects = async () => {
    try {
      const list = await listProjectsApi();
      setProjects(list);
    } catch (e: any) {
      showToast("Could not load projects: " + e.message);
    }
  };

  // Persist current bundle to the server.
  const persist = async (b: BepBundle, opts?: { note?: string; author?: string }) => {
    const id = activeProjectId ?? projectIdFromName(b.current.projectName);
    try {
      await saveBundleApi(id, b, opts);
      setActiveProjectId(id);
    } catch (e: any) {
      showToast("Save failed: " + e.message);
    }
  };

  const setDoc = (updater: (d: BepDocument) => BepDocument) => {
    setBundle((b) => {
      if (!b) return b;
      const next = updater(b.current);
      const nextBundle: BepBundle = { ...b, current: next };
      setIssues(validateBep(next));
      // Debounced save on the server.
      void persist(nextBundle);
      return nextBundle;
    });
  };

  const openEditor = (b: BepBundle, id: string | null) => {
    setBundle(b);
    setIssues(validateBep(b.current));
    setActiveProjectId(id);
    setView("editor");
  };

  const openProject = async (id: string) => {
    setLoading(true);
    try {
      const b = await getBundleApi(id);
      openEditor(b, id);
    } catch (e: any) {
      showToast("Open failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (mode: BepMode) => {
    const name = newProjectName.trim() || "Untitled Project";
    const template = getTemplate(templateId) ?? templates[0];
    const doc = template.build(mode, name);
    const b: BepBundle = { current: doc, changelog: [] };
    const id = projectIdFromName(name);
    try {
      await createProjectApi(b);
      await refreshProjects();
      openEditor(b, id);
      showToast(`Created "${name}" from ${template.name}`);
    } catch (e: any) {
      showToast("Create failed: " + e.message);
    }
  };

  const submitWizard = async (doc: BepDocument) => {
    const b: BepBundle = { current: doc, changelog: [] };
    const id = projectIdFromName(doc.projectName);
    try {
      await createProjectApi(b);
      await refreshProjects();
      setWizardOpen(false);
      openEditor(b, id);
      showToast(`Project "${doc.projectName}" created from wizard`);
    } catch (e: any) {
      showToast("Create failed: " + e.message);
    }
  };

  const createBlank = async (mode: BepMode) => {
    const name = newProjectName.trim() || "Untitled Project";
    const doc = emptyDocument(mode, name);
    const b: BepBundle = { current: doc, changelog: [] };
    const id = projectIdFromName(name);
    try {
      await createProjectApi(b);
      await refreshProjects();
      openEditor(b, id);
      showToast(`Created blank "${name}"`);
    } catch (e: any) {
      showToast("Create failed: " + e.message);
    }
  };

  const doCommit = async () => {
    if (!bundle) return;
    const note = prompt("Version note:");
    if (note === null) return;
    const author = authorName || "unknown";
    const next = commitVersion(bundle, author, note);
    setBundle(next);
    await persist(next, { note, author });
    await refreshProjects();
    showToast(`Saved revision ${next.current.documentControl.revision}`);
  };

  const removeProject = async (id: string) => {
    if (!confirm("Delete this project and its version history?")) return;
    try {
      await deleteProjectApi(id);
      await refreshProjects();
      showToast("Project deleted");
    } catch (e: any) {
      showToast("Delete failed: " + e.message);
    }
  };

  const exportJsonFor = (b: BepBundle) => {
    downloadFile(
      `${slug(b.current.projectName)}-bep.json`,
      exportBundleJson(b),
      "application/json",
    );
  };

  const exportDocumentFor = (b: BepBundle) => {
    downloadFile(`${slug(b.current.projectName)}-bep.md`, bepToMarkdown(b.current), "text/markdown");
    showToast("Markdown exported — convert to DOCX/PDF with pandoc (see docs)");
  };

  const exportJson = () => { if (bundle) exportJsonFor(bundle); };
  const exportDocument = () => { if (bundle) exportDocumentFor(bundle); };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b = importBundleJson(String(reader.result));
        await createProjectApi(b);
        await refreshProjects();
        openEditor(b, projectIdFromName(b.current.projectName));
        showToast("Imported BEP bundle");
      } catch (e: any) {
        showToast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  // Load projects on first mount.
  useEffect(() => {
    void refreshProjects();
  }, []);

  const compliance = useMemo(
    () => (bundle ? complianceStatus(bundle.current) : []),
    [bundle],
  );
  const complianceCount = compliance.filter((c) => c.met).length;
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  // ---------------- Render ----------------
  if (view === "projects") {
    return (
      <div className="app projects-view">
        <header className="topbar">
          <h1>BIM Execution Plan Studio</h1>
          <span className="subtitle">Author, version and validate ISO 19650-aligned BEPs</span>
          {serverOk === false && (
            <div className="banner-error">⚠ Backend not reachable — persistence is unavailable. Start the API (see README).</div>
          )}
        </header>

        <div className="projects-layout">
          <section className="panel">
            <h2>New project</h2>
            <div className="row gap" style={{ marginBottom: 14 }}>
              <button className="btn btn-primary" onClick={() => { setWizardData(defaultWizardData()); setWizardOpen(true); }} disabled={!serverOk}>✦ Guided setup (wizard)</button>
            </div>
            <p className="muted" style={{ marginBottom: 14 }}>Or create quickly from a template:</p>
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
              <button className="btn btn-primary" onClick={() => createProject(startMode)} disabled={!serverOk}>Create project</button>
              <button className="btn" onClick={() => createBlank(startMode)} disabled={!serverOk}>Blank</button>
            </div>

            <h2>Import</h2>
            <div className="row gap">
              <button className="btn" onClick={() => fileInput.current?.click()} disabled={!serverOk}>Import .bep JSON</button>
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
            <h2>Recent projects</h2>
            {projects.length === 0 && !loading && <p className="muted">No projects yet. Create one to begin.</p>}
            {projects.length === 0 && loading && <p className="muted">Loading projects…</p>}
            {projects.map((p) => (
              <div key={p.id} className="project-row">
                <div>
                  <strong>{p.name}</strong>
                  <div className="project-meta">
                    <span className={`pill pill-mode`}>{p.mode}</span>
                    <span className="pill">Rev {p.revision}</span>
                    <span className="pill">{p.versionCount} {p.versionCount === 1 ? "version" : "versions"}</span>
                  </div>
                  <div className="muted">Updated {new Date(p.updatedAt).toLocaleString()}</div>
                </div>
                <div className="row gap">
                  <button
                    className="btn btn-ghost"
                    title="Export markdown (convert with pandoc)"
                    onClick={async () => {
                      const b = await getBundleApi(p.id);
                      exportDocumentFor(b);
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="btn btn-ghost"
                    title="Download .bep JSON bundle"
                    onClick={async () => {
                      const b = await getBundleApi(p.id);
                      exportJsonFor(b);
                    }}
                  >
                    .bep
                  </button>
                  <button
                    className="btn btn-ghost"
                    title="Delete project"
                    onClick={() => removeProject(p.id)}
                  >
                    ✕
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => openProject(p.id)}
                    disabled={loading}
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {wizardOpen && (
          <div className="wizard-overlay">
            <ProjectWizard
              initial={wizardData}
              onChange={setWizardData}
              onSubmit={submitWizard}
              onCancel={() => setWizardOpen(false)}
            />
          </div>
        )}
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
          <button className="btn btn-ghost" onClick={() => { setView("projects"); void refreshProjects(); }}>← Projects</button>
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
          <button className="btn btn-ghost" onClick={() => { setView("projects"); void refreshProjects(); }}>Save &amp; exit</button>
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
            <button className="btn btn-primary" onClick={() => void doCommit()}>Commit revision</button>
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

function defaultWizardData(): WizardData {
  return {
    name: "",
    mode: "pre-appointment",
    sector: "",
    deliveryMethod: "",
    owner: "",
    goals: [],
    bimUses: [
      { name: "3D Coordination", phase: "Design", priority: "high", responsibleParty: "" },
      { name: "Design Authoring", phase: "Design", priority: "high", responsibleParty: "" },
    ],
    roles: [
      { role: "BIM Manager", person: "", organization: "" },
      { role: "BIM Coordinator", person: "", organization: "" },
    ],
    milestones: [
      { name: "Design Coordination Issue", deliverable: "Federated coordination model", format: "IFC 4" },
      { name: "Practical Completion", deliverable: "As-built model + COBie data", format: "IFC + COBie" },
    ],
  };
}

export default App;
