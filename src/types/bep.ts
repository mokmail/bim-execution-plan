// Core data model for a BIM Execution Plan (BEP) document.
// Modeled on the research: JSON canonical format, structured sections,
// inspired by the dotBEP .bep format and ISO 19650-2.

export type BepMode = "pre-appointment" | "delivery";
export type DocStatus = "draft" | "for-review" | "approved" | "superseded";

export type Raci = "R" | "A" | "C" | "I" | "–";

export interface ChangeEntry {
  date: string; // ISO date
  version: string;
  description: string;
  author: string;
}

export interface DocumentControl {
  documentNumber: string;
  revision: string;
  status: DocStatus;
  author: string;
  approver: string;
  distribution: string;
  canonicalLocation: string; // CDE link
  changes: ChangeEntry[];
}

export interface ProjectInformation {
  projectNumber: string;
  projectName: string;
  owner: string;
  location: string;
  description: string;
  duration: string;
  sector: string;
  deliveryMethod: string; // DBB, DB, IPD...
  contractRoute: string;
  startDate: string;
  endDate: string;
}

export interface BimUse {
  id: string;
  name: string;
  description: string;
  phase: string; // planning | design | construction | operations
  responsibleParty: string;
  priority: "high" | "medium" | "low";
  competence: string;
  gaps: string;
}

export interface BimGoals {
  goals: string[]; // measurable BIM goals
  uses: BimUse[];
}

export interface Role {
  id: string;
  role: string;
  person: string;
  organization: string;
  email: string;
  scope: string;
  dedicated: boolean;
}

export interface Responsibilities {
  roles: Role[];
  // RACI matrix: rows keyed by activity, values map roleId -> Raci
  raci: Record<string, Record<string, Raci>>;
  raciActivities: string[];
}

export interface Collaboration {
  cdePlatform: string;
  fileStructure: string;
  namingConvention: string;
  workflowStates: string; // WIP -> Shared -> Published -> Archived
  transitionAuthority: string;
  meetingCadence: string;
  communicationChannels: string;
  escalationProcedure: string;
}

export interface Exchange {
  id: string;
  name: string;
  format: string; // IFC, COBie, BCF, IDS, native...
  formatVersion: string;
  recipient: string;
  levelOfDetail: string;
  responsibleAuthor: string;
}

export interface DataExchange {
  ifcVersion: string; // IFC 2x3, IFC 4, IFC 4.3
  mvd: string;
  exchanges: Exchange[];
}

export interface SoftwareItem {
  id: string;
  discipline: string;
  software: string;
  version: string;
  purpose: string;
}

export interface SoftwareHardware {
  authoring: SoftwareItem[];
  coordination: SoftwareItem[];
  analysis: SoftwareItem[];
  hardware: string;
}

export interface StandardsConventions {
  standards: string;
  classification: string; // Uniclass, OmniClass...
  namingConventions: string;
  propertySets: string;
  units: string;
  coordinates: string;
}

export interface LodRow {
  id: string;
  element: string;
  stage: string;
  level: string; // LOD 100-500 or LOIN
  responsibleParty: string;
}

export interface LevelOfDevelopment {
  specification: string; // BIMForum / NBS
  loinFramework: string; // BS EN 17412-1
  matrix: LodRow[];
}

export interface ModelManagement {
  breakdown: string;
  federationStrategy: string;
  clashTolerance: string;
  coordinationCadence: string;
  ownership: string;
  bcfWorkflow: string;
}

export interface QualityControl {
  validationProcedure: string;
  checklists: string;
  qcResponsibility: string;
  auditFrequency: string;
  nonConformance: string;
  reporting: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  deliverable: string;
  recipient: string;
  format: string;
  responsibleAuthor: string;
  notes: string;
}

export interface Delivery {
  milestones: Milestone[];
  workStageReference: string; // RIBA Plan of Work etc.
}

export interface Security {
  classification: string;
  accessControl: string;
  dataProtection: string;
  secureStorage: string;
  responsibilities: string;
  standard: string; // ISO 19650-5 etc.
}

export interface Training {
  needsAssessment: string;
  plan: string;
  competencies: string;
  onboarding: string;
  lessonsLearned: string;
}

// The full BEP document
export interface BepDocument {
  format: "bep";
  schema: "1.0";
  mode: BepMode;
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

// Versioning
export interface VersionSnapshot {
  version: string;
  date: string;
  author: string;
  note: string;
  document: BepDocument;
}

export interface BepBundle {
  current: BepDocument;
  changelog: VersionSnapshot[];
}

export function emptyDocument(mode: BepMode, projectName = "Untitled Project"): BepDocument {
  const now = new Date().toISOString();
  return {
    format: "bep",
    schema: "1.0",
    mode,
    projectName,
    createdAt: now,
    updatedAt: now,
    documentControl: {
      documentNumber: "",
      revision: "0.1",
      status: "draft",
      author: "",
      approver: "",
      distribution: "",
      canonicalLocation: "",
      changes: [],
    },
    projectInformation: {
      projectNumber: "",
      projectName: "",
      owner: "",
      location: "",
      description: "",
      duration: "",
      sector: "",
      deliveryMethod: "",
      contractRoute: "",
      startDate: "",
      endDate: "",
    },
    bimGoals: { goals: [], uses: [] },
    responsibilities: { roles: [], raci: {}, raciActivities: [] },
    collaboration: {
      cdePlatform: "",
      fileStructure: "",
      namingConvention: "",
      workflowStates: "Work in Progress → Shared → Published → Archived",
      transitionAuthority: "",
      meetingCadence: "",
      communicationChannels: "",
      escalationProcedure: "",
    },
    dataExchange: {
      ifcVersion: "",
      mvd: "",
      exchanges: [],
    },
    software: { authoring: [], coordination: [], analysis: [], hardware: "" },
    standards: {
      standards: "",
      classification: "",
      namingConventions: "",
      propertySets: "",
      units: "",
      coordinates: "",
    },
    lod: { specification: "", loinFramework: "", matrix: [] },
    modelManagement: {
      breakdown: "",
      federationStrategy: "",
      clashTolerance: "",
      coordinationCadence: "",
      ownership: "",
      bcfWorkflow: "",
    },
    qualityControl: {
      validationProcedure: "",
      checklists: "",
      qcResponsibility: "",
      auditFrequency: "",
      nonConformance: "",
      reporting: "",
    },
    delivery: { milestones: [], workStageReference: "" },
    security: {
      classification: "",
      accessControl: "",
      dataProtection: "",
      secureStorage: "",
      responsibilities: "",
      standard: "",
    },
    training: {
      needsAssessment: "",
      plan: "",
      competencies: "",
      onboarding: "",
      lessonsLearned: "",
    },
  };
}
