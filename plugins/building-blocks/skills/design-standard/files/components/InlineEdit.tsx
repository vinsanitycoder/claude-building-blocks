import "../components.css";
import * as React from "react";
import { CheckIcon, XIcon } from "./icons";

export interface InlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  /** Read-view renderer (defaults to the value, or a muted placeholder when empty). */
  renderValue?: (value: string) => React.ReactNode;
  /** Edit-view control. Receives the live draft + setter; defaults to a text input. */
  renderEdit?: (props: {
    value: string;
    onChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    autoFocus: boolean;
  }) => React.ReactNode;
  placeholder?: string;
  /** Confirm with Enter, cancel with Esc — and show explicit ✓/✗ buttons. */
  label?: string;
  disabled?: boolean;
}

/** Click-to-edit field: a read view that swaps to an inline editor on click/Enter. Enter saves, Esc
 *  cancels; ✓/✗ buttons give an explicit affordance. Backend-agnostic — onSave does the persistence. */
export function InlineEdit({
  value, onSave, renderValue, renderEdit, placeholder = "Empty", label = "Edit", disabled,
}: InlineEditProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  function start() { if (!disabled) { setDraft(value); setEditing(true); } }
  function cancel() { setEditing(false); setDraft(value); }
  async function save() {
    if (draft === value) { setEditing(false); return; }
    setBusy(true);
    try { await onSave(draft); setEditing(false); }
    finally { setBusy(false); }
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); void save(); }
    else if (e.key === "Escape") { e.preventDefault(); cancel(); }
  }

  if (!editing) {
    return (
      <button type="button" className="ds-inlineedit__read" onClick={start} disabled={disabled} aria-label={`${label}: ${value || placeholder}`}>
        {renderValue ? renderValue(value) : (value || <span className="ds-inlineedit__placeholder">{placeholder}</span>)}
      </button>
    );
  }

  return (
    <span className="ds-inlineedit__edit" data-busy={busy || undefined}>
      {renderEdit ? (
        renderEdit({ value: draft, onChange: setDraft, onKeyDown, autoFocus: true })
      ) : (
        <input
          className="ds-input ds-inlineedit__input"
          value={draft}
          autoFocus
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
      )}
      <button type="button" className="ds-inlineedit__btn ds-inlineedit__btn--save" onClick={() => void save()} disabled={busy} aria-label="Save">
        <CheckIcon />
      </button>
      <button type="button" className="ds-inlineedit__btn" onClick={cancel} disabled={busy} aria-label="Cancel">
        <XIcon />
      </button>
    </span>
  );
}
