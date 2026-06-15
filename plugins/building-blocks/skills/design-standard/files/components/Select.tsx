import "../components.css";
import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  /** Align the panel's right edge to the trigger instead of the left. */
  align?: "start" | "end";
}

/** Custom select. The panel anchors directly under the trigger (top:100%) and slides down — never
 *  the native macOS popup that floats centred over the field. Controlled (value) or uncontrolled
 *  (defaultValue). Keyboard: open with Enter/Space/↓, move with ↑/↓, Esc closes. */
export function Select({
  value, defaultValue, onValueChange, options, placeholder = "Select…",
  error, disabled, id, align = "start", ...aria
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    const sel = panelRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    const first = panelRef.current?.querySelector<HTMLButtonElement>("[role=option]:not(:disabled)");
    (sel ?? first)?.focus();
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function choose(v: string) {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
    setOpen(false);
  }
  function focusTrigger() {
    (wrapRef.current?.querySelector("button.ds-select-trigger") as HTMLButtonElement | null)?.focus();
  }
  function onTriggerKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); }
  }
  function onPanelKey(e: React.KeyboardEvent) {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]:not(:disabled)") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[Math.max(i - 1, 0)]?.focus(); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); focusTrigger(); }
  }

  return (
    <span className="ds-dd" ref={wrapRef} style={{ display: "block" }}>
      <button
        type="button" id={id} disabled={disabled}
        className={["ds-select-trigger", error ? "ds-select-trigger--error" : ""].filter(Boolean).join(" ")}
        aria-haspopup="listbox" aria-expanded={open} aria-invalid={error || undefined}
        onClick={() => setOpen((o) => !o)} onKeyDown={onTriggerKey} {...aria}
      >
        <span className={selected ? undefined : "ds-select-trigger__placeholder"}>{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon className="ds-select-trigger__chevron" style={{ width: 16, height: 16 }} />
      </button>
      {open && (
        <div
          ref={panelRef} role="listbox"
          className={["ds-dd__panel", align === "end" ? "ds-dd__panel--end" : ""].filter(Boolean).join(" ")}
          style={{ maxHeight: 240, overflowY: "auto" }} onKeyDown={onPanelKey}
        >
          {options.map((o) => (
            <button
              key={o.value} type="button" role="option" aria-selected={o.value === current} disabled={o.disabled}
              className="ds-dd__item" onClick={() => choose(o.value)}
            >
              <span style={{ flex: 1 }}>{o.label}</span>
              {o.value === current && <CheckIcon style={{ width: 16, height: 16 }} />}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

/** Native <select>, styled — accessible by default and best on mobile (OS picker). Use when you
 *  prefer the native control; the custom Select above gives the anchored slide-down feel. */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(function NativeSelect({ error, className = "", children, ...rest }, ref) {
  return (
    <span className="ds-select-wrap">
      <select
        ref={ref}
        className={["ds-select", className].filter(Boolean).join(" ")}
        aria-invalid={error || undefined}
        style={error ? { borderColor: "var(--color-destructive)" } : undefined}
        {...rest}
      >
        {children}
      </select>
      <span className="ds-select-wrap__chevron"><ChevronDownIcon style={{ width: 16, height: 16 }} /></span>
    </span>
  );
});
