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
  effectiveStatus, DOT, SEG, LABEL, relTime, fmtHour, fmtDur, heatStyle,
} from "./presence";
import { Select } from "../../design-standard/files/components/Select";

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
        <div
          className="ds-card p-5"
          style={
            pollHealth && pollHealth.ok && pollHealth.ageMin <= 15
              ? undefined
              : { background: "color-mix(in srgb, var(--color-destructive) 8%, var(--color-card))",
                  borderColor: "color-mix(in srgb, var(--color-destructive) 30%, var(--color-border))" }
          }
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: pollHealth && pollHealth.ok && pollHealth.ageMin <= 15 ? "var(--color-success)" : "var(--color-destructive)" }}
            />
            <span className="text-sm font-semibold text-[var(--color-foreground)]">Background job health</span>
            <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">{pollHealth ? `Last run ${relTime(pollHealth.ranAt, now)}` : "Has not run yet"}</span>
          </div>
          {!pollHealth ? (
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">Waiting for the first scheduled run.</p>
          ) : pollHealth.ok && pollHealth.ageMin <= 15 ? (
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">Healthy — {pollHealth.created ?? 0} new / {pollHealth.drafted ?? 0} processed on the last run.</p>
          ) : (
            <div className="mt-2 text-xs" style={{ color: "var(--color-destructive)" }}>
              <p className="font-medium">{!pollHealth.ok ? "The last run failed." : `No successful run in ${pollHealth.ageMin} min.`}</p>
              {pollHealth.errors.slice(0, 4).map((e, i) => <p key={i} className="truncate">{e.inbox}: {e.error}</p>)}
            </div>
          )}
        </div>
      ) : null}

      {/* Presence + roles */}
      <div className="ds-card p-0">
        <div className="px-5 py-3 text-sm font-semibold text-[var(--color-foreground)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          Who&apos;s online &amp; roles
        </div>
        <ul>
          {users.map((u, ix) => {
            const st = effectiveStatus(typeof u.status === "string" ? u.status : null, u.lastSeen, now);
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center gap-3 px-5 py-3"
                style={ix === 0 ? undefined : { borderTop: "1px solid var(--color-border)" }}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={DOT[st]} />
                <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-foreground)]">{u.name}</span>
                <span className="text-sm text-[var(--color-muted-foreground)]">{LABEL[st]}</span>
                <span className="w-20 text-right text-xs text-[var(--color-muted-foreground)]">{relTime(u.lastSeen, now)}</span>
                {u.id === meId || !onRoleChange ? (
                  <span className="w-28 text-right text-xs text-[var(--color-muted-foreground)]">{u.role}{u.id === meId ? " (you)" : ""}</span>
                ) : (
                  <div style={{ width: "7rem" }}>
                    <Select
                      defaultValue={u.role}
                      onValueChange={(v) => onRoleChange(u.id, v)}
                      options={roles.map((r) => ({ value: r, label: r }))}
                      aria-label="Role"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Today's 24h timeline */}
      {today ? (
        <div className="ds-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-foreground)]">Activity today · 24 hours</h2>
            <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={SEG.active} />Active</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={SEG.idle} />Idle</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={SEG.hidden} />Not in focus</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-right text-xs text-[var(--color-muted-foreground)]">{u.name}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded" style={{ background: "var(--color-muted)" }}>
                  {segments.filter((s) => s.userId === u.id).map((s, i) => (
                    <span
                      key={i}
                      className="absolute inset-y-0"
                      style={{
                        ...SEG[s.status],
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
            <div className="flex flex-1 justify-between text-[10px] text-[var(--color-muted-foreground)]">
              {hours.map((h) => <span key={h}>{fmtHour(h)}</span>)}
            </div>
          </div>
        </div>
      ) : null}

      {/* Monthly heatmap */}
      {month ? (
        <div className="ds-card p-5">
          <h2 className="text-sm font-semibold text-[var(--color-foreground)]">Active hours by day · this month</h2>
          <div className="mt-4 overflow-x-auto">
            <div className="flex items-center gap-1">
              <span className="w-24 shrink-0" />
              {Array.from({ length: month.daysInMonth }, (_, i) => i + 1).map((d) => (
                <span key={d} className="w-4 shrink-0 text-center text-[8px] text-[var(--color-muted-foreground)]">{d === 1 || d % 5 === 0 ? d : ""}</span>
              ))}
            </div>
            <div className="mt-1 space-y-1">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-1">
                  <span className="w-24 shrink-0 truncate text-right text-xs text-[var(--color-muted-foreground)]">{u.name}</span>
                  {Array.from({ length: month.daysInMonth }, (_, i) => i + 1).map((d) => {
                    const dayStr = `${month.prefix}-${String(d).padStart(2, "0")}`;
                    const sec = monthMap.get(`${u.id}|${dayStr}`) ?? 0;
                    return <span key={d} title={`${dayStr}: ${fmtDur(sec)} active`} className="h-4 w-4 shrink-0 rounded-sm" style={heatStyle(sec)} />;
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--color-muted-foreground)]">
            Less
            <span className="h-3 w-3 rounded-sm" style={heatStyle(0)} />
            <span className="h-3 w-3 rounded-sm" style={heatStyle(30 * 60)} />
            <span className="h-3 w-3 rounded-sm" style={heatStyle(2 * 3600)} />
            <span className="h-3 w-3 rounded-sm" style={heatStyle(5 * 3600)} />
            <span className="h-3 w-3 rounded-sm" style={heatStyle(8 * 3600)} />
            More · active hours/day
          </div>
        </div>
      ) : null}

      {/* Recent events */}
      {events.length > 0 ? (
        <div className="ds-card p-0">
          <div className="px-5 py-3 text-sm font-semibold text-[var(--color-foreground)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
            Recent activity
          </div>
          <ul className="text-sm">
            {events.slice(0, 20).map((e, ix) => (
              <li
                key={e.id}
                className="flex items-center gap-3 px-5 py-2"
                style={ix === 0 ? undefined : { borderTop: "1px solid var(--color-border)" }}
              >
                <span className="min-w-0 flex-1 truncate text-[var(--color-foreground)]">{e.name}</span>
                <span className="text-xs text-[var(--color-muted-foreground)]">{e.type}</span>
                <span className="w-20 text-right text-xs text-[var(--color-muted-foreground)]">{relTime(e.at, now)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
