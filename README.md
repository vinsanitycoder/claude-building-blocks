# Building Blocks

A reusable library of **production-refined Claude Code building blocks** — drop-in skills you can install once and reuse across every app. Originated by the ZhenHub / Fynlo team; **public + MIT-licensed** so anyone can install, fork, or adapt.

**Live playground:** **https://claude-building-blocks.vince-1b6.workers.dev/** (click any tab to see a block running with mock data; the *Design standard* tab has a one-paste install panel at the top).

Four blocks so far (all UX-refined in real products):
1. **Design standard** — brand-agnostic base UI: tokens (spacing, type, radius, motion), 8 colour groups, 6 font packs, ~34 base components, full 20-section spec.
2. **AI model + API key settings** — pick provider/model + save a BYO key (encrypted, write-only).
3. **Data importer** — drag-drop CSV/Excel with a template + per-row validation preview.
4. **Team activity monitor** — presence, 24h timeline, monthly heatmap, job-health card, role management.

## Two ways to use this repo

### A) See them live (playground)
```bash
npm install
npm run dev      # open the printed localhost URL (e.g. http://localhost:5173)
```
Tabs across the top switch between the four blocks, each running with mock data. **Edit a component** under `plugins/building-blocks/skills/<block>/files/` and the playground hot-reloads — that's the iterate-and-preview loop.

### B) Install into your own Claude Code (any project)
This repo is a **Claude Code plugin marketplace**. Once installed, Claude auto-starts from these blocks when you ask for the matching feature.

**Easiest path — let Claude install it for you.** Open Claude Code, paste this prompt into a new chat; Claude has filesystem tools, so it will create or merge `~/.claude/settings.json` for you:

> Please install the design-standard plugin. Add a marketplace named `team-blocks` pointing at `vinsanitycoder/claude-building-blocks` and enable the `building-blocks@team-blocks` plugin in `~/.claude/settings.json` (create or merge, do NOT replace existing keys). Then tell me to fully quit Claude Code (Cmd+Q) and reopen.

After you reopen, ask Claude *"add an AI model picker with a BYO API key"* (or any matching feature) — Claude uses the relevant block (component + wiring contract) instead of rebuilding it.

**Alternative — terminal slash commands** (only on the interactive terminal Claude Code surface):
```
/plugin marketplace add vinsanitycoder/claude-building-blocks
/plugin install building-blocks@team-blocks
```

**Alternative — manual JSON edit:** merge these two keys into `~/.claude/settings.json` (create the file with `{}` if it doesn't exist), then fully quit and reopen Claude Code:
```json
{
  "extraKnownMarketplaces": { "team-blocks": { "source": { "source": "github", "repo": "vinsanitycoder/claude-building-blocks" } } },
  "enabledPlugins": ["building-blocks@team-blocks"]
}
```

## Repo layout
```
.claude-plugin/marketplace.json      ← makes this repo an installable marketplace
plugins/building-blocks/
  .claude-plugin/plugin.json
  skills/
    ai-model-settings/  (SKILL.md + files/: component + WIRING.md)
    data-importer/      (SKILL.md + files/: component + parser + WIRING.md)
    team-activity/      (SKILL.md + files/: component + helpers + WIRING.md)
index.html, vite.config.ts, src/    ← the playground app (repo root) that previews every block
CLAUDE.md                            ← how Claude should treat this repo
```

## Improving a block
1. Edit the component in `plugins/building-blocks/skills/<block>/files/`.
2. Preview in the playground (`npm run dev`).
3. Update its `WIRING.md` / `SKILL.md` if the contract changed.
4. Commit + push. Teammates get it with `/plugin marketplace update team-blocks`.

See `CLAUDE.md` for conventions (e.g. keeping blocks prop-driven so they stay reusable).
