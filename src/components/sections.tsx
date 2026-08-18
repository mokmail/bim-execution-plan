import type { ComponentType } from "react";
import {
  DocumentControlEditor,
  ProjectInformationEditor,
  BimGoalsEditor,
  RolesEditor,
  CollaborationEditor,
  DataExchangeEditor,
  SoftwareEditor,
  StandardsEditor,
  LodEditor,
  ModelManagementEditor,
  QualityControlEditor,
  DeliveryEditor,
  SecurityEditor,
  TrainingEditor,
} from "./editors";
import type { BepDocument } from "../types/bep";

type SetDoc = (updater: (d: BepDocument) => BepDocument) => void;

export interface SectionDef {
  id: string;
  num: string;
  title: string;
  short: string;
  Component: ComponentType<{ doc: BepDocument; setDoc: SetDoc }>;
}

export const sections: SectionDef[] = [
  { id: "documentControl", num: "1", title: "Document Control & Versioning", short: "Document control", Component: DocumentControlEditor },
  { id: "projectInformation", num: "2", title: "Project Information", short: "Project info", Component: ProjectInformationEditor },
  { id: "bimGoals", num: "3", title: "BIM Goals & BIM Uses", short: "Goals & uses", Component: BimGoalsEditor },
  { id: "responsibilities", num: "4", title: "Roles & Responsibilities", short: "Roles & RACI", Component: RolesEditor },
  { id: "collaboration", num: "5", title: "Collaboration Procedures", short: "Collaboration", Component: CollaborationEditor },
  { id: "dataExchange", num: "6", title: "Data Exchange Formats", short: "Data exchange", Component: DataExchangeEditor },
  { id: "software", num: "7", title: "Software & Hardware", short: "Software", Component: SoftwareEditor },
  { id: "standards", num: "8", title: "Standards & Conventions", short: "Standards", Component: StandardsEditor },
  { id: "lod", num: "9", title: "Level of Development / Information Need", short: "LOD / LOIN", Component: LodEditor },
  { id: "modelManagement", num: "10", title: "Model Management & Coordination", short: "Model mgmt", Component: ModelManagementEditor },
  { id: "qualityControl", num: "11", title: "Quality Control", short: "Quality control", Component: QualityControlEditor },
  { id: "delivery", num: "12", title: "Delivery Milestones & Information Exchanges", short: "Delivery", Component: DeliveryEditor },
  { id: "security", num: "13", title: "Security", short: "Security", Component: SecurityEditor },
  { id: "training", num: "14", title: "Training", short: "Training", Component: TrainingEditor },
];

// Which section a given document key belongs to (for "jump to incomplete" hints).
export function sectionForField(key: string): string | undefined {
  const map: Record<string, string> = {
    projectName: "projectInformation",
    "bimGoals.goals": "bimGoals",
    "bimGoals.uses": "bimGoals",
    "responsibilities.roles": "responsibilities",
    "dataExchange.exchanges": "dataExchange",
    "delivery.milestones": "delivery",
    "lod.matrix": "lod",
    "collaboration.cdePlatform": "collaboration",
    "security.standard": "security",
  };
  return map[key];
}
