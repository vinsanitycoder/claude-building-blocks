import "../components.css";
import * as React from "react";

export interface CommandItem {
  id: string;
  label: string;
  /** Optional short description shown next to the label. */
  description?: string;
  /** Optional grouping header (e.g. "Navigation", "Settings"). */
  group?: string;
  /** Optional keyboard shortcut hint, shown right-aligned. */
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

/** ⌘K-style command palette: search input + grouped result list + keyboard nav. */
export function CommandPalette({ open, onClose, items, placeholder = "Type a command or search…" }: CommandPaletteProps) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => { if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 0); } }, [open]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? items.filter((it) => it.label.toLowerCase().includes(s) || it.description?.toLowerCase().includes(s))
      : items;
  }, [items, q]);

  React.useEffect(() => { setActive(0); }, [q]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const it = filtered[active];
      if (it) { it.onSelect(); onClose(); }
    }
  }

  if (!open) return null;

  // Group results.
  const groups = new Map<string, CommandItem[]>();
  for (const it of filtered) {
    const g = it.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(it);
  }

  let flatIdx = 0;
  return (
    <div className="ds-cmdk-root" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="ds-cmdk-scrim" onClick={onClose} />
      <div className="ds-cmdk">
        <input
          ref={inputRef}
          className="ds-cmdk__input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Search commands"
        />
        <div className="ds-cmdk__list" role="listbox">
          {filtered.length === 0
            ? <div className="ds-cmdk__empty">No results.</div>
            : Array.from(groups.entries()).map(([group, list]) => (
                <div key={group || "_"} className="ds-cmdk__group">
                  {group && <div className="ds-cmdk__group-label">{group}</div>}
                  {list.map((it) => {
                    const idx = flatIdx++;
                    const isActive = idx === active;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={["ds-cmdk__item", isActive ? "ds-cmdk__item--active" : ""].filter(Boolean).join(" ")}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => { it.onSelect(); onClose(); }}
                      >
                        {it.icon && <span className="ds-cmdk__icon" aria-hidden="true">{it.icon}</span>}
                        <span className="ds-cmdk__label">{it.label}</span>
                        {it.description && <span className="ds-cmdk__desc">{it.description}</span>}
                        {it.shortcut && <kbd className="ds-kbd ds-cmdk__shortcut">{it.shortcut}</kbd>}
                      </button>
                    );
                  })}
                </div>
              ))}
        </div>
        <div className="ds-cmdk__footer">
          <span><kbd className="ds-kbd">↑↓</kbd> navigate</span>
          <span><kbd className="ds-kbd">⏎</kbd> select</span>
          <span><kbd className="ds-kbd">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
