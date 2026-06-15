import "../components.css";
import * as React from "react";

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  /** Sized to content by default (§21.4) — short numbers shouldn't be full-width. */
  widthCh?: number;
}

/** Number field with −/+ steppers. Clamps to min/max; sized to its expected input, not full-width. */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = 0, onValueChange, min, max, step = 1, disabled, error, widthCh = 6, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const v = isControlled ? value! : internal;

  function clamp(n: number) {
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    return n;
  }
  function set(next: number) {
    const c = clamp(next);
    if (!isControlled) setInternal(c);
    onValueChange?.(c);
  }

  return (
    <div className={["ds-number", error ? "ds-number--error" : "", disabled ? "ds-number--disabled" : ""].filter(Boolean).join(" ")}>
      <button type="button" className="ds-number__step" aria-label="Decrease" disabled={disabled || (min !== undefined && v <= min)} onClick={() => set(v - step)}>−</button>
      <input
        ref={ref}
        type="number"
        className="ds-number__input"
        style={{ width: `${widthCh}ch` }}
        value={Number.isFinite(v) ? v : ""}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        inputMode="numeric"
        onChange={(e) => set(Number(e.target.value))}
        {...rest}
      />
      <button type="button" className="ds-number__step" aria-label="Increase" disabled={disabled || (max !== undefined && v >= max)} onClick={() => set(v + step)}>+</button>
    </div>
  );
});
