import "../components.css";
import * as React from "react";

interface TabsCtx { value: string; setValue: (v: string) => void; }
const Ctx = React.createContext<TabsCtx | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** Switch between peer views. Controlled (value) or uncontrolled (defaultValue). */
export function Tabs({ value, defaultValue, onValueChange, children, ...rest }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const setValue = (v: string) => { if (value === undefined) setInternal(v); onValueChange?.(v); };
  return <Ctx.Provider value={{ value: current, setValue }}><div {...rest}>{children}</div></Ctx.Provider>;
}

export function TabsList({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={["ds-tabs__list", className].filter(Boolean).join(" ")} {...rest} />;
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
export function TabsTrigger({ value, className = "", ...rest }: TabsTriggerProps) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={["ds-tab", active ? "ds-tab--active" : "", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
export function TabsContent({ value, className = "", ...rest }: TabsContentProps) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={["ds-tabs__content", className].filter(Boolean).join(" ")} {...rest} />;
}
