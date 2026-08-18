# API Reference

The backend exposes a REST API under `/api`. In production the Express server also serves
the built frontend, so the API and app share one origin.

Base URL: `http://localhost:8080/api` (or wherever the app is hosted).

## Health

### `GET /api/health`

Returns `{ "status": "ok" }` if the database is reachable.

## Analytics

### `GET /api/analytics`

Returns aggregate dashboard metrics:

```json
{
  "totalProjects": 4,
  "preAppointment": 3,
  "delivery": 1,
  "totalVersions": 7,
  "compliance": { "met": 30, "total": 36 },
  "activity": [ { "day": "2026-08-18", "count": 4 } ]
}
```

- `compliance` aggregates the 9-item checklist across all projects.
- `activity` is project updates over the last 7 days.

## Projects

### `GET /api/projects`

Lists all projects (metadata only, newest first). Each item:

```json
{
  "id": "north-campus-extension",
  "name": "North Campus Extension",
  "mode": "pre-appointment",
  "createdAt": "2026-08-18T...",
  "updatedAt": "2026-08-18T...",
  "revision": "0.3",
  "versionCount": 2,
  "compliance": { "met": 9, "total": 9 }
}
```

### `GET /api/projects/:id`

Returns the full bundle:

```json
{
  "current": { /* BepDocument */ },
  "changelog": [ { "version": "0.2", "note": "...", "author": "...", "date": "...", "document": { /* snapshot */ } } ]
}
```

### `POST /api/projects`

Creates a new project. Body: `{ "current": { /* BepDocument */ } }`. The project id is
derived from `current.projectName` (slugified). Returns the created project metadata.

### `PUT /api/projects/:id`

Upserts a project. Body: `{ "current": { /* BepDocument */ }, "note"?, "author"? }`.
If the revision changed vs the stored one, a version snapshot is logged. Returns updated
metadata.

### `DELETE /api/projects/:id`

Deletes the project and its version history. Returns `{ "ok": true }`.

## Error handling

Errors return a non-2xx status with `{ "error": "message" }`.

## Client

The frontend uses `src/lib/api.ts` which wraps `fetch` and throws on non-OK responses.
Functions: `listProjectsApi`, `getBundleApi`, `saveBundleApi`, `createProjectApi`,
`deleteProjectApi`, `healthApi`, `analyticsApi`, `projectIdFromName`.

Next: [Templates](templates.md)
