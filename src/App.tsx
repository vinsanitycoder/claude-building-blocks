import { useState } from "react";
import { AiModelDemo } from "./demos/AiModelDemo";
import { ImporterDemo } from "./demos/ImporterDemo";
import { TeamActivityDemo } from "./demos/TeamActivityDemo";

const TABS = [
  { id: "ai", label: "AI model + key", el: <AiModelDemo /> },
  { id: "importer", label: "Data importer", el: <ImporterDemo /> },
  { id: "team", label: "Team activity", el: <TeamActivityDemo /> },
] as const;

export function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("ai");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
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
