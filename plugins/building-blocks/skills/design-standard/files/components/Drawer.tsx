import "../components.css";
import * as React from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Edge to anchor the panel to. */
  side?: "left" | "right" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  /** Close when the scrim is clicked. Default true. */
  closeOnScrimClick?: boolean;
  children?: React.ReactNode;
}

/** Edge-anchored slide-over panel with scrim, focus-trap escape, and Esc to close. */
export function Drawer({ open, onClose, side = "right", size = "md", closeOnScrimClick = true, children }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ds-drawer-root" role="dialog" aria-modal="true">
      <div className="ds-drawer-scrim" onClick={closeOnScrimClick ? onClose : undefined} />
      <div className={`ds-drawer ds-drawer--${side} ds-drawer--${size}`}>{children}</div>
    </div>
  );
}

export function DrawerHeader({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ds-drawer__header", className].filter(Boolean).join(" ")} {...rest} />;
}
export function DrawerBody({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ds-drawer__body", className].filter(Boolean).join(" ")} {...rest} />;
}
export function DrawerFooter({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ds-drawer__footer", className].filter(Boolean).join(" ")} {...rest} />;
}
