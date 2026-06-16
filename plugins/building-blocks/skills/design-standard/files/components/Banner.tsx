import "../components.css";
import * as React from "react";
import { InfoIcon, CheckCircleIcon, AlertIcon, XIcon } from "./icons";

export type BannerVariant = "info" | "success" | "warning" | "destructive";

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: BannerVariant;
  title?: React.ReactNode;
  /** Optional trailing actions (buttons/links). */
  actions?: React.ReactNode;
  /** Show a dismiss × and fire this when clicked. */
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const ICONS: Record<BannerVariant, React.ReactNode> = {
  info: <InfoIcon />, success: <CheckCircleIcon />, warning: <AlertIcon />, destructive: <AlertIcon />,
};

/** Page-level persistent message — full-bleed, sits at the top of a page or region. Distinct from a
 *  transient Toast and from the inline Alert (which lives in content flow). Variant carries icon +
 *  colour (never colour alone). Use role="alert" weight only for destructive. */
export function Banner({ variant = "info", title, children, actions, onDismiss, icon, className = "", ...rest }: BannerProps) {
  return (
    <div
      className={["ds-banner", `ds-banner--${variant}`, className].filter(Boolean).join(" ")}
      role={variant === "destructive" ? "alert" : "status"}
      {...rest}
    >
      <span className="ds-banner__icon" aria-hidden="true">{icon ?? ICONS[variant]}</span>
      <div className="ds-banner__body">
        {title && <span className="ds-banner__title">{title}</span>}
        {children && <span className="ds-banner__text">{children}</span>}
      </div>
      {actions && <div className="ds-banner__actions">{actions}</div>}
      {onDismiss && (
        <button type="button" className="ds-banner__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <XIcon />
        </button>
      )}
    </div>
  );
}
