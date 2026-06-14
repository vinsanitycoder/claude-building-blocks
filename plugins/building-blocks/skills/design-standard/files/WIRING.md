# Wiring the design standard into an app

The design standard is **two tiers**: a brand-agnostic structural layer (this block) and a thin
brand layer (a brand skill) on top. Apply this **first**, brand **second**.

## What ships here

| File | Role | Required? |
|---|---|---|
| `globals.css` | Tier-1 structural tokens + the neutral default colour set (light/dark) + reset + base elements | **Yes** — load once at the app root |
| `themes.css` | The 8 colour groups as `[data-theme]` blocks | Optional — only to use a non-default palette |
| `fonts.ts` | The 6 font packs via `next/font` (Next.js only) | Optional — picks the typeface |
| `tailwind.config.ts` | Maps the tokens to Tailwind utilities | Optional — only if the app uses Tailwind |
| `components.css` + `components/*` | Token-driven base components (Button, Input, Card, Badge, Separator, Spinner, Skeleton) | Optional — a runnable reference impl |
| `DESIGN_STANDARD.md` | The full 20-section spec (the source of truth) | Reference |

## 1. Minimum install (tokens only — works in any framework)

1. Copy `globals.css` into the app and import it once at the root (`app/layout.tsx` or `main.tsx`).
   You now have the full token system and a neutral light/dark theme. That's the foundation.
2. Dark mode: toggle the `dark` class on `<html>` (respect `prefers-color-scheme` for the initial value).

## 2. Pick a colour group (optional)

1. Also import `themes.css`.
2. Set `data-theme` on `<html>`: `<html data-theme="ocean">`. Groups: `slate ocean forest iris terracotta
   ruby amber mono`. Combine with `class="dark"` for dark mode.

## 3. Pick a font pack (optional, Next.js)

1. Copy `fonts.ts`; `npm i geist` (only the **Signal** pack needs it). Apply the pack's CSS variables on
   `<html>` (see the file header). The pack only changes `--font-sans` / `--font-display` — never structure.

## 4. Use the components

Two paths — **use the same tokens either way** so the visuals match:

- **Any app (no Tailwind):** copy `components.css` + `components/*` and use `<Button variant="primary">`,
  `<Input error>`, `<Card interactive>`, etc. They read the CSS variables, so a colour group / brand
  re-skins them with zero code changes.
- **Tailwind / shadcn app:** copy `tailwind.config.ts` (or the `@theme` block for v4). Your existing
  shadcn components already reference `--primary`, `--border`, `--ring`… so adopting `globals.css`
  re-skins them to this standard automatically. You don't need `components.css` in that case.

## 5. Layer a brand on top (last)

A brand skill (e.g. `zhenhub-brand`) overrides **only**: the colour tokens, `--font-sans` /
`--font-display`, the logo asset, and optionally the single `--radius`. It must **not** touch spacing,
type sizes, shadow, motion, sizing, or component anatomy. Apply brand CSS **after** `globals.css` +
`themes.css` so it wins. Example (`zhenhub`):

```css
:root {
  --font-sans: "DM Sans", var(--font-sans);
  --color-primary: #286cb4; --color-primary-foreground: #ffffff; --color-ring: #286cb4;
  --color-accent: #e8f1fa;  --color-accent-foreground: #1c4e84;
  /* optional: --radius: .5rem; */
}
.dark { --color-primary: #4f93d6; }
```

## Invariants to carry forward

- **Tokens are the contract.** Components reference only semantic tokens (`--color-*`) + structural
  tokens (`--space-*`, `--radius`, motion). Never hard-code a hex/px/ms in a component.
- **Structure is frozen; only the brand layer changes** colour/font/logo/radius. If a brand "needs" to
  change spacing or sizing, the base is wrong — fix the base, not the brand.
- **Every actionable element implements the full state cycle** (hover→press→release→focus→disabled→
  loading) — it's baked into `components.css`; keep it when you add components.
- **Accessibility floors:** ≥44px touch targets where it matters, visible focus rings (never removed),
  WCAG AA contrast in **both** modes, never colour-as-only-signal (see DESIGN_STANDARD §14, §20).
- **Charts get their own `--chart-*` palette** (Okabe-Ito, colourblind-safe) — not the brand accent.
