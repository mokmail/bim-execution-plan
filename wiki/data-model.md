# Data Model

The heart of the app is the **`BepDocument`** — a canonical JSON object that represents a
BIM Execution Plan. It lives in `src/types/bep.ts` and is stored in PostgreSQL as JSONB.

## The `BepDocument` shape

```ts
interface BepDocument {
  format: "bep";
  schema: "1.0";
  mode: "pre-appointment" | "delivery";
  projectName: string;
  createdAt: string;
  updatedAt: string;
  documentControl: DocumentControl;
  projectInformation: ProjectInformation;
  bimGoals: BimGoals;
  responsibilities: Responsibilities;
  collaboration: Collaboration;
  dataExchange: DataExchange;
  software: SoftwareHardware;
  standards: StandardsConventions;
  lod: LevelOfDevelopment;
  modelManagement: ModelManagement;
  qualityControl: QualityControl;
  delivery: Delivery;
  security: Security;
  training: Training;
}
```

## The 14 sections

Each section maps to a standard part of a BEP:

| # | Section | Key fields |
|---|---|---|
| 1 | **Document Control** | documentNumber, revision, status, author, approver, distribution, canonicalLocation, changes[] |
| 2 | **Project Information** | projectNumber, projectName, owner, location, description, duration, sector, deliveryMethod, contractRoute, startDate, endDate |
| 3 | **BIM Goals & Uses** | goals[], uses[] (name, phase, priority, responsibleParty, competence, gaps) |
| 4 | **Roles & Responsibilities** | roles[] (role, person, organization, email, scope, dedicated), raci matrix |
| 5 | **Collaboration** | cdePlatform, fileStructure, namingConvention, workflowStates, transitionAuthority, meetingCadence, communicationChannels, escalationProcedure |
| 6 | **Data Exchange** | ifcVersion, mvd, exchanges[] (name, format, formatVersion, recipient, levelOfDetail, responsibleAuthor) |
| 7 | **Software & Hardware** | authoring[], coordination[], analysis[], hardware |
| 8 | **Standards & Conventions** | standards, classification, namingConventions, propertySets, units, coordinates |
| 9 | **Level of Development** | specification, loinFramework, matrix[] (element, stage, level, responsibleParty) |
| 10 | **Model Management** | breakdown, federationStrategy, clashTolerance, coordinationCadence, ownership, bcfWorkflow |
| 11 | **Quality Control** | validationProcedure, checklists, qcResponsibility, auditFrequency, nonConformance, reporting |
| 12 | **Delivery** | workStageReference, milestones[] (name, date, deliverable, recipient, format, responsibleAuthor, notes) |
| 13 | **Security** | classification, accessControl, dataProtection, secureStorage, responsibilities, standard |
| 14 | **Training** | needsAssessment, plan, competencies, onboarding, lessonsLearned |

## Versioning

A **`BepBundle`** wraps the current document plus its version history:

```ts
interface BepBundle {
  current: BepDocument;
  changelog: VersionSnapshot[];
}
interface VersionSnapshot {
  version: string;
  date: string;
  author: string;
  note: string;
  document: BepDocument; // immutable snapshot
}
```

- Committing a revision bumps `documentControl.revision` (e.g. `0.1` → `0.2`), appends a
  change-history entry, and stores an immutable snapshot in `bep_versions`.
- The backend logs a version when the revision changes on save.

## The dual project-name fields (important)

`BepDocument` has **both** a top-level `projectName` AND `projectInformation.projectName`.
They must stay in sync — editing one without the other desyncs the DB name, the project
id/slug, and the wizard header. Always set both in a single update:

```ts
setDoc(x => ({ ...x, projectName: v, projectInformation: { ...x.projectInformation, projectName: v } }))
```

The wizard header shows a prominent always-editable name input that does this sync.

## Empty document

`emptyDocument(mode, projectName)` returns a fully-structured blank `BepDocument` with
all sections present but empty — the starting point for templates and blank projects.

Next: [API Reference](api.md)
