import "../components.css";
import * as React from "react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Defaults to (row as any)[key]. */
  cell?: (row: T) => React.ReactNode;
  /** Make this column sortable. Provide a comparator or true for default string/number sort. */
  sortable?: boolean | ((a: T, b: T) => number);
  align?: "left" | "right" | "center";
  /** Fixed width, e.g. "8rem". */
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, i: number) => string | number;
  onRowClick?: (row: T) => void;
  /** Shown when rows is empty. */
  empty?: React.ReactNode;
  /** Compact row height (per §21.6 — dense for scannable tables). */
  density?: "compact" | "default";
  className?: string;
}

/** Sortable, prop-driven table. Header click cycles asc → desc → none. Numbers right-aligned + tabular.
 *  Backend-agnostic: pass rows + columns. For huge sets, sort/paginate server-side and pass a page. */
export function DataTable<T>({ columns, rows, rowKey, onRowClick, empty = "No data.", density = "default", className = "" }: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortable) return rows;
    const cmp = typeof col.sortable === "function"
      ? col.sortable
      : (a: T, b: T) => {
          const av = (a as any)[col.key], bv = (b as any)[col.key];
          if (av == null) return -1;
          if (bv == null) return 1;
          if (typeof av === "number" && typeof bv === "number") return av - bv;
          return String(av).localeCompare(String(bv));
        };
    const out = [...rows].sort(cmp);
    return sort.dir === "desc" ? out.reverse() : out;
  }, [rows, sort, columns]);

  function toggle(key: string) {
    setSort((s) =>
      !s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null
    );
  }

  return (
    <div className={["ds-table-wrap", className].filter(Boolean).join(" ")} data-density={density === "compact" ? "compact" : undefined}>
      <table className="ds-table">
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  style={{ width: c.width, textAlign: c.align ?? "left" }}
                  aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  {c.sortable ? (
                    <button type="button" className="ds-table__sort" onClick={() => toggle(c.key)}>
                      {c.header}
                      <span className="ds-table__sort-ind" aria-hidden="true">{active ? (sort!.dir === "asc" ? "↑" : "↓") : "↕"}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td className="ds-table__empty" colSpan={columns.length}>{empty}</td></tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "ds-table__row--clickable" : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? "left", fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined }}>
                    {c.cell ? c.cell(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
