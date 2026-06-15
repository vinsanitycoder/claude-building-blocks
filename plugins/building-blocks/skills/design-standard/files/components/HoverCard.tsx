import "../components.css";
import * as React from "react";

export interface HoverCardProps {
  /** The element you hover/focus to reveal the card. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "start" | "end";
  /** Open delay (ms) — hover-intent guard. */
  openDelay?: number;
  closeDelay?: number;
}

/** Rich hover preview (richer than a Tooltip — can hold avatars, stats, links). Opens on hover OR
 *  focus after a short intent delay; anchored under the trigger. Use Tooltip for a one-line label. */
export function HoverCard({ trigger, children, align = "start", openDelay = 250, closeDelay = 120 }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), closeDelay); };

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const trig = React.cloneElement(trigger as React.ReactElement<any>, {
    onMouseEnter: (e: React.MouseEvent) => { (trigger.props as any).onMouseEnter?.(e); show(); },
    onMouseLeave: (e: React.MouseEvent) => { (trigger.props as any).onMouseLeave?.(e); hide(); },
    onFocus: (e: React.FocusEvent) => { (trigger.props as any).onFocus?.(e); show(); },
    onBlur: (e: React.FocusEvent) => { (trigger.props as any).onBlur?.(e); hide(); },
  });

  return (
    <span className="ds-dd" onMouseEnter={show} onMouseLeave={hide}>
      {trig}
      {open && (
        <div
          className="ds-dd__panel ds-popover ds-hovercard"
          role="dialog"
          style={align === "end" ? { left: "auto", right: 0 } : undefined}
        >
          {children}
        </div>
      )}
    </span>
  );
}
