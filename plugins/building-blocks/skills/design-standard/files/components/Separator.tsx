import "../components.css";
import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal", className = "", ...rest }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={["ds-separator", `ds-separator--${orientation}`, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
