# Wiring `TeamActivity` into a real app

The component is display-only — you feed it `users`, `segments`, `month`, `events`, and optional `pollHealth`. To make it real you need **presence tracking** (a heartbeat), a **rollup** for the monthly heatmap, and queries that shape the data.

> ⚠️ **Privacy/compliance:** monitoring staff activity requires disclosure under most data-privacy laws (e.g. PH DPA, GDPR). Tell your team it's on. This only sees in-app presence — not other tabs/apps.

## 1. Tables
```ts
export const presence = pgTable("presence", {           // current state, 1 row/user
  userId: text("user_id").primaryKey(),
  status: text("status").notNull(),                     // active | idle | hidden
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull(),
});
export const presenceEvents = pgTable("presence_events", { // append-only log (drives the timeline)
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),                         // login|logout|idle|active|tab_hidden|tab_visible
  at: timestamp("at", { withTimezone: true }).notNull(),
});
export const activityDaily = pgTable("activity_daily", {  // rollup, ~1 row/user/day (drives the heatmap)
  userId: text("user_id").notNull(),
  day: text("day").notNull(),                           // "YYYY-MM-DD" (local tz)
  activeSeconds: integer("active_seconds").notNull().default(0),
});
```

## 2. Client heartbeat (mount once in your layout, for signed-in users)
A small "use client" component: every ~30s POST `/api/presence` with status; flip to **idle** after ~3 min of no input; use the **Page Visibility API** for `tab_hidden`/`tab_visible`; `navigator.sendBeacon` on `beforeunload` for logout.
```tsx
useEffect(() => {
  const beat = (status: string) => navigator.sendBeacon?.("/api/presence", JSON.stringify({ status }))
    || fetch("/api/presence", { method: "POST", body: JSON.stringify({ status }) });
  const iv = setInterval(() => beat(document.hidden ? "hidden" : idle ? "idle" : "active"), 30_000);
  document.addEventListener("visibilitychange", () => beat(document.hidden ? "hidden" : "active"));
  return () => clearInterval(iv);
}, []);
```

## 3. `/api/presence` route → `recordHeartbeat`
Authenticate, validate `status` against an allowlist, then attribute elapsed time:
```ts
export async function recordHeartbeat(userId: string, status: string, now = new Date()) {
  const prev = await getPresence(userId);
  if (prev) {
    const elapsed = Math.min(120, Math.max(0, (now.getTime() - prev.lastSeen.getTime()) / 1000)); // cap gaps; clamp skew
    if (prev.status === "active") await addActiveSeconds(userId, localDay(prev.lastSeen), elapsed);
    if (prev.status !== status) await logEvent(userId, status, now);
  } else {
    await logEvent(userId, "login", now);
  }
  await upsertPresence(userId, status, now);
}
```
Attribute elapsed time to the day it was *spent* (`localDay(prev.lastSeen)`), not always "today", to keep the heatmap accurate across midnight.

## 4. Shape the data for the component
- `users`: join your users table with `presence` (status, lastSeen, role).
- `segments`: build from `presence_events` for today — walk the events, emitting `{from, to, status}` blocks between transitions (clip to `[startMs, nowMs]`).
- `month`: `SELECT user_id, day, active_seconds FROM activity_daily WHERE day LIKE '<YYYY-MM>%'` → cells.
- `events`: recent `presence_events` joined with names.
- `pollHealth` (optional): your own background-job heartbeat row.

## Gotchas
- **Normalize timestamps** to ISO strings before sending to the client (neon-http returns Date objects).
- **Clamp/cap elapsed** (negative = clock skew → 0; long gap = offline → cap at ~120s) so the rollup can't be poisoned.
- **Gate the page** to managers/admins.
