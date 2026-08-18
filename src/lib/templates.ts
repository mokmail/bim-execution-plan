import type { BepDocument, BepMode } from "../types/bep";
import { emptyDocument } from "../types/bep";
import { PENN_STATE_BIM_USES } from "./options";

// Template generators that pre-fill a BEP structure.
// Penn State 25 BIM Uses + NATSPEC / ISO 19650 style section scaffolding.

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  appliesTo: BepMode | "both";
  build: (mode: BepMode, projectName: string) => BepDocument;
}

export const templates: TemplatePreset[] = [
  {
    id: "penn-state",
    name: "Penn State BIM Project Execution Planning",
    description: "Prefills the 25 core BIM uses with roles, RACI scaffolding, and LOD matrix placeholders.",
    appliesTo: "both",
    build: (mode, projectName) => {
      const doc = emptyDocument(mode, projectName);
      doc.bimGoals.goals = [
        "Reduce construction conflicts through 3D coordination",
        "Improve cost certainty via early quantity takeoffs",
        "Streamline operations and maintenance handover",
      ];
      doc.bimGoals.uses = PENN_STATE_BIM_USES.map((u, i) => ({
        id: `use-${i}`,
        name: u,
        description: "",
        phase: i < 8 ? "design" : i < 15 ? "construction" : "operations",
        responsibleParty: "",
        priority: i < 5 ? "high" : "medium",
        competence: "",
        gaps: "",
      }));
      doc.responsibilities.roles = [
        {
          id: "role-bim-mgr",
          role: "BIM Manager",
          person: "",
          organization: "",
          email: "",
          scope: "Develop, maintain and enforce the BEP; manage CDE and BIM process across the project.",
          dedicated: true,
        },
        {
          id: "role-bim-coord",
          role: "BIM Coordinator",
          person: "",
          organization: "",
          email: "",
          scope: "Coordinate discipline models, run clash detection, ensure models meet BEP standards and LOD.",
          dedicated: true,
        },
        {
          id: "role-info-mgr",
          role: "Information Manager",
          person: "",
          organization: "",
          email: "",
          scope: "Manage the information process and CDE: control information flow, status, and approvals.",
          dedicated: true,
        },
        {
          id: "role-discipline-lead",
          role: "Discipline Lead / Task Team",
          person: "",
          organization: "",
          email: "",
          scope: "Produce information deliverables per TIDPs.",
          dedicated: false,
        },
      ];
      doc.responsibilities.raciActivities = [
        "3D Coordination",
        "Design Authoring",
        "Clash Detection",
        "Model Quality Check",
        "Information Handover",
      ];
      doc.responsibilities.raci = {
        "3D Coordination": { "role-bim-coord": "R", "role-bim-mgr": "A", "role-discipline-lead": "C" },
        "Design Authoring": { "role-discipline-lead": "R", "role-bim-coord": "C", "role-bim-mgr": "A" },
        "Clash Detection": { "role-bim-coord": "R", "role-bim-mgr": "A" },
        "Model Quality Check": { "role-bim-coord": "R", "role-bim-mgr": "A", "role-discipline-lead": "C" },
        "Information Handover": { "role-info-mgr": "R", "role-bim-mgr": "A", "role-discipline-lead": "C" },
      };
      doc.dataExchange.ifcVersion = "IFC 4";
      doc.dataExchange.exchanges = [
        {
          id: "ex-1",
          name: "Design coordination model",
          format: "IFC",
          formatVersion: "IFC 4",
          recipient: "Lead Appointed Party",
          levelOfDetail: "LOD 300",
          responsibleAuthor: "Discipline Lead",
        },
        {
          id: "ex-2",
          name: "Asset information",
          format: "COBie",
          formatVersion: "2.4",
          recipient: "Appointing Party",
          levelOfDetail: "Full asset data",
          responsibleAuthor: "Information Manager",
        },
      ];
      doc.lod.specification = "BIMForum LOD Specification 2021";
      doc.lod.loinFramework = "BS EN 17412-1 (Level of Information Need)";
      doc.lod.matrix = [
        { id: "lod-1", element: "Architecture", stage: "Design", level: "LOD 300", responsibleParty: "Architect" },
        { id: "lod-2", element: "Structure", stage: "Design", level: "LOD 300", responsibleParty: "Structural Engineer" },
        { id: "lod-3", element: "MEP", stage: "Design", level: "LOD 300", responsibleParty: "MEP Engineer" },
        { id: "lod-4", element: "Architecture", stage: "Construction", level: "LOD 400", responsibleParty: "Contractor" },
      ];
      doc.delivery.workStageReference = "RIBA Plan of Work 2020";
      doc.delivery.milestones = [
        {
          id: "ms-1",
          name: "Design Coordination Issue",
          date: "",
          deliverable: "Federated coordination model",
          recipient: "Lead Appointed Party",
          format: "IFC 4",
          responsibleAuthor: "BIM Coordinator",
          notes: "",
        },
        {
          id: "ms-2",
          name: "Practical Completion",
          date: "",
          deliverable: "As-built model + COBie data",
          recipient: "Appointing Party",
          format: "IFC + COBie",
          responsibleAuthor: "Information Manager",
          notes: "",
        },
      ];
      doc.security.standard = "ISO 19650-5";
      doc.collaboration.cdePlatform = "Common Data Environment (to be confirmed)";
      doc.qualityControl.validationProcedure = "Federated model checked against BEP requirements at each coordination gate.";
      return doc;
    },
  },
  {
    id: "natspec-iso19650",
    name: "NATSPEC / ISO 19650 skeleton",
    description: "A clean ISO 19650-2 aligned skeleton (pre-appointment & delivery), Australian NATSPEC style.",
    appliesTo: "both",
    build: (mode, projectName) => {
      const doc = emptyDocument(mode, projectName);
      doc.bimGoals.goals = ["Meet appointing party information requirements per ISO 19650-2."];
      doc.collaboration.cdePlatform = "CDE (to be confirmed)";
      doc.security.standard = "ISO 19650-5";
      doc.dataExchange.ifcVersion = "IFC 4";
      doc.delivery.workStageReference = "AS ISO 19650 / project work stages";
      doc.lod.specification = "BIMForum LOD / BS EN 17412-1";
      return doc;
    },
  },
  {
    id: "blank",
    name: "Blank BEP",
    description: "An empty, fully-structured BEP document.",
    appliesTo: "both",
    build: (mode, projectName) => emptyDocument(mode, projectName),
  },
];

export function getTemplate(id: string): TemplatePreset | undefined {
  return templates.find((t) => t.id === id);
}
