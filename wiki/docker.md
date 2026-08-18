# Docker & Deployment

The app is designed to run entirely in Docker Compose — one command spins up the app +
PostgreSQL with a persistent volume.

## Quick start

```bash
git clone https://github.com/mokmail/bim-execution-plan.git
cd bim-execution-plan
docker compose up -d --build
# open http://localhost:8080
```

## Services

| Service | Container | Port | Purpose |
|---|---|---|---|
| `app` | `bep-studio` | 8080 | Express backend + serves the built frontend |
| `db` | `bep-db` | 5432 (internal) | PostgreSQL 16 |

## Volumes

- **`bep-data`** — named volume persisting all projects across container restarts.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgres://bep:bep@db:5432/bep` | PostgreSQL connection string |
| `PORT` | `8080` | HTTP port for the app |

## Common commands

```bash
# Build + start
docker compose up -d --build

# Stop (data persists)
docker compose down

# Stop + remove data volume (destructive)
docker compose down -v

# View logs
docker compose logs -f app

# Check status
docker compose ps
```

## The Dockerfile

Multi-stage:
1. **Build stage** (`node:22-alpine`) — `npm ci`, `npm run build` (frontend + backend).
2. **Runtime stage** (`node:22-alpine`) — installs only production deps, copies `dist/`
   and `dist-server/`, runs `node dist-server/index.js`.

The backend reads `server/schema.sql` relative to its compiled location, so the build
copies it next to the compiled JS (`dist-server/schema.sql`).

## Production notes

- The Express server serves the built frontend from `dist/`, so there's a single origin.
- The database is not exposed to the host (internal only).
- For a public deployment, put a reverse proxy (Traefik/Nginx) in front of port 8080 and
  terminate TLS.

## Troubleshooting

- **Container name conflict on rebuild:** `docker compose down --remove-orphans`, then
  `docker rm -f bep-studio`, then `up -d`.
- **App crash-loops with `ENOENT dist-server/schema.sql`:** the schema copy step was
  dropped from the build — ensure `npm run build` ends with
  `&& cp server/schema.sql dist-server/schema.sql`.

Next: [Development](development.md)
