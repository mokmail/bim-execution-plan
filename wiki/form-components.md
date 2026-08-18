# Form Components

The app's forms are built from a set of reusable UI primitives in `src/components/ui.tsx`.
Each `Field` shows a ⓘ help icon when a help entry exists in `src/components/help.ts`.

## Core primitives

| Component | Purpose |
|---|---|
| `Field` | Label + children + optional hint; auto-shows ⓘ help |
| `TextField` | Single-line text input |
| `TextArea` | Multi-line text input |
| `Select` | Dropdown from a fixed option set |
| `Checkbox` | Boolean toggle |
| `Combobox` | Text input with `<datalist>` suggestions (free-form) |
| `AddButton` / `RemoveButton` | Add/remove list items |

## Richer form components

### `DateField`
Native date picker. Used for project start/end dates and milestone dates.

### `NumberField`
Numeric input with min/max/step. Value is `number | ""`.

### `TagInput`
Type a value and press **Enter** or **,** to add it as a tag; click ✕ to remove;
**Backspace** on an empty input removes the last tag. Supports optional suggestions via a
`<datalist>`. Used for BIM goals and RACI activities.

### `MultiSelect`
Toggle chips on/off from a fixed option set. Used for applicable standards.

### `PriorityField`
A three-tone segmented control (High/Medium/Low) with color-coded active state. Used for
BIM use priority.

### `SearchableSelect`
A text input that filters a large option list as you type, with a dropdown of matches.
Used for software discipline/name (large option sets).

## Where they're used

| Section | Components |
|---|---|
| Project Information | `DateField` (start/end), `Combobox` (sector, delivery, contract) |
| BIM Goals & Uses | `TagInput` (goals), `PriorityField` (priority), `Combobox` (use name, party) |
| Roles & RACI | `Combobox` (role, org), `TagInput` (RACI activities) |
| Collaboration | `Combobox` (CDE, naming, workflow, cadence, channels, escalation) |
| Data Exchange | `Combobox` (IFC, MVD, format, LOD), `SearchableSelect` |
| Software | `SearchableSelect` (discipline, software) |
| Standards | `MultiSelect` (standards), `Combobox` (classification, units, coords) |
| LOD | `Combobox` (spec, element, stage, level, responsible) |
| Model Management | `Combobox` (breakdown, tolerance, federation, cadence, ownership, BCF) |
| Quality Control | `Combobox` (validation, checklists, QC role, audit, NC, reporting) |
| Delivery | `DateField` (milestone date), `Combobox` (milestone, deliverable, format) |
| Security | `Combobox` (standard, classification, access, protection, storage, responsibilities) |
| Training | `Combobox` (needs, competencies, plan, onboarding, lessons) |

## Adding a new field

1. Add the field to the `BepDocument` type in `src/types/bep.ts`.
2. Add a help entry in `src/components/help.ts` (keyed by the exact Field label).
3. Add a predefined option list in `src/lib/options.ts` if it has standard values.
4. Render it in the relevant section editor in `src/components/editors.tsx`.

Next: [Docker & Deployment](docker.md)
