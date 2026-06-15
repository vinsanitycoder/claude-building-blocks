/** Types + pure helpers for the team activity monitor. No backend — all display logic. */

export type Status = "active" | "idle" | "hidden" | "offline";

export interface TeamUser {
  id: string;
  name: string;
  role: string;
  status: Status | string | null;
  lastSeen: string | null; // ISO instant
}

/** A coloured block on a user's 24h timeline (timestamps in ms). */
export interface DaySegment {
  userId: string;
  from: number;
  to: number;
  status: "active" | "idle" | "hidden";
}

/** One cell of the monthly heatmap. */
export interface MonthCell {
  userId: string;
  day: string; // "YYYY-MM-DD"
  activeSeconds: number;
}

export interface ActivityEvent {
  id: string;
  name: string;
  type: string;
  at: string; // ISO instant
}

/** Poller / background-job health (optional card). null = never run. */
export interface PollHealth {
  ranAt: string;
  ok: boolean;
  ageMin: number;
  inboxes?: number;
  created?: number;
  drafted?: number;
  errors: { inbox: string; error: string }[];
}

const OFFLINE_AFTER_MS = 90 * 1000;

/** A user is offline if we haven't heard a heartbeat recently, regardless of last reported status. */
export function effectiveStatus(status: string | null, lastSeen: string | null, now = Date.now()): Status {
  if (!lastSeen) return "offline";
  if (now - new Date(lastSeen).getTime() > OFFLINE_AFTER_MS) return "offline";
  if (status === "active" || status === "idle" || status === "hidden") return status;
  return "offline";
}

// Status-colour helpers return INLINE STYLE OBJECTS so they read from the
// design-standard semantic tokens (--color-*) instead of hard-coded Tailwind
// palette utilities. This is the design-standard rule: components reference
// semantic tokens, never literal palette classes.
type StyleObj = { background: string };
export const DOT: Record<Status, StyleObj> = {
  active:  { background: "var(--color-success)" },
  idle:    { background: "var(--color-warning)" },
  hidden:  { background: "var(--color-muted-foreground)" },
  offline: { background: "color-mix(in srgb, var(--color-muted-foreground) 55%, transparent)" },
};
export const SEG: Record<"active" | "idle" | "hidden", StyleObj> = {
  active: { background: "var(--color-success)" },
  idle:   { background: "var(--color-warning)" },
  hidden: { background: "var(--color-muted-foreground)" },
};
export const LABEL: Record<Status, string> = {
  active: "Active",
  idle: "Idle",
  hidden: "App not in focus",
  offline: "Offline",
};

export function relTime(iso: string | null, now = Date.now()): string {
  if (!iso) return "never";
  const s = Math.round((now - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export const fmtHour = (h: number) => (h === 0 || h === 24 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`);
export const fmtDur = (sec: number) => `${Math.floor(sec / 3600)}h ${Math.round((sec % 3600) / 60)}m`;

/** Heatmap intensity — returns an INLINE STYLE so the swatch tracks the
 *  --color-success token (and the page's dark/light mode), not literal greens. */
export function heatStyle(sec: number): { background: string } {
  const h = sec / 3600;
  if (h <= 0) return { background: "var(--color-muted)" };
  // Tint card with progressively more of the success colour for each band.
  const pct = h < 1 ? 18 : h < 3 ? 38 : h < 6 ? 70 : 100;
  return pct === 100
    ? { background: "var(--color-success)" }
    : { background: `color-mix(in srgb, var(--color-success) ${pct}%, var(--color-card))` };
}
