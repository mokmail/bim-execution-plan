# Overview

**BIM Execution Plan Studio** is a web application that lets BIM managers and
coordinators create, manage, and validate **BIM Execution Plans (BEPs)** through an
intuitive, guided workflow.

## The problem it solves

A BIM Execution Plan is the project-level agreement that defines *who* does *what*,
*when*, *with what tools*, and *to what level of detail* in a BIM project. Historically
BEPs were authored in Word/Excel/PDF and largely ignored after sign-off. The most common
reasons BEPs fail are:

- **Unengaging format** — a wall of text nobody reads
- **Not updated** — teams rely on outdated copies
- **Single author** — no collaboration
- **Copy-paste** from other projects
- **No standards compliance** — ISO 19650 / NBIMS requirements missed

This tool addresses all of these by making the BEP a **living, visual, versioned,
standards-checked** document.

## Key features

- **14-section wizard** — a single guided interface covering every part of a BEP, for
  both creating and editing. No separate classical editor.
- **Predefined options** — every field with a standard industry value offers a
  combobox/chip with suggestions (still free-form).
- **Inline ⓘ help** — every field explains what it is and how to fill it, with an example.
- **Live compliance** — a 9-item ISO 19650 / NBIMS-US checklist validates each plan as
  you work.
- **Immutable versioning** — commit revisions with notes; every snapshot is stored with a
  full change history.
- **Persistent storage** — projects live in PostgreSQL (JSONB), not the browser.
- **Export** — download the plan as Markdown (→ DOCX/PDF with Pandoc) or a
  machine-readable `.bep` JSON bundle.
- **Dashboard** — a professional intro page with live project analytics (totals, mode
  split, compliance, activity) and per-project compliance scores.
- **Docker Compose** — one command spins up the app + database with a persistent volume.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express 5 + Node.js |
| Database | PostgreSQL 16 (JSONB) |
| Deployment | Docker + Docker Compose |

## Project structure

```
bim-execution-plan/
├── research/            # the research knowledge base that informed the tool
├── wiki/                # this documentation
├── server/              # Express + PostgreSQL backend
│   ├── index.ts         # API + serves the built frontend
│   └── schema.sql       # database schema
├── src/
│   ├── types/bep.ts     # canonical BEP data model
│   ├── lib/             # api client, bep logic, options, templates
│   ├── components/      # UI primitives, editors, wizard, dashboard
│   └── App.tsx          # app shell
├── Dockerfile           # multi-stage production build
└── docker-compose.yml   # app + postgres + volume
```

## Who it's for

- **BIM Managers** — own the BEP, enforce standards, manage the CDE.
- **BIM Coordinators** — coordinate models, run clash detection, validate models.
- **Information Managers** — manage the information process and CDE.
- **Any project team** producing ISO 19650-aligned information.

Next: [Standards & Concepts](standards.md)
