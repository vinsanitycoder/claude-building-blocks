import "../components.css";
import * as React from "react";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}

export interface SegmentedControlProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SegmentedOption[];
  size?: "sm" | "md";
  "aria-label"?: string;
}

/** Joined, equal-width single-select toggle (iOS-style). 2–5 mutually-exclusive options. */
export function SegmentedControl({ value, defaultValue, onValueChange, options, size = "md", ...aria }: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value);
  const current = value ?? internal;
  function select(v: string) {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  }
  return (
    <div role="radiogroup" className={["ds-segmented", size === "sm" ? "ds-segmented--sm" : ""].filter(Boolean).join(" ")} {...aria}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === current}
          className={["ds-segmented__seg", o.value === current ? "ds-segmented__seg--on" : ""].filter(Boolean).join(" ")}
          onClick={() => select(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
