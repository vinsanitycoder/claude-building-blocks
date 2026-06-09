"use client";

/**
 * TeamActivity — a manager's view of who's online + their activity, fully prop-driven.
 *
 * Renders four pieces (all optional except `users`):
 *   1. Presence list (status dot, label, last-seen, optional inline role change)
 *   2. Today's 24h activity timeline (active/idle/not-in-focus segments per user)
 *   3. Monthly active-hours heatmap (users × days)
 *   4. Optional background-job ("poller") health card
 *
 * No backend here — feed it data. See WIRING.md for the presence-tracking + rollup contract.
 * ⚠️ Monitoring staff requires disclosure under most data-privacy laws — make it transparent.
 */
import {
  type TeamUser, type DaySegment, type MonthCell, type ActivityEvent, type PollHealth,
  effectiveStatus, DOT, SEG, LABEL, relTime, fmtHour, fmtDur, heatClass,
} from "./presence";

export function TeamActivity({
  users,
  today,
  segments = [],
  month,
  events = [],
  pollHealth,
  meId,
  roles = ["rep", "manager", "admin"],
  onRoleChange,
  now = Date.now(),
}: {
  users: TeamUser[];
  today?: { startMs: number; endMs: number };
  segments?: DaySegment[];
  month?: { prefix: string; daysInMonth: number; cells: MonthCell[] };
  events?: ActivityEvent[];
  pollHealth?: PollHealth | null;
  meId?: string;
  roles?: string[];
  onRoleChange?: (userId: string, role: string) => void | Promise<void>;
  now?: number;
}) {
  const hours = [0, 4, 8, 12, 16, 20, 24];
  const monthMap = new Map((month?.cells ?? []).map((c) => [`${c.userId}|${c.day}`, c.activeSeconds]));

  return (
    <div className="space-y-6">
      {/* Poller / background-job health */}
      {pollHealth !== undefined ? (
        <div className={`rounded-xl border p-4 ${pollHealth && pollHealth.ok && pollHealth.ageMin <= 15 ? "border-slate-200 bg-white" : "border-rose-200 bg-rose-50"}`}>
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${pollHealth && pollHealth.ok && pollHealth.ageMin <= 15 ? "bg-green-500" : "bg-rose-500"}`} />
            <span className="text-sm font-semibold text-slate-800">Background job health</span>
            <span className="ml-auto text-xs text-slate-500">{pollHealth ? `Last run ${relTime(pollHealth.ranAt, now)}` : "Has not run yet"}</span>
          </div>
          {!pollHealth ? (
            <p className="mt-2 text-xs text-slate-500">Waiting for the first scheduled run.</p>
          ) : pollHealth.ok && pollHealth.ageMin <= 15 ? (
            <p className="mt-2 text-xs text-slate-500">Healthy — {pollHealth.created ?? 0} new / {pollHealth.drafted ?? 0} processed on the last run.</p>
          ) : (
            <div className="mt-2 text-xs text-rose-700">
              <p className="font-medium">{!pollHealth.ok ? "The last run failed." : `No successful run in ${pollHealth.ageMin} min.`}</p>
              {pollHealth.errors.slice(0, 4).map((e, i) => <p key={i} className="truncate">{e.inbox}: {e.error}</p>)}
            </div>
          )}
        </div>
      ) : null}

      {/* Presence + roles */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">Who&apos;s online &amp; roles</div>
        <ul className="divide-y divide-slate-50">
          {users.map((u) => {
            const st = effectiveStatus(typeof u.status === "string" ? u.status : null, u.lastSeen, now);
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[st]}`} />
                <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">{u.name}</span>
                <span className="text-sm text-slate-600">{LABEL[st]}</span>
                <span className="w-20 text-right text-xs text-slate-400">{relTime(u.lastSeen, now)}</span>
                {u.id === meId || !onRoleChange ? (
                  <span className="w-28 text-right text-xs text-slate-400">{u.role}{u.id === meId ? " (you)" : ""}</span>
                ) : (
                  <select
                    defaultValue={u.role}
                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                    className="w-28 rounded border border-slate-300 px-1 py-1 text-xs"
                  >
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Today's 24h timeline */}
      {today ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Activity today · 24 hours</h2>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-green-500" />Active</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-400" />Idle</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-slate-400" />Not in focus</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-right text-xs text-slate-600">{u.name}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-slate-100">
                  {segments.filter((s) => s.userId === u.id).map((s, i) => (
                    <span
                      key={i}
                      className={`absolute inset-y-0 ${SEG[s.status]}`}
                      style={{
                        left: `${((s.from - today.startMs) / (today.endMs - today.startMs)) * 100}%`,
                        width: `${((s.to - s.from) / (today.endMs - today.startMs)) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 flex gap-3">
            <span className="w-24 shrink-0" />
            <div className="flex flex-1 justify-between text-[10px] text-slate-400">
              {hours.map((h) => <span key={h}>{fmtHour(h)}</span>)}
            </div>
          </div>
        </div>
      ) : null}

      {/* Monthly heatmap */}
      {month ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-700">Active hours by day · this month</h2>
          <div className="mt-4 overflow-x-auto">
            <div className="flex items-center gap-1">
              <span className="w-24 shrink-0" />
              {Array.from({ length: month.daysInMonth }, (_, i) => i + 1).map((d) => (
                <span key={d} className="w-4 shrink-0 text-center text-[8px] text-slate-400">{d === 1 || d % 5 === 0 ? d : ""}</span>
              ))}
            </div>
            <div className="mt-1 space-y-1">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-1">
                  <span className="w-24 shrink-0 truncate text-right text-xs text-slate-600">{u.name}</span>
                  {Array.from({ length: month.daysInMonth }, (_, i) => i + 1).map((d) => {
                    const dayStr = `${month.prefix}-${String(d).padStart(2, "0")}`;
                    const sec = monthMap.get(`${u.id}|${dayStr}`) ?? 0;
                    return <span key={d} title={`${dayStr}: ${fmtDur(sec)} active`} className={`h-4 w-4 shrink-0 rounded-sm ${heatClass(sec)}`} />;
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            Less
            <span className="h-3 w-3 rounded-sm bg-slate-100" />
            <span className="h-3 w-3 rounded-sm bg-green-200" />
            <span className="h-3 w-3 rounded-sm bg-green-300" />
            <span className="h-3 w-3 rounded-sm bg-green-500" />
            <span className="h-3 w-3 rounded-sm bg-green-600" />
            More · active hours/day
          </div>
        </div>
      ) : null}

      {/* Recent events */}
      {events.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">Recent activity</div>
          <ul className="divide-y divide-slate-50 text-sm">
            {events.slice(0, 20).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-2">
                <span className="min-w-0 flex-1 truncate text-slate-700">{e.name}</span>
                <span className="text-xs text-slate-500">{e.type}</span>
                <span className="w-20 text-right text-xs text-slate-400">{relTime(e.at, now)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
