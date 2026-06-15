import "../components.css";
import * as React from "react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Optional change indicator, e.g. "+12%". */
  delta?: React.ReactNode;
  /** Colours + arrow the delta. */
  trend?: "up" | "down" | "flat";
  /** Whether "up" is good (green) — set false for metrics where up is bad (e.g. error rate). */
  upIsGood?: boolean;
  icon?: React.ReactNode;
  /** Optional trailing visual, e.g. a <Sparkline/>. */
  chart?: React.ReactNode;
}

/** Metric card — muted label, large value, optional trend delta + sparkline. Quiet surface (no border),
 *  matching the design-standard metric-card pattern. */
export function StatCard({ label, value, delta, trend = "flat", upIsGood = true, icon, chart, className = "", ...rest }: StatCardProps) {
  const good = trend === "flat" ? null : (trend === "up") === upIsGood;
  const deltaColor = good == null ? "var(--color-muted-foreground)" : good ? "var(--color-success)" : "var(--color-destructive)";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  return (
    <div className={["ds-stat", className].filter(Boolean).join(" ")} {...rest}>
      <div className="ds-stat__head">
        <span className="ds-stat__label">{label}</span>
        {icon && <span className="ds-stat__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="ds-stat__value">{value}</div>
      <div className="ds-stat__foot">
        {delta != null && (
          <span className="ds-stat__delta" style={{ color: deltaColor }}>
            {arrow && <span aria-hidden="true">{arrow} </span>}{delta}
          </span>
        )}
        {chart && <span className="ds-stat__chart">{chart}</span>}
      </div>
    </div>
  );
}
