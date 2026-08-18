# BIM Execution Plan Studio — Wiki

Welcome to the exhaustive documentation for **BIM Execution Plan Studio**, a web-based
tool for BIM managers and coordinators to author, version, and validate **BIM Execution
Plans (BEPs)**.

This wiki explains everything: what a BEP is, the standards behind it, how the app is
architected, the data model, the API, the templates, the predefined options, how to run
and deploy it, and how to extend it.

## Contents

1. [Overview](overview.md) — what the tool does, the problem it solves, key features
2. [Standards & Concepts](standards.md) — ISO 19650, NBIMS-US, AIA, CIC, LOD/LOIN, the document hierarchy
3. [Architecture](architecture.md) — frontend, backend, database, Docker, data flow
4. [Data Model](data-model.md) — the `BepDocument` schema, all 14 sections, versioning
5. [API Reference](api.md) — every REST endpoint, request/response shapes
6. [Templates](templates.md) — Penn State, NATSPEC/ISO 19650, blank
7. [Predefined Options](options.md) — the combobox/chip value lists and the daily refresh cron
8. [Form Components](form-components.md) — the UI primitives and richer inputs
9. [Docker & Deployment](docker.md) — compose, volumes, ports, production
10. [Development](development.md) — local setup, scripts, testing, contributing
11. [Roadmap](roadmap.md) — planned features and future direction

---

**Quick start:**

```bash
git clone https://github.com/mokmail/bim-execution-plan.git
cd bim-execution-plan
docker compose up -d --build
# open http://localhost:8080
```
