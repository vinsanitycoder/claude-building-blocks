"use client";

/**
 * AiModelSettings — a self-contained "choose your AI provider + model + API key" control.
 *
 * Prop-driven and backend-agnostic: it renders the picker and calls `onSave({provider, model, apiKey})`.
 * In a real app you wire `onSave` to a server action that ENCRYPTS the key and stores it (see WIRING.md).
 * In the playground, `onSave` just shows what would be saved.
 *
 * Refined UX details worth keeping:
 *  - Curated model list per provider, first entry marked "default".
 *  - "Other…" escape hatch so a brand-new model id is never blocked by the list.
 *  - API key is write-only: we never render the stored key back; a filled state shows "•••• saved".
 *  - Switching provider resets the model to that provider's default.
 */
import { useState } from "react";
import { Select } from "../../design-standard/files/components/Select";
import { Input } from "../../design-standard/files/components/Input";
import { Button } from "../../design-standard/files/components/Button";

export type AiProvider = "anthropic" | "openai" | "gemini";

export interface AiModelValue {
  provider: AiProvider;
  model: string;
  apiKey: string; // blank means "leave the existing key unchanged"
}

// First entry per provider is the default. Edit this list to add models — that's the main thing
// you'll tweak over time as providers ship new models.
export const AI_MODELS: Record<AiProvider, { id: string; label: string }[]> = {
  anthropic: [
    { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5 — default" },
    { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most capable" },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — fast & cheap" },
  ],
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o mini — default" },
    { id: "gpt-5.5", label: "GPT-5.5 — most capable" },
    { id: "gpt-4o", label: "GPT-4o — multimodal" },
  ],
  gemini: [
    { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash — default" },
    { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro — most capable" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  ],
};

const PROVIDERS: { id: AiProvider; label: string }[] = [
  { id: "anthropic", label: "Anthropic (Claude)" },
  { id: "openai", label: "OpenAI (ChatGPT)" },
  { id: "gemini", label: "Google (Gemini)" },
];

const OTHER = "__other__";

export function AiModelSettings({
  defaultProvider = "anthropic",
  defaultModel = "",
  hasExistingKey = false,
  onSave,
}: {
  defaultProvider?: AiProvider;
  defaultModel?: string;
  hasExistingKey?: boolean;
  onSave?: (value: AiModelValue) => void | Promise<void>;
}) {
  const initialProvider = PROVIDERS.some((p) => p.id === defaultProvider) ? defaultProvider : "anthropic";
  const known = AI_MODELS[initialProvider].some((m) => m.id === defaultModel);
  const [provider, setProvider] = useState<AiProvider>(initialProvider);
  const [pick, setPick] = useState(defaultModel && known ? defaultModel : OTHER);
  const [custom, setCustom] = useState(defaultModel && !known ? defaultModel : "");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const model = pick === OTHER ? custom.trim() : pick;

  function onProviderChange(next: AiProvider) {
    setProvider(next);
    setPick(AI_MODELS[next][0].id);
    setCustom("");
  }

  async function save() {
    setSaving(true);
    setSavedMsg(null);
    try {
      await onSave?.({ provider, model, apiKey });
      setApiKey(""); // never keep the key in component state after save
      setSavedMsg(`Saved ${provider} · ${model || "(no model)"}${apiKey ? " · key updated" : ""}`);
    } finally {
      setSaving(false);
    }
  }

  // Grid layout — each form control gets a column, so Provider and Model sit
  // cleanly side-by-side instead of stacking under .ds-input's width:100%.
  // "Other" expands into the row when active.
  const modelOptions = [
    ...AI_MODELS[provider].map((m) => ({ value: m.id, label: m.label })),
    { value: OTHER, label: "Other (enter model id)…" },
  ];

  return (
    <div className="space-y-3">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: pick === OTHER ? "1fr 1fr 1fr" : "1fr 1fr" }}
      >
        <Select
          value={provider}
          onValueChange={(v) => onProviderChange(v as AiProvider)}
          options={PROVIDERS.map((p) => ({ value: p.id, label: p.label }))}
          aria-label="Provider"
        />

        <Select
          value={pick}
          onValueChange={setPick}
          options={modelOptions}
          aria-label="Model"
        />

        {pick === OTHER ? (
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. claude-opus-4-8"
            aria-label="Custom model id"
          />
        ) : null}
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto" }}>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={hasExistingKey ? "•••• saved — leave blank to keep, or paste a new key" : "Paste API key (stored encrypted)"}
          autoComplete="off"
          aria-label="API key"
        />
        <Button onClick={save} disabled={saving || !model} loading={saving}>
          {saving ? "Saving" : "Save"}
        </Button>
      </div>

      {savedMsg ? <p className="text-xs" style={{ color: "var(--color-success)" }}>{savedMsg}</p> : null}
      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
        The key is sent to your server, encrypted at rest, and never shown again. Leaving it blank keeps the existing key.
      </p>
    </div>
  );
}
