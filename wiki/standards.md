# Standards & Concepts

This page explains the standards and concepts behind a BIM Execution Plan. It is the
knowledge base that shapes the app's data model, compliance checklist, and predefined
options.

## What is a BIM Execution Plan (BEP)?

A **BEP** is a project-specific document that defines *how* building information
modelling (BIM) and information management will be carried out on a project. It sets out
the roles, responsibilities, processes, standards, software, data-exchange formats, and
information-delivery milestones the project team will follow.

Its core purposes:
- Clarify roles and responsibilities for producing and managing information
- Define the information requirements (what, when, by whom, to what level of detail)
- Standardize processes and workflows (modelling, coordination, clash detection, QA)
- Establish the technical environment (software, formats, naming, CDE)
- Align the team on milestones and deliverables
- Provide a baseline for monitoring and auditing information delivery

## Pre-appointment vs delivery BEP

ISO 19650-2 distinguishes two stages:

| Aspect | Pre-Appointment BEP | Delivery BEP |
|---|---|---|
| When | During tendering, before contract signed | After award, at start of delivery |
| Purpose | Bid/tender response to the EIR | The agreed, working plan governing delivery |
| Status | A proposal, not yet binding | Contractual once agreed |
| Content | Proposed roles, capability, methodology | Confirmed roles, detailed processes, MIDP/TIDPs, CDE |

## ISO 19650 series (the current international standard)

- **ISO 19650-1:2018** — Concepts and principles; information requirements, roles, CDE.
- **ISO 19650-2:2018** — Delivery phase; introduces the BEP, MIDP, TIDPs.
- **ISO 19650-3:2020** — Operational phase.
- **ISO 19650-4:2022** — Information exchange.
- **ISO 19650-5:2020** — Security-minded approach.
- **ISO 19650-6:2025** — Health and safety information.

Role terms: **appointing party** (client), **lead appointed party** (primary supplier),
**appointed party** (supplier), **task team**.

## PAS 1192-2 (legacy UK standard)

The UK's foundational BIM process standard (2013) that defined "Level 2 BIM" and
introduced the BEP, EIR, MIDP, and TIDPs. **Withdrawn and superseded by BS EN ISO
19650-2** in 2018/2019. Historically important as the origin of the BEP concept.

## US National BIM Standard (NBIMS-US)

Developed by the National Institute of Building Sciences (NIBS). A consensus-based
standard for the US market. Key elements: reference standards (IFC, COBie) and the
**BIM Project Execution Planning Guide** (Penn State), which provides a structured
template for project-specific BEPs.

## AIA E202 / E203 / G202 (US contract documents)

- **AIA E202-2008** — defined the **Level of Development (LOD)** scale (LOD 100–500).
- **AIA E203-2013** — responsibilities for developing/transmitting/using digital data.
- **AIA G202-2013** — records the agreed LOD and model-element authoring responsibilities.

## CIC BIM Protocol (UK)

A contractual protocol appended to appointments/subcontracts to make BIM obligations
binding. Establishes the **Information Manager** role and sets out CDE, model ownership,
and data exchange.

## The document hierarchy

**OIR → AIR/PIR → EIR → BEP → TIDPs → MIDP → AIM**

| Document | Acronym | What it is |
|---|---|---|
| Organizational Information Requirements | OIR | Owner's high-level business needs |
| Asset Information Requirements | AIR | Info to operate/maintain the asset |
| Project Information Requirements | PIR | Info to deliver the project |
| Exchange Information Requirements | EIR | Client's statement of *what* is required |
| BIM Execution Plan | BEP | Supplier's plan for *how* to meet the EIR |
| Task Information Delivery Plan | TIDP | A task team's delivery schedule |
| Master Information Delivery Plan | MIDP | Consolidated project-wide delivery schedule |
| Asset Information Model | AIM | Operational model delivered at handover |

## Level of Development (LOD) / Level of Information Need (LOIN)

- **LOD** (graphical) — how much geometric detail: LOD 100 (concept) → 500 (as-built).
- **LOI** (non-graphical) — how much attribute data.
- **LOIN** (BS EN 17412-1) — the modern framework combining both, per purpose.

## Data exchange standards

- **IFC** (ISO 16739) — open, vendor-neutral model schema. Versions: IFC 2x3, IFC 4, IFC 4.3.
- **COBie** — open format for facility asset data (non-graphical) for O&M handover.
- **BCF** — BIM Collaboration Format for issue tracking (clash detection, comments).
- **IDS** — Information Delivery Specification, machine-readable requirements.

## National BIM mandates

- **UK** — Level 2 BIM on centrally-procured government projects by April 2016.
- **Singapore** — BCA mandated BIM for submissions over 5,000 m² (2015).
- **Hong Kong** — BIM for government projects over HK$30M (2018).
- **Japan** — MLIT mandated BIM for public works from FY2023.

Next: [Architecture](architecture.md)
