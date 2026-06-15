import "../components.css";
import * as React from "react";

export interface DropdownMenuProps {
  /** The clickable trigger (e.g. a <Button>). Cloned with the open handler + ARIA — its own
   *  onClick is replaced, since the trigger's job is to open the menu. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  /** Align the menu's right edge to the trigger instead of the left. */
  align?: "start" | "end";
}

/** Action menu that anchors directly under its trigger (top:100%) and slides down — it reads as
 *  unfolding from the button, not a panel floating in the middle. Closes on select / outside-click /
 *  Escape. */
export function DropdownMenu({ trigger, children, align = "start" }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const trig = React.cloneElement(trigger, {
    onClick: () => setOpen((o) => !o),
    "aria-haspopup": "menu",
    "aria-expanded": open,
  });

  return (
    <span className="ds-dd" ref={wrapRef}>
      {trig}
      {open && (
        <div
          role="menu"
          className={["ds-dd__panel", align === "end" ? "ds-dd__panel--end" : ""].filter(Boolean).join(" ")}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </span>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
  onSelect?: () => void;
}
export function DropdownMenuItem({ destructive, onSelect, className = "", onClick, ...rest }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={["ds-dd__item", destructive ? "ds-dd__item--destructive" : "", className].filter(Boolean).join(" ")}
      onClick={(e) => { onSelect?.(); onClick?.(e); }}
      {...rest}
    />
  );
}

export function DropdownMenuSeparator() {
  return <div className="ds-dd__sep" role="separator" />;
}
