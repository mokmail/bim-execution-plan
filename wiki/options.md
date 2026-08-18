# Predefined Options

Every field that has a standard industry value offers a **Combobox** (text input +
suggestions, still free-form) or a richer input (chips, multi-select, searchable select)
rather than a bare text field. The central list lives in `src/lib/options.ts`.

## The option lists

| Export | Purpose |
|---|---|
| `PENN_STATE_BIM_USES` | The 25 core BIM uses (Penn State) |
| `DELIVERY_METHODS` | DBB, DB, IPD, CM, CMAR, EPC, PPP |
| `PROJECT_SECTORS` | Residential, Healthcare, Education, Infrastructure… |
| `CONTRACT_ROUTES` | Lump Sum, Cost Plus, Design-Build… |
| `CLASSIFICATION_SYSTEMS` | Uniclass, OmniClass, Uniformat II, MasterFormat… |
| `LOD_SPECIFICATIONS` | BIMForum, NBS, LOIN, AIA E202 |
| `IFC_VERSIONS` | IFC 2x3, IFC 4, IFC 4.3 |
| `MVD_OPTIONS` | Reference View, Design Transfer View… |
| `EXCHANGE_FORMATS` | IFC, COBie, BCF, IDS, native… |
| `EXCHANGE_LOD` | LOD 100–500 |
| `SOFTWARE_DISCIPLINES` | Architecture, Structure, MEP… |
| `AUTHORING_SOFTWARE` | Revit, Archicad, Tekla, Allplan… |
| `COORDINATION_SOFTWARE` | Navisworks, Solibri, BIMcollab… |
| `CDE_PLATFORMS` | Autodesk ACC, Trimble Connect, Procore… |
| `SECURITY_STANDARDS` | ISO 19650-5, PAS 1192-5, ISO 27001… |
| `SECURITY_CLASSIFICATIONS` | Unclassified, Official, Secret… |
| `STANDARDS_OPTIONS` | ISO 19650-1/2/3/4/5/6, NBIMS, AIA, CIC… |
| `WORK_STAGE_REFERENCES` | RIBA 2020, AIA, ISO 19650-2… |
| `UNITS` | mm, m, imperial… |
| `COORDINATE_SYSTEMS` | ETRS89/UTM, WGS84, OSGB36… |
| `BIM_ROLES` | BIM Manager, Coordinator, Information Manager… |
| `PARTIES` | Appointing Party, Architect, MEP Engineer… |
| `COMPETENCE_LEVELS` | Basic, Intermediate, Advanced, Expert |
| `WORKFLOW_STATES` | WIP → Shared → Published → Archived… |
| `MEETING_CADENCES` | Weekly, bi-weekly, monthly… |
| `COMMUNICATION_CHANNELS` | Teams, Slack, BCF, email… |
| `ESCALATION_PROCEDURES` | Coordinator → BIM Manager → Director… |
| `TRANSITION_AUTHORITIES` | Who approves status transitions |
| `CLASH_TOLERANCES` | 10mm, 25mm, per-discipline… |
| `MODEL_BREAKDOWNS` | By discipline, by zone, federated… |
| `FEDERATION_STRATEGIES` | Navisworks, Solibri, CDE-native… |
| `MODEL_OWNERSHIP` | Per-discipline, central, per-package… |
| `QC_VALIDATION_PROCEDURES` | Federated check, automated, IFC/IDS… |
| `QC_CHECKLISTS` | Naming, LOD, property sets, clash-free… |
| `QC_RESPONSIBILITIES` | BIM Coordinator, Manager, Discipline Lead… |
| `AUDIT_FREQUENCIES` | Weekly, monthly, per-milestone… |
| `QC_REPORTING` | Clash report, dashboard, summary… |
| `NON_CONFORMANCE_PROCESSES` | Log NC → assign → track… |
| `EXCHANGE_NAMES` | Design coordination, COBie, as-built… |
| `DELIVERABLE_NAMES` | Federated model, COBie drop, handover… |
| `MILESTONE_NAMES` | Concept, Developed, Technical, Practical Completion… |
| `LOD_ELEMENTS` | Architecture, Structure, MEP, Walls… |
| `LOD_STAGES` | Concept, Design, Construction, As-built… |
| `LOD_LEVELS` | LOD 100–500, LOIN levels |
| `RESPONSIBLE_ROLES` | BIM Coordinator, Architect, Engineer… |
| `SECURITY_ACCESS_CONTROL` | Role-based, 2FA, admin… |
| `DATA_PROTECTION` | GDPR, minimised, NDA… |
| `SECURE_STORAGE` | Encrypted, CDE-only, backups… |
| `SECURITY_RESPONSIBILITIES` | Info Manager, BIM Manager, Security Officer… |
| `TRAINING_NEEDS` | Revit MEP, Navisworks, COBie, ISO 19650… |
| `COMPETENCE_REQUIREMENTS` | Certified Navisworks, ISO 19650 practitioner… |
| `TRAINING_PLANS` | Q1/Q2 schedule, onboarding week… |
| `ONBOARDING` | BEP induction, buddy system… |
| `LESSONS_LEARNED` | Post-project workshop, milestone review… |
| `NAMING_CONVENTIONS` | Project_Discipline_Zone-Type_Number… |
| `PROPERTY_SETS` | COBie, Pset_*, IFC property sets… |

## The daily refresh cron

A **daily cron job** (`5b119f25a894`, "BEP form options web refresh", 06:00) web-searches
for current BIM/BEP standards, software, and classifications, and adds verified new values
to `options.ts`, then commits + pushes to GitHub.

**Rules the cron follows:**
- Only edits `options.ts` constants — never the data model or editors.
- Never removes or renames existing entries.
- Adds new values as additions; keeps each array sorted and de-duplicated.
- Only adds *real, verified* values (no invented software/standards).
- Verifies with `tsc -b` before committing.
- Only pushes if there are actual changes.

## How options are used

- **Combobox** — text input with a `<datalist>` of suggestions (free-form).
- **MultiSelect** — toggle chips on/off (e.g. applicable standards).
- **SearchableSelect** — filter a large list by typing (e.g. software).
- **TagInput** — type + Enter to add tags (e.g. BIM goals, RACI activities).
- **PriorityField** — three-tone segmented control (High/Medium/Low).

Next: [Form Components](form-components.md)
