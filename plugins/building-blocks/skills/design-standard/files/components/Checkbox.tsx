import "../components.css";
import * as React from "react";
import { CheckIcon, MinusIcon } from "./icons";

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** Multi-select boolean, supports indeterminate. role="checkbox" with aria-checked true|false|"mixed". */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked = false, indeterminate = false, onCheckedChange, disabled, className = "", ...rest },
  ref,
) {
  const on = checked || indeterminate;
  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={["ds-check", on ? "ds-check--on" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {indeterminate ? <MinusIcon style={{ width: ".8rem", height: ".8rem" }} /> : checked ? <CheckIcon style={{ width: ".8rem", height: ".8rem" }} /> : null}
    </button>
  );
});
