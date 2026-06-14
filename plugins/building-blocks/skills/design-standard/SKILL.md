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
5. **Brand last:** apply the brand skill's overrides (colour/font/logo/radius only) after the above.

## The rules that matter most (full detail in DESIGN_STANDARD.md)
- **Snap everything to the scale** — spacing is 4px-based (default gap 16, card padding 24, section 64); type,
  radius, motion all come from the token scales. No arbitrary `p-[13px]`.
- **Semantic tokens only** — components reference `--color-*` / `--space-*` / `--radius` / motion tokens; never a
  hard-coded hex/px/ms. That's what lets one base re-skin per brand.
- **Universal state cycle** — every actionable element does hover (lift+shadow) → press (compress) → release
  (spring back) → focus-visible (ring) → disabled → loading. Baked into `components.css`.
- **One accent, used sparingly; deliberate font; one card/button pattern repeated** — the anti-"AI-slop" rules (§2).
- **Accessibility floors** — ≥44px touch targets, visible focus rings, WCAG AA contrast in **both** modes, never
  colour as the only signal.
- **Sentence case everywhere; buttons are `verb + object`; errors say what+why+fix** (§18). Charts use the
  Okabe-Ito `--chart-*` palette, not the brand accent (§20).

## Keep these invariants
- Structure is frozen; only the brand layer changes colour/font/logo/radius. If a brand needs to change spacing or
  sizing, the base is wrong — fix the base, not the brand.
- Refuted myths to NOT reintroduce: there is no canonical "Anthropic 4px token scale", no serif body font, no fixed
  display sizes — those were community fabrications (see DESIGN_STANDARD "Sources").

## Preview / iterate
Run the repo playground (`npm run dev` at the root) → "Design standard" demo — switch colour groups + dark mode and
hover/press the components to see the tokens and states live.
