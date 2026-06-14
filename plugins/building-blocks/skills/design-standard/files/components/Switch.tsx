import "../components.css";
import * as React from "react";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** Instant binary toggle (no Save). role="switch"; full state cycle via tokens. Controlled. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked = false, onCheckedChange, disabled, className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={["ds-switch", checked ? "ds-switch--on" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className="ds-switch__thumb" />
    </button>
  );
});
