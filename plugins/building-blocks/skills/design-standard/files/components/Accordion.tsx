import "../components.css";
import * as React from "react";

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Allow multiple panels open at once. Default false (single-open). */
  multiple?: boolean;
  /** Controlled set of open item IDs (use with onOpenChange). */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
}

interface Ctx {
  open: string[];
  toggle: (id: string) => void;
}
const AccordionCtx = React.createContext<Ctx | null>(null);

export function Accordion({ multiple, open, defaultOpen, onOpenChange, className = "", children, ...rest }: AccordionProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultOpen ?? []);
  const isControlled = open !== undefined;
  const cur = isControlled ? open! : internal;

  function toggle(id: string) {
    const next = cur.includes(id)
      ? cur.filter((x) => x !== id)
      : multiple ? [...cur, id] : [id];
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  }

  return (
    <div className={["ds-accordion", className].filter(Boolean).join(" ")} {...rest}>
      <AccordionCtx.Provider value={{ open: cur, toggle }}>{children}</AccordionCtx.Provider>
    </div>
  );
}

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  id: string;
  title: React.ReactNode;
}

export function AccordionItem({ id, title, className = "", children, ...rest }: AccordionItemProps) {
  const ctx = React.useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionItem must be inside <Accordion>");
  const open = ctx.open.includes(id);
  return (
    <div className={["ds-accordion__item", className].filter(Boolean).join(" ")} {...rest}>
      <button
        type="button"
        className="ds-accordion__header"
        aria-expanded={open}
        aria-controls={`acc-${id}`}
        onClick={() => ctx.toggle(id)}
      >
        <span className="ds-accordion__title">{title}</span>
        <span className={["ds-accordion__chev", open ? "ds-accordion__chev--open" : ""].filter(Boolean).join(" ")} aria-hidden="true">▾</span>
      </button>
      <div id={`acc-${id}`} className="ds-accordion__panel" hidden={!open}>{children}</div>
    </div>
  );
}
