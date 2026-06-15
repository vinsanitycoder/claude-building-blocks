import "../components.css";
import * as React from "react";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;          // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many page buttons to show on each side of the current one. Default 1. */
  siblings?: number;
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

/** Page-number pagination with ellipsis overflow + prev/next. */
export function Pagination({ page, totalPages, onPageChange, siblings = 1, className = "", ...rest }: PaginationProps) {
  const total = Math.max(1, totalPages);
  const cur = Math.min(Math.max(1, page), total);
  const first = 1, last = total;
  const leftSib = Math.max(cur - siblings, first + 1);
  const rightSib = Math.min(cur + siblings, last - 1);
  const showLeftEllipsis = leftSib > first + 1;
  const showRightEllipsis = rightSib < last - 1;

  const pages: (number | "…")[] = [first];
  if (total > 1) {
    if (showLeftEllipsis) pages.push("…");
    pages.push(...range(leftSib, rightSib));
    if (showRightEllipsis) pages.push("…");
    pages.push(last);
  }

  return (
    <nav aria-label="Pagination" className={["ds-pagination", className].filter(Boolean).join(" ")} {...rest}>
      <button type="button" className="ds-pagination__btn" disabled={cur === first} aria-label="Previous page"
              onClick={() => onPageChange(cur - 1)}>‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} className="ds-pagination__ellipsis" aria-hidden="true">…</span>
          : (
            <button key={p} type="button"
                    className={["ds-pagination__btn", p === cur ? "ds-pagination__btn--active" : ""].filter(Boolean).join(" ")}
                    aria-current={p === cur ? "page" : undefined}
                    onClick={() => onPageChange(p)}>{p}</button>
          ),
      )}
      <button type="button" className="ds-pagination__btn" disabled={cur === last} aria-label="Next page"
              onClick={() => onPageChange(cur + 1)}>›</button>
    </nav>
  );
}
