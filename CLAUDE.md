# CLAUDE.md — Building Blocks repo

This repo is our **reusable component library + Claude Code plugin marketplace**. When working *in this repo*, your job is to **refine the blocks**. When working in *another* app, the installed skills point you here so you **reuse** these instead of rebuilding.

## What the blocks are
Each block lives at `plugins/building-blocks/skills/<block>/` and has:
- `SKILL.md` — when/how to use it (this is what auto-triggers in other projects).
- `files/` — the **canonical component code** + a `WIRING.md` (the server-side contract).

Blocks: `ai-model-settings`, `data-importer`, `team-activity`. The playground (the Vite app at the **repo root** — `index.html` + `src/`) imports the same `files/` so previews always reflect the canonical code. One `node_modules` at the root serves both `src/` and the block `files/` (so there's a single React instance).

## Conventions (keep blocks reusable)
- **Prop-driven / backend-agnostic.** Components take data + callbacks via props (e.g. `onSave`, `onImport`, `validateRow`). No direct imports of a specific app's auth/db. The backend wiring lives in `WIRING.md`, not in the component. This is what lets each block run in the playground AND drop into any app.
- **One source of truth.** The component code lives in `skills/<block>/files/`. The playground imports it; don't fork copies.
- **Document the contract, not just the code.** When you change a prop or a server expectation, update `WIRING.md` and `SKILL.md`.
- **Carry the hard-won invariants forward** (they're noted in each WIRING.md): write-only API keys + shared ENCRYPTION_KEY; importer re-validates server-side + neutralizes formula injection + per-row try/catch; presence clamps elapsed time + requires staff disclosure.

## Iterate + preview loop
1. Edit `plugins/building-blocks/skills/<block>/files/*`.
2. `npm run dev` (at the repo root) → see it live (hot reload). Edit the matching `src/demos/*` if you need new mock data.
3. Update `WIRING.md`/`SKILL.md`; commit + push.

## Versioning / sharing
- The plugin/marketplace currently **omit version numbers**, so every commit is the latest — teammates run `/plugin marketplace update team-blocks` to pull improvements immediately (good while we iterate).
- When a block stabilises, add a `"version"` to `plugin.json` for controlled releases.
- Before publishing, replace the `REPLACE-ME` placeholder in `plugins/building-blocks/.claude-plugin/plugin.json` `homepage` with the real repo URL.

## Adding a new block
Create `plugins/building-blocks/skills/<new-block>/` with `SKILL.md` + `files/` (component + `WIRING.md`), add a demo in `src/demos/` and a tab in `src/App.tsx`. Keep it prop-driven.
