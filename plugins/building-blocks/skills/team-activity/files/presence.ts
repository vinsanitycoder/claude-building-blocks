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

export const DOT: Record<Status, string> = {
  active: "bg-green-500",
  idle: "bg-amber-400",
  hidden: "bg-slate-400",
  offline: "bg-slate-300",
};
export const SEG: Record<"active" | "idle" | "hidden", string> = {
  active: "bg-green-500",
  idle: "bg-amber-400",
  hidden: "bg-slate-400",
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

export function heatClass(sec: number): string {
  const h = sec / 3600;
  if (h <= 0) return "bg-slate-100";
  if (h < 1) return "bg-green-200";
  if (h < 3) return "bg-green-300";
  if (h < 6) return "bg-green-500";
  return "bg-green-600";
}
