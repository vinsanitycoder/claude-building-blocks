import "../components.css";
import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Renders an "(optional)" hint; mark the minority of fields, never both required and optional. */
  optional?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { optional, className = "", children, ...rest },
  ref,
) {
  return (
    <label ref={ref} className={["ds-label", className].filter(Boolean).join(" ")} {...rest}>
      {children}
      {optional && <span style={{ color: "var(--color-muted-foreground)", fontWeight: 400 }}> (optional)</span>}
    </label>
  );
});

/** Helper text below a field. */
export function HelpText({ className = "", ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["ds-help", className].filter(Boolean).join(" ")} {...rest} />;
}

/** Inline field error (pairs with Input error + aria-describedby). */
export function ErrorText({ className = "", ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={["ds-error", className].filter(Boolean).join(" ")} {...rest} />;
}
