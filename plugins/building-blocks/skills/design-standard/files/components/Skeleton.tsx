import "../components.css";
import * as React from "react";

/** Placeholder shape during load. Size it to match the final content to avoid layout shift. */
export function Skeleton({ className = "", style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={["ds-skeleton", className].filter(Boolean).join(" ")} style={style} {...rest} />;
}
