# BIM Execution Plan Studio

A web-based tool for BIM managers and coordinators to **create, manage, and validate BIM Execution Plans (BEPs)** through an intuitive, visual workflow — built around the ISO 19650 / NBIMS-US framework.

> **Note:** This project was initiated from a comprehensive research phase. See [`research/BEP-RESEARCH.md`](research/BEP-RESEARCH.md) for the full knowledge base: standards, canonical BEP structure, software-landscape analysis, and market-gap positioning.

---

## Features

- **14-section BEP authoring** — a canonical, form-based editor covering every standard section: Document Control, Project Information, BIM Goals & Uses, Roles & RACI matrix, Collaboration/CDE, Data Exchange (IFC/COBie/BCF/IDS), Software & Hardware, Standards, LOD/LOIN matrix, Model Management, Quality Control, Delivery Milestones, Security, and Training.
- **Pre-appointment & delivery modes** — create either the tender-stage or post-contract BEP per ISO 19650-2.
- **Templates** — start from a **Penn State**-style preset (25 core BIM uses + role/RACI scaffolding) or a clean **NATSPEC/ISO 19650** skeleton, or blank.
- **Living & versioned** — commit immutable revisions with change history; every revision is snapshot-stored with a full audit trail.
- **Live validation** — structural validation flags errors (e.g. unknown RACI roles) and warnings in the inspector panel.
- **ISO 19650 / NBIMS compliance checklist** — a live 9-item compliance panel shows which requirements your plan satisfies, with per-section indicators in the sidebar.
- **Export** — export the plan as **Markdown** (convert to DOCX/PDF with Pandoc) or as a machine-readable **`.bep` JSON bundle** (JSON Schema-validatable).
- **Local persistence** — projects are auto-saved to your browser (localStorage), with import/export and an autosave-resume option.

## Tech stack

- **React + TypeScript + Vite**
- Canonical JSON data model (modeled on the dotBEP `.bep` format)
- No backend required — runs entirely client-side

## Getting started

### Prerequisites

- **Node.js 18+** and npm
- *(Optional, for DOCX/PDF export)* [Pandoc](https://pandoc.org/) installed and on your `PATH`

### Install & run (development)

```bash
# from the repo root
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Production build

```bash
npm run build       # outputs static site to dist/
npm run preview     # serve the production build locally
```

Deploy the `dist/` folder to any static host.

## Usage

1. **Create a project** — enter a project name, choose **pre-appointment** or **delivery** mode, pick a template, and click **Create project**.
2. **Fill in the 14 sections** — use the sidebar to navigate. The **inspector** (right panel) shows live compliance status, validation issues, and version history.
3. **Commit revisions** — click **Commit revision** to snapshot the current state with a note; the change is logged to the version history.
4. **Export** — click **Export** to download the plan as Markdown, or **.bep** for the full JSON bundle.

### Exporting to DOCX / PDF

The app exports Markdown. Convert it with Pandoc:

```bash
# DOCX
pandoc my-plan.md -o my-plan.docx

# PDF (requires a LaTeX engine or pdf-engine)
pandoc my-plan.md -o my-plan.pdf
```

## Project structure

```
bim-execution-plan/
├── research/
│   └── BEP-RESEARCH.md        # the research knowledge base that informed this tool
├── src/
│   ├── types/bep.ts           # canonical BEP data model + empty-document factory
│   ├── lib/
│   │   ├── bep.ts             # versioning, validation, compliance, markdown export
│   │   └── templates.ts       # Penn State / NATSPEC / blank template presets
│   ├── components/
│   │   ├── ui.tsx             # shared form primitives
│   │   ├── editors.tsx        # the 14 section editors
│   │   ├── sections.tsx       # section registry + navigation metadata
│   │   └── App.tsx            # app shell (App.tsx at root)
│   └── App.tsx                # main app: project mgmt, editor, inspector
```

## Roadmap

Future enhancements identified during research:
- Real-time collaborative editing (Yjs/CRDT)
- IFC / IDS model-checking integration
- AI-assisted drafting
- Multi-user accounts & permissions
- Template import from more sources (NBIMS-US V4, UK BIM Framework)

## License

TBD — to be published on GitHub.
