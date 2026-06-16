import React, { useState } from "react";
import "../../plugins/building-blocks/skills/design-standard/files/globals.css";
import "../../plugins/building-blocks/skills/design-standard/files/themes.css";
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
  KanbanBoard, KanbanCardContent,
} from "../../plugins/building-blocks/skills/design-standard/files/components";
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

export function DesignStandardDemo() {
  return (
    <ToastProvider>
      <DemoInner />
    </ToastProvider>
  );
}

/** Quick-start panel for colleagues opening the live URL. Plain English, copy-paste blocks. */
function InstallPanel() {
  const [copied, setCopied] = React.useState<string | null>(null);
  async function copy(label: string, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(null), 1500); } catch {}
  }
  // The one-paste install prompt — Claude has filesystem tools, so it can
  // create/merge ~/.claude/settings.json itself. No JSON editing for the user.
  const installPrompt = `Please install our team's design-standard plugin so I can use it on any project.

What I need you to do:
1. Open my Claude Code settings at ~/.claude/settings.json. Create the file with an empty JSON object {} if it does not exist.
2. Merge in (do NOT replace) these two keys, preserving every existing key:
   - "extraKnownMarketplaces": { "team-blocks": { "source": { "source": "github", "repo": "vinsanitycoder/claude-building-blocks" } } }
   - "enabledPlugins": ["building-blocks@team-blocks"]   (if the key already exists, ADD this entry to the array without removing the others)
3. Save the file.
4. Tell me to fully quit Claude Code (Cmd+Q on Mac, then reopen).
5. After I reopen, tell me how to verify it worked: I should be able to ask "what skills do you have available?" and see "design-standard" in the list.

The plugin repo is github.com/vinsanitycoder/claude-building-blocks. Marketplace name: team-blocks. Plugin name: building-blocks.`;
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
  const codeBox = "block w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-[12px] leading-5 font-mono text-slate-800 whitespace-pre-wrap overflow-x-auto";
  const codeBoxNoWrap = "block w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-[12px] leading-5 font-mono text-slate-800 whitespace-pre overflow-x-auto";
  const copyBtn = "absolute top-2 right-2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50";
  return (
    <div className="mb-5 rounded-xl border-2 border-slate-900 bg-white p-4">
      {/* HERO: one-paste install. The only thing colleagues should focus on first. */}
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-5 items-center rounded-full bg-slate-900 px-2 text-[10px] font-semibold uppercase tracking-wide text-white">Install</span>
        <h3 className="text-base font-semibold text-slate-900">One-paste install — Claude does it for you</h3>
      </div>
      <p className="mb-3 text-[13px] text-slate-600">
        Open Claude Code, start a new chat, and paste the message below. Claude has filesystem access and will create or merge your settings file for you — no terminal commands, no JSON editing. Claude will ask before changing the file, so you stay in control. After it finishes, <span className="font-medium text-slate-800">fully quit Claude Code (Cmd+Q on Mac) and reopen it</span>.
      </p>
      <div className="relative">
        <pre className={codeBox}>{installPrompt}</pre>
        <button
          className="absolute top-2 right-2 rounded-md bg-slate-900 px-3 py-1 text-[12px] font-semibold text-white hover:bg-slate-700"
          onClick={() => copy("prompt", installPrompt)}
        >
          {copied === "prompt" ? "Copied ✓" : "Copy prompt"}
        </button>
      </div>

      {/* USAGE — what to say after the plugin is installed. */}
      <div className="mt-4 border-t border-slate-100 pt-3 text-[13px] text-slate-800">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Once it's installed</div>
        <div className="space-y-2">
          <div>
            On any project, ask Claude:&nbsp;
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[12px]">"Apply our base design standard."</code>
            <button className="ml-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 hover:bg-slate-50" onClick={() => copy("apply", "Apply our base design standard.")}>
              {copied === "apply" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="text-slate-600">
            Optionally, layer a brand on top:&nbsp;
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[12px]">"Apply the zhenhub brand."</code>
            <span className="text-[12px]"> — brand overrides only colour, font, logo, and (optionally) corner-roundness.</span>
          </div>
        </div>
      </div>

      {/* ALTERNATIVES — collapsed so they don't distract the happy path. */}
      <details className="mt-3 text-[12px] text-slate-500">
        <summary className="cursor-pointer hover:text-slate-700">Prefer to install it yourself? Two manual paths</summary>
        <div className="mt-2">
          <div className="font-medium text-slate-700">A. Terminal slash commands</div>
          <div className="mt-1 text-slate-600">If your Claude Code accepts <code className="rounded bg-slate-100 px-1">/plugin</code> commands (the interactive terminal CLI does; the desktop / IDE app does not), paste these into a chat one at a time:</div>
          <div className="relative mt-1.5">
            <pre className={codeBoxNoWrap}>{cmds}</pre>
            <button className={copyBtn} onClick={() => copy("cmds", cmds)}>
              {copied === "cmds" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-medium text-slate-700">B. Edit settings.json by hand</div>
          <div className="mt-1 text-slate-600">Open <code className="rounded bg-slate-100 px-1">~/.claude/settings.json</code> (create it with <code className="rounded bg-slate-100 px-1">{"{}"}</code> if it doesn't exist) and merge these two keys into the top-level object, keeping any existing keys:</div>
          <div className="relative mt-1.5">
            <pre className={codeBoxNoWrap}>{settings}</pre>
            <button className={copyBtn} onClick={() => copy("settings", settings)}>
              {copied === "settings" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-1.5 text-slate-600">Save, then fully quit and reopen Claude Code.</div>
        </div>
      </details>

      <div className="mt-3 border-t border-slate-100 pt-2.5 text-[12px] text-slate-500">
        <span className="font-medium text-slate-700">What you're looking at below:</span> a live preview of every component in the standard. Pick a colour group or toggle dark mode — nothing else moves; only colour, type, and radius re-skin. That's the whole point: pick once, every app feels consistent.
      </div>
    </div>
  );
}

const DENSITIES = ["default", "spacious", "compact"] as const;
type Density = (typeof DENSITIES)[number];

function DemoInner() {
  const [theme, setTheme] = useState<string>("slate");
  const [font, setFont] = useState<string>("signal");
  const [dark, setDark] = useState(false);
  const [density, setDensity] = useState<Density>("default");
  const [sw, setSw] = useState(true);
  const [ck, setCk] = useState(true);
  const [radio, setRadio] = useState("daily");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const chip = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`;
  const field = (n: React.ReactNode) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>{n}</span>;

  // The selection a colleague takes away — a ready-to-paste instruction for Claude.
  const themeLabel = theme[0].toUpperCase() + theme.slice(1);
  const densityWord = density === "default" ? "comfortable (default)" : density;
  const standardPrompt =
    `Apply our base design standard with the ${themeLabel} colour group, the ${fontPack(font).label} font pack, and ${densityWord} density.`;
  const activePreset = PRESETS.find((p) => p.theme === theme && p.font === font && p.density === density);

  function applyPreset(p: (typeof PRESETS)[number]) { setTheme(p.theme); setFont(p.font); setDensity(p.density); }
  async function copyStandard() {
    try { await navigator.clipboard.writeText(standardPrompt); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  }

  return (
    <div>
      <InstallPanel />

      {/* Configurator — colleagues pick their standard, then copy the instruction to apply it. */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3.5">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-slate-900 px-2 text-[10px] font-semibold uppercase tracking-wide text-white">Configure</span>
          <h3 className="text-sm font-semibold text-slate-900">Build your standard</h3>
          <span className="text-xs text-slate-400">— preview below updates live; structure never changes, only colour, type, radius &amp; spacing.</span>
        </div>

        <div className="space-y-2.5">
          {/* Starter presets — set colour + font + density at once */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-14 shrink-0 text-xs text-slate-400">Presets</span>
            {PRESETS.map((p) => (
              <button key={p.name} onClick={() => applyPreset(p)} className={chip(activePreset?.name === p.name)} title={p.note}>{p.name}</button>
            ))}
          </div>
          {/* Colour group */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-14 shrink-0 text-xs text-slate-400">Colour</span>
            {THEMES.map(([id, hex]) => (
              <button key={id} onClick={() => setTheme(id)} className={chip(theme === id)}>
                <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 999, background: hex, marginRight: 5, verticalAlign: "middle" }} />
                {id}
              </button>
            ))}
          </div>
          {/* Font pack */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-14 shrink-0 text-xs text-slate-400">Font</span>
            {FONT_PACKS.map((f) => (
              <button key={f.id} onClick={() => setFont(f.id)} className={chip(font === f.id)} style={{ fontFamily: f.display }}>{f.label}</button>
            ))}
          </div>
          {/* Density + mode */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 w-14 shrink-0 text-xs text-slate-400">Density</span>
            {DENSITIES.map((d) => (
              <button key={d} onClick={() => setDensity(d)} className={chip(density === d)}>{d}</button>
            ))}
            <span className="mx-2 h-4 w-px bg-slate-200" />
            <button onClick={() => setDark(false)} className={chip(!dark)}>Light</button>
            <button onClick={() => setDark(true)} className={chip(dark)}>Dark</button>
          </div>
        </div>

        {/* Takeaway — the exact prompt to apply this standard */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          <button onClick={copyStandard} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
            {copied ? "Copied ✓" : "Copy this standard"}
          </button>
          <code className="min-w-0 flex-1 truncate rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-600">{standardPrompt}</code>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">Paste that into Claude on your project — it wires this exact look in. (Dark mode is a user preference, not part of the saved standard.)</p>
      </div>

      <div
        data-theme={theme}
        data-density={density === "default" ? undefined : density}
        className={dark ? "dark" : ""}
        style={{
          ...fontVars(font),
          background: "var(--color-background)", color: "var(--color-foreground)",
          fontFamily: "var(--font-sans)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "var(--inset-card)",
        }}
      >
        <p style={lbl}>Buttons · variants, sizes, states</p>
        <div style={{ ...row(), marginBottom: 10 }}>
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
            <Label htmlFor="d-sel">Plan</Label>
            <Select
              id="d-sel"
              defaultValue="pro"
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
                { value: "team", label: "Team" },
              ]}
            />
          </div>
        </div>

        <Separator />

        <p style={lbl}>Selection controls · dropdown · feedback</p>
        <div style={{ ...row(24), marginBottom: 16 }}>
          {field(<><Switch checked={sw} onCheckedChange={setSw} aria-label="Notifications" /> Switch</>)}
          {field(<><Checkbox checked={ck} onCheckedChange={setCk} aria-label="Accept" /> Checkbox</>)}
          {field(<><Checkbox indeterminate aria-label="Some selected" /> Indeterminate</>)}
          <RadioGroup value={radio} onValueChange={setRadio} style={{ display: "flex", gap: 14 }}>
            {field(<><RadioGroupItem value="daily" /> Daily</>)}
            {field(<><RadioGroupItem value="weekly" /> Weekly</>)}
          </RadioGroup>
          <Tooltip content="react-day-picker">
            <span tabIndex={0} style={{ borderBottom: "1px dotted var(--color-muted-foreground)", cursor: "help", fontSize: 14, outline: "none" }}>RDP</span>
          </Tooltip>
        </div>
        <div style={row()}>
          <DropdownMenu trigger={<Button variant="outline">Options ▾</Button>}>
            <DropdownMenuItem onSelect={() => toast({ title: "Profile" })}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast({ title: "Settings" })}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => toast({ title: "Deleted", variant: "destructive" })}>Delete account</DropdownMenuItem>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setOpen(true)}>Open dialog</Button>
          <Button variant="outline" onClick={() => toast({ title: "Changes saved", description: "Your edits are live.", variant: "success" })}>Toast: success</Button>
          <Button variant="outline" onClick={() => toast({ title: "Couldn't connect", description: "Check your network.", variant: "destructive" })}>Toast: error</Button>
        </div>

        <Separator />

        <p style={lbl}>Tabs</p>
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
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogDescription>This can't be undone. All data is removed.</DialogDescription>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { setOpen(false); toast({ title: "Project deleted", variant: "destructive" }); }}>Delete</Button>
        </DialogFooter>
      </Dialog>

      <ExtendedDemo theme={theme} dark={dark} density={density} font={font} />
    </div>
  );
}

function ExtendedDemo({ theme, dark, density, font }: { theme: string; dark: boolean; density: Density; font: string }) {
  const [slider, setSlider] = React.useState(62);
  const [page, setPage] = React.useState(3);
  const [date, setDate] = React.useState<string | null>("2026-06-15");
  const [range, setRange] = React.useState<{ start: string | null; end: string | null }>({ start: "2026-06-16", end: "2026-06-20" });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState<string[]>(["spacing"]);
  const [qty, setQty] = React.useState(2);
  const [seg, setSeg] = React.useState("month");
  const [combo, setCombo] = React.useState("");
  const [pickDate, setPickDate] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>(["design", "docs"]);
  const [emailErr, setEmailErr] = React.useState(false);
  const [treeSel, setTreeSel] = React.useState<string | null>("inv-1");
  const [acctName, setAcctName] = React.useState("Aurora Labs");
  const [view, setView] = React.useState<string | null>("board");
  const [otp, setOtp] = React.useState("");
  const [bannerOpen, setBannerOpen] = React.useState(true);
  const { toast } = useToast();

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

  return (
    <div data-theme={theme} data-density={density === "default" ? undefined : density} className={dark ? "dark" : ""} style={{
      ...fontVars(font),
      marginTop: 16, background: "var(--color-background)", color: "var(--color-foreground)",
      fontFamily: "var(--font-sans)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "var(--inset-card)",
    }}>
      <p style={lbl}>Extended set · slider, progress, avatars, alerts, code, kbd</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginBottom: 16 }}>
        <div>
          <Label>Budget: ${(slider * 100).toLocaleString()}</Label>
          <Slider value={slider} onValueChange={setSlider} showValueTooltip formatValue={(n) => `$${(n * 100).toLocaleString()}`} />
        </div>
        <div>
          <Label>Upload progress</Label>
          <Progress value={70} />
          <HelpText>70% — 14 of 20 files</HelpText>
        </div>
        <div>
          <Label>Team</Label>
          <AvatarGroup max={3}>
            <Avatar initials="AT" status="online" />
            <Avatar initials="MR" />
            <Avatar initials="JL" />
            <Avatar initials="SK" />
            <Avatar initials="VR" />
          </AvatarGroup>
        </div>
      </div>

      <Stack gap={2} style={{ marginBottom: 16 }}>
        <Alert variant="info" title="Heads up.">This is an informational callout that stays in the page (not transient).</Alert>
        <Alert variant="success" title="Saved." onDismiss={() => toast({ title: "Dismissed" })}>Your changes were published successfully.</Alert>
        <Alert variant="warning" title="Almost full">Storage at 92%. Consider archiving older items.</Alert>
        <Alert variant="destructive" title="Couldn't connect.">Check your network and try again.</Alert>
      </Stack>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 16 }}>
        <div>
          <p style={lbl}>Kbd</p>
          <div style={{ fontSize: 14 }}>
            Open with <Kbd keys={["⌘", "K"]} /> · Save with <Kbd keys={["⌘", "S"]} /> · Quit <Kbd>Esc</Kbd>
          </div>
          <Button variant="outline" size="sm" style={{ marginTop: 10 }} onClick={() => setCmdOpen(true)}>Open ⌘K</Button>
        </div>
        <div>
          <p style={lbl}>Code block</p>
          <CodeBlock filename="globals.css" copyable code={`:root {\n  --radius: 0.625rem;\n  --color-primary: #1c2024;\n}`} >
{`:root {
  --radius: 0.625rem;
  --color-primary: #1c2024;
}`}
          </CodeBlock>
        </div>
      </div>

      <Separator />

      <p style={lbl}>Navigation · breadcrumbs · pagination · stepper</p>
      <Stack gap={4} style={{ marginBottom: 16 }}>
        <Breadcrumbs items={[
          { label: "Home", href: "#" },
          { label: "Projects", href: "#" },
          { label: "Apollo" },
        ]} />
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
        <Stepper current={1} steps={[
          { label: "Account", description: "Email + password" },
          { label: "Details", description: "Tell us about you" },
          { label: "Preferences" },
          { label: "Done" },
        ]} />
      </Stack>

      <Separator />

      <p style={lbl}>Calendar · single date &amp; range</p>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 16 }}>
        <Stack gap={2}>
          <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Single date</span>
          <Calendar value={date} onChange={setDate} />
        </Stack>
        <Stack gap={2}>
          <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Range</span>
          <Calendar range={range} onRangeChange={setRange} />
        </Stack>
      </div>

      <Separator />

      <p style={lbl}>Charts · Okabe-Ito palette (colourblind-safe)</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginBottom: 16 }}>
        <LineChart
          width={360} height={200}
          labels={["Mon","Tue","Wed","Thu","Fri"]}
          series={[
            { name: "Revenue", data: [120, 180, 150, 220, 260] },
            { name: "Cost",    data: [90,  110, 130, 150, 170] },
          ]}
        />
        <BarChart
          width={360} height={200}
          labels={["Q1","Q2","Q3","Q4"]}
          series={[
            { name: "2025", data: [4, 8, 6, 11] },
            { name: "2026", data: [6, 10, 9, 14] },
          ]}
        />
        <AreaChart
          width={360} height={200}
          labels={["Jan","Feb","Mar","Apr","May","Jun"]}
          series={[{ name: "Users", data: [100, 140, 180, 170, 240, 290] }]}
        />
        <Stack gap={2}>
          <span style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>Inline sparklines:</span>
          <span style={{ fontSize: 14 }}>Revenue 42.1k <Sparkline data={[3,5,4,7,8,6,9,11]} /></span>
          <span style={{ fontSize: 14 }}>Users 1,290 <Sparkline data={[5,4,6,5,8,7,9,10]} color="var(--chart-2)" /></span>
          <span style={{ fontSize: 14 }}>Errors 0.3% <Sparkline data={[9,8,6,7,4,3,2,1]} color="var(--chart-3)" /></span>
        </Stack>
      </div>

      <Separator />

      <p style={lbl}>Polish · drawer · accordion · command palette</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
        <Button variant="outline" onClick={() => setCmdOpen(true)}>Command palette (⌘K)</Button>
      </div>

      <Accordion open={accordionOpen} onOpenChange={setAccordionOpen} multiple>
        <AccordionItem id="spacing" title="What's frozen in the base?">
          Spacing, type scale, button sizes, motion, dark-mode mechanism, and component anatomy — all fixed.
          A colour group or font pack only swaps colour, typeface, and radius.
        </AccordionItem>
        <AccordionItem id="brand" title="What can a brand override?">
          Only colour tokens, the font pack, the logo asset, and optionally the single <code>--radius</code> base value.
        </AccordionItem>
        <AccordionItem id="myths" title="What's been refuted?">
          There's no canonical "Anthropic 4px token scale", no serif body font, no fixed display sizes.
          Those were community fabrications. See the spec's Sources section.
        </AccordionItem>
      </Accordion>

      <Separator style={{ margin: "24px 0" }} />
      <p style={lbl}>Everything-common batch · forms, anchored panels, data, entry</p>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="MRR" value="$20,040" delta="12%" trend="up" chart={<Sparkline data={[8, 9, 11, 10, 13, 15, 20]} width={64} height={24} />} />
        <StatCard label="Active seats" value="139" delta="8" trend="up" />
        <StatCard label="Churn" value="2.1%" delta="0.4%" trend="up" upIsGood={false} />
        <StatCard label="Trials" value="6" delta="flat" trend="flat" />
      </div>

      {/* Form units */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "var(--stack-group)", marginBottom: 20 }}>
        <Field label="Work email" help="We'll only use this for billing." error={emailErr ? "Enter a valid email address." : undefined}>
          <Input placeholder="you@company.com" onBlur={(e) => setEmailErr(!!e.target.value && !e.target.value.includes("@"))} />
        </Field>
        <Field label="Country">
          <Combobox options={COUNTRIES} value={combo} onValueChange={setCombo} placeholder="Select country" />
        </Field>
        <Field label="Renewal date">
          <DatePicker value={pickDate} onChange={setPickDate} />
        </Field>
        <Field label="Seats" help="Sized to its content, not full-width.">
          <NumberInput value={qty} onValueChange={setQty} min={1} max={99} />
        </Field>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={lbl}>Segmented control</p>
          <SegmentedControl
            value={seg}
            onValueChange={setSeg}
            options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]}
            aria-label="Range"
          />
        </div>
        <div>
          <p style={lbl}>Tag input</p>
          <TagInput value={tags} onChange={setTags} placeholder="Add a tag…" />
        </div>
        <div>
          <p style={lbl}>Popover · HoverCard</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Popover trigger={<Button variant="outline">Filters</Button>}>
              <Stack gap={3}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Filter results</div>
                <div><Label>Status</Label><Input placeholder="Any" /></div>
                <Button size="sm">Apply</Button>
              </Stack>
            </Popover>
            <HoverCard trigger={<a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--color-primary)" }}>@aurora</a>}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar initials="AL" status="online" />
                <div>
                  <div style={{ fontWeight: 600 }}>Aurora Labs</div>
                  <div style={{ color: "var(--color-muted-foreground)", fontSize: 13 }}>Scale plan · 48 seats</div>
                </div>
              </div>
            </HoverCard>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div style={{ marginBottom: 20 }}>
        <p style={lbl}>Data table · sortable, scannable</p>
        <DataTable
          rows={TABLE_ROWS}
          rowKey={(r) => r.name}
          density="compact"
          columns={[
            { key: "name", header: "Account", sortable: true },
            { key: "plan", header: "Plan", sortable: true },
            { key: "seats", header: "Seats", align: "right", sortable: true },
            { key: "mrr", header: "MRR", align: "right", sortable: true, cell: (r) => `$${r.mrr.toLocaleString()}` },
            { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "Past due" ? "destructive" : r.status === "Trial" ? "warning" : "success"}>{r.status}</Badge> },
          ]}
        />
      </div>

      {/* File upload + empty state */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 8 }}>
        <FileUpload
          accept="image/png,image/jpeg,.pdf"
          maxSize={15 * 1024 * 1024}
          hint="PNG, JPG or PDF · up to 15MB"
          onFiles={(f) => toast({ title: `Selected ${f[0]?.name}` })}
          onReject={(b) => toast({ title: b[0]?.reason ?? "Rejected", variant: "destructive" })}
        />
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
          <EmptyState
            title="No invoices yet"
            description="Invoices appear here once your first billing cycle closes."
            action={<Button size="sm">Create invoice</Button>}
          />
        </div>
      </div>

      <Separator style={{ margin: "24px 0" }} />
      <p style={lbl}>Unusual batch · hierarchy, edit, overlay, layout, feedback, auth</p>

      {bannerOpen && (
        <Banner
          variant="warning"
          title="Sample data."
          actions={<Button size="sm" variant="outline">Import yours</Button>}
          onDismiss={() => setBannerOpen(false)}
          style={{ marginBottom: 20 }}
        >
          This board is showing demo records. Connect a source to see live data.
        </Banner>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, marginBottom: 20 }}>
        <div>
          <p style={lbl}>Tree view · right-click a row</p>
          <ContextMenu
            items={[
              { id: "open", label: "Open" },
              { id: "rename", label: "Rename", shortcut: "F2" },
              "separator",
              { id: "del", label: "Delete", destructive: true, shortcut: "⌫", onSelect: () => toast({ title: "Deleted" }) },
            ]}
          >
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius)" }}>
              <TreeView
                aria-label="Documents"
                defaultExpanded={["clients", "aurora"]}
                selectedId={treeSel ?? undefined}
                onSelect={setTreeSel}
                nodes={[
                  { id: "clients", label: "Clients", children: [
                    { id: "aurora", label: "Aurora Labs", children: [
                      { id: "inv-1", label: "Invoice 0012.pdf" },
                      { id: "inv-2", label: "Engagement letter.pdf" },
                    ]},
                    { id: "beacon", label: "Beacon Co", children: [{ id: "inv-3", label: "COR 2303.pdf" }] },
                  ]},
                  { id: "templates", label: "Templates" },
                ]}
              />
            </div>
          </ContextMenu>
        </div>

        <div>
          <p style={lbl}>Inline edit · click the value</p>
          <div style={{ fontSize: 14 }}>
            Account: <InlineEdit value={acctName} onSave={(v) => { setAcctName(v); toast({ title: "Saved" }); }} />
          </div>
          <p style={{ ...lbl, marginTop: 20 }}>Toolbar + toggle group</p>
          <Toolbar aria-label="View options">
            <ToggleGroup
              aria-label="Layout"
              value={view}
              onValueChange={(v) => setView(v as string)}
              options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }, { value: "table", label: "Table" }]}
            />
            <Separator orientation="vertical" style={{ height: 24 }} />
            <ToggleGroup type="multiple" aria-label="Format" size="sm" defaultValue={["bold"]}
              options={[
                { value: "bold", label: <span style={{ fontWeight: 700 }}>B</span>, "aria-label": "Bold" },
                { value: "italic", label: <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}>I</span>, "aria-label": "Italic" },
                { value: "underline", label: <span style={{ textDecoration: "underline" }}>U</span>, "aria-label": "Underline" },
              ]} />
          </Toolbar>
          <p style={{ ...lbl, marginTop: 20 }}>Verification code</p>
          <OtpInput length={6} value={otp} onChange={setOtp} onComplete={(c) => toast({ title: `Code: ${c}` })} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, marginBottom: 8 }}>
        <div>
          <p style={lbl}>Resizable panes · drag the divider</p>
          <Resizable defaultSize={42} min={20} max={75} aria-label="Documents and preview">
            <div style={{ padding: 16, fontSize: 13, color: "var(--color-muted-foreground)" }}>Document list</div>
            <div style={{ padding: 16, fontSize: 13, color: "var(--color-muted-foreground)" }}>Preview pane</div>
          </Resizable>
        </div>
        <div>
          <p style={lbl}>Timeline · activity feed</p>
          <Timeline
            items={[
              { id: "1", tone: "success", title: "Invoice 0012 filed", time: "2:14 PM" },
              { id: "2", tone: "default", title: "Reviewed by Cathlyn", time: "1:02 PM", description: "Approved with no changes." },
              { id: "3", tone: "warning", title: "Marked due-soon", time: "Yesterday" },
              { id: "4", tone: "muted", title: "Created from template", time: "Mon" },
            ]}
          />
        </div>
      </div>

      <Separator style={{ margin: "24px 0" }} />
      <p style={lbl}>Kanban board · drag cards (grab the ⠿ handle) — or keyboard: Tab to a handle, Space, arrows, Space</p>
      <KanbanDemo />

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

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        items={[
          { id: "n",  group: "Navigation", label: "Go to dashboard", shortcut: "G D", onSelect: () => toast({ title: "Dashboard" }) },
          { id: "p",  group: "Navigation", label: "Go to projects",   shortcut: "G P", onSelect: () => toast({ title: "Projects" }) },
          { id: "s",  group: "Settings",   label: "Open settings",     shortcut: "⌘,",  onSelect: () => toast({ title: "Settings" }) },
          { id: "t",  group: "Settings",   label: "Toggle theme",                     onSelect: () => toast({ title: "Theme toggled" }) },
          { id: "h",  group: "Help",       label: "Read the docs",                    onSelect: () => toast({ title: "Docs" }) },
        ]}
      />
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
