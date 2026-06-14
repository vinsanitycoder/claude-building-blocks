import { useState } from "react";
import "../../plugins/building-blocks/skills/design-standard/files/globals.css";
import "../../plugins/building-blocks/skills/design-standard/files/themes.css";
import {
  Button, Input, Label, HelpText, ErrorText,
  Card, CardTitle, CardDescription, Badge, Separator, Spinner, Skeleton,
  Switch, Checkbox, RadioGroup, RadioGroupItem,
  Tabs, TabsList, TabsTrigger, TabsContent, Tooltip,
  Dialog, DialogTitle, DialogDescription, DialogFooter, Select,
  ToastProvider, useToast,
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
            <Select id="d-sel" defaultValue="pro">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="team">Team</option>
            </Select>
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
    </div>
  );
}
