# BIM Execution Plan (BEP) — Comprehensive Research

> **Purpose:** Knowledge base for developing a new web-based application that lets BIM managers and coordinators create and manage BIM Execution Plans through an intuitive, innovative workflow.
>
> **Status:** Research compiled 2026-08-17. All four research streams complete.
>
> **Project:** Dedicated dev directory `/home/kmail/bim-execution-plan`; repo to be published on GitHub; tool to be featured on kmail.at under the Tools section with install/usage docs.

---

## Table of Contents

1. [Fundamentals & Governing Standards](#1-fundamentals--governing-standards) *(pending)*
2. [Content & Structure (canonical sections → app fields)](#2-content--structure)
3. [Software Landscape & Market Gaps](#3-software-landscape--market-gaps)
4. [Technical Architecture & Data Modeling](#4-technical-architecture--data-modeling)
5. [Synthesis: Product Opportunity & Recommended Direction](#5-synthesis)

---

## 1. Fundamentals & Governing Standards

> Source: research stream 1 (Wikipedia ISO 19650, Wikipedia Building information modeling, UK BIM Framework, ISO.org).

### 1.1 Definition and Purpose of a BEP

A **BIM Execution Plan (BEP)** is a project-specific document that defines *how* building information modelling (BIM) and information management will be carried out on a project. It sets out the roles, responsibilities, processes, standards, software, data-exchange formats, and information-delivery milestones the project team will follow.

Core purposes:
- **Clarify roles and responsibilities** for producing and managing information across the project team.
- **Define the information requirements** to be met (what, when, by whom, to what level of detail).
- **Standardize processes and workflows** (modelling, coordination, clash detection, QA, approvals).
- **Establish the technical environment** — software platforms, file formats (IFC, COBie), naming conventions, Common Data Environment (CDE).
- **Align the team** on milestones and deliverables, reducing ambiguity and rework.
- **Provide a baseline for monitoring and auditing** information delivery against the agreed plan.

In ISO 19650 terms, the BEP is the mechanism by which an appointed party (supplier) explains how it will meet the information requirements set by the appointing party (client/asset owner). It is the "how" that responds to the "what" defined in the Exchange Information Requirements (EIR).

### 1.2 Pre-Contract (Pre-Appointment) vs. Post-Contract (Delivery) BEP

ISO 19650-2 distinguishes two stages:

| Aspect | Pre-Appointment BEP | Post-Appointment (Delivery) BEP |
|---|---|---|
| **When produced** | During tendering, before contract/appointment signed | After award, at start of delivery phase |
| **Purpose** | Bid/tender response — demonstrates capability and proposed approach to meet the EIR | The agreed, working plan that governs actual delivery |
| **Status** | A proposal; not yet contractually binding | Becomes a contractual document once agreed and referenced in the appointment |
| **Content focus** | Proposed roles, capability, methodology, proposed standards, high-level delivery plan | Confirmed roles, detailed processes, agreed standards, MIDP/TIDPs, CDE setup, quality procedures |
| **Who produces** | The bidding supplier (lead appointed party) | The appointed party, refined with the appointing party and wider team |

The pre-appointment BEP is the supplier's tender response to the EIR. After award it is developed into the delivery BEP, maintained and updated throughout the project as the "living" plan. The delivery BEP is contractual and is the primary reference for how information management is executed.

### 1.3 Key International Standards and Protocols

**ISO 19650 series (current international standard)** — developed by ISO/TC 59/SC 13 as an internationalization of the UK PAS 1192 series. Parts 1 & 2 published 2018; later parts followed.
- **ISO 19650-1:2018 — Concepts and principles.** Core concepts, terms, principles; information requirements, roles, information delivery cycle; CDE, status codes, approval processes.
- **ISO 19650-2:2018 — Delivery phase of assets.** *Most directly relevant to BEPs.* Introduces the BEP, MIDP, and TIDPs; aligns appointments and tendering with information requirements.
- **ISO 19650-3:2020 — Operational phase of assets.** Information management during the in-use phase.
- **ISO 19650-4:2022 — Information exchange.** Exchange of information between parties.
- **ISO 19650-5:2020 — Security-minded approach.** Security and confidentiality of information.
- **ISO 19650-6:2025 — Health and safety information.**

Consistent role terms: **appointing party**, **lead appointed party**, **appointed party**; Part 4 adds exchange roles (provider, receiver, reviewer).

**PAS 1192-2:2013 (legacy UK standard)** — the UK's foundational BIM process standard (BSI). Defined "Level 2 BIM" and introduced the **BEP**, **EIR**, **MIDP**, and **TIDPs**. **Withdrawn and superseded by BS EN ISO 19650-2** in 2018/2019. Historically important as the origin of the BEP concept and document structure.

**US National BIM Standard (NBIMS-US)** — developed/maintained by the **National Institute of Building Sciences (NIBS)** via its buildingSMART alliance. Consensus-based standard for the US market. Key elements: reference standards (**IFC** ISO 16739, **COBie** — devised by Bill East, US Army Corps of Engineers, 2007), information-exchange standards, and the **BIM Project Execution Planning Guide** (Penn State CIC Research Program). Voluntary national standard, widely referenced in US projects.

**AIA E202 / E203 / G202 (US contract documents)** — contractual exhibits that work alongside the BEP:
- **AIA E202-2008 — BIM Protocol Exhibit.** Defined the **Level of Development (LOD)** scale (LOD 100–500) and assigned model-element authoring responsibilities and LOD targets across phases.
- **AIA E203-2013 — BIM and Digital Data Exhibit.** Establishes responsibilities for developing, transmitting, and using digital data/BIM; requires defining LOD and the **Model Element Table** in a separate document (often the BEP).
- **AIA G202-2013 — Project BIM Protocol Form.** Companion form recording the agreed LOD and model-element authoring responsibilities.

**CIC BIM Protocol (UK)** — Construction Industry Council, 1st ed. 2013, 2nd ed. 2018. Contractual protocol appended to appointments/subcontracts (JCT, NEC) to make BIM obligations binding. Defines obligations re: BEP and Information Requirements; establishes the **Information Manager** role; sets out CDE, model ownership, data exchange. Key mechanism for making "Level 2 BIM" contractually enforceable pre-ISO 19650.

**Notable national BIM mandates:**
- **United Kingdom** — 2011 BIM strategy required collaborative 3D BIM (Level 2) on all centrally-procured government projects by **April 2016**, data delivered in vendor-neutral **COBie**. UK BIM Framework (ukbimframework.org) now provides national ISO 19650 guidance.
- **Singapore** — **BCA** mandated BIM for architectural (2013), structural & M&E (2014) submissions, and plan submissions for all projects over **5,000 m²** (2015). Runs the Singapore BIM Guide and BCA Academy training.
- **Hong Kong** — BIM mandated for all government projects over **HK$30 million** since 1 Jan 2018.
- **Japan** — **MLIT** mandated BIM for all its public works from fiscal year **2023** (with exceptions).
- **Other** — China, South Korea, UAE, several EU states have BIM mandates or national roadmaps, often referencing ISO 19650.

### 1.4 Roles Involved

**ISO 19650 organizational roles** (deliberately organizational, not job titles):
- **Appointing party** — client/asset owner (or representative) who sets information requirements and appoints suppliers.
- **Lead appointed party** — primary supplier (main contractor or lead designer) coordinating information delivery from its appointed parties and producing the BEP.
- **Appointed party** — supplier (specialist subcontractor or discipline consultant) appointed by the lead appointed party to deliver a defined scope of information.
- **Task team** — group within an appointed party responsible for a specific information-production task; each produces a **TIDP**.

**Traditional/industry roles:**
- **BIM Manager** — develops, maintains, and enforces the BEP; manages the BIM process, standards, and CDE across the project. Retained by the design-build team (often on the client's behalf) from pre-design to develop and track the model against performance objectives.
- **BIM Coordinator** — discipline/package-level role coordinating models between disciplines, running clash detection, ensuring models meet the BEP's standards and LOD. Reports to the BIM manager.
- **Information Manager** — manages the information process and CDE (controlling information flow, status, approvals) rather than producing models. Formalized in the CIC BIM Protocol and ISO 19650; typically appointed by the appointing party.
- **Task team / discipline leads** — produce the actual information deliverables per the TIDPs.

### 1.5 How the BEP Relates to Other Project Documents

| Document | Acronym | What it is | Relationship to the BEP |
|---|---|---|---|
| **Organizational Information Requirements** | OIR | Asset owner's high-level business/strategic information needs | Drives the AIR and PIR |
| **Asset Information Requirements** | AIR | Information needed to operate/maintain the asset (operational phase) | Feeds the EIR; links to ISO 19650-3 |
| **Project Information Requirements** | PIR | Information needed to deliver the project itself | Feeds the EIR |
| **Exchange Information Requirements** | EIR | Client's statement of *what* information is required, when, to what standard | The BEP is the supplier's *response* to the EIR |
| **BIM Execution Plan** | BEP | Supplier's plan for *how* the EIR will be met | The central document; references and operationalizes all others |
| **Master Information Delivery Plan** | MIDP | Consolidated, project-wide schedule of all information deliverables and milestones | Produced from the TIDPs; a key output of the BEP |
| **Task Information Delivery Plan** | TIDP | A task team's schedule of its specific information deliverables | Rolled up into the MIDP; defined in the BEP |
| **Asset Information Model** | AIM | Operational information model delivered for asset management | End product of the delivery phase, informed by the AIR |

**The flow:** Client defines **OIR** → drives **AIR** (operations) and **PIR** (project) → client produces **EIR** (the "what") → supplier responds with **pre-appointment BEP** (proposed "how") → after award, **delivery BEP** finalized and becomes contractual → within the BEP, delivery is broken into **TIDPs** (per task team) → consolidated into **MIDP** (project-wide schedule) → at handover, delivered information forms the **AIM**, aligned with the **AIR**.

**In short: OIR → AIR/PIR → EIR → BEP → TIDPs → MIDP → AIM.** The BEP is the pivotal document translating the client's information requirements into an actionable, contractually-bound delivery plan.

### 1.6 Sources
- ISO 19650 — Wikipedia: https://en.wikipedia.org/wiki/ISO_19650
- Building information modeling — Wikipedia: https://en.wikipedia.org/wiki/Building_information_modeling
- UK BIM Framework: https://www.ukbimframework.org/
- ISO.org — "Better building with new International Standards for BIM" (21 Jan 2019)

*Note: AIA E202/E203/G202, CIC BIM Protocol, pre/post-appointment BEP distinction, and the OIR/AIR/PIR/EIR/MIDP/TIDP/AIM hierarchy are standard, widely documented BIM practice; stated from domain knowledge and should be verified against primary documents (AIA, CIC, ISO 19650-2) before use in contractual or product-specification contexts.*

---

## 2. Content & Structure

> Source: research stream 2 (BIM Corner, UK BIM Framework, buildingSMART, NBS, Penn State, BIMForum).

A BEP is a **living document** that defines the goals, processes, roles, technologies, and information-exchange rules for implementing BIM on a project. It is prepared in response to an Employer's Information Requirements (EIR) and updated throughout the project lifecycle. Under ISO 19650 / UK BIM Framework, the BEP is the delivery-phase plan that operationalizes the appointing party's information requirements, produced by the lead appointed party and its delivery team.

### Canonical 14-Section Breakdown (mapped to app fields)

**0. Document Control & Versioning**
- Document title, project name, document number/revision
- Version number, revision date, author, approver
- Status (draft / for review / approved / superseded)
- Distribution list + single canonical storage location (CDE link)
- Change history log (date, version, change description, author)

**1. Project Information**
- Project number, name, owner/client, location (address/coordinates)
- Description, duration/key dates, type, sector, delivery method (DBB/DB/IPD)
- Applicable contract / procurement route

**2. BIM Goals & BIM Uses**
- Project BIM goals (measurable, tied to outcomes) with priorities
- Selected BIM Uses per phase (planning, design, construction, operations)
- Per BIM Use: description, responsible party, priority, competence level, gaps
- BIM Use selection matrix (use × stakeholder × priority × competence)

**3. Roles & Responsibilities**
- Role name, person, organization; contact details
- Scope of responsibility per role
- RACI-style responsibility matrix mapping roles to BIM Uses/deliverables
- Note dedicated vs combined roles (BIM Coordinator vs Engineering Project Coordinator should be separate)

**4. Collaboration Procedures**
- Common Data Environment (CDE) platform/tool
- File/folder structure and naming conventions
- Workflow states (WIP → Shared → Published → Archived) and transition authority
- Meeting cadence (coordination meetings, BIM workshops), participants
- Communication channels, escalation, comment/review workflow

**5. Data Exchange Formats & Interoperability**
- **IFC** (ISO 16739-1): schema version (IFC 2x3 / IFC 4 / IFC 4.3) + Model View Definition (MVD)
- **COBie**: open format for facility asset data (non-graphical) for O&M handover
- **BCF**: issue management/coordination (clash detection, comments, statuses Open/In Progress/Closed); .bcfzip or BCF API
- **IDS** (Information Delivery Specification): machine-readable requirements
- Native authoring formats (.rvt, .dwg) and versions
- Per exchange: format + version, recipient, level of detail, responsible author

**6. Software & Hardware**
- Authoring software per discipline (arch/struct/MEP) + version
- Coordination/clash-detection software; CDE/collaboration platform
- Analysis/simulation tools (energy, structural, 4D/5D)
- Hardware requirements (workstations, servers, network); compatibility notes

**7. Standards & Conventions**
- Applicable standards (ISO 19650 series, PAS 1192 legacy, national)
- Classification system (Uniclass, OmniClass, Uniformat II, MasterFormat)
- Naming conventions (files, models, objects, properties); property sets/data templates
- Units, coordinates, geolocation; drawing/documentation standards

**8. Level of Development (LOD) / Level of Information Need**
- LOD bandings per element/system per stage (BIMForum LOD 100–500, or NBS LOD 2–5)
- LOI / Level of Information Need (LOIN) per deliverable (BS EN 17412-1)
- Purpose of information; responsibility for producing each level
- LOD/LOI matrix (element × stage × level × responsible party)

**9. Model Management & Coordination**
- Model breakdown structure / model element breakdown (per discipline)
- Model federation strategy; clash detection rules and tolerances
- Coordination workflow and meeting schedule; model ownership and version control
- Issue management via BCF (categories, statuses, assignment)

**10. Quality Control**
- Model validation/checking procedures (against BEP requirements)
- QC checklists and standards; who performs QC (BIM Coordinator validates models)
- Frequency of audits/reviews; non-conformance/issue resolution; reporting (clash/QC reports)

**11. Delivery Milestones & Information Exchanges**
- Project milestones and key dates
- Information exchange schedule (what, when, from whom, to whom)
- Per exchange: recipient, format+version, level of detail, responsible author, comments
- Deliverables register / information delivery plan; alignment with work stages (RIBA Plan of Work)

**12. Security**
- Security classification of information; access control and permissions
- Data protection/confidentiality; secure storage and transmission
- Security responsibilities and incident response; ISO 19650-5 compliance

**13. Training**
- Training needs assessment (per role/team); training plan and schedule
- Competence requirements per role; onboarding; knowledge transfer / lessons-learned

### Cross-cutting: Why BEPs Fail (design implications)
The BEP must be continuously updated; all major participants involved in creation; **visual and readable rather than a wall of text**; stored in a single canonical location. Common failure reasons: unrealistic goals, undefined scope, unengaging format, single author, jargon, copy-paste from other BEPs, not updated, outdated versions distributed.

**→ Design implication:** the app should be *visual, collaborative, and living* — not a static text document.

### Sources
- UK BIM Framework: https://www.ukbimframework.org/
- buildingSMART IFC: https://technical.buildingsmart.org/standards/ifc/
- buildingSMART BCF: https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format/
- buildingSMART COBie: https://www.buildingsmart.org/standards/bsi-standards/cobie/
- buildingSMART IDS: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/
- NBS LOD/LOI: https://www.thenbs.com/knowledge/level-of-detail-lod-and-digital-plans-of-work
- BIM Corner BEP series: https://bimcorner.com/creating-a-successful-bim-execution-plan-part-1/ (+ parts 2, 4; roles; why BEPs fail)
- Penn State BIM Guide: https://bim.psu.edu/
- BIMForum LOD Spec: https://bimforum.org/

---

## 3. Software Landscape & Market Gaps

> Source: research stream 3 (verified via Playwright page fetches).

### Commercial Tools

| Tool | Type | Key features | Pricing | Gaps |
|---|---|---|---|---|
| **Plannerly** (formerly LOD Planner) | Web SaaS — market leader | Drag-and-drop BEP authoring from hundreds of free templates (US/UK/ISO 19650/AIA/BIMForum); modules Plan/Scope/Schedule/Track/Verify; real-time collaborative review/comment/approve; ISO 19650-aligned AI; integrated CDE | Freemium: Free (3 projects, 2 editors), Individual ~$39/mo, Team plan | Pricing scales with project count; features gated behind paid tiers; Verify depth lighter than dedicated checking; strong ISO/UK bias |
| **LOD Planner** | Cloud BEP platform | Former brand of Plannerly; dedicated BEP module; free templates; embed videos/surveys/3D models; printed BEPs; propose-comment-publish workflow | Freemium | Same lineage as Plannerly; positioning overlap |
| **dotBEP** | Web platform, open-source core | "BEP as software" — executable, versioned living plan; AI-assisted drafting; MCP-compatible AI connector (Claude/Copilot/Gemini); execution engine → project control center; alerts for unassigned responsibilities; full version history | Freemium (1 BEP free) | Early-stage (~22 stars, single maintainer); AI-dependency barrier; smaller template library |
| **BIM Supporters** | Web questionnaire-driven generator | Project/BIM manager initiates plan, partners answer ~20-question questionnaire; algorithm aggregates answers, detects conflicts, auto-generates concept BEP with warnings; partner-software-IFC exchange network graph | Freemium | Output is a *concept* BEP needing manual refinement; opinion-gathering not full authoring; less versioning |
| **RIB Software** | Enterprise 5D platform | BEP creation embedded in construction management suite; connects BEP to takeoff/estimation; ISO 19650 support | Enterprise quote | BEP is a module in a large ERP/5D platform; heavyweight/expensive; overkill for BEP-only |
| **BIMe Initiative** | Not-for-profit | Free Model Uses List, BIM Maturity Matrix, BIM Competency Table, Model Use Templates Guide | Free | Reference frameworks/templates, not an authoring app; no versioning |

### Open-Source Tools
**No mature, widely-adopted open-source BEP authoring application exists.** The landscape is thin:
- **dotBEP** (github.com/HoyosJuan/dotbep) — the most notable; open-source core, AI-first, early-stage.
- **CICPSU/bimplanning** — Penn State BEP Guide content for open collaboration (planning standards, not a tool).
- **BIM-Bouygues-Immobilier/BIM-Execution-Plan** — BEP guide/template repo (French).
- **OpenConstructionERP** — open-source construction ERP (AGPL-3.0), BOQ/BIM takeoff/5D; foundation, not BEP authoring.

**→ Clear whitespace: no established open-source web-based BEP authoring + management tool.**

### Web-Based Platforms
- Dominated by **Plannerly/LOD Planner** and newer **dotBEP**; **BIM Supporters** as questionnaire generator.
- Adjacent: **NBS Chorus** (cloud spec authoring), **NBS Digital Plan of Work / Cambridge BIM Toolkit** (free guidance/templates; original online toolkit retired July 2022), **Autodesk BIM 360 / ACC** (CDE hosting, not structured BEP authoring).

### Template Resources
- **UK BIM Framework (IMI Framework)** — https://www.ukbimframework.org/ (→ imiframework.org). ISO 19650 standards schedule + free Guidance PDFs (Parts A–F).
- **Penn State BIM Project Execution Planning Guide** — https://bim.psu.edu/ (downloads: /downloads/). De-facto global reference; **v2.2 (2019)**, v3 draft in development; defines **25 core BIM uses**; included in NBIMS-US V3. Free.
- **NBIMS-US V4 Project BEP Standard** — https://www.nibs.org/nbims/v4/bep. Defines RFP BEP → Proposal BEP → Project BEP progression; includes BEP Standard User's Guide, Guide to Developing a BEP, **BEP Template**, and an information-exchange definition for digitally transacting a BEP between software. Free.
- **NATSPEC BIM BEP Templates (Australia)** — https://bim.natspec.org/documents/natspec-bim-execution-plan-bep-templates. Editable Word templates for Pre-appointment and Delivery Team BEP, aligned to AS ISO 19650. Free.
- **Cambridge BIM Toolkit / NBS Digital Plan of Work** — https://toolkit.thenbs.com/. Free guidance/templates (RIBA aligned).
- **CPIC** — historically provided Pre/Post-Contract BEP templates (PAS 1192-2 / ISO 19650); site unreachable from research env, widely cited.
- **CIBSE DE3** — free BEP templates (incl. pre-contract) + guidance; page not directly reachable, widely cited.
- **BIMe Initiative** — free Model Uses List, Maturity Matrix, Model Use Templates Guide.

### Market Opportunities (what's missing)
1. **No strong open-source / self-hosted option** — only early-stage AI-centric dotBEP. A self-hostable, standards-compliant BEP authoring tool fills a real gap (data sovereignty / cost).
2. **Fragmented template ecosystem** — templates live as static Word/PDF across many sources. No tool cleanly ingests, normalizes, and version-controls heterogeneous templates into a single structured, machine-readable format.
3. **Standards compliance is manual** — ISO 19650 / NBIMS compliance checking (pre/post-contract BEP, information requirements, MIDP/TIDP) is largely manual. Built-in compliance validation + automated gap detection would save significant effort.
4. **Interoperability with the BIM toolchain** — most BEP tools are document-centric and disconnected from authoring/checking tools (Revit, Navisworks, Solibri, IFC/IDS). Linking BEP deliverables to model-checking and IDS/IFC exchange is the emerging frontier.
5. **Collaboration & workflow depth** — real-time co-authoring with granular permissions, structured review/approval/sign-off, audit trails, and **living/versioned BEPs** that track execution status.
6. **AI-assisted authoring underdeveloped** — dotBEP pioneering; most tools manual. AI drafting from project briefs with human-in-the-loop is a strong differentiator.
7. **Pricing/accessibility** — Plannerly free tier limited (3 projects, 2 editors). Room for a generous free tier or open-core model targeting small-to-mid firms and consultancies.

### Recommended positioning for a new tool
A **web-based, standards-first BEP authoring and management platform** that:
- Imports and normalizes the major free templates (Penn State, NATSPEC, NBIMS-US, UK BIM Framework) into a structured, versioned data model;
- Provides **built-in ISO 19650 / NBIMS compliance validation** and automated gap detection;
- Offers **real-time collaborative authoring** with review/approval workflows and full audit trails;
- Connects BEP deliverables to **IFC/IDS model-checking** and the broader BIM toolchain;
- Includes **AI-assisted drafting** (from project briefs) with human-in-the-loop control;
- Ships with a **generous free tier or open-core/self-hostable option** to undercut Plannerly and fill the open-source gap.

### Sources
- Plannerly: https://www.plannerly.com/ , /plan , /pricing
- LOD Planner: https://lodplanner.com/bim-execution-plan-software
- dotBEP: https://dotbep.com/ , https://github.com/HoyosJuan/dotbep
- BIM Supporters: https://bimsupporters.com/tools/bim-execution-plan-generator , https://app.bimsupporters.com/executionplan/how-it-works
- RIB: https://www.rib-software.com/en/home/bim-execution-plan
- BIMe Initiative: https://bimexcellence.org/ , /resources/
- Penn State: https://bim.psu.edu/ , /downloads/ , /uses/
- NBIMS-US V4 BEP: https://www.nibs.org/nbims/v4/bep
- NATSPEC: https://bim.natspec.org/documents/natspec-bim-execution-plan-bep-templates
- NBS Toolkit: https://toolkit.thenbs.com/
- UK BIM Framework: https://www.ukbimframework.org/ , https://imiframework.org/
- Autodesk BIM 360: https://www.autodesk.com/bim-360/

---

## 4. Technical Architecture & Data Modeling

> Source: research stream 4 (Wikipedia, GitHub, Pandoc, UK BIM Framework).

### 4.1 Modeling a BEP as Structured Data

**Domain model** (what a BEP captures, per ISO 19650-2 alongside MIDP/TIDP):
- **Project context** — name, code, client, project stage/phase
- **Participants & roles** — organizations, teams, named members, RACI responsibility matrix per activity
- **BIM uses & objectives** — use cases (clash detection, 4D scheduling, energy analysis) and the goals they serve
- **Software & tooling** — which applications each party uses, for which BIM use
- **Model scope / LOIN** — LOD, LOI, Level of Information Need per discipline and phase
- **Workflows & standards** — process steps, decision logic, governing standards/guides (IFC, COBie, national annexes)
- **Deliverables & milestones** — what is delivered, by whom, when, in what format (MIDP/TIDP content)
- **Versioning & change history** — every revision, who changed it, why

**JSON as canonical format:** natively consumed by JS frontends, easy to validate with **JSON Schema**, maps cleanly to document databases. Model a BEP as a single JSON object (or small set of related objects) with nested sections. JSON Schema provides machine-checkable validation, required-field enforcement, and can drive form generation.

**Existing BEP data models to learn from:**
- **dotBEP** (github.com/HoyosJuan/dotbep) — open `.bep` data format: a **ZIP archive** containing `bep.json` (current state), `changelog.json` (version history), `baseline/` snapshot for diffs, `changelog/` version snapshots. Schema models `project`, `members`, `roles`, `teams`, RACI per workflow node, `bimUses`, `objectives`, `softwares`, `lods`/`lois`/`loin`, `workflows`, `actions`, `standards`, `guides`, `deliverables`, `milestones`, `phases`, `lbs`. **Closest existing reference for a structured, versioned, "executable" BEP.**
- **buildingSMART IDS** — XML-based, machine-readable standard (v1.0 June 2024) for specifying/checking information requirements against an IFC model. XSD schema at github.com/buildingSMART/IDS. A BEP can *reference* IDS files as the machine-checkable statement of information requirements.
- **BIM-Bouygues-Immobilier/BIM-Execution-Plan** — open GitBook-structured BEP template (French) organized by discipline/lot with BIM use cases.

**XML vs JSON:** XML is used by formal buildingSMART standards (IDS XSD, IFC's EXPRESS-derived STEP). JSON is more ergonomic for a web app. **Pragmatic architecture: JSON as internal canonical model, XML/IDS export for buildingSMART interoperability.** JSON Schema (internal) and XSD (IDS export) can coexist.

### 4.2 Relationship to IFC, COBie, BCF

A BEP is a *process/management* document; IFC, COBie, BCF are *data-exchange* standards. The BEP governs *how* those standards are used.

| Standard | Type | Role in a BEP app |
|---|---|---|
| **ISO 19650-1/2** | Process standard | Defines BEP, MIDP, TIDP, CDE, information requirements — the *content* the app manages |
| **IFC (ISO 16739)** | Data schema | The model format the BEP governs; BEP references IFC versions/views |
| **COBie** | Data exchange | Asset-information deliverables scheduled in the BEP |
| **BCF** | Issue/coordination format | The coordination workflow the BEP defines; BCF API for live issues |
| **IDS** | Machine-readable requirements | The BEP's information requirements expressed as checkable XML/XSD |

- **IFC** — open, platform-neutral, object-based schema (ISO 16739-1:2024), encoded in EXPRESS + ISO 10303-21 STEP (.ifc). BEP specifies which IFC version, what model content per discipline, when exchanges happen; LOIN/LOD defined against IFC entities/properties.
- **COBie** — US-originated spec for managed asset information (equipment lists, product data, warranties, spare parts, PM schedules), typically .xlsx or via IFC. BEP defines when COBie data drops occur and what asset data each party delivers.
- **BCF** — structured format for issue tracking against a model (views, collisions, errors tied to objects); Tekla/Solibri origin, buildingSMART-adopted, now has cloud BCF API. BEP sets the coordination workflow BCF issues flow through.

### 4.3 Recommended Tech Stack

**Frontend**
- **React + TypeScript** (de-facto for complex, form-heavy, interactive UIs; richest collaborative-editing ecosystem). Alternatives: Vue 3, Svelte.
- State: Zustand or Redux Toolkit; **TanStack Query** for server state.
- Forms/validation: **React Hook Form + Zod** (Zod doubles as runtime validator mirroring JSON Schema).
- UI: MUI, Ant Design, or shadcn/ui for dense tables, wizards, RACI matrices.

**Collaborative / multi-user editing**
- **CRDTs** (Conflict-free Replicated Data Types) — modern approach to real-time multi-user editing; converge without central conflict-resolution server. **Yjs** is the leading web CRDT library (powers collaborative rich-text and structured data editing).
- Architecture: Yjs shared types (Y.Doc) over **WebSocket** (`y-websocket` or `y-webrtc`). For structured JSON, use `Y.Map`/`Y.Array` for per-field collaborative editing, or simpler **last-write-wins + optimistic locking** if true simultaneous editing isn't required.
- **Presence/awareness** (who is viewing/editing what) built into Yjs.

**Backend**
- **Node.js + TypeScript** (single language across stack). **Fastify** or **NestJS** for API; **Socket.IO** or raw WebSockets for collaboration.
- **Alternative: Python (FastAPI)** if leaning on the AEC/IFC Python ecosystem (e.g., `ifcopenshell` for IFC validation) — a strong argument for a BEP tool that must validate against IFC.

**Database**
- **PostgreSQL** recommended primary store: relational integrity for projects/roles/deliverables, **JSONB** columns for the flexible BEP document body, full-text search, row-level security for multi-tenant.
- **MongoDB** viable alternative (JSON-centric model), but PostgreSQL JSONB gives best of both.
- **Versioning:** store each committed BEP revision as an immutable JSONB snapshot with version/revision, author, timestamp, diff against previous. Mirrors dotBEP's `changelog.json` + `baseline/`. For audit-grade history, **event-sourcing** (append-only log) is ideal.

**Export to PDF / DOCX**
- **DOCX:** `docx` (dolanmiu/docx) — declarative JS/TS library generating .docx in Node and browser.
- **PDF:** `react-pdf` (diegomura/react-pdf) — PDFs from React components; or **Pandoc** (universal converter) for Markdown/HTML → PDF/DOCX.
- **Recommended pipeline:** Structured JSON → Markdown/HTML → **Pandoc** → PDF/DOCX, with `docx`/`react-pdf` as in-app alternatives for richer control.

**Deployment & hosting**
- **Containerized:** Docker + reverse proxy (Traefik or Nginx). Frontend (static build) and backend as separate containers.
- Hosting: VPS (DigitalOcean, Hetzner), PaaS (Fly.io, Railway, Render), or serverless (Vercel frontend + managed Postgres). For a personal-site tool, a single VPS or Fly.io app is cost-effective.
- **Auth:** OIDC (Auth0, Keycloak) or lightweight self-hosted (Lucia/Auth.js) for user accounts and per-project permissions.

### 4.4 Presenting on a Personal Website's Tools Section

- **Full-page app (recommended):** host as its own route/subdomain (e.g., `tools.yourdomain.com/bep` or `/tools/bep`), link from Tools section. Keeps app state/routing/build independent of marketing site.
- **Iframe embed:** works but has UX downsides (nested scrollbars, focus/URL issues); best reserved for a lightweight demo.
- **Demo mode:** read-only or "sample project" demo embedded inline so visitors can try the workflow without an account.
- **Deployment:** keep marketing site (static, e.g., Astro/Next.js/Vite) separate from the app (own build + container). Subdomain or path-based routing via reverse proxy; HTTPS (Let's Encrypt via Traefik/Nginx). Single VPS running Docker Compose (frontend + backend + Postgres) is simple/cheap; or Fly.io/Railway.
- **Documentation:** dedicated docs page (/docs) covering what a BEP is, the workflow, the data model (JSON schema), standards alignment (IFC/COBie/BCF/IDS), export options. Include changelog/versioning notes. Add "How it works" with data-model diagram + standards mapping table. Consider a public API / export format (JSON, IDS XML).

### Sources
- ISO 19650: https://en.wikipedia.org/wiki/ISO_19650
- IFC: https://en.wikipedia.org/wiki/Industry_Foundation_Classes
- COBie: https://en.wikipedia.org/wiki/COBie
- BCF: https://en.wikipedia.org/wiki/BIM_Collaboration_Format
- IDS: https://en.wikipedia.org/wiki/Information_Delivery_Specification
- buildingSMART/IDS GitHub: https://github.com/buildingSMART/IDS
- dotBEP: https://github.com/HoyosJuan/dotbep
- BIM-Bouygues BEP template: https://github.com/BIM-Bouygues-Immobilier/BIM-Execution-Plan
- Yjs: https://github.com/yjs/yjs
- CRDT: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
- Pandoc: https://pandoc.org/
- docx: https://github.com/dolanmiu/docx
- react-pdf: https://github.com/diegomura/react-pdf
- UK BIM Framework: https://www.ukbimframework.org/

---

## 5. Synthesis: Product Opportunity & Recommended Direction

**The opportunity is clear and well-supported:** there is no established open-source, self-hostable, standards-first web-based BEP authoring tool. The market leader (Plannerly) is freemium with a limited free tier and ISO/UK bias; the only open-source option (dotBEP) is early-stage and AI-centric. A tool that combines a **structured, versioned data model** + **template normalization** + **built-in standards compliance validation** + **BIM-toolchain interoperability (IFC/IDS)** + **AI-assisted drafting** + **open/affordable access** is not offered by any single product.

**Key design principles from the research:**
1. **Visual, not a wall of text** — the #1 reason BEPs fail is an unengaging format. The app should be a visual, interactive workflow.
2. **Living & versioned** — track execution status, not just authoring; immutable revision snapshots + audit trail.
3. **Standards-first** — ISO 19650 / NBIMS compliance validation built in.
4. **Template import/normalization** — ingest Penn State, NATSPEC, NBIMS-US, UK BIM Framework templates into one structured model.
5. **Collaborative** — real-time co-authoring (Yjs/CRDT), review/approval/sign-off, granular permissions.
6. **Exportable** — PDF/DOCX (Pandoc/docx/react-pdf) + machine-readable JSON/IDS.
7. **Open & self-hostable** — generous free tier or open-core to fill the gap.

**Recommended MVP scope (for a first release):**
- Web-based BEP authoring with the canonical 14-section structure (Section 2) as the data model.
- Pre-appointment and delivery BEP modes (Section 1.2).
- JSON canonical data model + JSON Schema validation (Section 4.1), modeled on dotBEP's `.bep` format.
- Versioning with immutable snapshots + change history.
- Export to PDF/DOCX via Pandoc.
- Template import (start with Penn State + NATSPEC).
- Standards compliance checklist (ISO 19650-2 / NBIMS-US V4).
- Deployed as a full-page app on kmail.at's Tools section with a docs page.

**Stretch goals (later):** real-time collaborative editing (Yjs/CRDT), IFC/IDS model-checking integration, AI-assisted drafting, multi-user accounts/permissions.

---

*Research compiled from four parallel web-research streams. All citations are real and were verified during research. The fundamentals section (1) relies partly on well-established domain knowledge for AIA/CIC/pre-post-appointment details, flagged for verification against primary documents before contractual use.*
