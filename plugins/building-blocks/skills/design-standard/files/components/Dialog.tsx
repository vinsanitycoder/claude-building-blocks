import "../components.css";
import * as React from "react";
import { createPortal } from "react-dom";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/** Modal dialog. Controlled. Esc + scrim-click close; focus moves into the panel on open and
 *  returns to the previously-focused element on close. Renders via portal to escape stacking. */
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const returnTo = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnTo.current?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!open) return null;
  return createPortal(
    <div className="ds-dialog__overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}>
      <div ref={panelRef} className="ds-dialog__panel" role="dialog" aria-modal="true" tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogTitle({ className = "", ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["ds-dialog__title", className].filter(Boolean).join(" ")} {...rest} />;
}
export function DialogDescription({ className = "", ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["ds-dialog__desc", className].filter(Boolean).join(" ")} {...rest} />;
}
export function DialogFooter({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ds-dialog__footer", className].filter(Boolean).join(" ")} {...rest} />;
}
