# Templates

Templates pre-fill a `BepDocument` so you don't start from a blank form. They live in
`src/lib/templates.ts`.

## Available templates

| id | Name | Description |
|---|---|---|
| `penn-state` | Penn State BIM Project Execution Planning | Prefills the 25 core BIM uses with roles, RACI scaffolding, and LOD matrix placeholders |
| `natspec-iso19650` | NATSPEC / ISO 19650 skeleton | A clean ISO 19650-2 aligned skeleton (pre-appointment & delivery), Australian NATSPEC style |
| `blank` | Blank BEP | An empty, fully-structured BEP document |

## Penn State template

The default template. It:
- Sets 3 realistic BIM goals
- Prefills all **25 Penn State BIM Uses** (from `PENN_STATE_BIM_USES` in `options.ts`)
  with phase, priority, and responsible-party placeholders
- Adds 4 standard roles (BIM Manager, BIM Coordinator, Information Manager, Discipline
  Lead) with scopes
- Builds a RACI matrix over 5 activities
- Sets IFC 4, two information exchanges, a LOD matrix, and two delivery milestones
- References ISO 19650-5 for security

## How templates work

Each template is a `TemplatePreset`:

```ts
interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  appliesTo: BepMode | "both";
  build: (mode: BepMode, projectName: string) => BepDocument;
}
```

`build` returns a fully-populated `BepDocument`. The wizard and dashboard call
`getTemplate(id).build(mode, name)` to create a new project.

## Adding a template

1. Add a `TemplatePreset` to the `templates` array in `src/lib/templates.ts`.
2. Implement `build` to pre-fill the relevant sections.
3. (Optional) Add it to the dashboard's template selector.

Next: [Predefined Options](options.md)
