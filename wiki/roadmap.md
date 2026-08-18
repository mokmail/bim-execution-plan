# Roadmap

Planned features and future direction for BIM Execution Plan Studio, informed by the
research knowledge base (`research/BEP-RESEARCH.md`).

## Near term

- **Per-project compliance score** on the dashboard list (done) and a drill-down view
- **Template import** from more sources (NBIMS-US V4, UK BIM Framework)
- **DOCX/PDF export** directly in-app (via Pandoc or a JS library), not just Markdown
- **Search** across projects on the dashboard

## Medium term

- **Real-time collaborative editing** — Yjs/CRDT for multi-user co-authoring with
  presence/awareness
- **IFC / IDS model-checking integration** — link BEP deliverables to model-checking and
  IDS/IFC exchange (the emerging frontier)
- **AI-assisted drafting** — draft a BEP from a project brief with human-in-the-loop
- **Multi-user accounts & permissions** — OIDC/auth, per-project roles

## Long term

- **Standards compliance validation** — automated ISO 19650 / NBIMS gap detection
- **Template normalization** — ingest heterogeneous templates into one structured model
- **Public API / export format** — documented JSON + IDS XML for power users
- **Generous free tier / open-core** — self-hostable, standards-first BEP authoring

## Design principles (durable)

1. **Visual, not a wall of text** — the #1 reason BEPs fail is an unengaging format.
2. **Living & versioned** — track execution status, not just authoring.
3. **Standards-first** — ISO 19650 / NBIMS compliance built in.
4. **Collaborative** — real-time co-authoring, review/approval, audit trails.
5. **Exportable** — PDF/DOCX + machine-readable JSON/IDS.
6. **Open & self-hostable** — generous free tier or open-core.

---

*This wiki is maintained alongside the code. See the [README](../README.md) for the
project overview.*
