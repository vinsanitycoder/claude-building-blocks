import "../components.css";
import * as React from "react";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  /** Show a dismiss × in the corner. */
  onDismiss?: () => void;
  /** Hide the variant icon (still gets an icon via aria for screen readers). */
  hideIcon?: boolean;
}

const ICON: Record<AlertVariant, string> = {
  info: "ⓘ", success: "✓", warning: "!", destructive: "✕",
};

/** Inline alert / callout — persistent in-page message (distinct from a transient toast).
 *  Pairs colour with an icon (never colour-as-only-signal). */
export function Alert({ variant = "info", title, onDismiss, hideIcon, className = "", children, ...rest }: AlertProps) {
  return (
    <div role={variant === "destructive" || variant === "warning" ? "alert" : "status"}
         className={["ds-alert", `ds-alert--${variant}`, className].filter(Boolean).join(" ")} {...rest}>
      {!hideIcon && <span className="ds-alert__icon" aria-hidden="true">{ICON[variant]}</span>}
      <div className="ds-alert__body">
        {title && <div className="ds-alert__title">{title}</div>}
        {children && <div className="ds-alert__msg">{children}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="ds-alert__close" onClick={onDismiss} aria-label="Dismiss">×</button>
      )}
    </div>
  );
}
