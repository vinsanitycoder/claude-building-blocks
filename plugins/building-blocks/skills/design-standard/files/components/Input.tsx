import "../components.css";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Applies the destructive border + ring. Pair with a visible error message + aria-describedby. */
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, className = "", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={["ds-input", error ? "ds-input--error" : "", className].filter(Boolean).join(" ")}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className = "", ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={["ds-input", error ? "ds-input--error" : "", className].filter(Boolean).join(" ")}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
});
