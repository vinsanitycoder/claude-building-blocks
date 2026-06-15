import "../components.css";
import * as React from "react";

/** Minimal but real calendar — month grid, prev/next, today/selected/range/disabled/out-of-month.
 *  Calendar dates are zoneless ISO strings ("YYYY-MM-DD") — never round-trip through new Date(string). */

type ISO = string;

export interface CalendarProps {
  /** Selected date (ISO yyyy-mm-dd) — single-date mode. */
  value?: ISO | null;
  onChange?: (date: ISO) => void;
  /** Range mode: pass {start, end}. Mutually exclusive with value/onChange. */
  range?: { start: ISO | null; end: ISO | null };
  onRangeChange?: (next: { start: ISO | null; end: ISO | null }) => void;
  /** Initial month shown (ISO date in that month). Defaults to today. */
  defaultMonth?: ISO;
  /** Disable specific dates. */
  isDisabled?: (date: ISO) => boolean;
  /** Min / max selectable date (ISO). */
  min?: ISO;
  max?: ISO;
  /** First day of week: 0=Sun, 1=Mon (default uses Intl). */
  weekStartsOn?: 0 | 1;
  locale?: string;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }
function iso(y: number, m: number, d: number): ISO { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function parse(s: ISO): { y: number; m: number; d: number } { const [y, m, d] = s.split("-").map(Number); return { y: y!, m: m! - 1, d: d! }; }
function todayISO(): ISO { const d = new Date(); return iso(d.getFullYear(), d.getMonth(), d.getDate()); }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function dowOf(y: number, m: number, d: number) { return new Date(y, m, d).getDay(); }
function addMonths(y: number, m: number, delta: number) { const d = new Date(y, m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; }
function cmp(a: ISO, b: ISO) { return a < b ? -1 : a > b ? 1 : 0; }

export function Calendar({
  value, onChange, range, onRangeChange, defaultMonth, isDisabled, min, max,
  weekStartsOn = 1, locale,
}: CalendarProps) {
  const isRange = !!range;
  const initial = defaultMonth || value || range?.start || todayISO();
  const init = parse(initial);
  const [view, setView] = React.useState({ y: init.y, m: init.m });
  const [focusISO, setFocusISO] = React.useState<ISO>(initial);
  const [hovering, setHovering] = React.useState<ISO | null>(null);

  const today = todayISO();
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const monthLabel = fmt.format(new Date(view.y, view.m, 1));

  const dows = React.useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, i + (weekStartsOn === 0 ? 7 : 8))));
  }, [locale, weekStartsOn]);

  function disabled(d: ISO): boolean {
    if (min && cmp(d, min) < 0) return true;
    if (max && cmp(d, max) > 0) return true;
    return !!isDisabled?.(d);
  }

  function isSelected(d: ISO): boolean {
    if (!isRange) return value === d;
    return range!.start === d || range!.end === d;
  }
  function inRange(d: ISO): boolean {
    if (!isRange) return false;
    const { start, end } = range!;
    const tentativeEnd = end || (start && hovering && cmp(hovering, start) > 0 ? hovering : null);
    if (!start || !tentativeEnd) return false;
    return cmp(d, start) > 0 && cmp(d, tentativeEnd) < 0;
  }

  function pick(d: ISO) {
    if (disabled(d)) return;
    if (!isRange) { onChange?.(d); return; }
    const { start, end } = range!;
    if (!start || (start && end)) { onRangeChange?.({ start: d, end: null }); return; }
    if (cmp(d, start) < 0) { onRangeChange?.({ start: d, end: null }); return; }
    onRangeChange?.({ start, end: d });
  }

  function shiftFocus(deltaDays: number) {
    const p = parse(focusISO);
    const next = new Date(p.y, p.m, p.d + deltaDays);
    const ni = iso(next.getFullYear(), next.getMonth(), next.getDate());
    setFocusISO(ni);
    if (next.getMonth() !== view.m || next.getFullYear() !== view.y) {
      setView({ y: next.getFullYear(), m: next.getMonth() });
    }
  }

  function onKey(e: React.KeyboardEvent) {
    const k = e.key;
    if (k === "ArrowLeft")        { e.preventDefault(); shiftFocus(-1); }
    else if (k === "ArrowRight")  { e.preventDefault(); shiftFocus(1); }
    else if (k === "ArrowUp")     { e.preventDefault(); shiftFocus(-7); }
    else if (k === "ArrowDown")   { e.preventDefault(); shiftFocus(7); }
    else if (k === "Home")        { e.preventDefault(); const p = parse(focusISO); const dow = dowOf(p.y, p.m, p.d); const off = weekStartsOn === 1 ? (dow === 0 ? -6 : 1 - dow) : -dow; shiftFocus(off); }
    else if (k === "End")         { e.preventDefault(); const p = parse(focusISO); const dow = dowOf(p.y, p.m, p.d); const off = weekStartsOn === 1 ? (dow === 0 ? 0 : 7 - dow) : 6 - dow; shiftFocus(off); }
    else if (k === "PageUp")      { e.preventDefault(); const n = addMonths(view.y, view.m, e.shiftKey ? -12 : -1); setView(n); }
    else if (k === "PageDown")    { e.preventDefault(); const n = addMonths(view.y, view.m, e.shiftKey ? 12 : 1); setView(n); }
    else if (k === "Enter" || k === " ") { e.preventDefault(); pick(focusISO); }
  }

  // Build the 6-row grid.
  const firstDow = dowOf(view.y, view.m, 1);
  const startOffset = (firstDow - weekStartsOn + 7) % 7;
  const inMonth = daysInMonth(view.y, view.m);
  const prev = addMonths(view.y, view.m, -1);
  const prevDays = daysInMonth(prev.y, prev.m);
  const cells: { y: number; m: number; d: number; outside: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ y: prev.y, m: prev.m, d: prevDays - i, outside: true });
  for (let d = 1; d <= inMonth; d++) cells.push({ y: view.y, m: view.m, d, outside: false });
  const next = addMonths(view.y, view.m, 1);
  for (let d = 1; cells.length < 42; d++) cells.push({ y: next.y, m: next.m, d, outside: true });

  return (
    <div className="ds-cal" onKeyDown={onKey}>
      <div className="ds-cal__head">
        <button type="button" className="ds-cal__nav" aria-label="Previous month" onClick={() => setView(addMonths(view.y, view.m, -1))}>‹</button>
        <span className="ds-cal__title" aria-live="polite">{monthLabel}</span>
        <button type="button" className="ds-cal__nav" aria-label="Next month" onClick={() => setView(addMonths(view.y, view.m, 1))}>›</button>
      </div>
      <div className="ds-cal__grid" role="grid">
        {dows.map((d, i) => <div key={i} className="ds-cal__dow" role="columnheader">{d}</div>)}
        {cells.map((c, i) => {
          const di = iso(c.y, c.m, c.d);
          const isToday = di === today;
          const sel = isSelected(di);
          const within = inRange(di);
          const isStart = isRange && range!.start === di;
          const isEnd = isRange && range!.end === di;
          const dis = disabled(di);
          const isFocus = focusISO === di;
          const cls = [
            "ds-cal__day",
            c.outside ? "ds-cal__day--outside" : "",
            isToday ? "ds-cal__day--today" : "",
            sel ? "ds-cal__day--selected" : "",
            within ? "ds-cal__day--in-range" : "",
            isStart ? "ds-cal__day--range-start" : "",
            isEnd ? "ds-cal__day--range-end" : "",
            dis ? "ds-cal__day--disabled" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              tabIndex={isFocus ? 0 : -1}
              aria-selected={sel}
              aria-disabled={dis}
              disabled={dis}
              className={cls}
              onClick={() => pick(di)}
              onMouseEnter={() => isRange && setHovering(di)}
              onMouseLeave={() => isRange && setHovering(null)}
              onFocus={() => setFocusISO(di)}
            >
              {c.d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
