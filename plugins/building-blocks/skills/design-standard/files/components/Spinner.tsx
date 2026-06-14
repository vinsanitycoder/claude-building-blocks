import "../components.css";
import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Pixel size of the spinner (default 20). */
  size?: number;
  /** Accessible label announced to screen readers. */
  label?: string;
}

export function Spinner({ size = 20, label = "Loading", className = "", style, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={["ds-spinner", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
      {...rest}
    />
  );
}
