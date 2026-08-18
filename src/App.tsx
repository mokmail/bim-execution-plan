import { useEffect, useRef, useState } from "react";
import "./App.css";
import type { BepDocument, BepBundle, BepMode } from "./types/bep";
import { emptyDocument } from "./types/bep";
import {
  commitVersion,
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
import { getTemplate } from "./lib/templates";
import { ProjectWizard } from "./components/ProjectWizard";

type View = "projects" | "wizard";

function App() {
  const [view, setView] = useState<View>("projects");
  const [bundle, setBundle] = useState<BepBundle | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [templateId, setTemplateId] = useState("penn-state");
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [serverOk, setServerOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState(localStorage.getItem("bep.author") || "");
  const [toast, setToast] = useState<string | null>(null);
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
      setProjects(await listProjectsApi());
    } catch (e: any) {
      showToast("Could not load projects: " + e.message);
    }
  };

  // Load projects on first mount.
  useEffect(() => {
    void refreshProjects();
  }, []);

  const openNewWizard = (mode: BepMode) => {
    const template = getTemplate(templateId);
    const doc = template ? template.build(mode, "") : emptyDocument(mode, "");
    setBundle({ current: doc, changelog: [] });
    setActiveProjectId(null);
    setIsNew(true);
    setView("wizard");
  };

  const openProject = async (id: string) => {
    setLoading(true);
    try {
      const b = await getBundleApi(id);
      setBundle(b);
      setActiveProjectId(id);
      setIsNew(false);
      setView("wizard");
    } catch (e: any) {
      showToast("Open failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b = importBundleJson(String(reader.result));
        await createProjectApi(b);
        await refreshProjects();
        setBundle(b);
        setActiveProjectId(projectIdFromName(b.current.projectName));
        setIsNew(false);
        setView("wizard");
        showToast("Imported BEP bundle");
      } catch (e: any) {
        showToast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  const handleWizardSubmit = async (doc: BepDocument, commitOnSave: boolean) => {
    if (!bundle) return;
    const id = activeProjectId ?? projectIdFromName(doc.projectName);
    try {
      if (isNew) {
        // Fresh create.
        const b: BepBundle = { current: doc, changelog: [] };
        await createProjectApi(b);
        setActiveProjectId(id);
        showToast(`Project "${doc.projectName}" created`);
      } else {
        // Save to existing project; optionally commit a versioned snapshot.
        let b: BepBundle = { ...bundle, current: doc };
        let note: string | undefined;
        if (commitOnSave) {
          const author = authorName || "unknown";
          note = prompt("Version note:") || "Updated";
          b = commitVersion(b, author, note);
        }
        await saveBundleApi(id, b, note ? { note, author: authorName || "unknown" } : undefined);
        setBundle(b);
        showToast(`Saved "${doc.projectName}"`);
      }
      await refreshProjects();
      setView("projects");
    } catch (e: any) {
      showToast("Save failed: " + e.message);
    }
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
            <div className="row gap" style={{ marginBottom: 6 }}>
              <button className="btn btn-primary" onClick={() => openNewWizard("pre-appointment")} disabled={!serverOk}>✦ New project wizard</button>
              <button className="btn btn-ghost" onClick={() => openNewWizard("delivery")} disabled={!serverOk}>Delivery mode</button>
            </div>
            <p className="muted" style={{ marginTop: 10, marginBottom: 12 }}>Template pre-fills the plan:</p>
            <label className="field">
              <span className="field-label">Template</span>
              <select className="input" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                {(["penn-state", "natspec-iso19650", "blank"] as const).map((id) => (
                  <option key={id} value={id}>{getTemplate(id)?.name}</option>
                ))}
              </select>
            </label>
            <p className="muted">{getTemplate(templateId)?.description}</p>

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
                    <span className="pill pill-mode">{p.mode}</span>
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
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  if (!bundle) return null;

  return (
    <div className="app wizard-app">
      <ProjectWizard
        doc={bundle.current}
        isNew={isNew}
        authorName={authorName}
        onAuthorChange={(v) => {
          setAuthorName(v);
          localStorage.setItem("bep.author", v);
        }}
        onDocChange={(d) => setBundle((b) => (b ? { ...b, current: d } : b))}
        onSubmit={handleWizardSubmit}
        onCancel={() => setView("projects")}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function slug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bep";
}

export default App;
