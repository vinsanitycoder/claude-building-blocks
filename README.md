# Building Blocks

Our internal library of **reusable, production-refined components** for the apps we build with Claude Code. Refine them **once, here** — every future app starts from these instead of square one.

Three blocks so far (all UX-refined in real products):
1. **AI model + API key settings** — pick provider/model + save a BYO key (encrypted, write-only).
2. **Data importer** — drag-drop CSV/Excel with a template + per-row validation preview.
3. **Team activity monitor** — presence, 24h timeline, monthly heatmap, job-health card, role management.

## Two ways to use this repo

### A) See them live (playground)
```bash
npm install
npm run dev      # open the printed localhost URL (e.g. http://localhost:5173)
```
Tabs across the top switch between the three blocks, each running with mock data. **Edit a component** under `plugins/building-blocks/skills/<block>/files/` and the playground hot-reloads — that's the iterate-and-preview loop.

### B) Use them in a new app (via Claude Code)
This repo is a **Claude Code plugin marketplace**. Once installed, Claude auto-starts from these blocks when you ask for the matching feature.

**Install (you or a teammate):**
```
/plugin marketplace add vinsanitycoder/claude-building-blocks
/plugin install building-blocks@team-blocks
```
Then, in any project, just ask — e.g. *"add an AI model picker with a BYO API key"* — and Claude uses the `ai-model-settings` skill (component + wiring contract) instead of rebuilding it.

> Private repo? The teammate needs read access (GitHub login / `gh auth login`), and for background auto-updates set `GITHUB_TOKEN`.

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
