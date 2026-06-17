import "../components.css";
import * as React from "react";

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Right-aligned actions (buttons, avatar, etc.). */
  actions?: React.ReactNode;
  /** Left-aligned brand/logo area. */
  brand?: React.ReactNode;
  sticky?: boolean;
}

/** App top bar — 64px desktop default, sticky-able. */
export function TopBar({ brand, actions, sticky, className = "", children, style, ...rest }: TopBarProps) {
  return (
    <header
      className={["ds-topbar", sticky ? "ds-topbar--sticky" : "", className].filter(Boolean).join(" ")}
      style={style}
      {...rest}
    >
      {brand && <div className="ds-topbar__brand">{brand}</div>}
      <div className="ds-topbar__center">{children}</div>
      {actions && <div className="ds-topbar__actions">{actions}</div>}
    </header>
  );
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Collapsed (icon-only rail) vs expanded. */
  collapsed?: boolean;
}

/** Left navigation sidebar. Expanded = 256px; collapsed/rail = 56px (token-driven). */
export function Sidebar({ collapsed, className = "", style, ...rest }: SidebarProps) {
  return (
    <aside
      className={["ds-sidebar", collapsed ? "ds-sidebar--collapsed" : "", className].filter(Boolean).join(" ")}
      style={style}
      {...rest}
    />
  );
}

export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
}

/** Nav item. Renders a <button> by default; pass `as="a"` (or asChild via render) for routed links —
 *  the foundation resets anchor styling on `.ds-sidebar__item`. Always pass `title` so the label shows
 *  as a tooltip when the rail is collapsed. */
export function SidebarItem({ icon, active, className = "", children, ...rest }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={["ds-sidebar__item", active ? "ds-sidebar__item--active" : "", className].filter(Boolean).join(" ")}
      aria-current={active ? "page" : undefined}
      {...rest}
    >
      {icon && <span className="ds-sidebar__icon" aria-hidden="true">{icon}</span>}
      <span className="ds-sidebar__label">{children}</span>
    </button>
  );
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small section label (hidden automatically when the rail is collapsed). */
  label?: React.ReactNode;
}

/** Group of SidebarItems with an optional small uppercase label. */
export function SidebarGroup({ label, className = "", children, ...rest }: SidebarGroupProps) {
  return (
    <div className={["ds-sidebar__group", className].filter(Boolean).join(" ")} {...rest}>
      {label != null && <div className="ds-sidebar__group-label">{label}</div>}
      {children}
    </div>
  );
}

const PanelIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" />
  </svg>
);

/** Small, low-key collapse toggle (chrome icon button, not a chunky filled button). */
export function SidebarToggle({ collapsed, className = "", ...rest }: { collapsed?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={["ds-iconbtn", className].filter(Boolean).join(" ")}
      aria-label={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
      title={collapsed ? "Expand (⌘B)" : "Collapse (⌘B)"}
      {...rest}
    >
      {PanelIcon}
    </button>
  );
}

/** Self-contained collapse state for the Sidebar: persists to localStorage and toggles on ⌘B / Ctrl+B.
 *  `const { collapsed, toggle } = useSidebarCollapse();` then `<Sidebar collapsed={collapsed}>`. */
export function useSidebarCollapse(storageKey = "ds-sidebar-collapsed") {
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    try { setCollapsed(localStorage.getItem(storageKey) === "1"); } catch { /* ignore */ }
  }, [storageKey]);
  const toggle = React.useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(storageKey, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  }, [storageKey]);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); toggle(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
  return { collapsed, toggle, setCollapsed };
}

/** Convenience layout: TopBar + Sidebar + main content. Use for full app shells. */
export function AppShell({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="ds-shell" style={style} {...rest}>{children}</div>;
}

export function ShellMain({ className = "", ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <main className={["ds-shell__main", className].filter(Boolean).join(" ")} {...rest} />;
}
