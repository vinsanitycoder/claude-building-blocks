import "../components.css";
import * as React from "react";

/** Small raised key-cap for keyboard shortcuts. Wrap individual keys or use the keys prop. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional convenience — renders one <kbd> per key with "+" separators. */
  keys?: string[];
}

export function Kbd({ keys, className = "", children, ...rest }: KbdProps) {
  if (keys && keys.length) {
    return (
      <span className={className} {...rest}>
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="ds-kbd__sep">+</span>}
            <kbd className="ds-kbd">{k}</kbd>
          </React.Fragment>
        ))}
      </span>
    );
  }
  return <kbd className={["ds-kbd", className].filter(Boolean).join(" ")} {...rest}>{children}</kbd>;
}
