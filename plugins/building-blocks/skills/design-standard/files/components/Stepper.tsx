import "../components.css";
import * as React from "react";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface StepperStep {
  label: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  /** Index of the current step (0-based). If steps[].status is set, it wins. */
  current?: number;
  orientation?: "horizontal" | "vertical";
}

/** Numbered/check stepper for multi-step flows (wizard, onboarding, checkout). */
export function Stepper({ steps, current = 0, orientation = "horizontal", className = "", ...rest }: StepperProps) {
  return (
    <ol
      className={["ds-stepper", `ds-stepper--${orientation}`, className].filter(Boolean).join(" ")}
      aria-label="Progress"
      {...rest}
    >
      {steps.map((s, i) => {
        const status: StepStatus = s.status ?? (i < current ? "complete" : i === current ? "current" : "upcoming");
        const last = i === steps.length - 1;
        return (
          <li key={i} className={`ds-stepper__step ds-stepper__step--${status}`} aria-current={status === "current" ? "step" : undefined}>
            <span className="ds-stepper__node" aria-hidden="true">{status === "complete" ? "✓" : status === "error" ? "!" : i + 1}</span>
            <span className="ds-stepper__text">
              <span className="ds-stepper__label">{s.label}</span>
              {s.description && <span className="ds-stepper__desc">{s.description}</span>}
            </span>
            {!last && <span className="ds-stepper__connector" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
