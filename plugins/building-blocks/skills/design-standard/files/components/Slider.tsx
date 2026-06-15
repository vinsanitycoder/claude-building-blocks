import "../components.css";
import * as React from "react";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  /** Show the current value above the thumb on hover/drag. */
  showValueTooltip?: boolean;
  /** Format the displayed value (e.g. n => `$${n}`). */
  formatValue?: (n: number) => string;
}

/** Slider with the full state cycle: track hover, thumb hover-grow, grab-on-press,
 *  release spring-back, drag, focus ring, disabled. Token-driven. */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, defaultValue, min = 0, max = 100, step = 1, onValueChange, className = "", style,
    showValueTooltip = false, formatValue, disabled, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState(defaultValue ?? min);
  const isControlled = value !== undefined;
  const v = isControlled ? value! : internal;
  const pct = ((v - min) / (max - min)) * 100;

  return (
    <div className={["ds-slider", disabled ? "ds-slider--disabled" : "", className].filter(Boolean).join(" ")} style={style}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!isControlled) setInternal(next);
          onValueChange?.(next);
        }}
        className="ds-slider__input"
        style={{ background: `linear-gradient(to right, var(--color-primary) 0 ${pct}%, var(--color-muted) ${pct}% 100%)` }}
        {...rest}
      />
      {showValueTooltip && (
        <span className="ds-slider__tooltip" style={{ left: `${pct}%` }} aria-hidden="true">
          {formatValue ? formatValue(v) : v}
        </span>
      )}
    </div>
  );
});
