// Field help registry — each entry explains what a field is and how to fill it,
// shown as a ⓘ popup. Keyed by the exact Field label used in the editors.

export interface FieldHelp {
  what: string; // what the field is for
  example: string; // how to fill it / example value
}

export const FIELD_HELP: Record<string, FieldHelp> = {
  // ---- Document control ----
  "Document number": {
    what: "Unique identifier for this plan so it can be referenced and filed.",
    example: "BEP-001 or A-2024-BEP-01",
  },
  Revision: {
    what: "Version of the plan. Increment whenever you commit a change.",
    example: "0.1, 1.0, 2.0",
  },
  Status: {
    what: "Where the plan is in its approval lifecycle.",
    example: "Draft → For review → Approved → Superseded",
  },
  Author: {
    what: "Who wrote/owns this version of the plan.",
    example: "Sara Jensen, BIM Manager",
  },
  Approver: {
    what: "The person who must sign off on this plan before it is used.",
    example: "Project Director",
  },
  Distribution: {
    what: "Who receives a copy — keeps everyone on the same version.",
    example: "All discipline leads; info manager",
  },
  "Canonical location (CDE link)": {
    what: "The single master copy location, so nobody works from an old copy.",
    example: "https://cde.project.com/01_Shared/BEP/",
  },

  // ---- Project information ----
  "Project number": {
    what: "Internal code for the project used in document management.",
    example: "P-2024-118",
  },
  "Project name": {
    what: "The human-readable name of the project.",
    example: "North Campus Extension",
  },
  "Owner / client": {
    what: "The client/asset owner who commissions the work.",
    example: "Vienna University of Technology",
  },
  Location: {
    what: "Where the project is built — address and/or coordinates.",
    example: "Vienna, Austria · 48.2082° N, 16.3738° E",
  },
  Sector: {
    what: "The type of construction / industry sector.",
    example: "Education, Healthcare, Infrastructure…",
  },
  "Delivery method": {
    what: "The procurement/contractual model that shapes who does what.",
    example: "Design-Bid-Build, Design-Build, IPD",
  },
  "Contract route": {
    what: "The specific contract type used between the parties.",
    example: "Lump Sum, Cost Plus, Target Cost",
  },
  "Start date": {
    what: "Planned start of the delivery phase.",
    example: "2026-03-01",
  },
  "End date": {
    what: "Planned completion / handover date.",
    example: "2028-09-30",
  },
  "Duration / key dates": {
    what: "Overall programme or notable dates that shape milestones.",
    example: "24 months; design freeze Jun 2027",
  },
  "Project description": {
    what: "Short narrative of what is being built so any reader gets context.",
    example: "New 5-storey teaching block with a 300-seat auditorium.",
  },

  // ---- BIM goals & uses ----
  "BIM Use name": {
    what: "A specific application of BIM, from the standard Penn State BIM Uses list.",
    example: "3D Coordination, 4D Scheduling, Energy Analysis",
  },
  Phase: {
    what: "When this BIM use happens in the project.",
    example: "Planning, Design, Construction, Operations",
  },
  Priority: {
    what: "How important this use is — drives where effort goes.",
    example: "High / Medium / Low",
  },
  "Responsible party": {
    what: "Who leads or delivers this BIM use.",
    example: "MEP Engineer, Contractor",
  },
  "Competence required": {
    what: "The skill level needed to deliver the use well.",
    example: "Advanced Revit + Navisworks",
  },
  "Gaps / deficiencies": {
    what: "Known shortfalls (software, skills, data) that must be addressed.",
    example: "No clash-detection licence yet",
  },

  // ---- Roles & RACI ----
  Role: {
    what: "The role on the project (organisational, not a person's title).",
    example: "BIM Manager, BIM Coordinator, Information Manager",
  },
  Person: {
    what: "The named individual filling the role.",
    example: "Sara Jensen",
  },
  Organization: {
    what: "The company/team the person belongs to.",
    example: "Acme Engineering",
  },
  Email: {
    what: "Contact for coordination and the CDE account.",
    example: "s.jensen@acme.com",
  },
  "Dedicated role": {
    what: "Whether the role is a full-time post vs combined with another.",
    example: "Keep BIM Coordinator separate from Engineering Project Coordinator.",
  },
  "Scope of responsibility": {
    what: "What this role owns — models, checks, approvals.",
    example: "Runs clash detection, validates models to LOD 300.",
  },

  // ---- Collaboration ----
  "CDE platform": {
    what: "The Common Data Environment where all shared information lives.",
    example: "Autodesk ACC/BIM 360, Trimble Connect, Procore",
  },
  "Naming convention": {
    what: "The file/object naming rule everyone must follow.",
    example: "P-118_ARC_ZZ-ZZ-M3-DR-A-0001",
  },
  "Workflow states": {
    what: "The approval statuses information passes through in the CDE.",
    example: "Work in Progress → Shared → Published → Archived",
  },
  "File/folder structure": {
    what: "How the CDE folders are organised.",
    example: "01_WIP / 02_Shared / 03_Published / 04_Archived",
  },
  "Transition authority": {
    what: "Who may move information between workflow states.",
    example: "Information Manager approves Shared→Published",
  },
  "Meeting cadence": {
    what: "How often coordination and BIM meetings happen.",
    example: "Weekly coordination; monthly BIM workshop",
  },
  "Communication channels": {
    what: "Where the team communicates for day-to-day coordination.",
    example: "Teams channel + BCF issues",
  },
  "Escalation procedure": {
    what: "How issues get raised when the team cannot resolve them.",
    example: "Coordinator → BIM Manager → Project Director",
  },

  // ---- Data exchange ----
  "IFC version": {
    what: "The open exchange schema version used for model handover.",
    example: "IFC 2x3, IFC 4, IFC 4.3",
  },
  "Model View Definition (MVD)": {
    what: "Which IFC view/subset is required for each exchange.",
    example: "Reference View, Design Transfer View",
  },
  Format: {
    what: "The data format for this information exchange.",
    example: "IFC, COBie, BCF, IDS, native (RVT)",
  },
  Version: {
    what: "Version of the format/software for that exchange.",
    example: "IFC 4, COBie 2.4, Revit 2024",
  },
  Recipient: {
    what: "Who receives this information.",
    example: "Lead Appointed Party, Client",
  },
  "Level of detail": {
    what: "How much geometric/information development is expected (LOD).",
    example: "LOD 300 (detailed design)",
  },
  "Responsible author": {
    what: "Who produces and issues this deliverable.",
    example: "BIM Coordinator, Structural Engineer",
  },

  // ---- Software ----
  Discipline: {
    what: "The design discipline that uses the software.",
    example: "Architecture, Structure, MEP, Civil",
  },
  Software: {
    what: "The application used for the purpose.",
    example: "Revit, Navisworks, Solibri, Tekla",
  },
  "Hardware requirements": {
    what: "Workstation/server/network needed to run the tools smoothly.",
    example: "64GB RAM workstation for federated model",
  },

  // ---- Standards & conventions ----
  "Applicable standards": {
    what: "The standards and protocols the project must comply with.",
    example: "ISO 19650-1/-2, NBIMS-US V4, CIC BIM Protocol",
  },
  "Classification system": {
    what: "The coding scheme used to classify objects/elements.",
    example: "Uniclass 2015, OmniClass, Uniformat II",
  },
  Units: {
    what: "The units of measurement used in the models.",
    example: "Millimetres (mm), metres (m)",
  },
  "Coordinates / geolocation": {
    what: "The coordinate system and geolocation convention.",
    example: "ETRS89 / UTM zone 33N",
  },
  "Naming conventions": {
    what: "File/model/object naming rules.",
    example: "Project_Discipline_Zone-Level-Type_Number",
  },
  "Property sets / data templates": {
    what: "Standardised property groups applied to model elements.",
    example: "COBie asset data, fire ratings, warranty info",
  },

  // ---- LOD / LOIN ----
  "LOD specification": {
    what: "Which LOD framework defines the levels.",
    example: "BIMForum LOD Specification 2021",
  },
  "LOIN framework": {
    what: "The Level of Information Need framework (graphical + non-graphical).",
    example: "BS EN 17412-1 (Level of Information Need)",
  },
  "Element / system": {
    what: "The building element or system being specified.",
    example: "Architecture, Structure, MEP, Walls, Glazing",
  },
  Stage: {
    what: "The project stage at which this level applies.",
    example: "Design, Construction, As-built",
  },
  Responsible: {
    what: "Who is responsible for delivering that level.",
    example: "Architect, Structural Engineer",
  },

  // ---- Model management ----
  "Model breakdown structure": {
    what: "How models are split by discipline/zone for federation.",
    example: "ARC, STR, MEP federated into one coordination model",
  },
  "Clash tolerance": {
    what: "The gap below which a clash is reported.",
    example: "25mm for MEP vs structural",
  },
  "Federation strategy": {
    what: "How discipline models are combined for coordination.",
    example: "Navisworks federated each Friday",
  },
  "Coordination cadence": {
    what: "How often models are federated and reviewed.",
    example: "Weekly federated model review",
  },
  "Model ownership / version control": {
    what: "Who owns each model and how versions are controlled.",
    example: "Each discipline owns its model; versions in CDE",
  },
  "BCF issue workflow": {
    what: "How coordination issues are raised, tracked and closed.",
    example: "BCF topics: Open → In Progress → Closed",
  },

  // ---- Quality control ----
  "Model validation / checking procedure": {
    what: "How models are checked against BEP requirements.",
    example: "Federated model validated at each coordination gate",
  },
  "Quality control checklists": {
    what: "The checks applied to models/deliverables.",
    example: "Naming, LOD, property sets, clash-free",
  },
  "QC responsibility": {
    what: "Who performs the quality checks.",
    example: "BIM Coordinator",
  },
  "Audit / review frequency": {
    what: "How often QC audits happen.",
    example: "Monthly + at every milestone",
  },
  "Non-conformance / issue resolution": {
    what: "How failures to meet requirements are handled.",
    example: "Log NC → assign owner → track to close",
  },
  Reporting: {
    what: "What QC reports are produced and who sees them.",
    example: "Clash report + QC report to project team",
  },

  // ---- Delivery ----
  "Work stage reference (e.g. RIBA Plan of Work)": {
    what: "The stage framework the milestones align to.",
    example: "RIBA Plan of Work 2020, AIA phases",
  },
  Milestone: {
    what: "A named delivery point.",
    example: "Design Coordination Issue, Practical Completion",
  },
  Date: {
    what: "When the milestone occurs.",
    example: "2027-06-15",
  },
  Deliverable: {
    what: "What is delivered at this milestone.",
    example: "Federated coordination model, COBie data",
  },

  // ---- Security ----
  "Security standard": {
    what: "The security framework applied to project information.",
    example: "ISO 19650-5:2020",
  },
  "Security classification": {
    what: "The sensitivity level of the project information.",
    example: "Official, Official-Sensitive, Secret",
  },
  "Access control & permissions": {
    what: "Who can view/edit what in the CDE.",
    example: "BIM Manager admin; discipline leads edit their model",
  },
  "Data protection / confidentiality": {
    what: "Rules for handling sensitive client/asset data.",
    example: "GDPR-compliant; no data leaves the CDE",
  },
  "Secure storage & transmission": {
    what: "How information is stored and sent securely.",
    example: "Encrypted at rest; no email of drawings",
  },
  "Security responsibilities & incident response": {
    what: "Who owns security and what happens on a breach.",
    example: "Information Manager reports to appointing party",
  },

  // ---- Training ----
  "Training needs assessment": {
    what: "What skills each role needs vs what they have.",
    example: "Team lacks Revit MEP → plan a course",
  },
  "Competence requirements": {
    what: "The skill level each role must reach.",
    example: "BIM Coordinator: certified Navisworks",
  },
  "Training plan & schedule": {
    what: "When and how training happens.",
    example: "Q1: Revit Level 2; Q2: clash detection",
  },
  "Onboarding for new members": {
    what: "How new team members get up to speed.",
    example: "BEP induction + CDE walkthrough",
  },
  "Knowledge transfer / lessons learned": {
    what: "How project learnings are captured and shared.",
    example: "Post-project workshop → lessons register",
  },
};

export function getHelp(label: string): FieldHelp | undefined {
  return FIELD_HELP[label];
}
