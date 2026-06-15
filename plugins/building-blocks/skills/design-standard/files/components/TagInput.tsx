import "../components.css";
import * as React from "react";
import { XIcon } from "./icons";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  /** Keys that commit the current text as a tag. Defaults to Enter + comma. */
  delimiters?: string[];
  /** Reject duplicates (case-insensitive). Default true. */
  dedupe?: boolean;
  max?: number;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  "aria-label"?: string;
}

/** Token / tag entry — type + Enter (or comma) to add a chip; Backspace on empty removes the last.
 *  Chips have a remove button. Controlled via value/onChange (string[]). */
export function TagInput({
  value, onChange, placeholder = "Add…", delimiters = ["Enter", ","], dedupe = true, max, disabled, error, id, ...aria
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (max && value.length >= max) return;
    if (dedupe && value.some((v) => v.toLowerCase() === t.toLowerCase())) { setDraft(""); return; }
    onChange([...value, t]);
    setDraft("");
  }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)); }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (delimiters.includes(e.key)) { e.preventDefault(); add(draft); return; }
    if (e.key === "Backspace" && !draft && value.length) { e.preventDefault(); remove(value.length - 1); }
  }

  return (
    <div
      className={["ds-taginput", error ? "ds-taginput--error" : "", disabled ? "ds-taginput--disabled" : ""].filter(Boolean).join(" ")}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="ds-tag">
          <span className="ds-tag__label">{tag}</span>
          {!disabled && (
            <button type="button" className="ds-tag__remove" aria-label={`Remove ${tag}`} onClick={(e) => { e.stopPropagation(); remove(i); }}>
              <XIcon />
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        className="ds-taginput__field"
        value={draft}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : ""}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        autoComplete="off"
        {...aria}
      />
    </div>
  );
}
