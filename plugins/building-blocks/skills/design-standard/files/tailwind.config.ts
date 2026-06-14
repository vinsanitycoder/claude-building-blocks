/* tailwind.config.ts — OPTIONAL. Only needed if the target app uses Tailwind and you want utility
   classes (bg-primary, text-muted-foreground, rounded-lg…) wired to the same tokens as globals.css.
   The components in components/ do NOT require this — they're styled by components.css off the tokens.
   For Tailwind v4, put the same mappings in an @theme block in CSS instead of this file. */
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}", "./app/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: { DEFAULT: "var(--color-card)", foreground: "var(--color-card-foreground)" },
        popover: { DEFAULT: "var(--color-popover)", foreground: "var(--color-popover-foreground)" },
        primary: { DEFAULT: "var(--color-primary)", foreground: "var(--color-primary-foreground)" },
        secondary: { DEFAULT: "var(--color-secondary)", foreground: "var(--color-secondary-foreground)" },
        muted: { DEFAULT: "var(--color-muted)", foreground: "var(--color-muted-foreground)" },
        accent: { DEFAULT: "var(--color-accent)", foreground: "var(--color-accent-foreground)" },
        destructive: { DEFAULT: "var(--color-destructive)", foreground: "var(--color-destructive-foreground)" },
        success: { DEFAULT: "var(--color-success)", foreground: "var(--color-success-foreground)" },
        warning: { DEFAULT: "var(--color-warning)", foreground: "var(--color-warning-foreground)" },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        chart: {
          1: "var(--chart-1)", 2: "var(--chart-2)", 3: "var(--chart-3)", 4: "var(--chart-4)",
          5: "var(--chart-5)", 6: "var(--chart-6)", 7: "var(--chart-7)", 8: "var(--chart-8)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
        mono: "var(--font-mono)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)",
        lg: "var(--shadow-lg)", xl: "var(--shadow-xl)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        decelerate: "var(--ease-decelerate)",
        accelerate: "var(--ease-accelerate)",
      },
      transitionDuration: { fast: "150ms", base: "200ms", slow: "300ms" },
      zIndex: {
        dropdown: "1000", sticky: "1020", fixed: "1030", modal: "1055",
        popover: "1070", tooltip: "1080", toast: "1090",
      },
    },
  },
} satisfies Config;
