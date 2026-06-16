import "../components.css";
import * as React from "react";

export interface ContextMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuProps {
  /** The element that opens the menu on right-click / long-press. */
  children: React.ReactNode;
  items: (ContextMenuItem | "separator")[];
}

/** Right-click (or long-press) menu anchored at the pointer. role="menu", keyboard nav (↑/↓/Enter/Esc),
 *  outside-click closes. Pair with a visible affordance elsewhere for discoverability. Reuses the
 *  shared .ds-dd menu item styling. */
export function ContextMenu({ children, items }: ContextMenuProps) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = React.useState(-1);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const selectable = items.filter((i): i is ContextMenuItem => i !== "separator" && !i.disabled);

  function open(x: number, y: number) {
    // clamp into viewport (panel ~ 220x given count)
    const pad = 8, w = 220, h = items.length * 36 + 8;
    setPos({ x: Math.min(x, window.innerWidth - w - pad), y: Math.min(y, window.innerHeight - h - pad) });
    setActive(-1);
  }
  function close() { setPos(null); setActive(-1); }

  React.useEffect(() => {
    if (!pos) return;
    const onDoc = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) close(); };
    const onScroll = () => close();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    setTimeout(() => menuRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [pos]);

  function run(item: ContextMenuItem) { if (!item.disabled) { item.onSelect?.(); close(); } }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const idxInSel = selectable.findIndex((s) => s === selectableAt(active));
      let n = idxInSel + dir;
      if (n < 0) n = selectable.length - 1;
      if (n >= selectable.length) n = 0;
      setActive(items.indexOf(selectable[n]));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const it = selectableAt(active);
      if (it) run(it);
    }
  }
  function selectableAt(i: number): ContextMenuItem | null {
    const it = items[i];
    return it && it !== "separator" && !it.disabled ? it : null;
  }

  return (
    <>
      <div className="ds-ctxmenu__trigger" onContextMenu={(e) => { e.preventDefault(); open(e.clientX, e.clientY); }}>
        {children}
      </div>
      {pos && (
        <div
          ref={menuRef}
          className="ds-dd__panel ds-ctxmenu__panel"
          role="menu"
          tabIndex={-1}
          style={{ position: "fixed", top: pos.y, left: pos.x, minWidth: 200 }}
          onKeyDown={onKeyDown}
        >
          {items.map((it, i) =>
            it === "separator" ? (
              <hr key={`sep-${i}`} className="ds-dd__sep" />
            ) : (
              <button
                key={it.id}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                className={["ds-dd__item", it.destructive ? "ds-dd__item--destructive" : "", i === active ? "ds-dd__item--active" : ""].filter(Boolean).join(" ")}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(it)}
              >
                {it.icon && <span className="ds-dd__item-icon" aria-hidden="true">{it.icon}</span>}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.shortcut && <span className="ds-dd__item-shortcut">{it.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
}
