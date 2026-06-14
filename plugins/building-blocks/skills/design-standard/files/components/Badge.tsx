import "../components.css";
import * as React from "react";

export type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "default", className = "", ...rest }: BadgeProps) {
  return <span className={["ds-badge", `ds-badge--${variant}`, className].filter(Boolean).join(" ")} {...rest} />;
}
