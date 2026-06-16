import "../components.css";
import * as React from "react";
import { Calendar } from "./Calendar";
import { CalendarIcon } from "./icons";

export interface DatePickerProps {
  /** Selected date as ISO yyyy-mm-dd (zoneless) — or null. */
  value?: string | null;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  locale?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Date field — a trigger showing the localised date that opens the Calendar in an anchored popover.
 *  Stores/emits ISO yyyy-mm-dd; displays via Intl. Esc / outside-click / select closes. */
export function DatePicker({ value, onChange, min, max, placeholder = "Pick a date", disabled, error, id, locale, ...aria }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const label = React.useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(y, m - 1, d));
  }, [value, locale]);

  return (
    <div className="ds-dd" ref={ref} style={{ display: "block" }}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={["ds-select-trigger", error ? "ds-select-trigger--error" : ""].filter(Boolean).join(" ")}
        onClick={() => setOpen((o) => !o)}
        {...aria}
      >
        <span className={label ? "" : "ds-select-trigger__placeholder"}>{label ?? placeholder}</span>
        <CalendarIcon className="ds-select-trigger__icon" />
      </button>
      {open && (
        <div className="ds-dd__panel" role="dialog" style={{ minWidth: 0, width: "max-content", padding: "var(--space-2)" }}>
          <Calendar
            value={value ?? undefined}
            onChange={(d) => { onChange?.(d); setOpen(false); }}
            min={min}
            max={max}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
