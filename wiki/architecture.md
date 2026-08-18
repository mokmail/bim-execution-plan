# Architecture

This page explains how BIM Execution Plan Studio is architected end-to-end.

## High-level data flow

```
Browser (React SPA)
   │  fetch('/api/...')
   ▼
Express backend (server/index.ts)
   │  pg pool
   ▼
PostgreSQL 16
   ├── bep_projects   (JSONB `current` = the BepDocument)
   └── bep_versions   (immutable revision snapshots)
```

In production, the Express backend **also serves the built frontend** (`dist/`) from the
same container, so there is a single origin and no CORS issues. In development, Vite's
dev server proxies `/api` to the backend.

## Frontend

- **React 19 + TypeScript + Vite.** Code-split, form-heavy, interactive.
- **`src/types/bep.ts`** — the canonical `BepDocument` data model (see
  [Data Model](data-model.md)).
- **`src/lib/`** — `api.ts` (REST client), `bep.ts` (versioning, validation, compliance,
  markdown export), `options.ts` (predefined values), `templates.ts` (template presets).
- **`src/components/`** — `ui.tsx` (form primitives), `editors.tsx` (the 14 section
  editors), `sections.tsx` (section registry), `ProjectWizard.tsx` (the single
  create/edit interface), `Dashboard.tsx` (the intro page), `help.ts` (field help).
- **`src/App.tsx`** — the app shell: dashboard view + wizard view.

### The single-interface wizard

The user decided the 14-section wizard is the **only** editing interface. `ProjectWizard`
is document-centric and covers both create and edit:
- **Left:** a jump-to-able section index (all 14 sections, with error/warning dots)
- **Center:** the active section's form (reuses the section editors)
- **Right:** live compliance + validation panel
- **Footer:** Back/Next, "Commit revision on save" toggle, author field

## Backend

- **Express 5 + Node.js.** `server/index.ts`.
- **Endpoints:** see [API Reference](api.md).
- **`server/schema.sql`** — creates `bep_projects` and `bep_versions`.
- The backend reads `schema.sql` relative to its compiled location, so the build copies it
  next to the compiled JS (`dist-server/schema.sql`).

## Database

- **PostgreSQL 16**, JSONB columns for the flexible BEP document.
- **`bep_projects`** — one row per project; `current` holds the full `BepDocument`.
- **`bep_versions`** — immutable snapshots; one row per committed revision.
- A named Docker volume (`bep-data`) persists all data across container restarts.

## Docker

- **Multi-stage `Dockerfile`** — build stage compiles frontend + backend; runtime stage
  installs only production deps and copies the built assets.
- **`docker-compose.yml`** — `app` (port 8080) + `db` (postgres:16) + `bep-data` volume.
- See [Docker & Deployment](docker.md).

## Key design decisions

1. **JSON as the canonical format** — the `BepDocument` is a single JSON object, modeled
   on the dotBEP `.bep` format. Easy to validate, store in JSONB, and export.
2. **PostgreSQL over localStorage** — projects survive browser clears and restarts.
3. **Single wizard interface** — no redundant classical editor.
4. **Standards-first** — the compliance checklist and predefined options are grounded in
   ISO 19650 / NBIMS-US / buildingSMART.

Next: [Data Model](data-model.md)
