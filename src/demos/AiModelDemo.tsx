import { useState } from "react";
import { AiModelSettings, type AiModelValue } from "../../plugins/building-blocks/skills/ai-model-settings/files/AiModelSettings";

export function AiModelDemo() {
  const [saved, setSaved] = useState<AiModelValue | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI model + API key</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pick a provider, a model (or "Other…"), and paste a key. In a real app, Save calls a server action that
          encrypts the key. Here it just shows what would be saved.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <AiModelSettings
          defaultProvider="anthropic"
          defaultModel="claude-sonnet-4-5"
          hasExistingKey={false}
          onSave={(v) => setSaved({ ...v, apiKey: v.apiKey ? `(${v.apiKey.length}-char key)` : "(unchanged)" })}
        />
      </div>

      {saved ? (
        <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-green-300">
{JSON.stringify(saved, null, 2)}
        </pre>
      ) : (
        <p className="text-xs text-slate-400">Save above to see the payload your server action would receive.</p>
      )}
    </div>
  );
}
