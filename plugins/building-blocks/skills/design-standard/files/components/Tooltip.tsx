import "../components.css";
import * as React from "react";

export interface TooltipProps {
  /** Short, text-only label (not interactive content — that's a Popover/HoverCard). */
  content: React.ReactNode;
  children: React.ReactElement;
}

/** Text-only tooltip on hover AND keyboard focus (CSS-driven). The trigger must be focusable;
 *  for an icon-only trigger pass a focusable element (button/[tabindex]). */
export function Tooltip({ content, children }: TooltipProps) {
  const id = React.useId();
  const trigger = React.cloneElement(children, { "aria-describedby": id });
  return (
    <span className="ds-tooltip">
      {trigger}
      <span role="tooltip" id={id} className="ds-tooltip__bubble">{content}</span>
    </span>
  );
}
