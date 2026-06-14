import { useState } from "react";
import "../../plugins/building-blocks/skills/design-standard/files/globals.css";
import "../../plugins/building-blocks/skills/design-standard/files/themes.css";
import {
  Button, Input, Label, HelpText, ErrorText,
  Card, CardTitle, CardDescription, Badge, Separator, Spinner, Skeleton,
} from "../../plugins/building-blocks/skills/design-standard/files/components";

const THEMES = [
  ["slate", "#1c2024"], ["ocean", "#0d74ce"], ["forest", "#218358"], ["iris", "#5753c6"],
  ["terracotta", "#c2410c"], ["ruby", "#ca244d"], ["amber", "#ffc53d"], ["mono", "#000000"],
] as const;

/** Live demo of the base design standard. Switch colour group + dark mode; the same components
 *  re-skin purely from the token layer. Hover/press the buttons and card to feel the state cycle. */
export function DesignStandardDemo() {
  const [theme, setTheme] = useState<string>("slate");
  const [dark, setDark] = useState(false);

  const chip = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-slate-400">Colour</span>
        {THEMES.map(([id, hex]) => (
          <button key={id} onClick={() => setTheme(id)} className={chip(theme === id)}>
            <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 999, background: hex, marginRight: 5, verticalAlign: "middle" }} />
            {id}
          </button>
        ))}
        <span className="mx-1" />
        <button onClick={() => setDark(false)} className={chip(!dark)}>Light</button>
        <button onClick={() => setDark(true)} className={chip(dark)}>Dark</button>
      </div>

      <div
        data-theme={theme}
        className={dark ? "dark" : ""}
        style={{
          background: "var(--color-background)", color: "var(--color-foreground)",
          fontFamily: "var(--font-sans)", border: "1px solid var(--color-border)",
          borderRadius: 14, padding: "20px 22px",
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-muted-foreground)", margin: "0 0 12px" }}>Buttons · variants, sizes, states</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>

        <Separator />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          <div>
            <Label htmlFor="d-email">Email</Label>
            <Input id="d-email" placeholder="you@example.com" />
            <HelpText>We never share it.</HelpText>
          </div>
          <div>
            <Label htmlFor="d-bad">Email</Label>
            <Input id="d-bad" defaultValue="bad@" error aria-describedby="d-bad-err" />
            <ErrorText id="d-bad-err">Enter a valid email.</ErrorText>
          </div>
          <div>
            <Label htmlFor="d-dis" optional>Company</Label>
            <Input id="d-dis" defaultValue="locked" disabled />
          </div>
        </div>

        <Separator />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, alignItems: "start" }}>
          <Card interactive>
            <CardTitle>Project settings</CardTitle>
            <CardDescription>Hover me — shadow + lift. Manage your workspace defaults.</CardDescription>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Button size="sm">Save</Button>
              <Button size="sm" variant="ghost">Cancel</Button>
            </div>
          </Card>
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <Badge>Default</Badge>
              <Badge variant="secondary">Neutral</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="destructive">Failed</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Spinner />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Skeleton style={{ height: 10, width: "100%" }} />
                <Skeleton style={{ height: 10, width: "70%" }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
