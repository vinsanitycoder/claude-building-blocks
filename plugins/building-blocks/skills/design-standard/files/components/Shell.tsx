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

/** Convenience layout: TopBar + Sidebar + main content. Use for full app shells. */
export function AppShell({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="ds-shell" style={style} {...rest}>{children}</div>;
}

export function ShellMain({ className = "", ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <main className={["ds-shell__main", className].filter(Boolean).join(" ")} {...rest} />;
}
