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
