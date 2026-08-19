// BIM Execution Plan Studio — Express + PostgreSQL backend.
// Serves the built frontend (production) and a REST API for persistent
// BEP storage (replacing browser localStorage).

import express from "express";
import cors from "cors";
import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { attachCollab, setRoomChangeHook } from "./collab.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8080;
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://bep:bep@localhost:5432/bep";

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

function slug(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled"
  );
}

// 9-item ISO 19650 / NBIMS compliance checklist for a BepDocument.
function complianceFor(doc: any): { met: number; total: number } {
  if (!doc) return { met: 0, total: 9 };
  const checks = [
    doc.mode === "pre-appointment" || doc.mode === "delivery",
    (doc.responsibilities?.roles?.length ?? 0) > 0,
    (doc.collaboration?.cdePlatform ?? "").trim().length > 0,
    (doc.delivery?.milestones?.length ?? 0) > 0,
    (doc.dataExchange?.exchanges?.length ?? 0) > 0,
    (doc.security?.standard ?? "").trim().length > 0,
    (doc.lod?.matrix?.length ?? 0) > 0,
    (doc.qualityControl?.validationProcedure ?? "").trim().length > 0,
    (doc.bimGoals?.goals?.length ?? 0) > 0,
  ];
  return { met: checks.filter(Boolean).length, total: checks.length };
}

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
}

// ---------- Health ----------
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e: any) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

// ---------- Analytics ----------
app.get("/api/analytics", async (_req, res) => {
  try {
    const totals = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE mode = 'pre-appointment')::int AS pre,
              COUNT(*) FILTER (WHERE mode = 'delivery')::int AS delivery,
              COALESCE(SUM((SELECT COUNT(*) FROM bep_versions v WHERE v.project_id = p.id)), 0)::int AS total_versions
       FROM bep_projects p`,
    );
    const t = totals.rows[0];

    // Compliance: count met items across all projects (9-item checklist).
    const projects = await pool.query("SELECT current FROM bep_projects");
    let met = 0;
    let total = 0;
    for (const r of projects.rows) {
      const c = complianceFor(r.current);
      met += c.met;
      total += c.total;
    }

    // Activity: last 7 days of project updates.
    const activity = await pool.query(
      `SELECT to_char(updated_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
       FROM bep_projects
       WHERE updated_at >= now() - interval '7 days'
       GROUP BY day ORDER BY day`,
    );

    res.json({
      totalProjects: t.total,
      preAppointment: t.pre,
      delivery: t.delivery,
      totalVersions: t.total_versions,
      compliance: { met, total },
      activity: activity.rows.map((r) => ({ day: r.day, count: r.count })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- Projects ----------
app.get("/api/projects", async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.mode, p.created_at, p.updated_at,
            p.current->'documentControl'->>'revision' AS revision,
            p.current AS current,
            (SELECT COUNT(*) FROM bep_versions v WHERE v.project_id = p.id) AS version_count
     FROM bep_projects p
     ORDER BY p.updated_at DESC`,
  );
  res.json(
    rows.map((r) => {
      const c = complianceFor(r.current);
      return {
        id: r.id,
        name: r.name,
        mode: r.mode,
        updatedAt: r.updated_at,
        createdAt: r.created_at,
        revision: r.revision || "0.1",
        versionCount: Number(r.version_count),
        compliance: c,
      };
    }),
  );
});

// GET full bundle (current + changelog)
app.get("/api/projects/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT current FROM bep_projects WHERE id = $1",
    [req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: "Not found" });
  const versions = await pool.query(
    "SELECT version, note, author, created_at, document FROM bep_versions WHERE project_id = $1 ORDER BY created_at DESC",
    [req.params.id],
  );
  res.json({
    current: rows[0].current,
    changelog: versions.rows.map((v) => ({
      version: v.version,
      note: v.note,
      author: v.author,
      date: v.created_at,
      document: v.document,
    })),
  });
});

// Upsert a full bundle (create or save). If a revision bump is detected
// (current.documentControl.revision changed vs stored), log a version.
app.put("/api/projects/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  if (!body || !body.current) {
    return res.status(400).json({ error: "Missing bundle.current" });
  }
  const name = body.current.projectName || id;
  const mode = body.current.mode || "pre-appointment";
  const revision = body.current.documentControl?.revision || "0.1";

  const existing = await pool.query(
    "SELECT current FROM bep_projects WHERE id = $1",
    [id],
  );

  await pool.query(
    `INSERT INTO bep_projects (id, name, mode, current)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id)
     DO UPDATE SET name = $2, mode = $3, current = $4, updated_at = now()`,
    [id, name, mode, JSON.stringify(body.current)],
  );

  // Version logging: only when revision is newer than the last stored one.
  if (existing.rows.length > 0) {
    const lastRev = existing.rows[0].current?.documentControl?.revision;
    if (lastRev && lastRev !== revision) {
      const note = body.note || `Revision ${revision}`;
      const author = body.author || "unknown";
      const docForVersion = body.current;
      await pool.query(
        `INSERT INTO bep_versions (project_id, version, note, author, document)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (project_id, version) DO UPDATE SET document = EXCLUDED.document`,
        [id, revision, note, author, JSON.stringify(docForVersion)],
      );
    }
  }

  const updated = await pool.query(
    "SELECT id, name, mode, created_at, updated_at FROM bep_projects WHERE id = $1",
    [id],
  );
  res.json(updated.rows[0]);
});

// Create a new project with a specific id (slug).
app.post("/api/projects", async (req, res) => {
  const body = req.body;
  if (!body || !body.current) {
    return res.status(400).json({ error: "Missing bundle.current" });
  }
  const id = slug(body.current.projectName || "untitled");
  const name = body.current.projectName || id;
  const mode = body.current.mode || "pre-appointment";
  await pool.query(
    `INSERT INTO bep_projects (id, name, mode, current)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, current = EXCLUDED.current, updated_at = now()`,
    [id, name, mode, JSON.stringify(body.current)],
  );
  const { rows } = await pool.query(
    "SELECT id, name, mode, created_at, updated_at FROM bep_projects WHERE id = $1",
    [id],
  );
  res.status(201).json(rows[0]);
});

app.delete("/api/projects/:id", async (req, res) => {
  await pool.query("DELETE FROM bep_projects WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
});

// ---------- Export (pandoc: Markdown -> DOCX / PDF) ----------
// The frontend sends the plan's Markdown; pandoc renders it to the requested
// format. This is the Pandoc-based DOCX/PDF export the research recommended.
app.post("/api/export", (req, res) => {
  const { markdown, format = "docx", filename = "bim-execution-plan" } = req.body ?? {};
  if (typeof markdown !== "string" || !markdown) {
    return res.status(400).json({ error: "Missing markdown" });
  }
  if (!["docx", "pdf", "html", "md"].includes(format)) {
    return res.status(400).json({ error: "Unsupported format" });
  }

  const safeName = slug(filename);
  const to = format;
  const tmpIn = path.join("/tmp", `${safeName}-${Date.now()}.md`);
  const tmpOut = path.join("/tmp", `${safeName}-${Date.now()}.${to === "md" ? "md" : to}`);
  fs.writeFileSync(tmpIn, markdown, "utf8");

  const toFlag = to === "html" ? "html5" : to;
  const args = [tmpIn, "-o", tmpOut, `--to=${toFlag}`, "--standalone", "--metadata", `title=${filename}`];
  if (to === "pdf") args.push("--pdf-engine=weasyprint");
  execFile(
    "pandoc",
    args,
    (err) => {
      if (err) {
        console.error("pandoc failed:", err.message);
        return res.status(500).json({ error: "pandoc failed: " + err.message });
      }
      const mime =
        to === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : to === "pdf" ? "application/pdf"
        : to === "html" ? "text/html"
        : "text/markdown";
      const data = fs.readFileSync(tmpOut);
      res.setHeader("Content-Type", mime);
      res.setHeader("Content-Disposition", `attachment; filename="${safeName}.${to}"`);
      res.send(data);
      fs.rmSync(tmpIn, { force: true });
      fs.rmSync(tmpOut, { force: true });
    },
  );
});

// ---------- IFC/IDS model checking ----------
// Runs the Python/ifcopenshell checker against an uploaded IFC file, using the
// BEP's data-exchange requirements. This is the research's "emerging frontier":
// linking BEP deliverables to model-checking and IDS/IFC exchange.
const upload = multer({ dest: "/tmp/bep-uploads", limits: { fileSize: 50 * 1024 * 1024 } });

app.post("/api/check-ifc", upload.single("ifc"), (req, res) => {
  const checks = req.body?.checks ? JSON.parse(req.body.checks) : {};
  if (!req.file) {
    return res.status(400).json({ error: "Missing IFC file (multipart field 'ifc')" });
  }

  // Find ifcopenshell venv in several likely locations.
  const pyCandidates = [
    path.join(__dirname, "ifc-venv", "bin", "python"), // dev: dist-server/ifc-venv (via build:server cp)
    path.join(__dirname, "..", "server", "ifc-venv", "bin", "python"), // dev: repo layout
    path.join("/app", "ifc-venv", "bin", "python"), // Docker runtime
    "/usr/bin/python3",
    "python3",
  ];
  const python = pyCandidates.find((p) => fs.existsSync(p)) || "python3";
  // check.py may be co-located with the compiled server OR in the venv dir.
  const script =
    [path.join(__dirname, "check.py"), path.join(path.dirname(python), "check.py")]
      .find((p) => fs.existsSync(p)) || path.join(__dirname, "check.py");

  // Build a temp checks file for the Python script.
  const tmpChecks = path.join("/tmp", `checks-${Date.now()}.json`);
  fs.writeFileSync(tmpChecks, JSON.stringify(checks), "utf8");

  execFile(python, [script, req.file.path, tmpChecks], (err, stdout, stderr) => {
    fs.rmSync(tmpChecks, { force: true });
    fs.rmSync(req.file!.path, { force: true });
    if (err) {
      return res.status(500).json({ error: "checker failed: " + (stderr || err.message) });
    }
    try {
      const result = JSON.parse(stdout);
      res.json({ ok: true, result });
    } catch {
      res.status(500).json({ error: "bad checker output: " + stdout });
    }
  });
});

// ---------- Serve built frontend (production) ----------
const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// ---------- Boot ----------
async function main() {
  await initDb();

  // Persist collaborative edits (room id = project id) back to PostgreSQL.
  setRoomChangeHook(async (room, current) => {
    try {
      if (typeof room !== "string" || !current) return;
      await pool.query(
        `UPDATE bep_projects SET current = $2, updated_at = now()
         WHERE id = $1`,
        [room, JSON.stringify(current)],
      );
    } catch (e) {
      console.error("collab persist failed:", e);
    }
  });

  const server = createServer(app);
  attachCollab(server);
  server.listen(PORT, () => {
    console.log(`BEP backend listening on port ${PORT}`);
  });
}

main().catch((e) => {
  console.error("Failed to start:", e);
  process.exit(1);
});
