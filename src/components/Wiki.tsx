import { useState } from "react";
import { Markdown } from "./Markdown";

// Bundle the wiki markdown files as raw strings at build time (Vite ?raw).
import overview from "../../wiki/overview.md?raw";
import standards from "../../wiki/standards.md?raw";
import architecture from "../../wiki/architecture.md?raw";
import dataModel from "../../wiki/data-model.md?raw";
import api from "../../wiki/api.md?raw";
import templates from "../../wiki/templates.md?raw";
import options from "../../wiki/options.md?raw";
import formComponents from "../../wiki/form-components.md?raw";
import docker from "../../wiki/docker.md?raw";
import development from "../../wiki/development.md?raw";
import roadmap from "../../wiki/roadmap.md?raw";

export interface WikiPage {
  id: string;
  title: string;
  source: string;
}

export const WIKI_PAGES: WikiPage[] = [
  { id: "overview", title: "Overview", source: overview },
  { id: "standards", title: "Standards & Concepts", source: standards },
  { id: "architecture", title: "Architecture", source: architecture },
  { id: "data-model", title: "Data Model", source: dataModel },
  { id: "api", title: "API Reference", source: api },
  { id: "templates", title: "Templates", source: templates },
  { id: "options", title: "Predefined Options", source: options },
  { id: "form-components", title: "Form Components", source: formComponents },
  { id: "docker", title: "Docker & Deployment", source: docker },
  { id: "development", title: "Development", source: development },
  { id: "roadmap", title: "Roadmap", source: roadmap },
];

export function Wiki({ onBack }: { onBack: () => void }) {
  const [activeId, setActiveId] = useState("overview");
  const active = WIKI_PAGES.find((p) => p.id === activeId) ?? WIKI_PAGES[0];

  return (
    <div className="wiki-app">
      <header className="wiki-head">
        <div className="wiki-head-left">
          <button className="btn btn-ghost" onClick={onBack}>← Dashboard</button>
          <h1>BIM Execution Plan Studio — Wiki</h1>
        </div>
        <span className="pill pill-mode">documentation</span>
      </header>

      <div className="wiki-body">
        <aside className="wiki-nav">
          <div className="wiki-nav-label">Contents</div>
          {WIKI_PAGES.map((p) => (
            <button
              key={p.id}
              className={`wiki-nav-item ${p.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(p.id)}
            >
              {p.title}
            </button>
          ))}
        </aside>

        <main className="wiki-content">
          <Markdown source={active.source} />
        </main>
      </div>
    </div>
  );
}
