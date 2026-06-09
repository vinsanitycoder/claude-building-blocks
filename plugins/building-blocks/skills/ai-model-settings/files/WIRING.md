# Wiring `AiModelSettings` into a real app

The component is presentational + a single `onSave({provider, model, apiKey})` callback. To make it real you need three things on the server: **storage**, **encryption**, and **a factory** that builds the right client from the saved config.

## 1. Storage (per-workspace config)
A table keyed by workspace (or user/org), e.g. Drizzle/Postgres:
```ts
export const aiConfig = pgTable("ai_config", {
  workspaceId: text("workspace_id").primaryKey(),
  provider: text("provider").notNull(),   // 'anthropic' | 'openai' | 'gemini'
  model: text("model").notNull(),
  apiKeyEnc: text("api_key_enc").notNull(), // AES-GCM ciphertext, NEVER plaintext
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
```

## 2. Encryption (AES-GCM, key from env)
A small WebCrypto helper (works in Workers/Edge). `ENCRYPTION_KEY` = 64-hex-char (32 bytes), set as a secret.
```ts
function keyBytes() {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) throw new Error("ENCRYPTION_KEY must be 64 hex chars");
  return Uint8Array.from(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
}
export async function encryptSecret(plain: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey("raw", keyBytes(), "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plain)));
  return btoa(String.fromCharCode(...iv, ...ct)); // iv prefixed
}
export async function decryptSecret(enc: string): Promise<string> {
  const raw = Uint8Array.from(atob(enc), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12), ct = raw.slice(12);
  const key = await crypto.subtle.importKey("raw", keyBytes(), "AES-GCM", false, ["decrypt"]);
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct));
}
```

## 3. Server action (Next.js) — the `onSave` target
```ts
"use server";
export async function saveAiConfigAction({ provider, model, apiKey }: AiModelValue) {
  const me = await getCurrentUser();           // your auth; gate to admins
  if (me.role !== "admin") throw new Error("admins only");
  const patch: Record<string, unknown> = { provider, model, updatedAt: new Date() };
  if (apiKey) patch.apiKeyEnc = await encryptSecret(apiKey); // blank = keep existing key
  await upsertAiConfig(me.workspaceId, patch);
}
```
Pass `defaultProvider`/`defaultModel`/`hasExistingKey` from the stored row (key existence only — never the key).

## 4. Factory (build the client at call time)
```ts
export function createLlm(provider: string, model: string, apiKey: string): LlmPort {
  switch (provider) {
    case "openai":  return createOpenAiLlm(apiKey, model);
    case "gemini":  return createGeminiLlm(apiKey, model);
    default:        return createAnthropicLlm(apiKey, model);
  }
}
// at use time: decrypt the key, build, call. Cache per workspace within a run.
```

## Invariants worth keeping
- **Write-only key**: never return the stored key to the client; show only "saved" state.
- **Blank key = keep existing** (lets you change just the model without re-pasting the key).
- **ENCRYPTION_KEY identical across all services** that decrypt (web + any worker), or decryption fails.
- Adapters should **fail loud** on malformed model output (throw), not silently coerce — so a bad response is visible, not a buried wrong result.
