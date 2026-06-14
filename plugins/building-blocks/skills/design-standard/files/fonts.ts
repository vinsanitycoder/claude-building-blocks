// FONTS.ts — 6 pre-designed font packs for the base UI standard (DESIGN_STANDARD.md §11).
// Each pack defines display (headings), body (UI/paragraphs), mono (code/data).
// Loaded via next/font: self-hosts at build, subsets, prevents layout shift, zero runtime Google requests.
//
// Usage:
//   import { PACKS } from "@/FONTS";
//   const pack = PACKS.signal;
//   <html className={`${pack.body} ${pack.display} ${pack.mono}`} data-theme="ocean">
// Then in globals.css @theme:
//   --font-sans: var(--font-body), ui-sans-serif, system-ui, sans-serif;
//   --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
//   --font-mono: var(--font-mono), ui-monospace, "SF Mono", monospace;
//
// All families assign the SAME css variables (--font-body/--font-display/--font-mono) so swapping a
// pack changes only type — never spacing or sizing.
//
// Signal uses Geist (not on Google Fonts): `npm i geist`.

import {
  Fraunces, Source_Serif_4, Quicksand, Nunito, Space_Grotesk, Sora,
  Inter, IBM_Plex_Sans, IBM_Plex_Mono, JetBrains_Mono,
} from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

const sub = ["latin"] as const;

// — display faces —
const fraunces     = Fraunces({ subsets: sub, weight: ["400", "600", "700"], variable: "--font-display", display: "swap" });
const quicksand    = Quicksand({ subsets: sub, weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: sub, weight: ["500", "700"], variable: "--font-display", display: "swap" });
const sora         = Sora({ subsets: sub, weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });

// — body / UI faces —
const sourceSerif  = Source_Serif_4({ subsets: sub, weight: ["400", "600"], variable: "--font-body", display: "swap" });
const nunito       = Nunito({ subsets: sub, weight: ["400", "600", "700"], variable: "--font-body", display: "swap" });
const inter        = Inter({ subsets: sub, weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const plexSans      = IBM_Plex_Sans({ subsets: sub, weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const plexSansDisp  = IBM_Plex_Sans({ subsets: sub, weight: ["500", "600"], variable: "--font-display", display: "swap" });

// — mono faces —
const jetbrains    = JetBrains_Mono({ subsets: sub, weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const plexMono     = IBM_Plex_Mono({ subsets: sub, weight: ["400", "500"], variable: "--font-mono", display: "swap" });

type Pack = { name: string; vibe: string; display: string; body: string; mono: string };

export const PACKS: Record<string, Pack> = {
  // Clean Swiss SaaS — Geist superfamily (display + body share one var via GeistSans).
  signal: {
    name: "Signal", vibe: "clean Swiss SaaS",
    display: GeistSans.variable, body: GeistSans.variable, mono: GeistMono.variable,
  },
  // Warm editorial — characterful serif display over a calm reading serif.
  broadsheet: {
    name: "Broadsheet", vibe: "warm editorial",
    display: fraunces.variable, body: sourceSerif.variable, mono: plexMono.variable,
  },
  // Friendly rounded — Quicksand headings only, Nunito body.
  marshmallow: {
    name: "Marshmallow", vibe: "friendly rounded",
    display: quicksand.variable, body: nunito.variable, mono: jetbrains.variable,
  },
  // Technical / data — push mono into the UI; Inter is body-only.
  terminal: {
    name: "Terminal", vibe: "technical, data",
    display: spaceGrotesk.variable, body: inter.variable, mono: jetbrains.variable,
  },
  // Corporate trust — IBM Plex superfamily.
  charter: {
    name: "Charter", vibe: "corporate trust",
    display: plexSansDisp.variable, body: plexSans.variable, mono: plexMono.variable,
  },
  // Bold startup — Sora display 700/800, neutral Inter body.
  megaphone: {
    name: "Megaphone", vibe: "bold startup",
    display: sora.variable, body: inter.variable, mono: GeistMono.variable,
  },
};

export type PackName = keyof typeof PACKS;
