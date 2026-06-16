---
name: design-standard
description: Our base UI design standard — the brand-agnostic foundation every app's UI should start from. Apply when building or styling ANY web app UI (new screens, components, dashboards, forms, marketing pages) so spacing, typography, colour, buttons, states, components, dates, copy, layout, loading/error states, and charts are consistent across all our apps. Ships CSS-variable design tokens, 8 colour groups, 6 font packs, base components, and a 20-section spec. This is the STRUCTURE layer; brand skills (e.g. zhenhub-brand) layer colour/font/logo on top afterward.
when_to_use: building any web UI, a new app or screen, styling components, choosing spacing/colours/fonts, making the UI consistent or "on-standard", buttons/forms/cards/modals/tables/dropdowns/dates/charts, dark mode, loading/empty/error states, "make this look right", before applying a brand.
---

# Base UI design standard (brand-agnostic foundation)

The shared substrate for every app's UI. Apply this **first**; a brand skill (colour/font/logo) goes
**on top**. It exists because, with no fixed reference, each build reinvents spacing and reaches for the
same training-data defaults ("AI slop"). This removes the choices: constrain every value to a scale and
there's nothing to drift.

## What's here (`files/`)
- `globals.css` — Tier-1 structural tokens (spacing, type, radius, shadow, motion, z, chart) + a neutral
  default colour set (light/dark) + reset + base element styles. **Load this once; it's the foundation.**
- `themes.css` — 8 pre-designed, WCAG-verified colour groups (`slate ocean forest iris terracotta ruby
  amber mono`) as `[data-theme]` blocks.
- `fonts.ts` — 6 font packs (Signal/Geist, Broadsheet, Marshmallow, Terminal, Charter, Megaphone) via `next/font`.
- `components.css` + `components/*` — token-driven base components (Button, Input/Textarea, Label/Help/Error,
  Card, Badge, Separator, Spinner, Skeleton). No Tailwind required.
- `tailwind.config.ts` — optional token→Tailwind mapping for Tailwind/shadcn apps.
- `DESIGN_STANDARD.md` — the full 20-section spec (the source of truth). Read it for anything not obvious below.
- `WIRING.md` — exact install steps + the brand-layer contract.

## How to apply (don't rebuild — adopt)
1. **Foundation:** import `globals.css` at the app root → you have the whole token system + neutral light/dark.
2. **Palette (optional):** import `themes.css`, set `data-theme="…"` on `<html>`; toggle `class="dark"` for dark.
3. **Type (optional, Next.js):** apply a pack from `fonts.ts` (only Signal needs `npm i geist`).
4. **Components:** use `components/*` directly (any framework), OR in a Tailwind/shadcn app adopt
   `tailwind.config.ts` and your existing components re-skin to the tokens automatically.
   Every component is **zero-dependency** except **`KanbanBoard`**, which needs dnd-kit —
   `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`. It's controlled + backend-agnostic:
   feed `columns`/`cards`, handle one `onCardMove` callback (emits the moved card + target column/index
   + neighbour ids so you compute a fractional/LexoRank rank). Keyboard-operable with live announcements.
5. **Brand last:** apply the brand skill's overrides (colour/font/logo/radius only) after the above.

## The rules that matter most (full detail in DESIGN_STANDARD.md)
- **Snap everything to the scale** — spacing is 4px-based (default gap 16, card padding 24, section 64); type,
  radius, motion all come from the token scales. No arbitrary `p-[13px]`.
- **Spacing = scale → roles → proximity (§21).** Reference semantic roles (`--stack-*`, `--inset-*`, `--inline-*`),
  not bare px. Obey the proximity inequality so layouts feel intentional, not scattered:
  `label↔input (4) < field↔field (24) < group↔group (32) < section↔section (48)` — inner gap always smaller than
  outer. **Match field width to expected input** (postcode ~5ch, year 4ch — never full-width). Controls 40px default
  (44 touch); cards 16–24 padding; containers capped (app 1280 / form 480 / prose 65ch). Full sizing tables in §21.
- **Semantic tokens only** — components reference `--color-*` / `--space-*` / `--radius` / motion tokens; never a
  hard-coded hex/px/ms. That's what lets one base re-skin per brand.
- **Universal state cycle** — every actionable element does hover (lift+shadow) → press (compress) → release
  (spring back) → focus-visible (ring) → disabled → loading. Baked into `components.css`.
- **One accent, used sparingly; deliberate font; one card/button pattern repeated** — the anti-"AI-slop" rules (§2).
- **Clean = whitespace + removal, not just alignment (§22).** If a screen feels cluttered: separate with SPACE before
  borders/boxes/fills (escalate space → bg tint → shadow → border-last); use the TOP of the scale for macro gaps
  (section ≈ 3–4× group gap); cap content width (prose 65ch, never edge-to-edge); body line-height 1.5–1.6; one
  primary action per screen; run the squint test. Offer `data-density="spacious"` for marketing/forms/content and
  `data-density="compact"` for dashboards/tables — set per app, not globally. Refuted myth (never cite): the "+20%
  comprehension from whitespace (Lin 2004)" claim — folklore; the real number is NN/g's 33%→65% recall from decluttering.
- **Accessibility floors** — ≥44px touch targets, visible focus rings, WCAG AA contrast in **both** modes, never
  colour as the only signal.
- **Sentence case everywhere; buttons are `verb + object`; errors say what+why+fix** (§18). Charts use the
  Okabe-Ito `--chart-*` palette, not the brand accent (§20).

## Keep these invariants
- Structure is frozen; only the brand layer changes colour/font/logo/radius. If a brand needs to change spacing or
  sizing, the base is wrong — fix the base, not the brand.
- Refuted myths to NOT reintroduce: there is no canonical "Anthropic 4px token scale", no serif body font, no fixed
  display sizes — those were community fabrications (see DESIGN_STANDARD "Sources").

## Consistency audit — run this when adopting the standard in ANY block

When refactoring a component to "use the design standard," do not stop at the obvious. Loose ends in helper modules,
status-colour utilities, and small inputs are what make a block read as off-brand. Every item below has burned us in a
real refactor — keep the list short and treat it as a checklist:

1. **No raw `<button>`, `<input>`, `<select>`, `<textarea>` rendering as styled controls.** Replace with the
   design-standard component (`<Button>`, `<Input>`, `<Select>`, `<Textarea>`) or, if you must stay on the raw element,
   the matching `.ds-btn--*` / `.ds-input` class. Native `<select>` looks NOTHING like the anchored slide-down Select
   and is the #1 inconsistency catch.
2. **No Tailwind palette utilities** (`bg-slate-*`, `bg-gray-*`, `bg-zinc-*`, `bg-stone-*`, `bg-neutral-*`,
   `bg-green-*`, `bg-rose-*`, `bg-red-*`, `bg-blue-*`, `bg-amber-*`, `text-slate-*`, `text-gray-*`, `border-slate-*`,
   `border-rose-*`, etc.). Replace with semantic tokens: `bg-[var(--color-card)]`, `text-[var(--color-foreground)]`,
   `text-[var(--color-muted-foreground)]`, `border-[var(--color-border)]`. Status colours map to
   `--color-success` / `--color-warning` / `--color-destructive`.
3. **Audit HELPER modules too**, not just the component file. `bg-green-500` hiding in a `presence.ts` lookup table
   or a `heatClass()` function is invisible from the JSX but ships the wrong colour. If a helper returns Tailwind
   class names tied to a palette, convert it to return INLINE STYLE objects with `var(--color-*)` values.
4. **No literal hex / rgb values in components.** Search the file for `#[0-9a-f]{3,6}` and `rgb(`. Acceptable
   only inside the design-standard skill's own token files (`globals.css`, `themes.css`). Anywhere else = bug.
5. **Tints / shades from tokens** (success-tinted card, destructive-tinted error banner): use
   `color-mix(in srgb, var(--color-success) 10%, var(--color-card))`, not `bg-green-50`. This is how shadcn-style
   semantic backgrounds work without hard-coding a palette.
6. **Layout widths.** `.ds-input` and `.ds-select-trigger` are `display:block; width:100%` — designed to live
   inside a column. Putting two of them in a `flex flex-wrap items-center gap-2` row makes them STACK, not sit
   side-by-side. Use a `grid` with explicit columns (`grid-template-columns: 1fr 1fr` or `1fr auto`), or wrap each
   in a flex item with `flex: 1`. Never trust raw flex-wrap with full-width fields.
7. **Cards = `.ds-card` (or `<Card>`)**, not `rounded-xl border bg-white p-4`. The `.ds-card` class brings the
   right shadow, padding, and dark-mode background.
8. **Badges + chips = `.ds-badge--variant`** (or `<Badge>`), not hand-rolled `rounded bg-green-100 px-2 py-0.5
   text-green-800`. Same for inline alerts (`<Alert>`).
9. **Internal section dividers** (between list items, card sections): `border-top: 1px solid var(--color-border)`,
   not `border-slate-100` / `divide-slate-50`. They must travel with dark mode.
10. **Verify in BOTH light and dark mode after refactoring.** Most palette leaks are invisible in light mode and
    glaring in dark mode (a `bg-slate-100` looks fine on white but jumps off a dark page).

### Quick search to catch leaks
After refactoring, ripgrep the touched files for the patterns above:

```bash
rg -n \
  -e 'bg-(slate|gray|zinc|stone|neutral|green|rose|red|blue|amber|yellow|emerald|teal)-[0-9]' \
  -e 'text-(slate|gray|zinc|stone|neutral)-[0-9]' \
  -e 'border-(slate|gray)-[0-9]' \
  -e '<select ' \
  files/
```

A clean adoption returns ripgrep exit code 1 with no output. Treat any hits as bugs.

## Preview / iterate
Run the repo playground (`npm run dev` at the root) → "Design standard" demo — switch colour groups + dark mode and
hover/press the components to see the tokens and states live.
