import "../components.css";
import * as React from "react";
import { Label, HelpText, ErrorText } from "./Label";

let _id = 0;
function useFieldId(provided?: string) {
  const [auto] = React.useState(() => `ds-field-${++_id}`);
  return provided ?? auto;
}

export interface FieldProps {
  /** The field label (omit for an unlabelled control). */
  label?: React.ReactNode;
  /** Helper text shown below the control (hidden when `error` is set). */
  help?: React.ReactNode;
  /** Error message — sets the control's aria-invalid and replaces help text. */
  error?: React.ReactNode;
  /** Mark a minority field optional. */
  optional?: boolean;
  /** Explicit id for the control (otherwise auto-generated). */
  htmlFor?: string;
  className?: string;
  /** The single form control (Input, Select, Combobox, …). */
  children: React.ReactElement;
}

/** Field — the §21 form unit. Stacks Label → control → help/error with the proximity built in
 *  (label binds tight to its control; the next Field is separated by the form's stack gap). Wires
 *  id + aria-describedby + aria-invalid onto the control automatically, so every form is consistent. */
export function Field({ label, help, error, optional, htmlFor, className = "", children }: FieldProps) {
  const id = useFieldId(htmlFor ?? (children.props as any)?.id);
  const helpId = `${id}-help`;
  const errId = `${id}-err`;
  const describedBy = error ? errId : help ? helpId : undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        id,
        "aria-describedby": describedBy,
        ...(error ? { error: true, "aria-invalid": true } : {}),
      })
    : children;

  return (
    <div className={["ds-field", className].filter(Boolean).join(" ")}>
      {label != null && <Label htmlFor={id} optional={optional}>{label}</Label>}
      {control}
      {error ? <ErrorText id={errId}>{error}</ErrorText> : help ? <HelpText id={helpId}>{help}</HelpText> : null}
    </div>
  );
}
