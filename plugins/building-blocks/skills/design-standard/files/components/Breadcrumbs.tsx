import "../components.css";
import * as React from "react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Custom separator (default: ›). */
  separator?: React.ReactNode;
}

/** Ancestor links; the last item is the current page (rendered as text, not a link). */
export function Breadcrumbs({ items, separator = "›", className = "", ...rest }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={["ds-breadcrumbs", className].filter(Boolean).join(" ")} {...rest}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="ds-breadcrumbs__item">
              {last
                ? <span aria-current="page">{it.label}</span>
                : it.href
                  ? <a href={it.href}>{it.label}</a>
                  : <span>{it.label}</span>}
              {!last && <span className="ds-breadcrumbs__sep" aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
