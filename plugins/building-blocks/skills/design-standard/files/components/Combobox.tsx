import "../components.css";
import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "./icons";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Searchable single-select (type-ahead). Like Select, but the open panel has a filter input + keyboard
 *  nav. Anchored under the trigger; Esc / outside-click closes. */
export function Combobox({
  value, defaultValue, onValueChange, options, placeholder = "Select…",
  searchPlaceholder = "Search…", emptyText = "No results.", error, disabled, id, ...aria
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? options.filter((o) => o.label.toLowerCase().includes(s)) : options;
  }, [options, q]);

  React.useEffect(() => { setActive(0); }, [q, open]);
  React.useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 0);
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function choose(v: string) {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
    setOpen(false);
    setQ("");
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); return; }
    if (e.key === "Enter") { e.preventDefault(); const o = filtered[active]; if (o) choose(o.value); }
  }

  return (
    <div className="ds-dd" ref={ref} style={{ display: "block" }}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={["ds-select-trigger", error ? "ds-select-trigger--error" : ""].filter(Boolean).join(" ")}
        onClick={() => setOpen((o) => !o)}
        {...aria}
      >
        <span className={selected ? "" : "ds-select-trigger__placeholder"}>{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon className="ds-select-trigger__chevron" />
      </button>
      {open && (
        <div className="ds-dd__panel" role="listbox" style={{ padding: 0 }}>
          <input
            ref={inputRef}
            className="ds-combobox__search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            autoComplete="off"
          />
          <div className="ds-combobox__list">
            {filtered.length === 0 ? (
              <div className="ds-combobox__empty">{emptyText}</div>
            ) : (
              filtered.map((o, i) => (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={o.value === current}
                  className={["ds-dd__item", i === active ? "ds-dd__item--active" : ""].filter(Boolean).join(" ")}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o.value)}
                >
                  <span style={{ flex: 1 }}>{o.label}</span>
                  {o.value === current && <CheckIcon />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
