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
} from "../../plugins/building-blocks/skills/design-standard/files/components";

const THEMES = [
  ["slate", "#1c2024"], ["ocean", "#0d74ce"], ["forest", "#218358"], ["iris", "#5753c6"],
  ["terracotta", "#c2410c"], ["ruby", "#ca244d"], ["amber", "#ffc53d"], ["mono", "#000000"],
] as const;

const lbl = { fontSize: 12, fontWeight: 500, color: "var(--color-muted-foreground)", margin: "0 0 12px" } as const;
const row = (gap = 8) => ({ display: "flex", flexWrap: "wrap" as const, gap, alignItems: "center" });

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
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex h-5 items-center rounded-full bg-slate-900 px-2 text-[10px] font-semibold uppercase tracking-wide text-white">Use this</span>
        <h3 className="text-sm font-semibold text-slate-900">Install in your own project — 3 steps</h3>
      </div>
      <p className="mb-3 text-[13px] text-slate-600">
        This is our shared base UI. Apply it on any UI work; your brand styling (colour, font, logo) layers on top afterwards.
      </p>

      <ol className="space-y-3 text-[13px] text-slate-800">
        <li>
          <div className="font-medium text-slate-900">1. Install the plugin (once per machine)</div>
          <div className="mt-1.5 text-slate-600">
            <span className="font-medium text-slate-700">Easiest — let Claude install it for you.</span> Open Claude Code, start a new chat, and paste this whole message. Claude has filesystem access and will create/merge your settings file for you — no JSON editing required.
          </div>
          <div className="relative mt-1.5">
            <pre className={codeBox}>{installPrompt}</pre>
            <button className={copyBtn} onClick={() => copy("prompt", installPrompt)}>
              {copied === "prompt" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-1.5 text-[12px] text-slate-500">
            After Claude finishes, <span className="font-medium text-slate-700">fully quit Claude Code (Cmd+Q on Mac) and reopen it</span> so the new plugin loads.
          </div>

          <details className="mt-2 text-[12px] text-slate-500">
            <summary className="cursor-pointer hover:text-slate-700">Alternative paths if you prefer to do it yourself</summary>
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
        </li>

        <li>
          <div className="font-medium text-slate-900">2. In any project, tell Claude:</div>
          <div className="relative mt-1.5">
            <pre className={codeBoxNoWrap}>{"Apply our base design standard."}</pre>
            <button className={copyBtn} onClick={() => copy("apply", "Apply our base design standard.")}>
              {copied === "apply" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-1 text-slate-600">Claude pulls the tokens + components from this skill and wires them in.</div>
        </li>

        <li>
          <div className="font-medium text-slate-900">3. (Optional) Layer your brand on top</div>
          <div className="mt-1 text-slate-600">After the base is in place: <span className="rounded bg-slate-100 px-1 font-mono text-[12px]">"Apply the zhenhub brand."</span> The brand only overrides colour, font, logo, and (optionally) corner-roundness — never spacing, sizing, or component anatomy.</div>
        </li>
      </ol>

      <div className="mt-3 border-t border-slate-100 pt-2.5 text-[12px] text-slate-500">
        <span className="font-medium text-slate-700">What you're looking at below:</span> a live preview of every component in the standard. Pick a colour group or toggle dark mode — nothing else moves; only colour, type, and radius re-skin. That's the whole point: pick once, every app feels consistent.
      </div>
    </div>
  );
}

function DemoInner() {
  const [theme, setTheme] = useState<string>("slate");
  const [dark, setDark] = useState(false);
  const [sw, setSw] = useState(true);
  const [ck, setCk] = useState(true);
  const [radio, setRadio] = useState("daily");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const chip = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`;
  const field = (n: React.ReactNode) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>{n}</span>;

  return (
    <div>
      <InstallPanel />

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
          fontFamily: "var(--font-sans)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px 22px",
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

      <ExtendedDemo theme={theme} dark={dark} />
    </div>
  );
}

function ExtendedDemo({ theme, dark }: { theme: string; dark: boolean }) {
  const [slider, setSlider] = React.useState(62);
  const [page, setPage] = React.useState(3);
  const [date, setDate] = React.useState<string | null>("2026-06-15");
  const [range, setRange] = React.useState<{ start: string | null; end: string | null }>({ start: "2026-06-16", end: "2026-06-20" });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState<string[]>(["spacing"]);
  const { toast } = useToast();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div data-theme={theme} className={dark ? "dark" : ""} style={{
      marginTop: 16, background: "var(--color-background)", color: "var(--color-foreground)",
      fontFamily: "var(--font-sans)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "20px 22px",
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
