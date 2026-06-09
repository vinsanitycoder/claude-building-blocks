---
name: ai-model-settings
description: Add a "choose AI provider + model + API key" settings control to an app. Use when building a screen where a user/admin picks an LLM provider (Anthropic/OpenAI/Gemini), selects a model (with an "Other" escape hatch), and saves a BYO API key that's encrypted at rest. Covers the UI component plus the server-side storage/encryption/factory contract.
when_to_use: user wants an AI model picker, model dropdown, BYO API key, bring-your-own-key, per-workspace LLM config, switch between Claude/GPT/Gemini, store an API key securely.
---

# AI model + API key settings block

A refined, production-tested control for letting a user pick an **AI provider + model** and save a **bring-your-own API key** (encrypted at rest, write-only). Start from this instead of building it from scratch.

## What's here
- `files/AiModelSettings.tsx` — the React component. Prop-driven: `onSave({provider, model, apiKey})`. Includes the curated per-provider model lists, the "Other…" escape hatch, the write-only key field, and the "blank key = keep existing" behaviour.
- `files/WIRING.md` — the server side: the `ai_config` table, AES-GCM `encryptSecret`/`decryptSecret` (WebCrypto, Workers-safe), the `saveAiConfigAction` server action, and the `createLlm` factory.

## How to use it
1. Copy `AiModelSettings.tsx` into the target app's components.
2. Read `WIRING.md` and add: the storage table, the crypto helper, the save action, and the factory — adapting names to the app's stack.
3. Render `<AiModelSettings onSave={saveAiConfigAction} defaultProvider={cfg.provider} defaultModel={cfg.model} hasExistingKey={cfg.hasKey} />`.
4. To add/remove models, edit the `AI_MODELS` map at the top of the component — that's the main thing that changes over time.

## Keep these invariants
- **Write-only key** (never render the stored key back), **blank key = keep existing**, **same `ENCRYPTION_KEY` across all services** that decrypt, and **adapters fail loud** on bad model output.

## Preview / iterate
Run the playground (`playground/` in this repo): `npm install && npm run dev`, open the "AI model" demo to see and tweak it live.
