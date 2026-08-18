// Predefined option lists for BEP fields, based on the research knowledge base
// (ISO 19650, NBIMS-US, BIMForum, buildingSMART, Penn State BIM uses).

export const DELIVERY_METHODS = [
  "Design-Bid-Build (DBB)",
  "Design-Build (DB)",
  "Integrated Project Delivery (IPD)",
  "Construction Manager (CM)",
  "Construction Manager at Risk (CMAR)",
  "Engineering, Procurement & Construction (EPC)",
  "Public-Private Partnership (PPP)",
];

export const PROJECT_SECTORS = [
  "Residential",
  "Commercial / Office",
  "Healthcare",
  "Education",
  "Industrial / Manufacturing",
  "Infrastructure / Civil",
  "Transportation",
  "Energy / Utilities",
  "Hospitality",
  "Retail",
  "Civic / Public",
  "Data Centre",
];

export const DELIVERY_METHOD_SHORT = [
  "DBB",
  "DB",
  "IPD",
  "CM",
  "CMAR",
  "EPC",
  "PPP",
];

export const CONTRACT_ROUTES = [
  "Lump Sum",
  "Cost Plus / Cost Reimbursable",
  "Design-Build Contract",
  "Traditional (Design-Bid-Build) Contract",
  "Management Contracting",
  "Target Cost",
  "Framework Agreement",
];

export const CLASSIFICATION_SYSTEMS = [
  "Uniclass 2015 (UK)",
  "OmniClass (US)",
  "Uniformat II",
  "MasterFormat",
  "UniFormat",
  "NRM / CESMM (UK)",
  "CoClass (Sweden)",
  "Cuneco (Denmark)",
  "Other",
];

export const LOD_SPECIFICATIONS = [
  "BIMForum LOD Specification 2021",
  "BIMForum LOD Specification 2020",
  "NBS LOD 2-5",
  "Level of Information Need (BS EN 17412-1)",
  "AIA E202 LOD 100-500",
  "Custom",
];

export const LOIN_LEVELS = [
  "Minimal",
  "Standard",
  "Detailed",
  "Complete",
  "Not required",
];

export const IFC_VERSIONS = ["IFC 2x3", "IFC 4", "IFC 4.3", "IFC 4.3.2 (IFC Reference View)"];
export const MVD_OPTIONS = [
  "Reference View",
  "Design Transfer View",
  "Coordination View 2.0",
  "Quantity Takeoff",
  "Structural Analysis View",
  "Custom",
];

export const EXCHANGE_FORMATS = [
  "IFC",
  "COBie",
  "BCF",
  "IDS",
  "Native (RVT)",
  "Native (DWG)",
  "Native (DGN)",
  "IFC XML",
  "CSV / XLSX",
  "PDF",
  "Other",
];

export const EXCHANGE_LOD = [
  "Concept (LOD 100)",
  "Schematic (LOD 200)",
  "Detailed design (LOD 300)",
  "Construction (LOD 350)",
  "Fabrication/Installation (LOD 400)",
  "As-built (LOD 500)",
];

export const SOFTWARE_DISCIPLINES = [
  "Architecture",
  "Structure",
  "Mechanical",
  "Electrical",
  "Plumbing",
  "MEP (combined)",
  "Civil",
  "Landscape",
  "Interior",
  "Fire Protection",
  "Coordination",
  "Quantity / Cost",
  "Facility Management",
];

export const AUTHORING_SOFTWARE = [
  "Autodesk Revit",
  "Autodesk AutoCAD",
  "Autodesk Civil 3D",
  "Graphisoft Archicad",
  "Bentley OpenBuildings",
  "Bentley MicroStation",
  "Trimble SketchUp",
  "Vectorworks",
  "Tekla Structures",
  "Allplan",
  "Dassault CATIA",
  "Rhino / Grasshopper",
];

export const COORDINATION_SOFTWARE = [
  "Autodesk Navisworks",
  "Solibri Office",
  "BIMcollab",
  "Trimble Connect",
  "Desite",
  "Bentley iTwin / Synchro",
  "Dalux",
  "Revizto",
];

export const CDE_PLATFORMS = [
  "Autodesk Construction Cloud / BIM 360",
  "Trimble Connect",
  "Procore",
  "Dalux Box",
  "Asite",
  "Aconex",
  "Think Project",
  "Bentley ProjectWise",
  "Microsoft SharePoint / Teams",
  "Common Data Environment (other)",
];

export const SECURITY_STANDARDS = [
  "ISO 19650-5:2020",
  "PAS 1192-5",
  "UK NCSC / CE marking for sensitive data",
  "GDPR-compliant data handling",
  "ISO 27001",
  "Other",
];

export const SECURITY_CLASSIFICATIONS = [
  "Unclassified",
  "Official",
  "Official-Sensitive",
  "Secret",
  "Commercial-in-Confidence",
  "Restricted",
];

export const STANDARDS_OPTIONS = [
  "ISO 19650-1:2018 (Concepts & principles)",
  "ISO 19650-2:2018 (Delivery phase)",
  "ISO 19650-3:2020 (Operational phase)",
  "ISO 19650-4:2022 (Information exchange)",
  "ISO 19650-5:2020 (Security)",
  "ISO 19650-6:2025 (Health & safety)",
  "PAS 1192-2:2013 (legacy)",
  "BS EN 17412-1 (Level of Information Need)",
  "NBIMS-US V4",
  "AIA E203 / G202",
  "CIC BIM Protocol",
  "Other",
];

export const WORK_STAGE_REFERENCES = [
  "RIBA Plan of Work 2020",
  "AIA Project Delivery Phases",
  "ISO 19650-2 information delivery",
  "NATSPEC / AS ISO 19650 work stages",
  "Custom",
];

export const PHASES = ["Planning", "Design", "Construction", "Operations", "Handover"];

export const UNITS = [
  "Millimetres (mm)",
  "Metres (m)",
  "Feet/inches (imperial)",
  "Centimetres (cm)",
  "Mixed (mm / m)",
];

export const COORDINATE_SYSTEMS = [
  "Local project origin",
  "Project North aligned",
  "Shared coordinate system (ETRS89 / UTM)",
  "WGS84 geographic",
  "UK National Grid (OSGB36)",
  "US State Plane",
];
