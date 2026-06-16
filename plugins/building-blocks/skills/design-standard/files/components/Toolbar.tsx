import "../components.css";
import * as React from "react";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label": string;
  orientation?: "horizontal" | "vertical";
}

/** Action bar grouping buttons / toggles / menus under ONE tab stop with roving focus (arrow keys
 *  move between controls). role="toolbar". Put ToggleGroup, Buttons, Separator inside. */
export function Toolbar({ orientation = "horizontal", className = "", children, ...rest }: ToolbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const prev = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    if (e.key !== next && e.key !== prev && e.key !== "Home" && e.key !== "End") return;
    const items = Array.from(
      ref.current?.querySelectorAll<HTMLElement>('[data-toolbar-item]:not([disabled])') ?? []
    );
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    let t = i;
    if (e.key === next) t = i < 0 ? 0 : (i + 1) % items.length;
    else if (e.key === prev) t = i <= 0 ? items.length - 1 : i - 1;
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = items.length - 1;
    items[t]?.focus();
  }

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation={orientation}
      className={["ds-toolbar", orientation === "vertical" ? "ds-toolbar--vertical" : "", className].filter(Boolean).join(" ")}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface ToggleGroupOption {
  value: string;
  label: React.ReactNode;
  "aria-label"?: string;
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  /** single → string|null; multiple → string[]. */
  type?: "single" | "multiple";
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
}

/** Grouped toggle buttons (e.g. bold/italic, list/grid view). Single = one-or-none active (aria-pressed);
 *  multiple = any number active. Lives inside a Toolbar or standalone. */
export function ToggleGroup({
  options, type = "single", value, defaultValue, onValueChange, size = "md", disabled, ...aria
}: ToggleGroupProps) {
  const [internal, setInternal] = React.useState<string | string[] | null>(
    defaultValue ?? (type === "multiple" ? [] : null)
  );
  const current = value !== undefined ? value : internal;

  function isOn(v: string) {
    return type === "multiple" ? Array.isArray(current) && current.includes(v) : current === v;
  }
  function toggle(v: string) {
    let next: string | string[] | null;
    if (type === "multiple") {
      const arr = Array.isArray(current) ? current : [];
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    } else {
      next = current === v ? null : v;
    }
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <div className={["ds-togglegroup", size === "sm" ? "ds-togglegroup--sm" : ""].filter(Boolean).join(" ")} role="group" aria-label={aria["aria-label"]}>
      {options.map((o) => {
        const on = isOn(o.value);
        return (
          <button
            key={o.value}
            type="button"
            data-toolbar-item
            disabled={disabled}
            aria-pressed={on}
            aria-label={o["aria-label"]}
            className={["ds-togglegroup__btn", on ? "ds-togglegroup__btn--on" : ""].filter(Boolean).join(" ")}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
