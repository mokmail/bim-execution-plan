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
  analyticsApi,
  exportDocApi,
  projectIdFromName,
  type ProjectMeta,
  type Analytics,
} from "./lib/api";
import { bepToIds } from "./lib/bep";
import { getTemplate } from "./lib/templates";
import { ProjectWizard } from "./components/ProjectWizard";
import { Dashboard } from "./components/Dashboard";
import { Wiki } from "./components/Wiki";

type View = "projects" | "wizard" | "wiki";

function App() {
  const [view, setView] = useState<View>("projects");
  const [bundle, setBundle] = useState<BepBundle | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
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

  const refreshAnalytics = async () => {
    try {
      setAnalytics(await analyticsApi());
    } catch (e: any) {
      // non-fatal
    }
  };

  // Load projects + analytics on first mount.
  useEffect(() => {
    void refreshProjects();
    void refreshAnalytics();
  }, []);

  const openNewWizard = (mode: BepMode) => {
    const template = getTemplate("penn-state");
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
        await refreshAnalytics();
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
        const b: BepBundle = { current: doc, changelog: [] };
        await createProjectApi(b);
        setActiveProjectId(id);
        showToast(`Project "${doc.projectName}" created`);
      } else {
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
      await refreshAnalytics();
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
      await refreshAnalytics();
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

  const exportDocxFor = async (id: string) => {
    const b = await getBundleApi(id);
    try {
      await exportDocApi(bepToMarkdown(b.current), "docx", b.current.projectName);
      showToast("DOCX exported via pandoc");
    } catch (e: any) {
      showToast("DOCX export failed: " + e.message);
    }
  };

  const exportPdfFor = async (id: string) => {
    const b = await getBundleApi(id);
    try {
      await exportDocApi(bepToMarkdown(b.current), "pdf", b.current.projectName);
      showToast("PDF exported via pandoc");
    } catch (e: any) {
      showToast("PDF export failed: " + e.message);
    }
  };

  const exportIdsFor = async (id: string) => {
    const b = await getBundleApi(id);
    downloadFile(`${slug(b.current.projectName)}-ids.xml`, bepToIds(b.current), "application/xml");
    showToast("IDS exported (buildingSMART Information Delivery Specification)");
  };

  // ---------------- Render ----------------
  if (view === "wiki") {
    return (
      <div className="app">
        <Wiki onBack={() => setView("projects")} />
      </div>
    );
  }

  if (view === "projects") {
    return (
      <div className="app dash-app">
        <Dashboard
          analytics={analytics}
          projects={projects}
          loading={loading}
          serverOk={serverOk}
          onNewProject={() => openNewWizard("pre-appointment")}
          onNewDelivery={() => openNewWizard("delivery")}
          onOpenWiki={() => setView("wiki")}
          onOpenProject={openProject}
          onOpenIfc={openProject}
          onDeleteProject={removeProject}
          onExportMd={async (id) => {
            const b = await getBundleApi(id);
            exportDocumentFor(b);
          }}
          onExportJson={async (id) => {
            const b = await getBundleApi(id);
            exportJsonFor(b);
          }}
          onExportDocx={exportDocxFor}
          onExportPdf={exportPdfFor}
          onExportIds={exportIdsFor}
        />
        <div className="dash-import">
          <button className="btn" onClick={() => fileInput.current?.click()} disabled={!serverOk}>Import .bep JSON</button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && onImportFile(e.target.files[0])}
          />
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  if (!bundle) return null;

  return (
    <div className="app wizard-app">
      <ProjectWizard
        doc={bundle.current}
        isNew={isNew}
        projectId={activeProjectId}
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
