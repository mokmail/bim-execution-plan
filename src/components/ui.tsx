import React from "react";
import { getHelp } from "./help";

// Minimal, clean form primitives shared across section editors.

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  const help = getHelp(label);
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {help && <HelpIcon what={help.what} example={help.example} />}
      </span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

// Small ⓘ icon that opens a popup explaining the field.
function HelpIcon({ what, example }: { what: string; example: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span
      className="help-wrap"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen((o) => !o);
      }}
    >
      <span className="help-icon" role="button" tabIndex={0} title="Help">ⓘ</span>
      {open && (
        <span className="help-popup" onClick={(e) => e.stopPropagation()}>
          <span className="help-popup-what">{what}</span>
          <span className="help-popup-ex-label">Example</span>
          <span className="help-popup-ex">{example}</span>
        </span>
      )}
    </span>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className="input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="input textarea"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Text input that offers predefined suggestions via a datalist,
// while still allowing free-form entry.
let comboboxSeq = 0;
export function Combobox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const listId = `dl-${comboboxSeq++}`;
  return (
    <>
      <input
        type="text"
        className="input"
        list={listId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="btn btn-ghost btn-add" onClick={onClick}>
      + {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn btn-icon" title="Remove" onClick={onClick}>
      ✕
    </button>
  );
}

// ---------- Richer form components ----------

// Date input (native date picker).
export function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="date"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Numeric input with min/max/step.
export function NumberField({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className="input"
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? "" : Number(v));
      }}
    />
  );
}

// Tag input: type a value, press Enter/comma to add; click ✕ to remove.
export function TagInput({
  tags,
  onChange,
  placeholder,
  suggestions,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = React.useState("");
  const add = (raw: string) => {
    const v = raw.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setDraft("");
  };
  return (
    <div className="tag-input">
      <div className="tag-list">
        {tags.map((t) => (
          <span key={t} className="tag">
            {t}
            <button type="button" className="tag-x" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}>✕</button>
          </span>
        ))}
        <input
          className="input tag-draft"
          value={draft}
          list={suggestions ? `tag-dl-${tags.length}` : undefined}
          placeholder={placeholder || "type + Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && draft === "" && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
        />
        {suggestions && (
          <datalist id={`tag-dl-${tags.length}`}>
            {suggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
        )}
      </div>
    </div>
  );
}

// Multi-select: toggle chips on/off from a fixed option set.
export function MultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((x) => x !== opt) : [...value, opt]);
  };
  return (
    <div className="multiselect">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${value.includes(opt) ? "chip-on" : ""}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Priority selector: three-tone segmented control.
export function PriorityField({
  value,
  onChange,
}: {
  value: "high" | "medium" | "low";
  onChange: (v: "high" | "medium" | "low") => void;
}) {
  const opts: { v: "high" | "medium" | "low"; label: string }[] = [
    { v: "high", label: "High" },
    { v: "medium", label: "Medium" },
    { v: "low", label: "Low" },
  ];
  return (
    <div className="priority">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          className={`priority-btn priority-${o.v} ${value === o.v ? "active" : ""}`}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Searchable select: filter a large option list by typing.
export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="searchable">
      <input
        className="input"
        value={open ? query : value}
        placeholder={placeholder || "Search…"}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && (
        <div className="searchable-list">
          {filtered.length === 0 && <div className="searchable-empty">No matches</div>}
          {filtered.map((o) => (
            <button
              key={o}
              type="button"
              className={`searchable-item ${o === value ? "selected" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(o); setOpen(false); }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
