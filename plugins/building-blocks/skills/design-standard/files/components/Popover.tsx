import "../components.css";
import * as React from "react";

export interface PopoverProps {
  /** The element that opens the popover (must be focusable). */
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

/** Generic click-triggered floating panel for rich content (filters, forms, info). Anchored under
 *  the trigger, slides down; closes on outside-click or Esc. For a list of actions use DropdownMenu;
 *  for a short text label use Tooltip. */
export function Popover({ trigger, children, align = "start", className = "" }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const trig = React.cloneElement(trigger as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => { (trigger.props as any).onClick?.(e); setOpen((o) => !o); },
    "aria-expanded": open,
    "aria-haspopup": "dialog",
  });

  return (
    <span className="ds-dd" ref={ref}>
      {trig}
      {open && (
        <div
          className={["ds-dd__panel", "ds-popover", className].filter(Boolean).join(" ")}
          role="dialog"
          style={align === "end" ? { left: "auto", right: 0 } : undefined}
        >
          {children}
        </div>
      )}
    </span>
  );
}
