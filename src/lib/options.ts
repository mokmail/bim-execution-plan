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

// ---- Additional predefined values for fields across all 14 sections ----

export const PENN_STATE_BIM_USES = [
  "Existing Conditions Modeling",
  "Record Modeling",
  "Site Analysis",
  "Design Authoring",
  "Design Reviews",
  "Structural Analysis",
  "Lighting Analysis",
  "Energy Analysis",
  "Mechanical Analysis",
  "Other Engineering Analysis",
  "Sustainability (LEED) Evaluation",
  "Code Validation",
  "3D Coordination",
  "Programming",
  "Space Program Validation",
  "Phase Planning (4D Modeling)",
  "Cost Estimation (5D Modeling)",
  "Site Utilization Planning",
  "Construction System Design",
  "Digital Fabrication",
  "3D Control and Planning",
  "Building Maintenance Scheduling",
  "Building System Analysis",
  "Asset Management",
  "Space Management and Tracking",
];

export const BIM_ROLES = [
  "BIM Manager",
  "BIM Coordinator",
  "Information Manager",
  "Discipline Lead (Architecture)",
  "Discipline Lead (Structure)",
  "Discipline Lead (MEP)",
  "Model Manager",
  "Task Team Member",
  "Project Manager",
  "Appointing Party Representative",
  "Lead Appointed Party",
];

export const PARTIES = [
  "Appointing Party (Client)",
  "Lead Appointed Party",
  "Architect",
  "Structural Engineer",
  "MEP Engineer",
  "Civil Engineer",
  "Main Contractor",
  "Specialist Subcontractor",
  "Facility Manager",
  "Information Manager",
];

export const BIM_USE_PHASES = ["Planning", "Design", "Construction", "Operations", "Handover"];

export const COMPETENCE_LEVELS = [
  "Basic",
  "Intermediate",
  "Advanced",
  "Expert",
  "Not required",
];

export const WORKFLOW_STATES = [
  "Work in Progress → Shared → Published → Archived",
  "S0 (WIP) → S1 (Shared) → S2 (Published) → S3 (Archived)",
  "In progress → For review → Approved",
  "Draft → Reviewed → Issued",
];

export const MEETING_CADENCES = [
  "Weekly coordination meeting",
  "Bi-weekly coordination meeting",
  "Monthly BIM workshop",
  "Weekly BIM + coordination meeting",
  "Monthly + milestone reviews",
  "Ad hoc / on-demand",
];

export const COMMUNICATION_CHANNELS = [
  "Microsoft Teams channel",
  "Slack channel",
  "Email + shared CDE notifications",
  "Weekly status calls",
  "BCF issue tracker + email",
  "In-person BIM workshops",
];

export const ESCALATION_PROCEDURES = [
  "Coordinator → BIM Manager → Project Director",
  "Task team → Discipline Lead → BIM Manager",
  "Issue logged in BCF → assignee → escalation after 48h",
  "Designated single escalation point",
];

export const TRANSITION_AUTHORITIES = [
  "Information Manager approves Shared→Published",
  "BIM Manager controls all status transitions",
  "Discipline lead approves own model publication",
  "Appointing Party approves published issue",
];

export const CLASH_TOLERANCES = [
  "10 mm",
  "15 mm",
  "20 mm",
  "25 mm (MEP vs structural)",
  "30 mm",
  "50 mm",
  "Per discipline pair (specified in BEP)",
];

export const MODEL_BREAKDOWNS = [
  "By discipline (ARC / STR / MEP)",
  "By zone / package",
  "By discipline + zone (federated)",
  "Single federated model",
  "Per work package / trade",
];

export const FEDERATION_STRATEGIES = [
  "Navisworks federated model (weekly)",
  "Solibri federation (per milestone)",
  "CDE-native federated model",
  "IFC-based federation",
];

export const MODEL_OWNERSHIP = [
  "Each discipline owns its model; versions in CDE",
  "Central model owned by lead appointed party",
  "Model owner per work package",
  "Appointing Party owns as-built model",
];

export const QC_VALIDATION_PROCEDURES = [
  "Federated model checked against BEP requirements at each coordination gate",
  "Automated model checking (Solibri / Navisworks) + manual review",
  "IFC/IDS validation of information requirements",
  "Peer review by discipline leads + BIM Coordinator sign-off",
];

export const QC_CHECKLISTS = [
  "Naming, LOD, property sets, clash-free",
  "Naming convention + LOD + COBie data completeness",
  "BEP section 8/9 compliance + clash report",
  "Geometry, attributes, classification per standards",
];

export const QC_RESPONSIBILITIES = [
  "BIM Coordinator",
  "BIM Manager",
  "Discipline Lead (self-check)",
  "Independent QC team",
  "Information Manager",
];

export const AUDIT_FREQUENCIES = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "At every milestone",
  "Monthly + at every milestone",
  "Quarterly",
];

export const QC_REPORTING = [
  "Clash report + QC report to project team",
  "Automated dashboard in CDE",
  "Monthly compliance summary to appointing party",
  "Issue log + closure report",
];

export const NON_CONFORMANCE_PROCESSES = [
  "Log NC → assign owner → track to close",
  "NC raised in BCF → review at coordination meeting",
  "Automated flag → responsible party → re-check",
];

export const EXCHANGE_NAMES = [
  "Design coordination model",
  "Structural analysis model",
  "MEP coordination model",
  "Quantity takeoff / cost model",
  "Clash detection model",
  "Asset information (COBie)",
  "As-built model",
  "Facility / O&M data",
  "Energy / sustainability analysis",
  "4D programme model",
  "5D cost model",
  "Record model",
];

export const DELIVERABLE_NAMES = [
  "Federated coordination model",
  "As-built model + COBie data",
  "Design development model",
  "Clash detection report",
  "Asset information (COBie) drop",
  "Energy analysis report",
  "Cost estimate / takeoff",
  "Facility handover package",
  "Record / as-constructed model",
];

export const MILESTONE_NAMES = [
  "Concept Design Issue",
  "Developed Design Issue",
  "Technical Design Issue",
  "Design Coordination Issue",
  "Construction Information Issue",
  "Practical Completion",
  "Soft Landings / Handover",
  "Post-occupancy Review",
];

export const LOD_ELEMENTS = [
  "Architecture",
  "Structure",
  "MEP",
  "Walls",
  "Roof",
  "Floor / Slab",
  "Glazing / Facade",
  "Doors & Windows",
  "Services (HVAC)",
  "Electrical",
  "Plumbing / Drainage",
  "Fire Protection",
  "Site / Landscape",
];

export const LOD_STAGES = [
  "Concept",
  "Design development",
  "Technical design",
  "Construction",
  "As-built",
  "Operations",
];

export const LOD_LEVELS = [
  "LOD 100 (Concept)",
  "LOD 200 (Schematic)",
  "LOD 300 (Detailed design)",
  "LOD 350 (Construction)",
  "LOD 400 (Fabrication)",
  "LOD 500 (As-built)",
  "LOIN Minimal",
  "LOIN Standard",
  "LOIN Detailed",
  "LOIN Complete",
];

export const RESPONSIBLE_ROLES = [
  "BIM Coordinator",
  "BIM Manager",
  "Architect",
  "Structural Engineer",
  "MEP Engineer",
  "Contractor",
  "Information Manager",
];

export const SECURITY_ACCESS_CONTROL = [
  "BIM Manager admin; discipline leads edit their own model",
  "Role-based access: Viewer / Editor / Manager per CDE",
  "2FA required for all users",
  "Appointing Party approves external sharing",
];

export const DATA_PROTECTION = [
  "GDPR-compliant; no data leaves the CDE",
  "Personal data minimised; anonymise where possible",
  "Client data confidential; NDA covers all parties",
];

export const SECURE_STORAGE = [
  "Encrypted at rest and in transit; no email of drawings",
  "All exchange via CDE; no removable media",
  "Backups daily; DR tested quarterly",
];

export const SECURITY_RESPONSIBILITIES = [
  "Information Manager reports to appointing party",
  "BIM Manager owns access review",
  "Named Security Officer per project",
  "Incident → 24h report to appointing party",
];

export const TRAINING_NEEDS = [
  "Team lacks Revit MEP → plan a course",
  "No clash-detection competency → Navisworks training",
  "COBie / asset data training required",
  "ISO 19650 process training for new team",
  "Assessment per role to be completed",
];

export const COMPETENCE_REQUIREMENTS = [
  "BIM Coordinator: certified Navisworks / Solibri",
  "BIM Manager: ISO 19650 practitioner",
  "Discipline leads: proficient in authoring tool + IFC",
  "Information Manager: CDE administration",
];

export const TRAINING_PLANS = [
  "Q1: Revit Level 2; Q2: clash detection",
  "Onboarding week + monthly BIM training",
  "Tailored per role from needs assessment",
  "External courses + in-house workshops",
];

export const ONBOARDING = [
  "BEP induction + CDE walkthrough",
  "Buddy system for first 2 weeks",
  "Standard onboarding pack + tools setup",
  "Review BEP + roles on day one",
];

export const LESSONS_LEARNED = [
  "Post-project workshop → lessons register",
  "Capture at each milestone review",
  "Shared lessons repository across projects",
  "Retrospective + action items tracked",
];

export const NAMING_CONVENTIONS = [
  "Project_Discipline_Zone-Level-Type_Number",
  "P-118_ARC_ZZ-ZZ-M3-DR-A-0001",
  "BS 1192 / ISO 19650 naming (Originator_Zone_Type_...)",
  "PBS Standard / NRM naming",
];

export const WORKFLOW_ROLE_OPTIONS = [
  "BIM Manager",
  "BIM Coordinator",
  "Information Manager",
  "Discipline Lead",
];

export const PROPERTY_SETS = [
  "COBie asset data, fire ratings, warranty info",
  "Standard Pset_* property sets",
  "Project-specific property templates",
  "IFC property sets (Pset_WallCommon, etc.)",
  "Uniclass/OmniClass classification codes",
  "COBie + FM data templates",
];
