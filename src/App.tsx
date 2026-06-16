import { useState } from "react";
import { DesignStandardDemo } from "./demos/DesignStandardDemo";
import { AiModelDemo } from "./demos/AiModelDemo";
import { ImporterDemo } from "./demos/ImporterDemo";
import { TeamActivityDemo } from "./demos/TeamActivityDemo";

// One-time install command. Works on BOTH the Claude Desktop app and the
// terminal Claude Code CLI — both load skills from ~/.claude/skills/.
const INSTALL_CMD =
  'T=$(mktemp -d); curl -fsSL https://github.com/vinsanitycoder/claude-building-blocks/archive/refs/heads/main.tar.gz | tar -xz -C "$T" && mkdir -p ~/.claude/skills && for s in design-standard ai-model-settings data-importer team-activity; do rm -rf ~/.claude/skills/$s; cp -R "$T/claude-building-blocks-main/plugins/building-blocks/skills/$s" ~/.claude/skills/$s; done && rm -rf "$T" && echo "✅ Done — fully quit Claude (Cmd+Q) and reopen."';

function InstallBanner() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
    } catch {
      // Fallback for browsers/contexts without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = INSTALL_CMD;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Install these skills in your Claude</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Paste this into <span className="font-medium text-slate-200">Terminal</span>, then fully quit Claude
            (Cmd+Q) and reopen. Works on both the desktop app and the CLI.
          </p>
        </div>
        <button
          onClick={copy}
          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
            copied ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-slate-200"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-[11px] leading-relaxed text-emerald-200">
        <code>{INSTALL_CMD}</code>
      </pre>
      <p className="mt-2 text-[11px] text-slate-500">
        Then ask Claude <span className="text-slate-300">“what skills do you have?”</span> — you should see{" "}
        <span className="text-slate-300">design-standard</span>.
      </p>
    </section>
  );
}

const TABS = [
  { id: "design", label: "Design standard", el: <DesignStandardDemo /> },
  { id: "ai", label: "AI model + key", el: <AiModelDemo /> },
  { id: "importer", label: "Data importer", el: <ImporterDemo /> },
  { id: "team", label: "Team activity", el: <TeamActivityDemo /> },
] as const;

export function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("design");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <InstallBanner />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Building Blocks — Playground</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live previews of our reusable components. Edit the files under{" "}
          <code className="rounded bg-slate-100 px-1">plugins/building-blocks/skills/&lt;block&gt;/files/</code> and they update here instantly.
        </p>
      </header>

      <nav className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="rounded-2xl border border-slate-200 bg-white p-6">{active.el}</main>

      <footer className="mt-6 text-center text-xs text-slate-400">
        Each block is prop-driven — it runs here with mock data, and drops into a real app by wiring its <code>WIRING.md</code> contract.
      </footer>
    </div>
  );
}
