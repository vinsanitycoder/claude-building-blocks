import "../components.css";
import * as React from "react";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon/illustration (kept small + muted). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary action(s) — e.g. a "Create" button. */
  action?: React.ReactNode;
}

/** Honest empty state — short heading + one line of guidance + one primary action.
 *  Distinguish first-run (create CTA) vs no-results (clear filters) vs empty via the copy you pass. */
export function EmptyState({ icon, title, description, action, className = "", ...rest }: EmptyStateProps) {
  return (
    <div className={["ds-empty", className].filter(Boolean).join(" ")} {...rest}>
      {icon && <div className="ds-empty__icon" aria-hidden="true">{icon}</div>}
      <div className="ds-empty__title">{title}</div>
      {description && <div className="ds-empty__desc">{description}</div>}
      {action && <div className="ds-empty__action">{action}</div>}
    </div>
  );
}
