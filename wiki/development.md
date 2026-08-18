# Development

How to set up, run, and extend the project locally.

## Prerequisites

- **Node.js 18+** and npm
- **PostgreSQL** (for local dev) or Docker (for the containerized stack)
- *(Optional, for DOCX/PDF export)* [Pandoc](https://pandoc.org/)

## Local development

```bash
# 1. Create the database (adjust creds to your Postgres)
createdb bep   # or: psql -c "CREATE DATABASE bep;"

# 2. Install deps
npm install

# 3. Run the backend (serves the built frontend + API)
npm run build
DATABASE_URL=postgres://USER:PASS@localhost:5432/bep npm start

# 4. In a second terminal — frontend dev server with API proxy
npm run dev      # → http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8080` (configurable via
`VITE_API_TARGET`).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server (frontend) |
| `npm run build` | Build frontend + backend + copy schema.sql |
| `npm run build:web` | Build frontend only |
| `npm run build:server` | Build backend + copy schema.sql |
| `npm start` | Run the built backend |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview the production build |

## Project layout

```
server/            # Express + PostgreSQL backend
  index.ts         # API + serves the built frontend
  schema.sql       # database schema
src/
  types/bep.ts     # canonical BEP data model
  lib/
    api.ts         # REST client
    bep.ts         # versioning, validation, compliance, markdown export
    options.ts     # predefined value lists
    templates.ts   # template presets
  components/
    ui.tsx         # form primitives
    editors.tsx    # the 14 section editors
    sections.tsx   # section registry
    ProjectWizard.tsx  # the single create/edit interface
    Dashboard.tsx  # the intro page
    help.ts        # field help registry
  App.tsx          # app shell
wiki/              # this documentation
research/          # the research knowledge base
```

## Testing

There is no formal test suite yet. The core logic (versioning, validation, compliance,
markdown export) can be exercised by compiling the TS libs and running a Node harness:

```bash
npx tsc --ignoreConfig src/lib/bep.ts src/lib/templates.ts src/types/bep.ts \
  --outDir /tmp/bep-test --module commonjs --target es2020 --skipLibCheck --esModuleInterop
node /tmp/bep-test/test.js
```

## Verification checklist

- [ ] `npx tsc -b` exits 0
- [ ] `npm run build` succeeds (web + server + schema.sql copy)
- [ ] `docker compose up -d --build`, both containers healthy
- [ ] `curl http://localhost:8080/api/health` → `{"status":"ok"}`
- [ ] Projects persist across `docker restart bep-studio`
- [ ] Git repo has no tracked build artifacts (`dist/`, `dist-server/`, `node_modules`)

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes, following the conventions in this wiki.
3. Run the verification checklist above.
4. Open a pull request.

Next: [Roadmap](roadmap.md)
