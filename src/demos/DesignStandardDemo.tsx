import React, { useState } from "react";
import "../../plugins/building-blocks/skills/design-standard/files/globals.css";
import "../../plugins/building-blocks/skills/design-standard/files/themes.css";
import "../doc.css";
import {
  Button, Input, Label, HelpText, ErrorText,
  Card, CardTitle, CardDescription, Badge, Separator, Spinner, Skeleton,
  Switch, Checkbox, RadioGroup, RadioGroupItem,
  Tabs, TabsList, TabsTrigger, TabsContent, Tooltip,
  Dialog, DialogTitle, DialogDescription, DialogFooter, Select,
  DropdownMenu, DropdownMenuItem, DropdownMenuSeparator,
  ToastProvider, useToast,
  Slider, Progress, Avatar, AvatarGroup, Alert, Kbd, CodeBlock,
  Stack, Breadcrumbs, Pagination,
  LineChart, BarChart, AreaChart, Sparkline,
  Calendar,
  Drawer, DrawerHeader, DrawerBody, DrawerFooter,
  Accordion, AccordionItem, Stepper, CommandPalette,
  Field, NumberInput, SegmentedControl, Popover, HoverCard, Combobox, DatePicker,
  EmptyState, StatCard, DataTable, FileUpload, TagInput,
  TreeView, InlineEdit, ContextMenu, Resizable, Toolbar, ToggleGroup, Timeline, Banner, OtpInput,
  KanbanBoard, KanbanCardContent, NotificationCenter,
  ListIcon, ColumnsIcon, TableIcon,
} from "../../plugins/building-blocks/skills/design-standard/files/components";
import type { NotificationItem } from "../../plugins/building-blocks/skills/design-standard/files/components";
import type { KanbanColumn, KanbanCard, CardMoveEvent } from "../../plugins/building-blocks/skills/design-standard/files/components";

const THEMES = [
  ["slate", "#1c2024"], ["ocean", "#0d74ce"], ["forest", "#218358"], ["iris", "#5753c6"],
  ["terracotta", "#c2410c"], ["ruby", "#ca244d"], ["amber", "#ffc53d"], ["mono", "#000000"],
] as const;

const lbl = { fontSize: 12, fontWeight: 500, color: "var(--color-muted-foreground)", margin: "0 0 12px" } as const;
const row = (gap = 8) => ({ display: "flex", flexWrap: "wrap" as const, gap, alignItems: "center" });

// Font packs (families loaded via the Google Fonts <link> in index.html; Signal/Geist falls back to system).
const FONT_PACKS: { id: string; label: string; body: string; display: string }[] = [
  { id: "signal", label: "Signal", body: "Geist, ui-sans-serif, system-ui, -apple-system, sans-serif", display: "Geist, ui-sans-serif, system-ui, sans-serif" },
  { id: "broadsheet", label: "Broadsheet", body: '"Source Serif 4", Georgia, Cambria, serif', display: "Fraunces, ui-serif, Georgia, serif" },
  { id: "marshmallow", label: "Marshmallow", body: 'Nunito, ui-rounded, "Segoe UI", system-ui, sans-serif', display: "Quicksand, ui-rounded, system-ui, sans-serif" },
  { id: "terminal", label: "Terminal", body: "Inter, ui-sans-serif, system-ui, sans-serif", display: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif' },
  { id: "charter", label: "Charter", body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif', display: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "megaphone", label: "Megaphone", body: "Inter, ui-sans-serif, system-ui, sans-serif", display: "Sora, ui-sans-serif, system-ui, sans-serif" },
];
const fontPack = (id: string) => FONT_PACKS.find((f) => f.id === id) ?? FONT_PACKS[0];

// Curated "starter standards" — each sets colour + font + density at once.
const PRESETS: { name: string; theme: string; font: string; density: Density; note: string }[] = [
  { name: "Clean & calm", theme: "slate", font: "signal", density: "spacious", note: "content, marketing, calm apps" },
  { name: "Dashboard", theme: "slate", font: "signal", density: "compact", note: "data tables, analytics, ops" },
  { name: "Warm editorial", theme: "terracotta", font: "broadsheet", density: "spacious", note: "blogs, docs, human-AI" },
  { name: "Bold startup", theme: "iris", font: "megaphone", density: "default", note: "landing pages, launches" },
  { name: "Friendly", theme: "forest", font: "marshmallow", density: "default", note: "consumer, education, family" },
  { name: "Corporate", theme: "ocean", font: "charter", density: "default", note: "fintech, enterprise, gov" },
];

// CSS custom properties for a font pack — spread into a wrapper's style so the subtree re-skins.
const fontVars = (id: string): React.CSSProperties => {
  const f = fontPack(id);
  return { ["--font-sans" as any]: f.body, ["--font-display" as any]: f.display };
};

function seedNotifications(): NotificationItem[] {
  const now = Date.now();
  return [
    { id: "n1", group: "Today", severity: "critical", title: "Filing overdue: 1702Q", body: "Princess Ventures Q3 statutory deadline passed.", timestamp: now - 7 * 60 * 1000, actionLabel: "Open obligation", onAction: () => {} },
    { id: "n2", group: "Today", severity: "success", title: "Invoice 0012 filed", body: "Cathlyn marked it complete with proof of filing.", timestamp: now - 52 * 60 * 1000 },
    { id: "n3", group: "Today", severity: "info", title: "Jaz mentioned you", body: "“Can you review the Beacon Co engagement letter?”", timestamp: now - 3 * 60 * 60 * 1000, read: true },
    { id: "n4", group: "Earlier", severity: "warning", title: "Storage at 92%", body: "Archive older documents to free space.", timestamp: now - 28 * 60 * 60 * 1000 },
    { id: "n5", group: "Earlier", severity: "info", title: "Nightly backup completed", timestamp: now - 30 * 60 * 60 * 1000, read: true },
  ];
}

export function DesignStandardDemo() {
  return (
    <ToastProvider>
      <DemoInner />
    </ToastProvider>
  );
}

// Inline-code style used across the install copy (token-driven so it re-skins).
const icode: React.CSSProperties = { background: "var(--color-muted)", borderRadius: 4, padding: "1px 6px", fontFamily: "ui-monospace, monospace", fontSize: "0.85em" };
const strong = (s: React.ReactNode) => <strong style={{ color: "var(--color-foreground)", fontWeight: 600 }}>{s}</strong>;

/** Quick-start panel — token-based so it re-skins with the theme (incl. dark mode). */
function InstallPanel() {
  const [copied, setCopied] = React.useState(false);
  const installCmd =
    'T=$(mktemp -d); curl -fsSL https://github.com/vinsanitycoder/claude-building-blocks/archive/refs/heads/main.tar.gz | tar -xz -C "$T" && mkdir -p ~/.claude/skills && for s in design-standard ai-model-settings data-importer team-activity; do rm -rf ~/.claude/skills/$s; cp -R "$T/claude-building-blocks-main/plugins/building-blocks/skills/$s" ~/.claude/skills/$s; done && rm -rf "$T" && echo "✅ Done — fully quit Claude (Cmd+Q) and reopen."';
  const cmds = `/plugin marketplace add vinsanitycoder/claude-building-blocks
/plugin install building-blocks@team-blocks`;
  const settings = `{
  "extraKnownMarketplaces": {
    "team-blocks": {
      "source": { "source": "github", "repo": "vinsanitycoder/claude-building-blocks" }
    }
  },
  "enabledPlugins": ["building-blocks@team-blocks"]
}`;
  async function copyApply() {
    try { await navigator.clipboard.writeText("Apply our base design standard."); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }
  const para: React.CSSProperties = { fontSize: 14, lineHeight: 1.55, color: "var(--color-muted-foreground)" };
  return (
    <Stack gap={5}>
      <div>
        <p style={{ ...para, marginBottom: 12 }}>
          Open {strong("Terminal")}, paste this and press Enter — it installs the skills into <code style={icode}>~/.claude/skills/</code> (read by both the Claude desktop app and the CLI). Then {strong("fully quit Claude (Cmd+Q) and reopen")}.
        </p>
        <CodeBlock filename="Terminal" copyable code={installCmd}>{installCmd}</CodeBlock>
        <p style={{ ...para, fontSize: 12, marginTop: 8 }}>
          No Git needed — <code style={icode}>curl</code> ships with macOS. After reopening, ask Claude “what skills do you have?” — you should see {strong("design-standard")}.
        </p>
      </div>

      <div>
        <p className="ds-doc__subhead">Once it's installed</p>
        <p style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span>On any project, ask Claude:</span>
          <code style={icode}>"Apply our base design standard."</code>
          <Button size="sm" variant="ghost" onClick={copyApply}>{copied ? "Copied ✓" : "Copy"}</Button>
        </p>
        <p style={{ ...para, fontSize: 13, marginTop: 6 }}>
          Optionally layer a brand on top: <code style={icode}>"Apply the zhenhub brand."</code> — a brand overrides only colour, font, logo, and corner-roundness.
        </p>
      </div>

      <Accordion>
        <AccordionItem id="cli" title="CLI-only alternatives (terminal Claude Code)">
          <Stack gap={4}>
            <div>
              <p style={{ ...para, fontSize: 13, marginBottom: 8 }}>{strong("A. Slash commands")} — if your Claude Code accepts <code style={icode}>/plugin</code> (the terminal CLI does; desktop/IDE does not), paste these one at a time:</p>
              <CodeBlock copyable code={cmds}>{cmds}</CodeBlock>
            </div>
            <div>
              <p style={{ ...para, fontSize: 13, marginBottom: 8 }}>{strong("B. Edit settings.json")} — merge these keys into <code style={icode}>~/.claude/settings.json</code> (create it with <code style={icode}>{"{}"}</code> if missing), then quit + reopen:</p>
              <CodeBlock filename="~/.claude/settings.json" copyable code={settings}>{settings}</CodeBlock>
            </div>
          </Stack>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}

const DENSITIES = ["default", "spacious", "compact"] as const;
type Density = (typeof DENSITIES)[number];

type NavItem = { id: string; title: string };
type NavGroup = { label: string; items: NavItem[] };
const NAV: NavGroup[] = [
  { label: "Get started", items: [
    { id: "install", title: "Install" },
    { id: "theme", title: "Theme & foundations" },
  ]},
  { label: "Components", items: [
    { id: "buttons", title: "Buttons" },
    { id: "forms", title: "Forms & inputs" },
    { id: "selection", title: "Selection & ranges" },
    { id: "overlays", title: "Overlays & menus" },
    { id: "navigation", title: "Navigation" },
    { id: "feedback", title: "Feedback & status" },
    { id: "data", title: "Data display" },
    { id: "charts", title: "Charts" },
    { id: "dates", title: "Dates" },
  ]},
  { label: "Patterns", items: [
    { id: "kanban", title: "Kanban board" },
    { id: "advanced", title: "Power components" },
  ]},
];

function DocSection({ id, title, desc, children }: { id: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={id} className="ds-doc__section">
      <div className="ds-doc__section-head">
        <h2 className="ds-doc__section-title">{title}</h2>
        <p className="ds-doc__section-desc">{desc}</p>
      </div>
      {children}
    </section>
  );
}
function Canvas({ children, plain }: { children: React.ReactNode; plain?: boolean }) {
  return <div className={plain ? "ds-doc__canvas ds-doc__canvas--plain" : "ds-doc__canvas"}>{children}</div>;
}
function Subhead({ children }: { children: React.ReactNode }) {
  return <p className="ds-doc__subhead">{children}</p>;
}

function DemoInner() {
  const [theme, setTheme] = useState<string>("slate");
  const [font, setFont] = useState<string>("signal");
  const [dark, setDark] = useState(false);
  const [density, setDensity] = useState<Density>("default");
  const [active, setActive] = useState<string>("install");
  // component state
  const [sw, setSw] = useState(true);
  const [ck, setCk] = useState(true);
  const [radio, setRadio] = useState("daily");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>(seedNotifications);
  const [slider, setSlider] = useState(62);
  const [page, setPage] = useState(3);
  const [date, setDate] = useState<string | null>("2026-06-15");
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({ start: "2026-06-16", end: "2026-06-20" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<string[]>(["spacing"]);
  const [qty, setQty] = useState(2);
  const [seg, setSeg] = useState("month");
  const [combo, setCombo] = useState("");
  const [pickDate, setPickDate] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(["design", "docs"]);
  const [emailErr, setEmailErr] = useState(false);
  const [treeSel, setTreeSel] = useState<string | null>("inv-1");
  const [acctName, setAcctName] = useState("Aurora Labs");
  const [view, setView] = useState<string | null>("board");
  const [otp, setOtp] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);
  const { toast } = useToast();

  const themeLabel = theme[0].toUpperCase() + theme.slice(1);
  const densityWord = density === "default" ? "comfortable (default)" : density;
  const standardPrompt = `Apply our base design standard with the ${themeLabel} colour group, the ${fontPack(font).label} font pack, and ${densityWord} density.`;
  const activePreset = PRESETS.find((p) => p.theme === theme && p.font === font && p.density === density);
  function applyPreset(p: (typeof PRESETS)[number]) { setTheme(p.theme); setFont(p.font); setDensity(p.density); }
  async function copyStandard() {
    try { await navigator.clipboard.writeText(standardPrompt); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  }
  const field = (n: React.ReactNode) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>{n}</span>;
  const chip = (activeChip: boolean, extra?: React.CSSProperties) => ({
    className: activeChip ? "ds-doc__chip ds-doc__chip--active" : "ds-doc__chip", style: extra,
  });

  const COUNTRIES = [
    "Australia", "Brazil", "Canada", "France", "Germany", "Japan", "Philippines", "Singapore", "United Kingdom", "United States",
  ].map((c) => ({ value: c.toLowerCase().replace(/\s+/g, "-"), label: c }));
  const TABLE_ROWS = [
    { name: "Aurora Labs", plan: "Scale", seats: 48, mrr: 7200, status: "Active" },
    { name: "Beacon Co", plan: "Team", seats: 12, mrr: 1440, status: "Active" },
    { name: "Cirrus", plan: "Free", seats: 3, mrr: 0, status: "Trial" },
    { name: "Delta Works", plan: "Scale", seats: 76, mrr: 11400, status: "Past due" },
  ];

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // scroll-spy — highlight the section nearest the top of the viewport
  React.useEffect(() => {
    const ids = NAV.flatMap((g) => g.items.map((i) => i.id));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive((vis[0].target as HTMLElement).id);
      },
      { rootMargin: "0px 0px -72% 0px", threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  function goTo(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={["ds-doc", dark ? "dark" : ""].filter(Boolean).join(" ")}
      data-theme={theme}
      data-density={density === "default" ? undefined : density}
      style={fontVars(font)}
    >
      <aside className="ds-doc__sidebar">
        <div className="ds-doc__brand">
          <span className="ds-doc__brand-mark">B</span>
          <span>
            <span className="ds-doc__brand-text" style={{ display: "block" }}>Building Blocks</span>
            <span className="ds-doc__brand-sub">Design standard</span>
          </span>
        </div>
        {NAV.map((g) => (
          <nav key={g.label} className="ds-doc__navgroup" aria-label={g.label}>
            <div className="ds-doc__navgroup-label">{g.label}</div>
            {g.items.map((it) => (
              <button
                key={it.id}
                className={["ds-doc__navlink", active === it.id ? "ds-doc__navlink--active" : ""].filter(Boolean).join(" ")}
                aria-current={active === it.id ? "true" : undefined}
                onClick={() => goTo(it.id)}
              >
                {it.title}
              </button>
            ))}
          </nav>
        ))}
      </aside>

      <main className="ds-doc__main">
        <div className="ds-doc__inner">
          {/* Hero */}
          <header className="ds-doc__hero">
            <div className="ds-doc__eyebrow">Base UI design standard</div>
            <h1 className="ds-doc__title">One foundation, every app on-brand.</h1>
            <p className="ds-doc__lede">
              A brand-agnostic structure layer — spacing, type, colour, motion, and {64}+ components — so every
              screen we ship feels considered and consistent. Pick a theme below; the whole page re-skins live.
            </p>
            <div className="ds-doc__hero-actions">
              <Button onClick={copyStandard}>{copied ? "Copied ✓" : "Copy this standard"}</Button>
              <Button variant="outline" onClick={() => goTo("install")}>Install</Button>
              <Avatar initials="VP" status="online" />
              <NotificationCenter
                align="end"
                items={notifs}
                onMarkRead={(id) => setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))}
                onMarkAllRead={() => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))}
                onItemClick={(it) => toast({ title: `Opened: ${String(it.title)}` })}
              />
            </div>
          </header>

          {/* Install */}
          <DocSection id="install" title="Install" desc="Add the plugin to Claude Code once; then ask Claude to apply the standard on any project.">
            <InstallPanel />
          </DocSection>

          {/* Theme & foundations */}
          <DocSection id="theme" title="Theme & foundations" desc="Colour group, font pack, density and mode are the only things a brand changes — structure stays frozen. Adjust them and watch every example below update.">
            <div className="ds-doc__themebar">
              <div className="ds-doc__dial">
                <span className="ds-doc__dial-label">Presets</span>
                {PRESETS.map((p) => (
                  <button key={p.name} onClick={() => applyPreset(p)} title={p.note} {...chip(activePreset?.name === p.name)}>{p.name}</button>
                ))}
              </div>
              <div className="ds-doc__dial">
                <span className="ds-doc__dial-label">Colour</span>
                {THEMES.map(([id, hex]) => (
                  <button key={id} onClick={() => setTheme(id)} {...chip(theme === id)}>
                    <span className="ds-doc__swatch" style={{ background: hex }} />{id}
                  </button>
                ))}
              </div>
              <div className="ds-doc__dial">
                <span className="ds-doc__dial-label">Font</span>
                {FONT_PACKS.map((f) => (
                  <button key={f.id} onClick={() => setFont(f.id)} {...chip(font === f.id, { fontFamily: f.display })}>{f.label}</button>
                ))}
              </div>
              <div className="ds-doc__dial">
                <span className="ds-doc__dial-label">Density</span>
                {DENSITIES.map((d) => (
                  <button key={d} onClick={() => setDensity(d)} {...chip(density === d)}>{d}</button>
                ))}
                <span style={{ width: 1, height: 16, background: "var(--color-border)", margin: "0 6px" }} />
                <button onClick={() => setDark(false)} {...chip(!dark)}>Light</button>
                <button onClick={() => setDark(true)} {...chip(dark)}>Dark</button>
              </div>
              <div className="ds-doc__themebar-foot">
                <Button size="sm" onClick={copyStandard}>{copied ? "Copied ✓" : "Copy this standard"}</Button>
                <code className="ds-doc__prompt">{standardPrompt}</code>
              </div>
            </div>
          </DocSection>

          {/* Buttons */}
          <DocSection id="buttons" title="Buttons" desc="Six variants and three sizes share one interaction cycle: hover lifts, press compresses, focus rings, loading and disabled built in.">
            <Canvas>
              <div style={{ ...row(), marginBottom: 12 }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div style={row()}>
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button loading>Saving</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Canvas>
          </DocSection>

          {/* Forms & inputs */}
          <DocSection id="forms" title="Forms & inputs" desc="Inputs, selects, and the Field wrapper bind label + control + help/error with the right proximity. Short fields are sized to their content, not stretched full-width.">
            <Canvas>
              <Subhead>Inputs &amp; select</Subhead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
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
                  <Label htmlFor="d-sel">Plan</Label>
                  <Select id="d-sel" defaultValue="pro" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }, { value: "team", label: "Team" }]} />
                </div>
              </div>
              <Subhead>Field wrapper · combobox · date · number · tags</Subhead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "var(--stack-group)" }}>
                <Field label="Work email" help="We'll only use this for billing." error={emailErr ? "Enter a valid email address." : undefined}>
                  <Input placeholder="you@company.com" onBlur={(e) => setEmailErr(!!e.target.value && !e.target.value.includes("@"))} />
                </Field>
                <Field label="Country"><Combobox options={COUNTRIES} value={combo} onValueChange={setCombo} placeholder="Select country" /></Field>
                <Field label="Renewal date"><DatePicker value={pickDate} onChange={setPickDate} /></Field>
                <Field label="Seats" help="Sized to its content."><NumberInput value={qty} onValueChange={setQty} min={1} max={99} /></Field>
              </div>
              <Subhead>Tag input</Subhead>
              <TagInput value={tags} onChange={setTags} placeholder="Add a tag…" />
            </Canvas>
          </DocSection>

          {/* Selection & ranges */}
          <DocSection id="selection" title="Selection & ranges" desc="Switches, checkboxes, radios, segmented controls, and sliders — every actionable control shares the same hover / press / focus states.">
            <Canvas>
              <div style={{ ...row(24), marginBottom: 24 }}>
                {field(<><Switch checked={sw} onCheckedChange={setSw} aria-label="Notifications" /> Switch</>)}
                {field(<><Checkbox checked={ck} onCheckedChange={setCk} aria-label="Accept" /> Checkbox</>)}
                {field(<><Checkbox indeterminate aria-label="Some selected" /> Indeterminate</>)}
                <RadioGroup value={radio} onValueChange={setRadio} style={{ display: "flex", gap: 14 }}>
                  {field(<><RadioGroupItem value="daily" /> Daily</>)}
                  {field(<><RadioGroupItem value="weekly" /> Weekly</>)}
                </RadioGroup>
                <SegmentedControl value={seg} onValueChange={setSeg} aria-label="Range"
                  options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
                <div>
                  <Label>Budget: ${(slider * 100).toLocaleString()}</Label>
                  <Slider value={slider} onValueChange={setSlider} showValueTooltip formatValue={(n) => `$${(n * 100).toLocaleString()}`} />
                </div>
                <div>
                  <Label>Upload progress</Label>
                  <Progress value={70} />
                  <HelpText>70% — 14 of 20 files</HelpText>
                </div>
              </div>
            </Canvas>
          </DocSection>

          {/* Overlays & menus */}
          <DocSection id="overlays" title="Overlays & menus" desc="Dropdowns, dialogs, popovers, hover cards, drawers, the command palette and right-click menus — all anchored, dismissible, and keyboard-operable.">
            <Canvas>
              <div style={{ ...row(), marginBottom: 16 }}>
                <DropdownMenu trigger={<Button variant="outline">Options ▾</Button>}>
                  <DropdownMenuItem onSelect={() => toast({ title: "Profile" })}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast({ title: "Settings" })}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onSelect={() => toast({ title: "Deleted", variant: "destructive" })}>Delete account</DropdownMenuItem>
                </DropdownMenu>
                <Button variant="outline" onClick={() => setOpen(true)}>Open dialog</Button>
                <Popover trigger={<Button variant="outline">Filters</Button>}>
                  <Stack gap={3}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Filter results</div>
                    <div><Label>Status</Label><Input placeholder="Any" /></div>
                    <Button size="sm">Apply</Button>
                  </Stack>
                </Popover>
                <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                <Button variant="outline" onClick={() => setCmdOpen(true)}>Command palette ⌘K</Button>
              </div>
              <div style={{ ...row(24), alignItems: "center" }}>
                <Tooltip content="A one-line label"><span tabIndex={0} style={{ borderBottom: "1px dotted var(--color-muted-foreground)", cursor: "help", fontSize: 14, outline: "none" }}>Hover for tooltip</span></Tooltip>
                <HoverCard trigger={<a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--color-primary)" }}>@aurora</a>}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Avatar initials="AL" status="online" />
                    <div><div style={{ fontWeight: 600 }}>Aurora Labs</div><div style={{ color: "var(--color-muted-foreground)", fontSize: 13 }}>Scale plan · 48 seats</div></div>
                  </div>
                </HoverCard>
                <ContextMenu items={[{ id: "open", label: "Open" }, { id: "rename", label: "Rename", shortcut: "F2" }, "separator", { id: "del", label: "Delete", destructive: true, shortcut: "⌫", onSelect: () => toast({ title: "Deleted" }) }]}>
                  <span style={{ fontSize: 14, padding: "6px 10px", border: "1px dashed var(--color-border)", borderRadius: 8, cursor: "context-menu" }}>Right-click me</span>
                </ContextMenu>
                <Button variant="outline" onClick={() => toast({ title: "Changes saved", description: "Your edits are live.", variant: "success" })}>Toast: success</Button>
                <Button variant="outline" onClick={() => toast({ title: "Couldn't connect", description: "Check your network.", variant: "destructive" })}>Toast: error</Button>
              </div>
            </Canvas>
          </DocSection>

          {/* Navigation */}
          <DocSection id="navigation" title="Navigation" desc="Tabs, breadcrumbs, pagination, the multi-step wizard, and a roving-focus toolbar.">
            <Canvas>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview"><span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Peer views switch in place under a sliding underline.</span></TabsContent>
                <TabsContent value="activity"><span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>A feed of recent changes would render here.</span></TabsContent>
                <TabsContent value="settings"><span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Configuration controls live here.</span></TabsContent>
              </Tabs>
              <Separator />
              <Stack gap={4} style={{ marginBottom: 8 }}>
                <Breadcrumbs items={[{ label: "Home", href: "#" }, { label: "Projects", href: "#" }, { label: "Apollo" }]} />
                <Pagination page={page} totalPages={10} onPageChange={setPage} />
                <Stepper current={1} steps={[{ label: "Account", description: "Email + password" }, { label: "Details", description: "Tell us about you" }, { label: "Preferences" }, { label: "Done" }]} />
                <Toolbar aria-label="View options">
                  <ToggleGroup aria-label="Layout" value={view} onValueChange={(v) => setView(v as string)}
                    options={[
                      { value: "list", label: <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ListIcon /> List</span> },
                      { value: "board", label: <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ColumnsIcon /> Board</span> },
                      { value: "table", label: <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><TableIcon /> Table</span> },
                    ]} />
                  <Separator orientation="vertical" style={{ height: 24 }} />
                  <ToggleGroup type="multiple" aria-label="Format" size="sm" defaultValue={["bold"]}
                    options={[
                      { value: "bold", label: <span style={{ fontWeight: 700 }}>B</span>, "aria-label": "Bold" },
                      { value: "italic", label: <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>I</span>, "aria-label": "Italic" },
                      { value: "underline", label: <span style={{ textDecoration: "underline" }}>U</span>, "aria-label": "Underline" },
                    ]} />
                </Toolbar>
              </Stack>
            </Canvas>
          </DocSection>

          {/* Feedback & status */}
          <DocSection id="feedback" title="Feedback & status" desc="Inline alerts, the full-bleed banner, badges, and async states — severity always pairs colour with an icon, never colour alone.">
            <Canvas>
              {bannerOpen && (
                <Banner variant="warning" title="Sample data." actions={<Button size="sm" variant="outline">Import yours</Button>} onDismiss={() => setBannerOpen(false)} style={{ marginBottom: 20 }}>
                  This board is showing demo records. Connect a source to see live data.
                </Banner>
              )}
              <Stack gap={2} style={{ marginBottom: 20 }}>
                <Alert variant="info" title="Heads up.">This is an informational callout that stays in the page.</Alert>
                <Alert variant="success" title="Saved." onDismiss={() => toast({ title: "Dismissed" })}>Your changes were published successfully.</Alert>
                <Alert variant="warning" title="Almost full">Storage at 92%. Consider archiving older items.</Alert>
                <Alert variant="destructive" title="Couldn't connect.">Check your network and try again.</Alert>
              </Stack>
              <Subhead>Badges &amp; async states</Subhead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, alignItems: "start" }}>
                <Card interactive>
                  <CardTitle>Project settings</CardTitle>
                  <CardDescription>Hover me — shadow + lift.</CardDescription>
                  <div style={{ marginTop: 14, ...row() }}>
                    <Badge variant="success">Active</Badge>
                    <Badge variant="warning">Pending</Badge>
                    <Badge variant="destructive">Failed</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </Card>
                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Spinner />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <Skeleton style={{ height: 10, width: "100%" }} />
                      <Skeleton style={{ height: 10, width: "70%" }} />
                    </div>
                  </div>
                </Card>
                <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
                  <EmptyState title="No invoices yet" description="They appear once your first cycle closes." action={<Button size="sm">Create invoice</Button>} />
                </div>
              </div>
            </Canvas>
          </DocSection>

          {/* Data display */}
          <DocSection id="data" title="Data display" desc="Metric cards, a sortable table, hierarchy tree, activity timeline, avatars, and code — the surfaces a dashboard is built from.">
            <Canvas>
              <Subhead>Metric cards</Subhead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
                <StatCard label="MRR" value="$20,040" delta="12%" trend="up" chart={<Sparkline data={[8, 9, 11, 10, 13, 15, 20]} width={64} height={24} />} />
                <StatCard label="Active seats" value="139" delta="8" trend="up" />
                <StatCard label="Churn" value="2.1%" delta="0.4%" trend="up" upIsGood={false} />
                <StatCard label="Trials" value="6" delta="flat" trend="flat" />
              </div>
              <Subhead>Sortable table</Subhead>
              <div style={{ marginBottom: 24 }}>
                <DataTable rows={TABLE_ROWS} rowKey={(r) => r.name} density="compact"
                  columns={[
                    { key: "name", header: "Account", sortable: true },
                    { key: "plan", header: "Plan", sortable: true },
                    { key: "seats", header: "Seats", align: "right", sortable: true },
                    { key: "mrr", header: "MRR", align: "right", sortable: true, cell: (r) => `$${r.mrr.toLocaleString()}` },
                    { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "Past due" ? "destructive" : r.status === "Trial" ? "warning" : "success"}>{r.status}</Badge> },
                  ]} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24, alignItems: "start" }}>
                <div>
                  <Subhead>Tree · right-click a row</Subhead>
                  <ContextMenu items={[{ id: "open", label: "Open" }, { id: "rename", label: "Rename", shortcut: "F2" }, "separator", { id: "del", label: "Delete", destructive: true, onSelect: () => toast({ title: "Deleted" }) }]}>
                    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
                      <TreeView aria-label="Documents" defaultExpanded={["clients", "aurora"]} selectedId={treeSel ?? undefined} onSelect={setTreeSel}
                        nodes={[{ id: "clients", label: "Clients", children: [{ id: "aurora", label: "Aurora Labs", children: [{ id: "inv-1", label: "Invoice 0012.pdf" }, { id: "inv-2", label: "Engagement letter.pdf" }] }, { id: "beacon", label: "Beacon Co", children: [{ id: "inv-3", label: "COR 2303.pdf" }] }] }, { id: "templates", label: "Templates" }]} />
                    </div>
                  </ContextMenu>
                </div>
                <div>
                  <Subhead>Timeline</Subhead>
                  <Timeline items={[
                    { id: "1", tone: "success", title: "Invoice 0012 filed", time: "2:14 PM" },
                    { id: "2", tone: "default", title: "Reviewed by Cathlyn", time: "1:02 PM", description: "Approved with no changes." },
                    { id: "3", tone: "warning", title: "Marked due-soon", time: "Yesterday" },
                    { id: "4", tone: "muted", title: "Created from template", time: "Mon" },
                  ]} />
                  <Subhead>Avatars · kbd · code</Subhead>
                  <AvatarGroup max={3}><Avatar initials="AT" status="online" /><Avatar initials="MR" /><Avatar initials="JL" /><Avatar initials="SK" /><Avatar initials="VR" /></AvatarGroup>
                  <div style={{ fontSize: 14, margin: "12px 0" }}>Open with <Kbd keys={["⌘", "K"]} /> · Save <Kbd keys={["⌘", "S"]} /> · Quit <Kbd>Esc</Kbd></div>
                  <CodeBlock filename="globals.css" copyable code={":root {\n  --radius: 0.625rem;\n  --color-primary: #1c2024;\n}"}>{":root {\n  --radius: 0.625rem;\n  --color-primary: #1c2024;\n}"}</CodeBlock>
                </div>
              </div>
            </Canvas>
          </DocSection>

          {/* Charts */}
          <DocSection id="charts" title="Charts" desc="Pure-SVG charts with hover tooltips. Single-series charts and sparklines follow the brand; multi-series uses the colourblind-safe Okabe-Ito palette.">
            <Canvas>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
                <LineChart width={360} height={200} labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} series={[{ name: "Revenue", data: [120, 180, 150, 220, 260] }, { name: "Cost", data: [90, 110, 130, 150, 170] }]} />
                <BarChart width={360} height={200} labels={["Q1", "Q2", "Q3", "Q4"]} series={[{ name: "2025", data: [4, 8, 6, 11] }, { name: "2026", data: [6, 10, 9, 14] }]} />
                <AreaChart width={360} height={200} labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} series={[{ name: "Users", data: [100, 140, 180, 170, 240, 290] }]} />
                <Stack gap={2}>
                  <span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Inline sparklines:</span>
                  <span style={{ fontSize: 14 }}>Revenue 42.1k <Sparkline data={[3, 5, 4, 7, 8, 6, 9, 11]} /></span>
                  <span style={{ fontSize: 14 }}>Users 1,290 <Sparkline data={[5, 4, 6, 5, 8, 7, 9, 10]} color="var(--chart-2)" /></span>
                  <span style={{ fontSize: 14 }}>Errors 0.3% <Sparkline data={[9, 8, 6, 7, 4, 3, 2, 1]} color="var(--chart-3)" /></span>
                </Stack>
              </div>
            </Canvas>
          </DocSection>

          {/* Dates */}
          <DocSection id="dates" title="Dates" desc="A single-date and range calendar. Values are stored as zoneless ISO strings and displayed via Intl.">
            <Canvas>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <Stack gap={2}>
                  <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Single date</span>
                  <Calendar value={date} onChange={setDate} />
                </Stack>
                <Stack gap={2}>
                  <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Range</span>
                  <Calendar range={range} onRangeChange={setRange} />
                </Stack>
              </div>
            </Canvas>
          </DocSection>

          {/* Kanban */}
          <DocSection id="kanban" title="Kanban board" desc="Drag a card by its ⠿ handle — or keyboard: Tab to a handle, Space to lift, arrows to move, Space to drop. Colour-coded by priority, with WIP limits and live announcements.">
            <Canvas>
              <KanbanDemo />
            </Canvas>
          </DocSection>

          {/* Power components */}
          <DocSection id="advanced" title="Power components" desc="The heavier building blocks: resizable panes, click-to-edit, accordion, file upload, and a verification-code input.">
            <Canvas>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, marginBottom: 24 }}>
                <div>
                  <Subhead>Resizable panes · drag the divider</Subhead>
                  <Resizable defaultSize={42} min={20} max={75} aria-label="Documents and preview">
                    <div style={{ padding: 16, fontSize: 13, color: "var(--color-muted-foreground)" }}>Document list</div>
                    <div style={{ padding: 16, fontSize: 13, color: "var(--color-muted-foreground)" }}>Preview pane</div>
                  </Resizable>
                  <Subhead>Inline edit · click the value</Subhead>
                  <div style={{ fontSize: 14 }}>Account: <InlineEdit value={acctName} onSave={(v) => { setAcctName(v); toast({ title: "Saved" }); }} /></div>
                  <Subhead>Verification code</Subhead>
                  <OtpInput length={6} value={otp} onChange={setOtp} onComplete={(c) => toast({ title: `Code: ${c}` })} />
                </div>
                <div>
                  <Subhead>File upload</Subhead>
                  <FileUpload accept="image/png,image/jpeg,.pdf" maxSize={15 * 1024 * 1024} hint="PNG, JPG or PDF · up to 15MB"
                    onFiles={(f) => toast({ title: `Selected ${f[0]?.name}` })} onReject={(b) => toast({ title: b[0]?.reason ?? "Rejected", variant: "destructive" })} />
                  <Subhead>Accordion</Subhead>
                  <Accordion open={accordionOpen} onOpenChange={setAccordionOpen} multiple>
                    <AccordionItem id="spacing" title="What's frozen in the base?">Spacing, type scale, button sizes, motion, dark-mode mechanism, and component anatomy — all fixed.</AccordionItem>
                    <AccordionItem id="brand" title="What can a brand override?">Only colour tokens, the font pack, the logo, and optionally the single <code>--radius</code> value.</AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Canvas>
          </DocSection>
        </div>
      </main>

      {/* overlays */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogDescription>This can't be undone. All data is removed.</DialogDescription>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { setOpen(false); toast({ title: "Project deleted", variant: "destructive" }); }}>Delete</Button>
        </DialogFooter>
      </Dialog>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" size="md">
        <DrawerHeader>Filter results</DrawerHeader>
        <DrawerBody>
          <Stack gap={4}>
            <div><Label>Status</Label><Input placeholder="Any" /></div>
            <div><Label>Assignee</Label><Input placeholder="Anyone" /></div>
            <div><Label>Tag</Label><Input placeholder="design, docs…" /></div>
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Clear</Button>
          <Button onClick={() => setDrawerOpen(false)}>Apply</Button>
        </DrawerFooter>
      </Drawer>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} items={[
        { id: "n", group: "Navigation", label: "Go to dashboard", shortcut: "G D", onSelect: () => toast({ title: "Dashboard" }) },
        { id: "p", group: "Navigation", label: "Go to projects", shortcut: "G P", onSelect: () => toast({ title: "Projects" }) },
        { id: "s", group: "Settings", label: "Open settings", shortcut: "⌘,", onSelect: () => toast({ title: "Settings" }) },
        { id: "t", group: "Settings", label: "Toggle theme", onSelect: () => toast({ title: "Theme toggled" }) },
        { id: "h", group: "Help", label: "Read the docs", onSelect: () => toast({ title: "Docs" }) },
      ]} />
    </div>
  );
}

function KanbanDemo() {
  const initialCards: Record<string, KanbanCard> = {
    c1: { id: "c1", title: "Wire OAuth callback", desc: "Reps re-connect Outlook; needs Mail.Read scope before the next send.", tag: "Eng", priority: "High", points: 3, who: "VP" },
    c2: { id: "c2", title: "Q3 invoice batch", desc: "Generate + attach the 12 multi-destination proposals for review.", tag: "Finance", priority: "Med", points: 2, who: "CT" },
    c3: { id: "c3", title: "Onboard Beacon Co", desc: "Tick registered tax types, generate the draft obligation set.", tag: "Ops", priority: "Low", points: 5, who: "JZ" },
    c4: { id: "c4", title: "Fix timezone bug", desc: "Calendar dates drifting a day west of UTC — store ISO, zoneless.", tag: "Eng", priority: "High", points: 2, who: "VP" },
    c5: { id: "c5", title: "Draft engagement letter", tag: "Legal", priority: "Med", points: 1, who: "CT" },
    c6: { id: "c6", title: "Reconcile R2 backups", desc: "Verify nightly Neon→R2 dumps for the last 7 days.", tag: "Ops", priority: "Low", points: 3, who: "JZ" },
  };
  const [cards] = React.useState(initialCards);
  const [columns, setColumns] = React.useState<KanbanColumn[]>([
    { id: "todo", title: "To do", cardIds: ["c1", "c2", "c3"] },
    { id: "doing", title: "In progress", cardIds: ["c4", "c5"], wipLimit: 2 },
    { id: "done", title: "Done", cardIds: ["c6"] },
  ]);

  function move(e: CardMoveEvent) {
    setColumns((cols) => {
      // remove from source, insert into target at toIndex
      const stripped = cols.map((c) => ({ ...c, cardIds: c.cardIds.filter((id) => id !== e.cardId) }));
      return stripped.map((c) =>
        c.id === e.toColumnId
          ? { ...c, cardIds: [...c.cardIds.slice(0, e.toIndex), e.cardId, ...c.cardIds.slice(e.toIndex)] }
          : c
      );
    });
  }

  const tagColor: Record<string, string> = { Eng: "var(--chart-2)", Finance: "var(--chart-1)", Ops: "var(--chart-3)", Legal: "var(--chart-4)" };
  const priorityColor: Record<string, string> = { High: "var(--color-destructive)", Med: "var(--color-warning)", Low: "var(--color-success)" };

  return (
    <KanbanBoard
      columns={columns}
      cards={cards}
      onCardMove={move}
      accentPosition="left"
      cardAccent={(card) => priorityColor[String(card.priority)]}
      renderCard={(card) => (
        <KanbanCardContent
          labels={[{ color: tagColor[String(card.tag)] ?? "var(--color-muted-foreground)", label: String(card.tag) }]}
          title={String(card.title)}
          description={card.desc ? String(card.desc) : undefined}
          meta={
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: priorityColor[String(card.priority)] }} />
                {String(card.priority)}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontVariantNumeric: "tabular-nums" }}>
                {String(card.points)} pts
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 999, background: "var(--color-muted)", color: "var(--color-foreground)", fontSize: 10, fontWeight: 600 }}>{String(card.who)}</span>
              </span>
            </>
          }
        />
      )}
    />
  );
}
