import type { Analytics } from "../lib/api";
import type { ProjectMeta } from "../lib/api";

// Skeleton shimmer placeholder for loading states (ui-ux-pro-max: loading feedback).
function Skeleton() {
  return <span className="skeleton" aria-hidden="true" />;
}

interface Props {
  analytics: Analytics | null;
  projects: ProjectMeta[];
  loading: boolean;
  serverOk: boolean | null;
  onNewProject: () => void;
  onNewDelivery: () => void;
  onOpenWiki: () => void;
  onOpenProject: (id: string) => void;
  onOpenIfc: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onExportMd: (id: string) => void;
  onExportJson: (id: string) => void;
  onExportDocx: (id: string) => void;
  onExportPdf: (id: string) => void;
  onExportIds: (id: string) => void;
}

export function Dashboard({
  analytics,
  projects,
  loading,
  serverOk,
  onNewProject,
  onNewDelivery,
  onOpenWiki,
  onOpenProject,
  onOpenIfc,
  onDeleteProject,
  onExportMd,
  onExportJson,
  onExportDocx,
  onExportPdf,
  onExportIds,
}: Props) {
  const a = analytics;
  const compliancePct = a && a.compliance.total > 0 ? Math.round((a.compliance.met / a.compliance.total) * 100) : 0;
  const prePct = a && a.totalProjects > 0 ? Math.round((a.preAppointment / a.totalProjects) * 100) : 0;
  const delPct = a && a.totalProjects > 0 ? Math.round((a.delivery / a.totalProjects) * 100) : 0;
  const maxActivity = a && a.activity.length ? Math.max(...a.activity.map((x) => x.count)) : 1;

  return (
    <div className="dash">
      {/* Hero */}
      <header className="dash-hero">
        <div className="dash-hero-glow" />
        <div className="dash-hero-inner">
          <div className="dash-eyebrow">➜ ./bim-execution-plan-studio</div>
          <h1 className="dash-title">
            BIM Execution Plan <span className="dash-accent">Studio</span>
          </h1>
          <p className="dash-subtitle">
            Author, version and validate ISO 19650-aligned BIM Execution Plans — a living,
            collaborative workspace for BIM managers and coordinators.
          </p>
          <div className="dash-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onNewProject} disabled={!serverOk}>
              ✦ New project
            </button>
            <button className="btn btn-lg" onClick={onNewDelivery} disabled={!serverOk}>
              Delivery mode
            </button>
            <button className="btn btn-lg" onClick={onOpenWiki}>
              Wiki
            </button>
          </div>
          {serverOk === false && (
            <div className="banner-error">⚠ Backend not reachable — persistence is unavailable. Start the API (see README).</div>
          )}
        </div>
      </header>

      {/* KPI cards */}
      <section className="dash-kpis" aria-label="Project metrics">
        <div className="kpi-card">
          <div className="kpi-value kpi-num">{a ? a.totalProjects : <Skeleton />}</div>
          <div className="kpi-label">Projects</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value kpi-num">{a ? a.totalVersions : <Skeleton />}</div>
          <div className="kpi-label">Versioned snapshots</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value kpi-num kpi-accent">{a ? `${compliancePct}%` : <Skeleton />}</div>
          <div className="kpi-label">Compliance met</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value kpi-num">{a ? a.preAppointment : <Skeleton />}</div>
          <div className="kpi-label">Pre-appointment</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value kpi-num">{a ? a.delivery : <Skeleton />}</div>
          <div className="kpi-label">Delivery</div>
        </div>
      </section>

      {/* Charts */}
      <section className="dash-charts" aria-label="Project analytics">
        <div className="chart-card">
          <h3>Mode split</h3>
          {a && a.totalProjects > 0 ? (
            <>
              <div className="bar-row" role="img" aria-label={`Mode split: ${prePct}% pre-appointment, ${delPct}% delivery`}>
                <div className="bar-seg" style={{ width: `${prePct}%`, background: "var(--accent)" }} title={`Pre-appointment ${prePct}%`} />
                <div className="bar-seg" style={{ width: `${delPct}%`, background: "var(--accent-2)" }} title={`Delivery ${delPct}%`} />
              </div>
              <div className="bar-legend">
                <span><i style={{ background: "var(--accent)" }} /> Pre-appointment {prePct}%</span>
                <span><i style={{ background: "var(--accent-2)" }} /> Delivery {delPct}%</span>
              </div>
            </>
          ) : (
            <p className="muted">No projects yet.</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Compliance</h3>
          {a && a.compliance.total > 0 ? (
            <div className="ring-wrap">
              <div className="ring" role="img" aria-label={`Compliance ${compliancePct}%`} style={{ background: `conic-gradient(var(--ok) ${compliancePct}%, var(--bg-3) 0)` }}>
                <div className="ring-inner">{compliancePct}%</div>
              </div>
              <p className="muted">{a.compliance.met} of {a.compliance.total} checklist items met</p>
            </div>
          ) : (
            <p className="muted">No data yet.</p>
          )}
        </div>

        <div className="chart-card chart-card-wide">
          <h3>Activity — last 7 days</h3>
          {a && a.activity.length > 0 ? (
            <div className="activity-bars" role="img" aria-label="Project updates over the last 7 days">
              {a.activity.map((d) => (
                <div key={d.day} className="activity-col" title={`${d.day}: ${d.count}`}>
                  <div className="activity-bar" style={{ height: `${(d.count / maxActivity) * 100}%` }} />
                  <span className="activity-day">{d.day.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No activity in the last 7 days.</p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="dash-how">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <span className="how-num">01</span>
            <h4>Create</h4>
            <p>Start from a template or blank, guided by a 14-section wizard covering every part of a BEP.</p>
          </div>
          <div className="how-step">
            <span className="how-num">02</span>
            <h4>Author</h4>
            <p>Fill in goals, roles, data exchange, LOD, milestones and more — with predefined options and inline help.</p>
          </div>
          <div className="how-step">
            <span className="how-num">03</span>
            <h4>Validate</h4>
            <p>Live ISO 19650 / NBIMS compliance and validation checks flag gaps as you work.</p>
          </div>
          <div className="how-step">
            <span className="how-num">04</span>
            <h4>Version & export</h4>
            <p>Commit immutable revisions, then export to Markdown (→ DOCX/PDF) or a machine-readable .bep bundle.</p>
          </div>
        </div>
      </section>

      {/* Recent projects */}
      <section className="dash-projects">
        <h2>Recent projects</h2>
        {projects.length === 0 && !loading && <p className="muted">No projects yet. Create one to begin.</p>}
        {projects.length === 0 && loading && <p className="muted">Loading projects…</p>}
        {projects.map((p) => {
          const pct = p.compliance && p.compliance.total > 0 ? Math.round((p.compliance.met / p.compliance.total) * 100) : 0;
          const recent = Date.now() - new Date(p.updatedAt).getTime() < 24 * 60 * 60 * 1000;
          return (
            <div key={p.id} className={`project-row ${recent ? "recent" : ""}`}>
              <div>
                <div className="project-name-line">
                  <strong>{p.name}</strong>
                  {recent && <span className="pill pill-recent">● recently updated</span>}
                </div>
                <div className="project-meta">
                  <span className="pill pill-mode">{p.mode}</span>
                  <span className="pill">Rev {p.revision}</span>
                  <span className="pill">{p.versionCount} {p.versionCount === 1 ? "version" : "versions"}</span>
                </div>
                <div className="project-compliance">
                  <span className="compliance-mini-label">Compliance</span>
                  <div className="compliance-mini-bar" role="img" aria-label={`Compliance ${pct}%`}>
                    <div className="compliance-mini-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="compliance-mini-pct">{pct}%</span>
                </div>
                <div className="muted">Updated {new Date(p.updatedAt).toLocaleString()}</div>
              </div>
              <div className="row gap">
                <button className="btn btn-ifc" title="Upload an IFC model and validate against this BEP" onClick={() => onOpenIfc(p.id)}>◎ IFC Check</button>
                <button className="btn btn-ghost" title="Export DOCX (Word)" onClick={() => onExportDocx(p.id)}>DOCX</button>
                <button className="btn btn-ghost" title="Export PDF" onClick={() => onExportPdf(p.id)}>PDF</button>
                <button className="btn btn-ghost" title="Export IDS (buildingSMART)" onClick={() => onExportIds(p.id)}>IDS</button>
                <button className="btn btn-ghost" title="Export markdown" onClick={() => onExportMd(p.id)}>MD</button>
                <button className="btn btn-ghost" title="Download .bep JSON" onClick={() => onExportJson(p.id)}>.bep</button>
                <button className="btn btn-ghost" title="Delete project" onClick={() => onDeleteProject(p.id)}>✕</button>
                <button className="btn btn-primary" onClick={() => onOpenProject(p.id)} disabled={loading}>Edit</button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
