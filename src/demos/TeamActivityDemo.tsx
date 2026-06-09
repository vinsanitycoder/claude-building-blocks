import { useState } from "react";
import { TeamActivity } from "../../plugins/building-blocks/skills/team-activity/files/TeamActivity";
import type { TeamUser, DaySegment, MonthCell, ActivityEvent, PollHealth } from "../../plugins/building-blocks/skills/team-activity/files/presence";

const now = Date.now();
const min = 60_000;
const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
const startMs = todayStart.getTime();
const endMs = startMs + 24 * 60 * min;
const H = (h: number, m = 0) => startMs + (h * 60 + m) * min;

const USERS: TeamUser[] = [
  { id: "u1", name: "Angela Cruz", role: "manager", status: "active", lastSeen: new Date(now - 10 * 1000).toISOString() },
  { id: "u2", name: "Marco Reyes", role: "rep", status: "idle", lastSeen: new Date(now - 4 * min).toISOString() },
  { id: "u3", name: "Bea Santos", role: "rep", status: "hidden", lastSeen: new Date(now - 30 * 1000).toISOString() },
  { id: "u4", name: "Diego Lim", role: "rep", status: "active", lastSeen: new Date(now - 3 * 60 * min).toISOString() }, // stale → offline
];

const clip = (to: number) => Math.min(to, now);
const SEGMENTS: DaySegment[] = ([
  { userId: "u1", from: H(8, 30), to: H(12), status: "active" },
  { userId: "u1", from: H(12), to: H(13), status: "idle" },
  { userId: "u1", from: H(13), to: clip(H(18)), status: "active" },
  { userId: "u2", from: H(9), to: H(11, 30), status: "active" },
  { userId: "u2", from: H(11, 30), to: H(13, 30), status: "hidden" },
  { userId: "u2", from: H(13, 30), to: clip(H(17)), status: "active" },
  { userId: "u3", from: H(10), to: clip(H(16)), status: "active" },
  { userId: "u4", from: H(8), to: H(12), status: "active" },
] as DaySegment[]).filter((s) => s.to > s.from);

const monthPrefix = `${todayStart.getFullYear()}-${String(todayStart.getMonth() + 1).padStart(2, "0")}`;
const daysInMonth = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 0).getDate();
const todayDate = todayStart.getDate();
const CELLS: MonthCell[] = USERS.flatMap((u, ui) =>
  Array.from({ length: todayDate }, (_, i) => {
    const d = i + 1;
    const weekday = new Date(todayStart.getFullYear(), todayStart.getMonth(), d).getDay();
    const base = weekday === 0 || weekday === 6 ? 0 : 3 + ((d * 7 + ui * 3) % 6);
    return { userId: u.id, day: `${monthPrefix}-${String(d).padStart(2, "0")}`, activeSeconds: base * 3600 };
  }),
);

const EVENTS: ActivityEvent[] = [
  { id: "e1", name: "Angela Cruz", type: "Became active", at: new Date(now - 10 * 1000).toISOString() },
  { id: "e2", name: "Bea Santos", type: "Left the app tab", at: new Date(now - 30 * 1000).toISOString() },
  { id: "e3", name: "Marco Reyes", type: "Went idle", at: new Date(now - 4 * min).toISOString() },
  { id: "e4", name: "Diego Lim", type: "Logged out", at: new Date(now - 3 * 60 * min).toISOString() },
];

const POLL_HEALTH: PollHealth = { ranAt: new Date(now - 2 * min).toISOString(), ok: true, ageMin: 2, inboxes: 1, created: 0, drafted: 0, errors: [] };

export function TeamActivityDemo() {
  const [users, setUsers] = useState(USERS);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Team activity monitor</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manager view: who's online, today's 24h timeline, the monthly active-hours heatmap, and a background-job
          health card. Try changing someone's role. (Fed with mock data here; wire real presence per WIRING.md.)
        </p>
      </div>
      <TeamActivity
        users={users}
        today={{ startMs, endMs }}
        segments={SEGMENTS}
        month={{ prefix: monthPrefix, daysInMonth, cells: CELLS }}
        events={EVENTS}
        pollHealth={POLL_HEALTH}
        meId="u1"
        onRoleChange={(id, role) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, role } : u)))}
      />
    </div>
  );
}
