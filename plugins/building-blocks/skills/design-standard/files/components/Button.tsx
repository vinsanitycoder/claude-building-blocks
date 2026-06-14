import "../components.css";
import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button; keeps width stable (no reflow). */
  loading?: boolean;
}

/** Base button. Implements the full state cycle: hover (lift+shadow), press (compress),
 *  release (spring back), focus-visible (ring), disabled, loading. Styled only via tokens. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className = "", children, disabled, type = "button", ...rest },
  ref,
) {
  const cls = ["ds-btn", `ds-btn--${variant}`, size !== "md" ? `ds-btn--${size}` : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <span className="ds-spinner" style={{ width: "1em", height: "1em", borderWidth: 2 }} aria-hidden="true" />}
      {children}
    </button>
  );
});
