-- BIM Execution Plan Studio — database schema
-- Stores BEP bundles in Postgres JSONB with per-project versioning.

CREATE TABLE IF NOT EXISTS bep_projects (
  id          TEXT PRIMARY KEY,          -- slug, e.g. 'north-campus-extension'
  name        TEXT NOT NULL,
  mode        TEXT NOT NULL CHECK (mode IN ('pre-appointment', 'delivery')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  current     JSONB NOT NULL             -- the current BepDocument
);

CREATE TABLE IF NOT EXISTS bep_versions (
  id           SERIAL PRIMARY KEY,
  project_id   TEXT NOT NULL REFERENCES bep_projects(id) ON DELETE CASCADE,
  version      TEXT NOT NULL,
  note         TEXT,
  author       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  document     JSONB NOT NULL,           -- immutable snapshot of the BepDocument
  UNIQUE (project_id, version)
);

CREATE INDEX IF NOT EXISTS idx_versions_project ON bep_versions (project_id, created_at DESC);
