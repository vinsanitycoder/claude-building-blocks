---
name: team-activity
description: Add a manager's "team activity monitor" — who's online (presence), a 24h activity timeline per person, a monthly active-hours heatmap, and an optional background-job health card. Use when building an admin/manager view of staff presence and activity, with inline role management. Includes the in-app presence-tracking (heartbeat) contract. Disclose to staff for privacy compliance.
when_to_use: user wants a team activity dashboard, presence/online status, who's online, activity heatmap, idle/active tracking, monitor staff, last-seen, role management UI, background-job/poller health card.
---

# Team activity monitor block

A manager-facing view of team presence + activity, plus inline role changes and an optional background-job health card. Refined UX — start from this.

## What's here
- `files/TeamActivity.tsx` — the component, fully prop-driven (`users`, `segments`, `month`, `events`, `pollHealth`, `onRoleChange`). Renders: presence list, today's 24h timeline, monthly heatmap, recent events, and the job-health card.
- `files/presence.ts` — types + pure helpers (effectiveStatus/offline detection, status colours, relative-time, duration, heatmap intensity).
- `files/WIRING.md` — the backend contract: `presence` / `presence_events` / `activity_daily` tables, the client **heartbeat** (Page Visibility + idle + sendBeacon), `recordHeartbeat` (elapsed-time attribution with skew/gap clamping), and how to shape each prop from queries.

## How to use it
1. Copy `TeamActivity.tsx` + `presence.ts` into the app.
2. Read `WIRING.md`: add the three tables, the client heartbeat component (mount in the layout for signed-in users), the `/api/presence` route → `recordHeartbeat`, and the queries that build `users`/`segments`/`month`/`events`.
3. Render `<TeamActivity users=… today=… segments=… month=… onRoleChange={setRoleAction} meId={me.id} />` on a **manager/admin-gated** page.

## Keep these invariants & cautions
- **Disclose monitoring to staff** (data-privacy compliance) — it's in-app presence only.
- **Clamp elapsed time** (skew → 0, gaps → cap) and **attribute to the day spent** so the heatmap stays accurate across midnight.
- **Normalize timestamps to ISO strings** before passing to the client. **Gate** the page to managers/admins.

## Preview / iterate
Run `playground/` → "Team activity" demo, which feeds the component realistic mock presence/timeline/heatmap data so you can see and tweak the layout live.
