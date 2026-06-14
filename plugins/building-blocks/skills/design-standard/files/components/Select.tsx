import "../components.css";
import * as React from "react";
import { ChevronDownIcon } from "./icons";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

/** Native <select>, styled to the tokens (accessible by default, mobile-friendly). For a filterable
 *  / async list, build a combobox per DESIGN_STANDARD §15. Pass <option>s as children. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error, className = "", children, ...rest },
  ref,
) {
  return (
    <span className="ds-select-wrap">
      <select
        ref={ref}
        className={["ds-select", className].filter(Boolean).join(" ")}
        aria-invalid={error || undefined}
        style={error ? { borderColor: "var(--color-destructive)" } : undefined}
        {...rest}
      >
        {children}
      </select>
      <span className="ds-select-wrap__chevron"><ChevronDownIcon style={{ width: 16, height: 16 }} /></span>
    </span>
  );
});
