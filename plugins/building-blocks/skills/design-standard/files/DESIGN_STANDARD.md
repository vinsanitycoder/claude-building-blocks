# DESIGN_STANDARD.md — Base UI Standard (brand-agnostic)

> **What this is.** A single, opinionated design standard that every app you build should
> follow *before* any brand is applied. It fixes the structure — spacing, sizing, buttons,
> states, motion, component anatomy — so every app feels consistent. Brand (color, font,
> logo, corner softness) is a thin layer applied **on top** via your brand skills
> (`zhenhub-brand`, etc.). Structure here; brand there. Never mix them.
>
> **Why it exists.** Claude (and most AI coding tools) produce inconsistent, "samey" UIs
> because, with no fixed reference, each build reinvents the spacing and reaches for the same
> training-data defaults. This document removes the choices. When a value is constrained to a
> scale, there is nothing to drift.
>
> **How to use it.** Paste this file into a project (or reference it from `CLAUDE.md`) and
> instruct Claude to follow it. Apply the brand skill *after*. Appendix A is a copy-paste
> token file; Appendix C shows exactly what a brand is allowed to override.
>
> **Provenance tags.** Every load-bearing number is tagged:
> **[Verified]** = confirmed in this project's deep research against primary sources
> (shadcn, Tailwind, Material 3, W3C/WCAG, EightShapes).
> **[Convention]** = the established industry default I'm locking as our opinionated choice.
> See the Sources section for the verified set and what was explicitly *refuted*.

---

## 0. The verdict (read this first)

**Adopt a neutral, shadcn/ui-style semantic-token base as the structural layer. Treat every
brand — including an Anthropic-style "warm minimalism" — as a swappable skin on top.** **[Verified]**

Reasoning from the research:

- shadcn's tokens are named by **role, not color** (`background`, `foreground`, `primary`,
  `muted`, `destructive`, `border`, `ring`…). You "change the look of the app without
  rewriting component classes" by overriding token *values*. That is the exact mechanism that
  lets one base re-skin per brand. **[Verified]**
- This matches the W3C Design Tokens spec (first **stable** version 2025.10, Oct 2025), which
  formalises **theming/multi-brand without file duplication** via primitive→semantic aliasing.
  **[Verified]**
- An Anthropic-style cream+coral palette is *a brand identity*. Hard-coding it would make your
  base Anthropic-branded, not brand-agnostic. Offer it as one skin; don't bake it in. **[Verified]**

So: **structure = this document. Color/font/logo = the brand layer.**

---

## 1. Core architecture — two tiers of tokens

Everything is a CSS variable. There are exactly two tiers. **[Verified]**

```
TIER 1 — PRIMITIVES (raw values; the brand-agnostic substrate; rarely touched)
  --space-1..--space-24, --text-xs..--text-5xl, --radius, --shadow-*, --duration-*, --ease-*
        │  aliased to ▼
TIER 2 — SEMANTIC (role-named; what components actually reference)
  --color-background, --color-foreground, --color-primary, --color-border, --color-ring …
```

Rules:
1. **Components only ever reference Tier-2 semantic tokens** (and Tier-1 *structural* tokens
   like spacing/radius/motion). They must **never** hard-code a hex, px, or ms value.
2. **A brand may only redefine token *values*.** It may not add new component classes or
   change which token a component uses.
3. **Structure (spacing, sizing, radius scale, motion, elevation) stays in the base.** A brand
   touches **color, font, logo, and the single `--radius` base value** — nothing else.
   (Token naming taxonomy per EightShapes: namespace → object → base → modifier.) **[Verified]**

This is why "apply brand afterward" works cleanly: the brand skill overrides ~15 color tokens,
2 font variables, the logo, and optionally `--radius`. The other ~60 structural tokens are frozen.

---

## 2. The 10 anti-"AI-slop" rules

These are the specific tells that make generated UIs look cheap, and the fix for each. **[Verified — synthesised from the "why AI UIs look cheap" research angle]**

1. **No default Inter + Tailwind indigo/violet.** "VibeCode purple" (`indigo-500`/`violet-500`)
   and Inter-as-default are the #1 AI signature. Always set a deliberate font and a deliberate
   accent. The base ships *neutral*; the brand must supply a real accent.
2. **One accent colour, used sparingly.** Primary actions only. Rainbow UIs read as generated.
3. **Kill the clichés:** no colored left-border cards, no icon-on-top generic feature cards,
   no glassmorphism-everywhere, no gratuitous gradient hero. Use one flat card pattern.
4. **Snap everything to the scale.** No arbitrary `p-[13px]` / `mt-[27px]`. If a value isn't on
   the spacing scale, it's wrong. This single rule removes most visible drift.
5. **One layout primitive, repeated.** Pick the page shell (sidebar + content, or top-nav +
   container) once and reuse it on every screen. Don't reinvent layout per page.
6. **One button, everywhere.** Same heights, same variants, same states — no bespoke buttons.
7. **Borders + restrained shadow, not heavy drop-shadows.** Depth comes from a 1px border and a
   *subtle* shadow, not blur. (Anthropic's own language: "whitespace and color blocking over
   shadows.")
8. **Dark mode must pass contrast.** AI dark modes routinely fail WCAG (gray-on-gray). Every
   semantic token has a tested dark value; verify contrast both modes.
9. **Consistency beats novelty.** The same card, same spacing rhythm, same empty-state pattern
   on every screen. Sameness *within* an app is the goal; sameness *across the internet* (the
   slop look) is what we're avoiding — and a deliberate palette/font is what separates them.
10. **Generous, consistent whitespace.** Cramped + uneven gaps is the cheap tell. Use the
    spacing scale's larger steps between sections; don't crowd.

---

## 3. Spacing & layout

> This section is the spacing **scale** (the legal values). For the prescriptive *system* that makes
> layouts feel intentional — semantic spacing **roles**, the **proximity rule**, and exact control /
> field / card / screen / modal **sizing** — see **§21 (the spacing & sizing playbook)**. If a screen
> ever feels "boxes placed at random," the fix lives in §21.

**Base unit: 4px. Layout rhythm: 8px (the 8-point grid).** Use multiples of 4 for component
internals; prefer multiples of 8 for layout gaps. **[Verified — 8px is the convergent enterprise
base (IBM Carbon "mini unit", Atlassian); Tailwind/Atlassian use a 4px half-step]**

### Spacing scale (Tailwind-aligned) **[Convention]**

| Token | px | rem | Typical use |
|---|---|---|---|
| `--space-0` | 0 | 0 | reset |
| `--space-1` | 4 | 0.25 | icon ↔ label, tight inline |
| `--space-2` | 8 | 0.5 | inside small controls |
| `--space-3` | 12 | 0.75 | input padding, chip |
| `--space-4` | 16 | 1 | **default gap**, card padding (compact) |
| `--space-5` | 20 | 1.25 | |
| `--space-6` | 24 | 1.5 | **card padding (default)**, between fields |
| `--space-8` | 32 | 2 | between groups |
| `--space-10` | 40 | 2.5 | |
| `--space-12` | 48 | 3 | section padding (compact) |
| `--space-16` | 64 | 4 | between sections |
| `--space-20` | 80 | 5 | |
| `--space-24` | 96 | 6 | major section rhythm |

**Default gap = 16px. Card padding = 24px. Section spacing = 64px.** Pick from the table; never
interpolate.

### Containers, breakpoints, gutters **[Convention]**

- **Breakpoints:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (Tailwind defaults).
- **App container max-width:** `1280px` (`max-w-7xl`), centered.
- **Reading/prose max-width:** `65ch` (~720px) — see Typography "measure".
- **Page gutters:** `16px` on mobile, `24px` on ≥ md. (`px-4 md:px-6`.)

---

## 4. Typography

One UI font family (brand-supplied; base falls back to system stack). Type sizes come from a
fixed ramp — do not introduce off-ramp sizes. **[Convention]**

### Type scale (rem / px @16 base · line-height)

| Token | size | line-height | Role |
|---|---|---|---|
| `--text-xs` | 0.75 / 12 | 1.33 (16px) | captions, legal, table meta |
| `--text-sm` | 0.875 / 14 | 1.43 (20px) | secondary text, help, labels |
| `--text-base` | 1.0 / 16 | 1.5 (24px) | **body default** |
| `--text-lg` | 1.125 / 18 | 1.56 (28px) | lead paragraph |
| `--text-xl` | 1.25 / 20 | 1.4 (28px) | h4 / card title |
| `--text-2xl` | 1.5 / 24 | 1.33 (32px) | h3 |
| `--text-3xl` | 1.875 / 30 | 1.2 (36px) | h2 |
| `--text-4xl` | 2.25 / 36 | 1.11 (40px) | h1 |
| `--text-5xl` | 3.0 / 48 | 1.0 | display / hero |

### Rules **[Convention]**

- **Line-height:** body `1.5`; headings `1.1–1.25` (tighter as size grows). Encoded above.
- **Weights:** body `400`; UI labels & buttons `500`; headings `600`; reserve `700` for rare
  emphasis. Don't use more than 3 weights in one app.
- **Measure (line length):** body text **60–75 characters** (`max-w-[65ch]`). The single
  biggest readability lever; AI output usually runs lines too wide.
- **Letter-spacing:** `0` for body; slight negative (`-0.01em` to `-0.02em`) on large display
  headings only.
- **Numbers in tables/data:** use `font-variant-numeric: tabular-nums`.

---

## 5. Color & depth

### 5.1 Semantic color contract (shadcn-style) **[Verified]**

Every surface token has a matching `-foreground` for legible text/icons on it. The `-background`
suffix is omitted on the surface token (so `primary` pairs with `primary-foreground`).

| Token | Pairs with | Role |
|---|---|---|
| `--color-background` | `--color-foreground` | app canvas / base text |
| `--color-card` | `--color-card-foreground` | card / raised surface |
| `--color-popover` | `--color-popover-foreground` | menus, popovers, tooltips |
| `--color-primary` | `--color-primary-foreground` | primary action |
| `--color-secondary` | `--color-secondary-foreground` | secondary action |
| `--color-muted` | `--color-muted-foreground` | subtle bg / secondary text |
| `--color-accent` | `--color-accent-foreground` | hover/highlight surface |
| `--color-destructive` | `--color-destructive-foreground` | danger/delete |
| `--color-border` | — | hairline borders |
| `--color-input` | — | input border |
| `--color-ring` | — | focus ring |

Add success/warning if the app needs them (`--color-success` / `--color-warning` + foregrounds).
The **base ships these neutral** (grayscale + a neutral primary); the **brand supplies the real
hues**. **[Verified]**

> Sourcing a brand palette: map a 12-step perceptual scale (e.g. Radix Colors) onto these slots
> — neutrals for surfaces/borders/text, the brand hue for `primary`/`ring`. Use the *approach*,
> not hard-coded step numbers (the "step 9 = primary" mapping was **refuted** as unstable). **[Verified]**

### 5.2 Radius **[Verified]**

One base variable drives the whole scale.

- `--radius: 0.625rem` (**10px**) base — matches shadcn; the effective button/card radius lands
  at ~8px.
- Derived: `sm = radius − 4px`, `md = radius − 2px`, `lg = radius`, `xl = radius + 4px`,
  `full = 9999px`.
- **Buttons, inputs, cards = `md` (~8px). Pills/avatars = `full`.**
- **A brand may set `--radius`** to retune softness app-wide (e.g. `0.5rem` sharp, `0.875rem`
  friendly) — this is the *one* structural value a brand is allowed to touch.

> Tailwind note: v3 names radii `sm/md/lg…`; v4 renamed them (`sm→xs`, etc.). Reference the CSS
> variable, not the Tailwind class name, to stay version-proof. **[Verified]**

### 5.3 Elevation / shadow **[Convention]**

Restrained, 5-step. Depth = border + subtle shadow, never blur-heavy.

| Token | Use |
|---|---|
| `--shadow-xs` | inputs, subtle |
| `--shadow-sm` | cards at rest |
| `--shadow-md` | dropdowns, hover-raise |
| `--shadow-lg` | popovers, modals |
| `--shadow-xl` | rare, top-level dialogs |

One shadow per elevation level. A raised card gets `border + shadow-sm`, not a giant drop shadow.

### 5.4 Borders **[Convention]**

`1px` solid `--color-border` for separators and resting card edges. Use borders + spacing to
create structure before reaching for shadow or color.

---

## 6. Buttons & interactive controls

The most-reused control — lock it hard. **[Convention, accessibility floor Verified]**

### Sizes

| Size | Height | Padding (y / x) | Font | Use |
|---|---|---|---|---|
| `sm` | 32px | 6 / 12 | 14/500 | dense toolbars |
| `md` (default) | 40px | 8 / 16 | 14/500 | **default** |
| `lg` | 44px | 12 / 24 | 16/500 | primary CTAs, touch |
| `icon` | = height, square | — | — | icon-only |

**Touch floor:** interactive targets must be **≥ 24×24px (WCAG 2.5.8 AA)**; aim for **44×44px
(WCAG 2.5.5 AAA / Apple HIG 44pt)** on primary/touch. If a button renders < 44px tall, expand its
hit area to 44px. **[Verified]** Material's equivalent is 48dp. **[Verified]**

### Variants

| Variant | Look |
|---|---|
| `primary` | solid `--color-primary` / `-foreground` |
| `secondary` | tonal `--color-secondary` |
| `outline` | transparent bg + `--color-border` |
| `ghost` | transparent; `--color-accent` on hover |
| `destructive` | solid `--color-destructive` |
| `link` | text only, underline on hover |

### State matrix (every variant implements all) **[Convention]**

| State | Treatment |
|---|---|
| default | base |
| hover | shift surface ~4–8% (darken solids / tint ghosts) |
| active | slightly stronger shift; optional `translateY(0.5px)` |
| focus-visible | `2px` ring in `--color-ring` + `2px` offset — **keyboard only**, never remove outlines |
| disabled | `opacity: 0.5`, `pointer-events: none`, no hover |
| loading | inline spinner, label stays, control disabled, width stable (no layout jump) |

Font weight `500`. Default `md`/40px.

**Interaction feel (locked):**
- **Hover (everything interactive lifts)** — every button, card, menu item, input and clickable surface gains a **shadow** on hover (`shadow-sm → shadow-md`) plus a `translateY(-1px)` lift over `150ms`; raised/clickable cards lift `-2px`. Solids also shift surface 4–8%; outline/ghost additionally fill with `--color-accent`. **Exception:** text links (underline only — no shadow/lift). In dark mode the shadow reads faint, so the lift carries the cue.
- **Press (active)** — tactile compress: `transform: scale(0.97)` (or `translateY(1px)`) over `~100ms` with `--ease-standard`. Every button and clickable card gets this; it's the biggest "feels responsive" cue.
- **Transition** — `150ms` on `background-color, box-shadow, transform, color` (see §8).

**Spacing between buttons (groups):**
| Context | Gap |
|---|---|
| Dialog/form action row (primary + cancel) | `8px` (`gap-2`) |
| General button group | `8–12px` |
| Dense toolbar / segmented control | `4px` (`gap-1`), or `0` with shared borders |
| Stacked (vertical) buttons | `8px` |

Primary action sits **right-most** in a horizontal action row (and is the full-width top button on mobile stacks). Never crowd two solids together — pair one solid `primary` with a `ghost`/`outline` secondary.

### Universal interactive-state matrix (every actionable element)

**Anything a user can act on — buttons, links, menu items, clickable cards, table rows, tabs, chips, toggles,
sliders, calendar days, icon buttons — implements this full cycle.** Decide it once here; don't re-litigate per
component.

| State | Trigger | Treatment |
|---|---|---|
| **Rest** | default | base token colours |
| **Hover** | pointer over (`@media (hover:hover)`) | shadow lift + `translateY(-1px)` (cards −2px); solids shift surface 4–8%, ghost/outline fill `--color-accent` |
| **Press** | pointer/finger down (`:active`) | compress `scale(0.97)` or `translateY(1px)`, ~100ms, shadow drops |
| **Release** | pointer up | springs back to **hover** (if still over) or **rest** over ~150ms `--ease-standard` — the bounce-back *is* the tactile confirmation |
| **Focus-visible** | keyboard focus | `2px` ring `--color-ring` + `2px` offset; never removed |
| **Disabled** | unavailable | `opacity:.5`, `pointer-events:none`, no hover/press |
| **Loading** | async in flight | spinner replaces/precedes label, control disabled, width held (no reflow) |
| **Selected/active** | current item | persistent `--color-accent`/primary indicator (tabs, nav, segmented, calendar day) |

Press = `:active` (down); **release** = the transition back when `:active` clears — keep `transition` on
`transform, box-shadow` so the spring-back animates, not snaps. Touch has no hover, so the press→release
compression carries the feedback (gate hover-only effects behind `@media (hover:hover)`).

### Slider — full state model

Track + filled range + thumb(s).
- **Track** — rest `--color-muted`; filled portion `--color-primary`.
- **Thumb rest** — `--color-background` fill, `2px --color-primary` border, `shadow-sm`.
- **Thumb hover** — grows (16→18px) + soft halo `0 0 0 6px` primary @~12% alpha.
- **Thumb press/grab** (`:active`) — halo strengthens (`0 0 0 8px` @~18%), cursor `grabbing`, value tooltip appears.
- **Thumb release** — halo relaxes to the hover ring over ~150ms.
- **Dragging** — tooltip persists, filled range tracks live.
- **Focus-visible** — same halo using `--color-ring`; arrow keys move by step.
- **Disabled** — `opacity:.5`, no halo, `pointer-events:none`.

Thumb hit area ≥ 24px even when the visual thumb is 16px.

---

## 7. Forms & inputs

Inputs visually match buttons (same heights/radius) so rows align. **[Convention]**

- **Input height:** 40px default (matches button `md`); `sm` 32 / `lg` 44. Horizontal padding
  12–16px. Radius `md`. Border `--color-input`.
- **Label:** above the field, `14px / 500`, `6px` gap to input. Required marker `*` in
  `--color-destructive` *plus* the word "required" for screen readers (never color alone).
- **Help text:** below, `14px`, `--color-muted-foreground`.
- **Error:** border → `--color-destructive`, message below in destructive color **with an icon**
  (not color-only), and `aria-describedby` wired to the message. **[Convention; "don't rely on
  color alone" is a WCAG principle — Verified]**
- **Focus:** same `2px` ring as buttons.
- **States:** default · focus · error · disabled (50% opacity). Don't disable-and-hide why;
  show validation inline, not only on submit.
- **Placeholders are not labels.** Always render a visible label.

---

## 8. Motion & transitions

Material Design 3 is the most concrete cross-industry reference; use its curves + a trimmed
duration set. **[Verified]**

### Durations **[Verified ramp; trimmed for web UI — Convention]**

| Token | ms | Use |
|---|---|---|
| `--duration-fast` | 150 | hover, color/bg, small toggles |
| `--duration-base` | 200 | **default** transitions |
| `--duration-slow` | 300 | overlays/modals/drawers enter |

Keep UI interactions in **150–300ms**. Anything > 400ms feels sluggish; M3's longer tokens
(450–1000ms) are for large/expressive transitions only.

### Easing (M3 standard set) **[Verified]**

| Token | cubic-bezier | Use |
|---|---|---|
| `--ease-standard` | `0.2, 0, 0, 1` | **default** (most transitions) |
| `--ease-decelerate` | `0, 0, 0, 1` | elements **entering** |
| `--ease-accelerate` | `0.3, 0, 1, 1` | elements **exiting** |

**Interaction tokens:** press/compress `100ms`; hover-raise `150ms`; both `--ease-standard`. Overlays/drawers/menus enter at `--duration-slow` (300ms, or 150ms for small menus) with `--ease-decelerate`, exit with `--ease-accelerate`. A dropdown enters `opacity 0→1` + `translateY(-4px)→0`; a disclosure body animates `max-height`/`opacity`.

### Rules **[Convention]**

- **Animate `transform` and `opacity`** (GPU-cheap). Avoid animating `width`/`height`/`top`/
  `left` (layout thrash).
- **Always honour `prefers-reduced-motion: reduce`** — drop non-essential motion to near-instant
  opacity. Required, not optional.
- Motion should clarify (where did this come from), not decorate.

---

## 9. Dark mode

One base, two value sets, switched by a class. **[Verified — this is the shadcn mechanism]**

- Define **every semantic color token** in `:root` (light) and again under `.dark` (dark). Same
  names, different values. Components never change. **[Verified]**
- Toggle by adding/removing `.dark` on `<html>` (or `data-theme="dark"`). Respect
  `prefers-color-scheme` for the initial value; let the user override.
- Dark is **not** inverted light: dark surfaces are near-black-but-warm (not pure `#000`), text
  is off-white (not pure `#fff`), and elevation is shown by *lighter* surfaces rather than
  shadows.
- **Verify WCAG contrast in both modes** (body text ≥ 4.5:1, large text/UI ≥ 3:1). Failing dark
  contrast is a classic AI tell. **[Convention; contrast ratios are WCAG — Verified]**

---

## 10. Core components (anatomy)

Standard skeletons. Each references only tokens above. **[Convention]**

- **Card:** surface `--color-card`, `1px --color-border`, radius `md`, padding `24px`,
  `shadow-sm`. Optional header (title `text-xl/600` + optional description `text-sm muted`) and
  footer (actions, right-aligned). Internal vertical rhythm `16px`.
- **Modal / Dialog:** overlay `rgba(0,0,0,0.5)`; panel centered, `--color-popover`, radius `lg`,
  padding `24px`, `max-w` 480 (sm) / 640 (default), `shadow-lg`. **Focus-trap, restore focus on
  close, `Esc` closes, click-outside closes.** Title is `text-xl/600`; primary action bottom-right.
- **Table:** header row `--color-muted` bg, `text-sm/500`; cells padding `12px 16px`; row
  separators `1px --color-border`; hover row `--color-accent`; numeric columns right-aligned +
  tabular-nums. Sticky header for long tables.
- **Nav:** fixed height **56–64px**; active item uses `--color-accent` + `--color-foreground`,
  inactive `--color-muted-foreground`. One nav pattern app-wide (top bar *or* sidebar, not both
  re-styled per page).
- **Toast:** top-right or bottom-right, `max-w` 420, `--color-popover`, radius `md`, `shadow-lg`,
  icon + message + optional action + dismiss; auto-dismiss ~5s (errors persist). Stack newest-first.
- **Dropdown / menu:** trigger is a button (often `outline`/`ghost` with a trailing `chevron-down`).
  Menu = `--color-popover` surface, radius `md`, `shadow-lg`, `1px border`, `4px` inset padding; items
  `32–36px` tall, `8–12px` horizontal padding, hover = `--color-accent`, selected shows a leading
  `check`. Group with `1px` separators; destructive items use `--color-destructive` text. Opens on
  click; closes on outside-click / `Esc` / select; `max-height` + scroll past ~8 items. Animate in:
  `opacity 0→1` + `translateY(-4px)→0`, `150ms` decelerate.
- **Dismissible (banner / toast / chip):** a close affordance top-right — an icon button (`x`) with a
  **≥24px** (ideally 44px) hit area, `--color-muted-foreground` → `--color-foreground` on hover.
  Dismiss animates `opacity→0` + slight collapse, `150ms` accelerate. Always give the `x`
  `aria-label="Dismiss"`.
- **Collapsible / disclosure (accordion):** header is a full-width button (title + trailing
  `chevron-down` that rotates `180°` when open); body expands `max-height`/`opacity` over `200ms`
  standard. Keyboard: `Enter`/`Space` toggles; `aria-expanded` reflects state; never `display:none`-snap.
- **Empty state:** honest, not a fake skeleton — short heading, one line of guidance, one primary
  action. (Matches your "honest coming-soon" preference.)

---

## 11. Font packs (pick one per app) **[Researched]**

Type is the fastest way to make two apps feel distinct while the structure stays identical. Pick
**one pack** per app. All fonts are free (Google Fonts or SIL OFL). Load via `next/font` — it
self-hosts, subsets, and sets `size-adjust` to prevent layout shift. Principles: limit to 1–2
families + a mono; pair a high-character **display** with a neutral **body**; match x-height;
superfamilies (Geist, IBM Plex) are the safe shortcut. The pack is **brand layer** — swapping it
must not change any spacing or sizing. Concrete `next/font` setup for all six is in `FONTS.ts`.

| Pack | Personality | Display / Body / Mono | Best for | Avoid-generic note |
|---|---|---|---|---|
| **Signal** | clean Swiss SaaS | Geist / Geist / Geist Mono | dashboards, internal tools | Geist is *the* shadcn default — tighten heading tracking, use Geist Mono for labels |
| **Broadsheet** | warm editorial | Fraunces / Source Serif 4 / IBM Plex Mono | content, docs, marketing | use a serif *body* (not Inter); Fraunces over Playfair |
| **Marshmallow** | friendly rounded | Quicksand / Nunito / JetBrains Mono | consumer, education, family | Quicksand headings only; calmer than Poppins |
| **Terminal** | technical, data | Space Grotesk / Inter / JetBrains Mono | dev tools, analytics | push mono into the UI; Inter is body-only |
| **Charter** | corporate trust | IBM Plex Sans / IBM Plex Sans / IBM Plex Mono | fintech, enterprise, gov | Plex Mono for figures; more distinctive than Roboto |
| **Megaphone** | bold startup | Sora / Inter / Geist Mono | landing pages, launches | display 700/800 tight tracking; body stays neutral |

**Weights:** body `400/500/600`, display `600/700` (Megaphone adds `800`), mono `400/500`. Use the
**variable** font once you need 3+ weights. `font-display: swap`. Self-hosting via `next/font` is
~180ms faster LCP than the Google CDN and GDPR-friendly.

---

## 12. Color groups (pick one per app) **[Researched — WCAG-verified]**

Eight pre-designed palettes, each mapping onto the semantic tokens in light + dark, derived from
**Radix Colors'** 12-step scales. Every group's key contrast pairs were computed against the WCAG
formula and pass AA. The full paste-ready token sets (light + dark) are in **`THEMES.css`** — set
`data-theme="ocean"` on `<html>` and toggle `.dark`.

**The one rule that keeps them accessible:** in **light mode**, `primary` uses the accent's *darker*
step (10–11) so white `primary-foreground` passes AA — the bright brand step (e.g. `blue-9 #0090ff`)
fails white text at ~3.3:1. In **dark mode**, `primary` uses the *lighter* step with a near-black
foreground. Keep the brand hue confined to: the primary button, links, the focus `ring`, and small
active indicators. Everything else stays on the neutral scale. That discipline is what separates a
designed theme from AI slop.

| Group | Vibe | Neutral (gray temp) | Light `primary` | Use for |
|---|---|---|---|---|
| **Slate** | quiet default | slate (cool) | near-black | dashboards, B2B, internal tools |
| **Ocean** | trustworthy blue | slate (cool) | `#0d74ce` | fintech, health, productivity |
| **Forest** | natural green | sage (cool-green) | `#218358` | sustainability, health, finance-up |
| **Iris** | premium violet | mauve (cool-purple) | `#5753c6` | AI / creative (escapes purple cliché) |
| **Terracotta** | warm, human | sand (warm) | `#c2410c` | editorial, human-AI, lifestyle |
| **Ruby** | bold rose | mauve | `#ca244d` | consumer, social, beauty |
| **Amber** | warm gold | sand (warm) | `#ffc53d`† | luxury, hospitality |
| **Mono** | high-contrast | pure gray | `#000000` | accessibility-first, editorial |

† Amber is light, so its `primary-foreground` is **near-black, not white** — the one group that
inverts the button. Also make `warning` visually distinct (icon, not hue alone) when amber is the brand.

**Neutral-temperature rule:** pair the accent with the gray saturated toward the same hue — slate↔blue,
sage↔green, mauve↔violet/rose, sand↔orange/amber, pure gray↔anything. **Dark-mode rule:** never pure
black/white (near-black warm surface + near-white text); cards are *lighter* than the page; lighten the
accent.

---

## 13. Date & time selection **[Researched]**

The most-botched control family. Get the **format rules** right and the rest is styling.
Library reality: shadcn's `Calendar` wraps **react-day-picker**; **Radix has no calendar primitive**;
reach for **react-aria** (`@internationalized/date`) when you need typed segments, time, or timezone
correctness.

**Format rules (load-bearing — apply to every date control):**
1. **Store/serialize ISO 8601; display in the user's locale.** Date-only = `YYYY-MM-DD`; instant =
   full ISO with zone `2026-06-14T21:30:00Z`. Never store a localized string.
2. **Display via `Intl.DateTimeFormat`** (use `dateStyle`/`timeStyle`), never hand-rolled. Locale alone
   decides first-day-of-week, MM/DD vs DD/MM order, month names, and 12h vs 24h.
3. **Default locale = the user's runtime locale** (pass `undefined` to `Intl`), not hardcoded `en-US`.
   First-day-of-week and 12h/24h are locale-driven; expose an override only for single-region products.
   Pragmatic default when forced: 24h for ops/enterprise/global, 12h for US-consumer.
4. **The #1 bug — timezone off-by-one.** `new Date("2026-01-01")` parses as **UTC midnight**, so users
   west of UTC see the previous day. **Calendar dates** (birthday, due date) are zoneless — never
   round-trip through `new Date(string)`; use a `CalendarDate`/`parseDate()` type. **Instants** (event
   time) store **UTC**, render with an explicit `timeZone`. A trailing `Z` = UTC; its absence = local.
5. **SSR:** detect the timezone in `useEffect` via `Intl.DateTimeFormat().resolvedOptions()`, not at
   render, to avoid hydration mismatch.

**Components & anatomy:**
- **Single date picker** = input/trigger (shows `Intl` `dateStyle:'medium'`, placeholder when empty) +
  popover calendar. Value bound as `YYYY-MM-DD`.
- **Date-range picker** = two date fields + **two-month** calendar side-by-side on desktop (≈`min-w-580px`);
  after the first click, **hover-preview** the tentative range. States: `range-start / middle / end`.
  Presets live in a **left rail** inside the popover.
- **Calendar** = month/year heading (`aria-live="polite"`) + prev/next + weekday row + month grid.
  **Day cell 40px desktop / 44px touch.** Required states, all distinct *and not color-only*: `default`,
  **`today`** (ring/dot — must differ from selected), `selected`, `range-*`, `hover/focus`, `disabled`,
  `outside-month` (muted).
- **Time picker** = segmented `HH : MM (: AM/PM)` field (each segment focusable, arrows inc/dec) — matches
  input height 40px. AM/PM is display-only; never serialize "9:30 PM".
- **Date-time** = date segments + time segments; serialize full ISO with zone, store UTC.
- **Typed input vs popover:** offer **both in one control** — typed/segmented for known/far dates (DOB,
  expiry) and power users; popover for browsing/ranges. On **mobile, prefer native `<input type="date">`**
  for single dates (free touch + a11y + locale; value is ISO), custom calendar only for ranges/presets/time.

**min/max/disabled/validation:** native `min`/`max` (`yyyy-mm-dd`); arbitrary disabled via predicate;
disabled cells get `aria-disabled` and are keyboard-skipped. Errors inline + specific ("End date must be
after start date"), linked by `aria-describedby`. **Presets** ("Today / Yesterday / Last 7 days / Last 30
days / This month"): range pickers in analytics/filter contexts, most-used first.

**Keyboard (W3C ARIA APG date-picker):**
| Key | Action |
|---|---|
| ← / → | prev / next day |
| ↑ / ↓ | same weekday prev / next week |
| Home / End | first / last day of week |
| Page Up / Down | prev / next month |
| Shift+Page Up / Down | prev / next year |
| Enter / Space | select, close, return focus to trigger |
| Esc | close, return focus to trigger |

**Accessibility:** calendar = `role="grid"`, days = `gridcell` buttons; **roving tabindex** (one cell
`tabindex=0`, rest `-1`; arrows move focus, not Tab); `aria-selected` on selected; month changes announced
via `aria-live`; on open focus today (or the selected day), on close return focus to the trigger; full
weekday names via `abbr`; modal calendar **contains** focus (Tab wraps) but Esc always escapes.

---

## 14. Inline text & links (hover on words) **[Researched]**

Interactions on *words*, not buttons. Governing rule: **never rely on colour alone** (WCAG 1.4.1) — a
body link needs a second cue (the underline), present **at rest**, not only on hover.

**Text links (body/prose):**
```css
a {
  color: var(--color-link);                 /* defaults to --color-primary; ≥4.5:1 on bg */
  text-decoration-line: underline;
  text-decoration-thickness: 0.08em;        /* ~1px @16; scales with text */
  text-underline-offset: 0.15em;            /* 0.1–0.2em, clears descenders */
  text-decoration-skip-ink: auto;
  transition: color 150ms, text-decoration-thickness 150ms;
}
a:hover { text-decoration-thickness: 0.12em; }   /* underline thickens */
a:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; border-radius: 2px; }
a:visited { color: var(--color-link-visited); }  /* colour-only OK for :visited (privacy-restricted) */
```
- **Underline at rest for prose links.** Underline-on-hover-only is allowed *only* where links are already
  unambiguous (nav bars, card titles, link lists) — not inside paragraphs.
- **Colour-only links** (no rest underline) need **≥3:1 contrast vs the surrounding text** *and* a cue on
  hover **and** focus. Simplest path: just keep the underline.
- Use `:focus-visible` (keyboard only), not `:focus`.

**External links:** trailing external icon + `target="_blank" rel="noopener noreferrer"` + visually-hidden
"(opens in a new tab)". The icon is the non-colour cue for link *type*.

**Inline `code`:** subtle tint + small padding + radius, scoped to inline (not `<pre>`):
```css
:where(p,li,td,h1,h2,h3,h4) > code{font-family:var(--font-mono);font-size:.875em;
  background:var(--color-muted);padding:.15em .35em;border-radius:.25em;box-decoration-break:clone}
```

**"Read more" / clamp:** `line-clamp` + a real `<button aria-expanded>` (it's an action, not navigation);
toggle a class (line-clamp isn't animatable). Tap target ≥24px (ideally 44px).

**Mentions / hashtags / tags:** focusable, non-colour cue (weight or pill background), same focus ring;
hover tints background. Pill tags: `padding:.1em .5em;border-radius:999px`.

**Hover cards (rich preview):** **supplementary only** — every fact must be reachable another way (they're
mouse-only). Open delay ~500ms, close ~300ms; must be **hoverable** (bridge the gap), **dismissible** (Esc),
and the trigger keyboard-reachable (Enter navigates to the full info). WCAG 1.4.13.

**Tooltips (terms/abbreviations):** **text-only, non-interactive** (`role="tooltip"` + `aria-describedby`);
show on hover **and** focus; trigger is focusable but the tooltip never takes focus; Esc dismisses; must be
hoverable + persistent (1.4.13); open delay ~150–500ms. Never put links/buttons in a tooltip — that's a
popover/hover-card. For abbreviations, spell the term out on first use rather than hiding meaning in `title`.

**Selection:** brand the highlight — `::selection{background:var(--color-accent);color:var(--color-accent-foreground)}`.

**Hover-on-touch:** touch has no hover and tapped `:hover` can stick. So (1) never hide essential info/actions
behind hover-only; (2) gate hover enhancements behind `@media (hover:hover) and (pointer:fine)`; (3) provide a
tap-to-toggle fallback for anything hover-revealed (row actions stay visible on `pointer:coarse`).

**Quick numbers:** underline `0.08→0.12em`, offset `0.1–0.2em`; link text ≥4.5:1 vs bg, colour-only link ≥3:1
vs text; focus ring 2px + 2px offset ≥3:1; tooltip open 150–500ms; hover-card 500/300ms.

---

## 15. Component coverage map (so nothing common is missed) **[Researched — union of shadcn, Radix, Material 3, Carbon, Polaris, Primer]**

✓ = standardized above · ➜ = **standardize now** (essential/common gap; anatomy below) · · = niche/defer.

| Forms & inputs | | Navigation / overlay | | Feedback / data / content | |
|---|---|---|---|---|---|
| Button + group | ✓ | Top nav / sidebar | ✓ | Toast | ✓ |
| Text input | ✓ | Tabs | ➜ | Inline alert / callout | ➜ |
| Textarea | ➜ | Breadcrumbs | ➜ | Progress bar | ➜ |
| Select / combobox | ➜ | Pagination | ➜ | Spinner / loader | ➜ |
| Checkbox | ➜ | Menu / dropdown | ✓ | Skeleton | ➜ |
| Radio group | ➜ | Command palette ⌘K | ➜ | Badge / tag / chip | ➜ |
| Switch / toggle | ➜ | Stepper / wizard | ➜ | Avatar (+ group) | ➜ |
| Segmented control | ➜ | Modal / dialog | ✓ | Card | ✓ |
| Slider | ➜ | Drawer / sheet | ➜ | Table / data table | ✓ |
| Search field | ➜ | Tooltip | ➜ | List (ul/ol/description) | ➜ |
| Number / stepper | ➜ | Popover | ➜ | Separator / divider | ➜ |
| Multi-select / tokens | ➜ | Hover card | ✓ (§14) | Code block | ➜ |
| File upload / dropzone | ➜ | Context menu | · | Kbd | ➜ |
| Date / time picker | ✓ (§13) | Accordion / collapsible | ✓ | Blockquote | ➜ |
| Field wrapper (label+help+error) | ✓ (§5) | Empty state | ✓ | Inline links / code | ✓ (§14) |

**Standardize-now anatomy (one line each):**
- **Tabs** — `tablist › tab (label+optional count) + active indicator › tabpanel`; variants underline / pill / enclosed; overflow → scroll. States: selected/hover/focus/disabled.
- **Tooltip** — see §14. `role="tooltip"`, hover+focus, Esc, text-only.
- **Popover** — click-triggered floating panel with rich content; trigger › anchored surface (header/body/footer); outside-click/Esc closes; modal or non-modal.
- **Badge / tag / chip** — variants: status (info/success/warning/critical/neutral), count, removable tag, filter chip; sizes sm/md; optional leading dot/icon; removable adds trailing ×.
- **Switch** — instant binary (no Save); track + sliding thumb; `role="switch"`; states on/off/hover/focus/disabled/loading.
- **Checkbox** — box + check/dash (tri-state `indeterminate`) + label + helper/error; states incl. error.
- **Radio group** — `fieldset/legend › radio(dot)+label`; pick exactly one; roving focus; horizontal/vertical.
- **Select / combobox** — trigger (value+chevron) › listbox › option (check+label+optional desc); combobox adds a filter input + empty/loading/no-results; single/multi/creatable.
- **Slider** — track + filled range + thumb(s) + optional value tooltip/ticks; single or dual-thumb; states default/hover/focus/dragging/disabled.
- **Segmented control** — joined equal-width segments + selected indicator; 2–5 options, mutually exclusive.
- **Textarea** — multiline + resize handle + optional char counter; fixed or auto-grow; default/focus/error/disabled.
- **Search field** — search icon + input + clear × + optional scope select; states empty/typing/has-value/loading/suggestions.
- **Number / stepper** — input + up/down steppers + optional unit suffix; min/max-reached states.
- **Multi-select / token input** — input wrapping removable token chips + dropdown listbox; overflow / max-reached.
- **File upload / dropzone** — dashed drop region + browse button + per-file row (name/size/progress/remove); idle/drag-over/uploading/success/error.
- **Drawer / sheet** — edge-anchored panel (left/right/bottom) + scrim; header+close+scrollable body+footer; sizes sm/md/lg/full.
- **Command palette (⌘K)** — dialog + search input + grouped result list + per-item shortcut + footer hints; empty/loading/recent.
- **Breadcrumbs** — ordered ancestor links + separators; last = current (non-link); overflow → "…" menu.
- **Pagination** — prev + page numbers (+ ellipsis) + next; or load-more / page-size select + results count.
- **Stepper / wizard** — numbered/check nodes + connectors + labels; per-step upcoming/current/complete/error; horizontal or vertical.
- **Inline alert / callout** — persistent in-page message (distinct from transient toast); variants info/success/warning/critical; icon + title + body + optional actions + optional dismiss.
- **Progress bar** — track + fill; determinate (0–100%) or indeterminate; optional label/%; success/error.
- **Spinner** — animated ring/arc + optional caption; sizes xs–xl; inline/centered/overlay; powers button-loading.
- **Skeleton** — gray shapes mirroring final layout + pulse; text-line / avatar / box / table-row / card variants.
- **Avatar (+ group)** — circular image/initials/icon fallback + optional status dot; group = overlapping stack + "+N".
- **Separator / divider** — 1px rule, horizontal/vertical, optional centered label, inset or full-bleed.
- **List** — ul / ol / description (term+definition) / action-list (interactive rows).
- **Code block** — mono container + optional header (lang/filename + copy) + scroll; inline vs block; optional line numbers.
- **Kbd** — small raised key-cap for shortcuts (single key or combo ⌘+K).
- **Blockquote** — left accent border/indent + quote text + optional citation.

**Niche / defer (only if the product needs it):** context menu (right-click), toggletip, time picker beyond §13,
colour picker, OTP / password-toggle (auth only), carousel, tree view, timeline, resizable/split panels, charts,
filters/query builder. **Utilities** (standardize as tokens/helpers, not components): aspect-ratio, scroll-area,
visually-hidden, spacer/box, relative-time, truncate. **App shell / layout provider:** formalize as your page
layout, not a component.

---

## 16. App shell & layout **[Researched]**

Three regions: top bar + left sidebar + content. Concrete sizes (shadcn / Carbon / Material consensus):

| Element | Value |
|---|---|
| Top bar height | **64px** desktop (56px dense minimum) |
| Sidebar expanded | **256px** (16rem) — range 240–280 |
| Sidebar rail (collapsed) | **48–56px** (icon) or 72–80px (labeled) |
| Mobile drawer | **288px** (18rem), slide-over with scrim |
| Content max-width | **1280–1440px** centered; full-bleed for data tables |
| Page gutters | 16 (mobile) → 24 (tablet) → 32–40px (desktop) |
| Sidebar toggle | ⌘B / Ctrl+B; collapse transition 200ms |

**Responsive degrade:** inline sidebar ≥ `md` (768px); **below `md` → slide-over `Sheet` + scrim** (never an
inline panel on mobile). Expanded ↔ rail around `lg`/`xl` (1024–1280px) by density. Mobile bottom-nav only for
**3–5** top destinations (never more).

**Page header:** breadcrumbs → row[ title (+status) · primary action far-right · secondary in overflow ] →
subtitle → optional tabs. Pin the header/tab row `position:sticky; top:<topbar-height>` at the sticky z-tier.

**Grid:** 12 columns on the 8px baseline. Tailwind breakpoints `sm640 md768 lg1024 xl1280 2xl1536`. Columns by
window class: compact <600 = 4, medium 600–839 = 8, expanded ≥840 = 12.

**Z-index ladder (tokenize; change as a set, never hand-pick `z-index:99999`):**
`dropdown 1000 · sticky 1020 · fixed 1030 · drawer-scrim 1040 · drawer 1045 · modal-scrim 1050 · modal 1055 ·
popover 1070 · tooltip 1080 · toast 1090`.

**Density:** comfortable (default) = row/control 40–48px, vertical padding 12–16px; compact = 32px height, 8px
padding. Switch **vertical** rhythm only; keep horizontal padding constant.

---

## 17. Icons **[Convention]**

- **One icon set, app-wide** (e.g. Lucide — the shadcn default — or Tabler). Never mix families or blend
  outline + filled from different sets.
- **Sizes from a small scale:** `16px` (inline / dense), `20px` (default UI / buttons), `24px` (touch /
  prominent). Match icon size to adjacent text size.
- **Consistent stroke weight** (Lucide = 2px @24, scale proportionally). Never the same icon at two weights.
- **Optical alignment:** centre to text cap-height (often a `-1–2px` nudge), `gap: 6–8px` to the label. One
  concept = one glyph, everywhere.
- **Accessibility:** decorative icons `aria-hidden="true"`; icon-only controls need an `aria-label`. An icon is
  never the *only* signal for a critical state (pair with text/colour — §14, WCAG 1.4.1).
- **Touch:** icon-only button keeps a ≥44px hit area even when the glyph is 20px.

---

## 18. Content & voice (UX writing) **[Researched]**

Clear > concise > human. Second person ("you"), active voice, ~grade 7–9, contractions welcome. **One name per
concept, app-wide.**

- **Capitalisation: sentence case everywhere** — buttons, headings, labels, menus, tabs, table headers.
  Capitalise only proper nouns / product names. **Never Title Case; never ALL-CAPS for emphasis** (use weight or
  size). (Title case only inside a native Apple app matching system UI.)
- **Buttons/actions = `verb + object`, 3–6 words:** "Save changes", "Delete project", "Create account" — never
  "Submit / OK / Done / Yes / No". Confirm buttons restate the action ("Delete project" / "Cancel"); destructive
  confirms name what's destroyed and read as dangerous.
- **Errors = what went wrong + why + how to fix.** No blame, no jargon, no raw codes ("Error 500"). Specific,
  inline at the source (system failures → global banner), preserve the user's input. e.g. "We couldn't upload
  your file because it's larger than 10 MB. Try a smaller file."
- **Empty states = what it is + its value + one next action** (verb-object CTA). Distinguish first-run vs
  no-results vs cleared (different copy/actions — see §19).
- **Forms:** every field has a **visible persistent label** — a placeholder is **not** a label. Guidance →
  helper text below; format hints only → placeholder. Mark the minority "(optional)" or required, never both.
- **Numbers/dates:** numerals ("9"), thousands separators at 4+ digits, "%" not "percent", "$10,000 USD",
  "Dec 11, 2024" (no ordinals), "7:30 pm", relative time for recent ("2h ago") + absolute for older. Localise via
  `Intl.*`, never hand-roll.
- **Links:** descriptive text — never "click here" / "learn more" alone; must make sense out of context.
- **Punctuation:** no periods on labels / single-sentence helper; Oxford comma; avoid "&" (write "and"); en-dash
  ranges "5–10"; lowercase URLs/emails.

---

## 19. Loading, empty & error states **[Researched]**

**Every async view explicitly handles four states — loading, empty, error, success — never "blank then pop."**
Treat them as a required discriminated union, not an afterthought.

**Response-time budget (NN/g):** **0.1s** = instant (show the result, *no* indicator); **1s** = flow holds
(subtle cue only); **10s** = attention limit (determinate progress + Cancel).

| Wait | Indicator |
|---|---|
| < ~0.3–1s | nothing |
| ~1–10s · single module / button / indeterminate | **spinner** |
| < 10s · known layout, substantial content | **skeleton** (mirrors final layout) |
| > 10s · determinate | **progress bar + %** + Cancel |

**Delay the spinner** to avoid flash: don't show if work finishes within **~300ms**; once shown, keep it
**≥ ~350ms** (skeletons ~600ms pre-delay). **Optimistic UI** for low-stakes reversible actions (toggle, like,
reorder): snapshot → apply → on error revert + Retry; never optimistic for money/irreversible actions.

**Errors:** validation → inline at the field/section; failed top-level load → full-page error. Wrap each
independently-loaded region in an **error boundary** so one widget's failure shows a local fallback + **Retry**,
not a white screen. **Never swallow errors silently** — render a visible state and log. Partial failure: the
broken tile degrades, siblings survive.

**Empty ≠ no-results ≠ first-run:** first-run = onboard + create CTA; no-results = "No results for '…'" + clear
filters (no create CTA); empty = neutral. **Avoid layout shift:** skeleton matches final dimensions; reserve
sticky-header height; keep loading/empty/error footprints close to the loaded content (low CLS *is* perceived
performance).

---

## 20. Data visualization & charts **[Researched]**

Charts need their **own extended palette**, separate from the brand accent — define `--chart-1…N` tokens
(Appendix A ships an Okabe-Ito set). Library on this stack: **Recharts via shadcn Charts** (default); Tremor for
dashboard blocks; visx for bespoke.

**Colour is never the only encoding** (~8% of men have CVD). Pair colour with direct labels, distinct markers,
dash patterns or textures, and ship a `<table>`/`accessibilityLayer` fallback. Meaningful marks need **3:1**
contrast (WCAG 1.4.11) vs adjacent colours/background — verify in light *and* dark.

- **Categorical (distinct series) — max ~6–8; design for 6.** Colourblind-safe **Okabe-Ito** → `--chart-1…8`:
  `#009E73 #0072B2 #D55E00 #CC79A7 #E69F00 #56B4E9 #F0E442 #000000` (swap black → `#999999` on dark). Keep a
  series' colour stable across charts. >8 series → group / "Top N + Other", not more colours.
- **Sequential (magnitude/heatmap)** — single hue light→dark (Blues `#EFF3FF→#08519C`) or **viridis** (CVD-safe).
- **Diverging (+/- around a midpoint)** — CVD-safe RdBu, neutral midpoint at the *meaningful* zero:
  `#B2182B … #F7F7F7 (mid) … #2166AC`. Avoid red↔green.

**Chart-type pick:** over time → **line/area**; across categories → **bar** (start at **zero** — never truncate);
correlation → **scatter**; part-of-whole ≤5 parts → pie/donut *sparingly* (a sorted bar usually beats it).
**Axes/labels:** subtle horizontal gridlines, direct-label series over legends, abbreviate numbers (1.2k / 3.4M /
42%), 4–7 ticks, sort bars by value.

**Dark mode:** don't invert — use a separate, slightly desaturated/lighter series set; chart sits on `--card`
(not pure black); gridlines drop to low-alpha white; re-check 3:1 on the dark surface.

---

## 21. Spacing & sizing system — the prescriptive playbook **[Researched]**

> §3 gives the spacing *scale* (the legal values). This section is the *grammar* — which value
> goes where, how big each control/card/screen is, and the one rule that makes a layout read as
> **intentional instead of scattered**. If a screen ever feels "boxes placed at random," it's
> almost always missing the **roles** (§21.2) or violating the **proximity inequality** (§21.3).

**The model in one line:** *scale → roles → proximity.* The **scale** gives legal values (§3); a
**role** says what a value means (padding vs gap vs section break); **proximity** sets the
relationship between roles (related = closer, unrelated = farther). Most UIs have the scale and skip
the other two — every value is "on-grid" yet nothing feels deliberate.

### 21.1 Never eyeball — every value comes from the scale
Spacing is only ever a token from §3 (`4 8 12 16 20 24 32 40 48 64 80 96`). No `p-[17px]`, no `margin:
13px`. A small fixed set creates **rhythm** the eye reads as deliberate, and removes ambiguity (every
spacing choice is one of ~12 picks, not infinite px). Enforce with lint (ban Tailwind arbitrary
values). [Refactoring UI; Primer "no raw values"]

### 21.2 Spacing roles (the semantic tier — reference these, not raw px)
A `16px` could be padding, a field gap, or a section gap. Give space **meaning** via named roles
(token taxonomy: EightShapes *Inset / Inset-squish / Stack / Inline*; SEEK Braid `Stack`/`Inline`).
These ship in `globals.css` as a second token tier over the scale:

| Role | What it controls | Token | px |
|---|---|---|---|
| **Inset** | Padding inside a card/panel | `--inset-card` (`--inset-card-compact`) | 24 (16) |
| **Inset-squish** | Padding inside button/input/cell (less top/bottom than sides) | `--inset-squish-y` × `--inset-squish-x` | 8 × 16 |
| **Stack-tight** | Label↔input, input↔help/error | `--stack-tight` | 4 |
| **Stack-default** | Field↔field | `--stack-default` (`--stack-dense`) | 24 (16) |
| **Stack-group** | Group↔group within a section | `--stack-group` | 32 |
| **Stack-section** | Section↔section | `--stack-section` | 48 |
| **Inline-tight** | Icon↔label, chip↔chip | `--inline-tight` | 8 |
| **Inline-default** | Button↔button in an action row | `--inline-default` | 12 |

Components reference the role (`gap: var(--stack-default)`), never the raw value — so density and
brand can remap one tier and the whole app reflows.

### 21.3 The proximity rule (the #1 "designed vs random" lever)
Gestalt's Law of Proximity: things close together read as **one group**; things far apart read as
**separate**. So spacing must **strictly increase as the relationship weakens** — roughly **1.5–2×
per level**, and **inner gap < outer gap, always**.

```
label ↔ input   <   field ↔ field   <   group ↔ group   <   section ↔ section
     4px                  24px                 32px                48–64px
```

| Boundary | Inner | Outer | Ratio |
|---|---|---|---|
| label ↔ input  (vs next field) | 4 | 24 | labels bind very tightly |
| field ↔ field  (vs group break) | 24 | 32–48 | ~1.5–2× |
| group ↔ group  (vs section break) | 32 | 48–64 | ~1.5–2× |

**The classic bug:** if the label-to-input gap ≥ the field-to-field gap, the eye groups each label
with the field *above* it. Keep label↔input the **tightest** gap on the form. [NN/g, Refactoring UI]

### 21.4 Control & field sizing
- **Heights:** `sm 32` (`h-8`, dense/pointer-only) · **`md 40` (`h-10`) = default** for input/select/
  button · `lg 44` (`h-11`, primary CTA / touch). Tokens `--control-sm/md/lg`. Touch targets ≥ 44px
  (pad the hit-area even if the visual control is smaller). [Carbon 32/40/48; Material btn 40; shadcn]
- **Internal padding:** input `px-3` (12); button `px-4` (16) — buttons carry more so the label
  breathes. Vertical = inset-squish (8). Icon-only button = square (width = height).
- **Field WIDTH — match the field to its expected input** (the single biggest "random form" fix).
  Free-text/unknown-length (email, address, name, search) → **full-width** in a single column.
  Bounded answers get a **fixed character width** and must NOT stretch:

  | Field | Width |
  |---|---|
  | day / month / age / CVC | 2–3 ch (`w-[7ch]`) |
  | year (YYYY) / PIN | 4 ch (`w-[9ch]`) |
  | postcode / ZIP | ~5 ch (`w-[11ch]`) |
  | phone / reference | ~10 ch (`w-[16ch]`) |
  | short free text | ~20 ch (`w-[26ch]`) |

  Match `maxlength` + `inputmode` to the visual width so cue, constraint, and keyboard agree.
  Never exceed ~20ch for a single short field. [GOV.UK width classes; NN/g; Baymard]

### 21.5 Card sizing
- **Padding:** compact **16** (`p-4`) · **default 20–24** (`p-5`/`p-6`) · spacious **24** (`p-6`).
- **Internal rhythm:** title→body **8**, body→actions **16**, section→section in a card **24**.
- **Width:** text card ~**280 min / 600–680 max** (cap line length ≤ ~70ch).
- **Card grid:** `repeat(auto-fit, minmax(280px, 1fr))` — 1 col on phones → 2–4 on desktop, no media
  queries (use 320–360 min for image-led cards). Cards **stretch to fill the track** (`1fr`) so rows
  align; content stays left and capped. Fixed width only for a discrete known-size object.

### 21.6 Tables / list rows
Row heights **compact 32 / default 40 / comfortable 48**; header = default (40–48). Cell padding
`px-4` (16), `px-3` (12) when compact. Pick density by data volume: analytics → 32; editable → 40–48.
[Carbon 24/32/40/48/64; Material 52 row/56 header]

### 21.7 Layout, containers & screens
- **Breakpoints** (Tailwind, unchanged): `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Use
  Material's *intent* per tier: base = single column; `md` = two-pane viable / sidebar appears;
  `lg` = persistent sidebar + multi-column; `xl` = content hits max-width.
- **Container max-widths** (tokens `--container-*`): app shell **1280** (media-heavy 1440); reading
  **65ch ≈ 680**; single-column form **480**; wide form **720**; dashboards/data tables **full-bleed**.
- **Page side padding / gutters:** **16** mobile → **24** tablet → **32** desktop (`px-4 md:px-6 lg:px-8`).
  12-col grid gutter: 16 (mobile) → 24 (`md`) → 24–32 (`lg`). [Material 16/24dp; Carbon 32px; Bootstrap 24px]

### 21.8 Section rhythm (page-level vertical)
Between **major page sections**: **96** desktop → **48–64** mobile (`py-12 md:py-24`). Sub-section: 64 →
40–48 (`py-10 md:py-16`). **Mobile ≈ 50–66% of desktop** section spacing. All on the 8px scale.

### 21.9 Modal / drawer / popover sizing (tokens shipped)
- **Dialog:** sm **448** · md **520** (default) · lg **720** · xl **880**; max-height **85vh** (body
  scrolls, header/footer fixed); **full-screen below 640px**. [Material max 560; Ant 520/confirm 416; shadcn ~512]
- **Drawer/sheet:** sm **320** · md **400** · lg **560** · xl **736**; **~90vw on mobile** (or use a
  bottom sheet). [Ant 378/736]
- **Popover/menu:** min **200** / max **320**; select-style popovers match the trigger width.

### 21.10 Density modes
Two densities from **one** scale — remap only the semantic tier, never invent a second scale:
```css
[data-density="compact"] {
  --inset-card: var(--space-4);     /* 24→16 */
  --stack-default: var(--space-4);  /* 24→16 */
  --inset-squish-y: var(--space-1); /* 8→4  */
}
```
Components read `--inset-card`/`--stack-default`, so flipping `data-density` reflows the whole app.
Both ends still resolve to scale values. Touch targets stay ≥ 44px. [Carbon; Material density −1 = −4dp]

### 21.11 Fluid spacing (optional, advanced)
For type + space that scale *smoothly* between viewports instead of jumping at breakpoints, use
`clamp()` (the Utopia approach): a value at a **min viewport (~320)** and **max viewport (~1280)**,
linearly interpolated. Keep **breakpoints for structural changes** (1-col → 2-pane), use **clamp for the
in-between sizing**. Example (section gap 48→96px): `clamp(3rem, 2.13rem + 4.35vw, 6rem)`. Generate at
utopia.fyi and export the custom properties. Not required to ship — the fixed scale above is the baseline.

### 21.12 The pre-ship spacing checklist
Run this on any screen before calling it done:
1. **Every gap is a scale token** — zero arbitrary px.
2. **Every gap references a role** (`--stack-*`, `--inset-*`, `--inline-*`), not a bare number.
3. **Proximity holds:** label↔input < field↔field < group↔group < section↔section.
4. **Field widths match expected input** — short fields are short, not full-width.
5. **Controls are 40px default** (44 touch), cards 16–24 padding, on the grid.
6. **Containers capped** (app 1280 / form 480 / prose 65ch) — content isn't a full-width wall of text.
7. **Verified at mobile (375px) and desktop** — spacing compresses ~50–66% on mobile, structure holds.

---

## 22. Whitespace & clean design — the anti-clutter standard **[Researched]**

> §21 is the *mechanics* of spacing (which value goes where). This is the *generosity dial* — how much
> air you give everything, and what you **remove**. A layout can be perfectly on-grid and still feel
> cluttered; "clean" is mostly **active whitespace + ruthless removal**, not better alignment. If the UI
> feels busy, this section is the fix.

**Whitespace is the primary element, not the leftover.** Two axes:
- **Macro** (between sections, columns, cards, page margins) vs **Micro** (line-height, label↔input,
  padding). Macro sets the calm/airy feel; micro sets legibility.
- **Active** (deliberately added to create emphasis, flow, grouping) vs **Passive** (incidental). The
  declutter lever is **active macro whitespace** — adding it on purpose. *Space around an element is
  emphasis: more space = more importance.*

**Why it works (the honest version):** whitespace lowers **cognitive load** and matches how people
actually use screens — they **scan, reading only ~20–28% of words** (NN/g). Decluttering dense content
into scannable form raised recall **from 33% to 65%** (NN/g) — that's the citable headline, *not* the
"+20%" myth below. Readable text wants **medium density** — neither cramped nor loose.

> ⚠️ **Refuted — never repeat:** "whitespace increases comprehension by ~20% (Lin, 2004)." Lin himself
> stated his paper "has nothing to do with whitespace." Both the number and citation are folklore. Use
> NN/g's **33%→65% recall** and the Wichita State *direction* (comprehension ↑, reading speed ↓) instead.

### 22.1 Space before lines — the #1 declutter move
Borders/boxes/fills communicate **conceptual boundaries**; whitespace communicates **hierarchy &
grouping**. A cluttered UI almost always reached for the heavy tool (lines, cards, zebra fills) to do a
job space does more quietly. To separate two things, escalate **in this order, stopping at the first
that works**: **(1) more space → (2) a different background tint → (3) a subtle shadow → (4) a border
(last resort).** [Refactoring UI] The fastest declutter pass on any screen: delete every divider, card
border, and stripe fill, then re-introduce hierarchy with *space + type size/weight/colour* — add a
border back only where a true boundary survives.

### 22.2 The clean-design moves, by impact
1. **Use the TOP of the spacing scale, not the middle.** Start with *too much* whitespace and trim —
   you land far airier. Macro gaps jump to 48/64/96, not 16/24.
2. **Big section gaps — macro ≫ within.** Space *between* sections should be **~3–4×** the space
   *within* them (96 between vs 24 inside). That ratio is what reads as "structured."
3. **Cap the content width — never edge-to-edge.** Constrain prose to `--container-prose` (65ch) and let
   the margins breathe. Edge-to-edge text is the #1 "premium → cheap" tell. Measure 45–75 chars (~66).
4. **Generous body line-height 1.5–1.6** (WCAG 1.4.12 expects 1.5-capable); headings 1.1–1.25; ~1em
   between paragraphs.
5. **Fewer elements per view; one primary action per screen.** If everything is emphasised, nothing is.
6. **Remove visual noise** — unnecessary borders, shadows, background fills, decorative icons, competing
   colours. Each surviving element must earn its place.
7. **Progressive disclosure** — defer advanced/rare options to a second screen; reveal on relevance.

### 22.3 The squint test (your clutter detector)
Blur/squint at the screen — detail drops out, only the strongest size/contrast/space survive. Then ask:
*does the one thing that stands out match the one thing that should?* If several elements fight for
attention, or the primary CTA doesn't pop, you've found clutter + broken hierarchy. [NN/g]

### 22.4 When spacious is WRONG (density by app type)
Whitespace optimises **focus & comprehension per screen**; density optimises **information & actions per
screen**. Match the spacing to the job:

| App type | Lean | Preset |
|---|---|---|
| Marketing / landing / onboarding / docs / consumer | **Spacious** | `data-density="spacious"` |
| Forms & settings | Mostly spacious | spacious / default |
| App content, most product screens | **Default** | (no attribute) |
| Dashboards, analytics, data tables, ops / financial / admin / power-user | **Dense** | `data-density="compact"` |

**Dense ≠ cluttered.** A data-dense view gets "clean" by **removing non-data ink** (gridlines, heavy
borders, zebra fills, chart-junk — Tufte's data-ink ratio) and tightening *micro* spacing + alignment —
**not** by inflating macro gaps. Dashboards: tight macro, ruthless ink discipline. Landing pages: the
reverse. **Decision rule:** *Is the user reading/deciding, or comparing many values?* Reading → spacious.
Comparing → dense + remove non-data ink.

### 22.5 The saveable "spacious" preset (ships in `globals.css`)
Set `data-density="spacious"` on `<html>` (or any wrapper) and the whole subtree re-skins — macro roles
go ×~1.3–1.5 while legibility roles stay at their optimum. The concrete remap:

| Role | Default | **Spacious** | ×  |
|---|---|---|---|
| Card padding (`--inset-card`) | 24 | **32** | 1.33 |
| Field↔field (`--stack-default`) | 24 | **32** | 1.33 |
| Group↔group (`--stack-group`) | 32 | **48** | 1.5 |
| **Section↔section (`--stack-section`)** | 48 | **96** | 2.0 |
| Control padding (`--inset-squish-*`) | 8 / 16 | **12 / 20** | ~1.4 |
| Control height (`--control-md`) | 40 | **44** | 1.1 |
| Body line-height | 1.5 | **1.6** (capped — never looser) | — |
| Content width | as-is | **cap at 65ch** (narrower = more side air) | — |

Three rules to keep with it: **(a) macro ≫ within** (section ≈ 3–4× group); **(b) space before lines**
(§22.1); **(c) cap the well** (prose always wears `--container-prose`; only dense regions go edge-to-edge).

> Pick the preset per app, not globally — a marketing site and an ops dashboard want opposite ends.
> Sources: NN/g (cognitive load, legibility/recall 33→65%, scan-reading, squint test), Refactoring UI
> (space before borders), Tufte (data-ink), UXPin/Baymard (measure), WCAG 1.4.12 (line-height).

---

## Appendix A — Copy-paste token file (`app/globals.css`)

> Neutral base values. Light + dark. A brand overrides the **color** tokens and the two **font**
> vars (and optionally `--radius`). Everything else is frozen structure. Values are HSL channels
> (shadcn convention); swap to OKLCH if your Tailwind version uses it.

```css
:root {
  /* ---- TIER 1: structural primitives (brand-agnostic; do not change per brand) ---- */
  --space-0:0; --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem;
  --space-5:1.25rem; --space-6:1.5rem; --space-8:2rem; --space-10:2.5rem; --space-12:3rem;
  --space-16:4rem; --space-20:5rem; --space-24:6rem;

  /* semantic spacing roles (§21) — reference these in components, not raw --space-* */
  --inset-squish-y:var(--space-2); --inset-squish-x:var(--space-4);
  --inset-card-compact:var(--space-4); --inset-card:var(--space-6);
  --stack-tight:var(--space-1); --stack-default:var(--space-6); --stack-dense:var(--space-4);
  --stack-group:var(--space-8); --stack-section:var(--space-12);
  --inline-tight:var(--space-2); --inline-default:var(--space-3);
  /* sizing (§21) */
  --control-sm:2rem; --control-md:2.5rem; --control-lg:2.75rem;
  --container-app:1280px; --container-wide:1440px; --container-prose:65ch;
  --container-form:480px; --container-form-wide:720px;
  --dialog-sm:448px; --dialog-md:520px; --dialog-lg:720px; --dialog-xl:880px; --dialog-max-h:85vh;
  --drawer-sm:320px; --drawer-md:400px; --drawer-lg:560px; --drawer-xl:736px;
  --popover-min:200px; --popover-max:320px;

  --text-xs:.75rem;  --leading-xs:1rem;
  --text-sm:.875rem; --leading-sm:1.25rem;
  --text-base:1rem;  --leading-base:1.5rem;
  --text-lg:1.125rem;--leading-lg:1.75rem;
  --text-xl:1.25rem; --leading-xl:1.75rem;
  --text-2xl:1.5rem; --leading-2xl:2rem;
  --text-3xl:1.875rem;--leading-3xl:2.25rem;
  --text-4xl:2.25rem;--leading-4xl:2.5rem;
  --text-5xl:3rem;   --leading-5xl:1;

  --radius:.625rem; /* 10px base; brand MAY retune this one value */

  --shadow-xs:0 1px 2px 0 hsl(0 0% 0% / .05);
  --shadow-sm:0 1px 3px 0 hsl(0 0% 0% / .08), 0 1px 2px -1px hsl(0 0% 0% / .08);
  --shadow-md:0 4px 6px -1px hsl(0 0% 0% / .08), 0 2px 4px -2px hsl(0 0% 0% / .08);
  --shadow-lg:0 10px 15px -3px hsl(0 0% 0% / .08), 0 4px 6px -4px hsl(0 0% 0% / .08);
  --shadow-xl:0 20px 25px -5px hsl(0 0% 0% / .10), 0 8px 10px -6px hsl(0 0% 0% / .10);

  --duration-fast:150ms; --duration-base:200ms; --duration-slow:300ms;
  --ease-standard:cubic-bezier(.2,0,0,1);
  --ease-decelerate:cubic-bezier(0,0,0,1);
  --ease-accelerate:cubic-bezier(.3,0,1,1);

  /* ---- TIER 2: semantic colors (NEUTRAL base — the brand layer overrides these) ---- */
  --color-background:hsl(0 0% 100%);     --color-foreground:hsl(240 10% 4%);
  --color-card:hsl(0 0% 100%);           --color-card-foreground:hsl(240 10% 4%);
  --color-popover:hsl(0 0% 100%);        --color-popover-foreground:hsl(240 10% 4%);
  --color-primary:hsl(240 6% 10%);       --color-primary-foreground:hsl(0 0% 98%);
  --color-secondary:hsl(240 5% 96%);     --color-secondary-foreground:hsl(240 6% 10%);
  --color-muted:hsl(240 5% 96%);         --color-muted-foreground:hsl(240 4% 46%);
  --color-accent:hsl(240 5% 96%);        --color-accent-foreground:hsl(240 6% 10%);
  --color-destructive:hsl(0 72% 51%);    --color-destructive-foreground:hsl(0 0% 98%);
  --color-success:hsl(142 71% 36%);      --color-success-foreground:hsl(0 0% 98%);
  --color-warning:hsl(38 92% 50%);       --color-warning-foreground:hsl(240 10% 4%);
  --color-border:hsl(240 6% 90%);
  --color-input:hsl(240 6% 90%);
  --color-ring:hsl(240 6% 10%);
  --color-link:var(--color-primary); --color-link-visited:hsl(266 50% 55%);

  /* ---- chart palette (Okabe-Ito, colourblind-safe; brand-agnostic, shared across themes) ---- */
  --chart-1:#009E73; --chart-2:#0072B2; --chart-3:#D55E00; --chart-4:#CC79A7;
  --chart-5:#E69F00; --chart-6:#56B4E9; --chart-7:#F0E442; --chart-8:#999999;
  --z-dropdown:1000; --z-sticky:1020; --z-fixed:1030; --z-modal:1055; --z-popover:1070; --z-tooltip:1080; --z-toast:1090;

  /* ---- fonts (brand supplies real families; base = system fallback) ---- */
  --font-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --font-display:var(--font-sans);
  --font-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}

.dark {
  --color-background:hsl(240 10% 4%);    --color-foreground:hsl(0 0% 98%);
  --color-card:hsl(240 8% 7%);           --color-card-foreground:hsl(0 0% 98%);
  --color-popover:hsl(240 8% 7%);        --color-popover-foreground:hsl(0 0% 98%);
  --color-primary:hsl(0 0% 98%);         --color-primary-foreground:hsl(240 6% 10%);
  --color-secondary:hsl(240 4% 16%);     --color-secondary-foreground:hsl(0 0% 98%);
  --color-muted:hsl(240 4% 16%);         --color-muted-foreground:hsl(240 5% 65%);
  --color-accent:hsl(240 4% 16%);        --color-accent-foreground:hsl(0 0% 98%);
  --color-destructive:hsl(0 62% 50%);    --color-destructive-foreground:hsl(0 0% 98%);
  --color-success:hsl(142 60% 45%);      --color-success-foreground:hsl(240 10% 4%);
  --color-warning:hsl(38 92% 55%);       --color-warning-foreground:hsl(240 10% 4%);
  --color-border:hsl(240 4% 16%);
  --color-input:hsl(240 4% 18%);
  --color-ring:hsl(240 5% 84%);
}

* { border-color: var(--color-border); }
body {
  background: var(--color-background); color: var(--color-foreground);
  font-family: var(--font-sans); font-size: var(--text-base); line-height: var(--leading-base);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--color-link); text-underline-offset: 0.15em; text-decoration-thickness: 0.08em; }
a:hover { text-decoration-thickness: 0.12em; }
a:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; border-radius: 2px; }
::selection { background: var(--color-accent); color: var(--color-accent-foreground); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; }
}
```

---

## Appendix B — Tailwind wiring

Map Tailwind to the variables so utilities and tokens stay in sync. (v3 `tailwind.config.ts`
shown; for v4, put the same mappings in the `@theme` block in CSS.)

```ts
export default {
  theme: {
    extend: {
      colors: {
        background:'var(--color-background)', foreground:'var(--color-foreground)',
        card:{DEFAULT:'var(--color-card)', foreground:'var(--color-card-foreground)'},
        popover:{DEFAULT:'var(--color-popover)', foreground:'var(--color-popover-foreground)'},
        primary:{DEFAULT:'var(--color-primary)', foreground:'var(--color-primary-foreground)'},
        secondary:{DEFAULT:'var(--color-secondary)', foreground:'var(--color-secondary-foreground)'},
        muted:{DEFAULT:'var(--color-muted)', foreground:'var(--color-muted-foreground)'},
        accent:{DEFAULT:'var(--color-accent)', foreground:'var(--color-accent-foreground)'},
        destructive:{DEFAULT:'var(--color-destructive)', foreground:'var(--color-destructive-foreground)'},
        border:'var(--color-border)', input:'var(--color-input)', ring:'var(--color-ring)',
      },
      borderRadius:{ lg:'var(--radius)', md:'calc(var(--radius) - 2px)', sm:'calc(var(--radius) - 4px)' },
      fontFamily:{ sans:'var(--font-sans)', display:'var(--font-display)', mono:'var(--font-mono)' },
      transitionTimingFunction:{
        standard:'var(--ease-standard)', decelerate:'var(--ease-decelerate)', accelerate:'var(--ease-accelerate)',
      },
      transitionDuration:{ fast:'150ms', base:'200ms', slow:'300ms' },
    },
  },
}
```

(Tailwind's default spacing scale already equals `--space-*` — 4px base — so `p-4`, `gap-6`,
etc. map 1:1. Don't fight it; just never use arbitrary `[13px]` values.)

---

## Appendix C — What a brand layer overrides (the contract)

A brand skill (e.g. `zhenhub-brand`) is allowed to set **only** these, on top of the base:

```css
/* brand: zhenhub — applied AFTER the base */
:root {
  --font-sans: "DM Sans", var(--font-sans);     /* font */
  --color-primary: hsl(207 51% 45%);            /* ZhenBlue #286CB4 */
  --color-primary-foreground: hsl(0 0% 100%);
  --color-ring: hsl(207 51% 45%);
  --color-accent: hsl(207 51% 95%);             /* tinted brand accent surface */
  --color-accent-foreground: hsl(207 51% 25%);
  /* optional: --radius: .5rem;  (retune corner softness) */
  /* logo asset swapped in the header component */
}
.dark { --color-primary: hsl(207 55% 60%); /* lighten brand hue for dark */ }
```

It must **not** redefine spacing, type sizes, shadow, motion, sizing, or component anatomy.
If a brand "needs" to change those, that's a signal the base is wrong — fix the base, not the brand.

**Anthropic "warm minimalism" as a brand skin (optional, offered — not the base):** **[Verified palette]**
```css
:root{
  --color-background:hsl(48 33% 97%);  /* cream #faf9f5 */
  --color-foreground:hsl(60 2% 8%);    /* ink #141413 */
  --color-primary:hsl(16 56% 56%);     /* coral/orange #d97757 */
  --color-primary-foreground:hsl(48 33% 97%);
  /* font: Styrene-like display; structure unchanged */
}
```
(Confirmed brand facts: `#141413` ink, `#faf9f5` cream, `#d97757` orange, Styrene display by
Berton Hasebe. The exact CTA coral varies by source — `#d97757` official vs `#cc785c` community.
Claims of a specific 4px-named Anthropic token scale, a Tiempos serif body, and 28–64px display
sizes were **refuted** and are deliberately omitted.)

---

## Sources & confidence

**Verified against primary sources (unanimous adversarial votes unless noted):**
shadcn semantic token contract & dark-mode override · single `--radius` base (0.625rem) ·
Tailwind v3 radius scale · Material Design 3 motion (16-step durations + 3 easing curves) ·
WCAG 2.5.8 (24px AA) & 2.5.5 (44px AAA) hit targets · Apple HIG 44pt · two-tier primitive→
semantic token architecture (EightShapes) · W3C Design Tokens stable spec 2025.10 · Anthropic
brand palette (#141413 / #faf9f5 / #d97757) + Styrene.

Primary references: ui.shadcn.com/docs/theming · v3.tailwindcss.com/docs/border-radius ·
github.com/material-components/material-components-android (Motion.md) ·
w3.org/WAI WCAG 2.2/2.1 Understanding (target-size) ·
medium.com/eightshapes-llc/naming-tokens-in-design-systems ·
w3.org/community/design-tokens (2025.10 stable) · github.com/anthropics/skills (brand-guidelines).

**Explicitly refuted — not used as fact:** an Anthropic 4px named-token spacing scale; a
Tiempos/Copernicus serif *body* face; 28–64px Anthropic display sizes with negative tracking;
exact shadcn-token→Radix-step mappings (e.g. "primary = step 9").

**Marked [Convention]:** the concrete spacing scale values, type ramp, button heights/padding,
form patterns, and component anatomy — these are the established Tailwind/shadcn defaults, set
here as our single opinionated choice. They are safe and conventional, but are our decision, not
a cited mandate.

**Time-sensitivity:** Tailwind v4 renamed the radius scale and moved to OKLCH/CSS-first config;
shadcn's token set evolves (e.g. `destructive-foreground` was dropped). Reference the CSS
*variables*, not framework class names, and re-verify before locking a project.
