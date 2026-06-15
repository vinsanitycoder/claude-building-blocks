import "../components.css";
import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  /** Override the accessible label (defaults to "Progress"). */
  label?: string;
  variant?: "default" | "success" | "destructive";
}

/** Progress bar — determinate (0–100) or indeterminate (omit value). */
export function Progress({ value, label = "Progress", variant = "default", className = "", ...rest }: ProgressProps) {
  const determinate = typeof value === "number";
  const clamped = determinate ? Math.max(0, Math.min(100, value!)) : undefined;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? clamped : undefined}
      className={["ds-progress", `ds-progress--${variant}`, !determinate ? "ds-progress--indeterminate" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className="ds-progress__bar" style={determinate ? { width: `${clamped}%` } : undefined} />
    </div>
  );
}
