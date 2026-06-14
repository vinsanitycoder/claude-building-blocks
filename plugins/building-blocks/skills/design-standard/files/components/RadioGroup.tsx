import "../components.css";
import * as React from "react";

interface RadioCtx { value?: string; onValueChange?: (v: string) => void; name: string; }
const Ctx = React.createContext<RadioCtx | null>(null);

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

/** Pick exactly one. Compose with RadioGroupItem. Controlled. */
export function RadioGroup({ value, onValueChange, name = "radio", className = "", children, ...rest }: RadioGroupProps) {
  return (
    <Ctx.Provider value={{ value, onValueChange, name }}>
      <div role="radiogroup" className={className} {...rest}>{children}</div>
    </Ctx.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(function RadioGroupItem(
  { value, disabled, className = "", ...rest },
  ref,
) {
  const ctx = React.useContext(Ctx);
  const selected = ctx?.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => ctx?.onValueChange?.(value)}
      className={["ds-radio", selected ? "ds-radio--on" : "", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});
