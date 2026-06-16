import "../components.css";
import * as React from "react";
import { BellIcon, InfoIcon, CheckCircleIcon, AlertIcon, XIcon } from "./icons";

export type NotificationSeverity = "info" | "success" | "warning" | "critical";

export interface NotificationItem {
  id: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** epoch ms or ISO string — shown as relative time. */
  timestamp: number | string;
  read?: boolean;
  severity?: NotificationSeverity;
  /** Custom leading icon/avatar (overrides the severity icon). */
  icon?: React.ReactNode;
  /** Group bucket label (e.g. "Today", "Earlier", or a source). Items keep their given order within a group. */
  group?: string;
  /** Inline primary action. */
  actionLabel?: React.ReactNode;
  onAction?: () => void;
}

export interface NotificationCenterProps {
  items: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  /** Fired when the row (not an action) is activated — deep-link target. Also marks read. */
  onItemClick?: (item: NotificationItem) => void;
  loading?: boolean;
  /** Badge caps the unread count to avoid layout shift: shows e.g. "9+". Default 9. */
  badgeMax?: number;
  /** Panel side relative to the bell (default "end" — bell usually sits top-right). */
  align?: "start" | "end";
  /** Override relative-time formatting. */
  relativeTime?: (ts: number | string) => string;
  emptyTitle?: React.ReactNode;
  emptyText?: React.ReactNode;
  className?: string;
}

const SEV_ICON: Record<NotificationSeverity, React.ReactNode> = {
  info: <InfoIcon />, success: <CheckCircleIcon />, warning: <AlertIcon />, critical: <AlertIcon />,
};

function defaultRelative(ts: number | string): string {
  const t = typeof ts === "number" ? ts : Date.parse(ts);
  if (!isFinite(t)) return "";
  const diff = Date.now() - t;
  const s = Math.round(diff / 1000), m = Math.round(s / 60), h = Math.round(m / 60), d = Math.round(h / 24);
  if (s < 45) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** In-app notification inbox — a bell + unread-count badge that opens a grouped, scrollable list of
 *  asynchronous notifications (mentions, assignments, status changes). Controlled + backend-agnostic:
 *  pass items + callbacks. Severity shows as icon + colour (never colour alone, WCAG 1.4.1); unread is
 *  marked by a dot + weight; new items announce politely without stealing focus. */
export function NotificationCenter({
  items, onMarkRead, onMarkAllRead, onItemClick, loading, badgeMax = 9, align = "end",
  relativeTime = defaultRelative, emptyTitle = "You're all caught up", emptyText = "New notifications will show up here.", className = "",
}: NotificationCenterProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = items.filter((i) => !i.read).length;
  const badge = unread > badgeMax ? `${badgeMax}+` : String(unread);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // group preserving first-seen order
  const groups = React.useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, NotificationItem[]>();
    for (const it of items) {
      const g = it.group ?? "";
      if (!map.has(g)) { map.set(g, []); order.push(g); }
      map.get(g)!.push(it);
    }
    return order.map((g) => ({ label: g, items: map.get(g)! }));
  }, [items]);

  function activate(item: NotificationItem) {
    if (!item.read) onMarkRead?.(item.id);
    onItemClick?.(item);
  }

  return (
    <div className={["ds-notif", className].filter(Boolean).join(" ")} ref={ref}>
      <button
        type="button"
        className="ds-notif__bell"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <BellIcon />
        {unread > 0 && <span className="ds-notif__badge" aria-hidden="true">{badge}</span>}
      </button>

      {open && (
        <div className={["ds-notif__panel", align === "start" ? "ds-notif__panel--start" : ""].filter(Boolean).join(" ")} role="dialog" aria-label="Notifications">
          <div className="ds-notif__head">
            <span className="ds-notif__title">Notifications</span>
            {unread > 0 && onMarkAllRead && (
              <button type="button" className="ds-notif__markall" onClick={onMarkAllRead}>Mark all as read</button>
            )}
          </div>

          <div className="ds-notif__list" role="list">
            {loading ? (
              <div className="ds-notif__loading">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="ds-notif__skel">
                    <span className="ds-skeleton ds-notif__skel-dot" />
                    <span style={{ flex: 1 }}>
                      <span className="ds-skeleton" style={{ display: "block", height: 12, width: "70%", marginBottom: 6 }} />
                      <span className="ds-skeleton" style={{ display: "block", height: 10, width: "90%" }} />
                    </span>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="ds-notif__empty">
                <span className="ds-notif__empty-icon" aria-hidden="true"><BellIcon /></span>
                <span className="ds-notif__empty-title">{emptyTitle}</span>
                <span className="ds-notif__empty-text">{emptyText}</span>
              </div>
            ) : (
              groups.map((grp) => (
                <div key={grp.label} className="ds-notif__group">
                  {grp.label && <div className="ds-notif__group-label">{grp.label}</div>}
                  {grp.items.map((it) => (
                    <div
                      key={it.id}
                      role="listitem"
                      className={["ds-notif__item", it.read ? "" : "ds-notif__item--unread", it.severity ? `ds-notif__item--${it.severity}` : ""].filter(Boolean).join(" ")}
                    >
                      <span className="ds-notif__item-icon" aria-hidden="true">{it.icon ?? (it.severity ? SEV_ICON[it.severity] : <InfoIcon />)}</span>
                      <button type="button" className="ds-notif__item-main" onClick={() => activate(it)}>
                        <span className="ds-notif__item-head">
                          <span className="ds-notif__item-title">{it.title}</span>
                          <span className="ds-notif__item-time">{relativeTime(it.timestamp)}</span>
                        </span>
                        {it.body != null && <span className="ds-notif__item-body">{it.body}</span>}
                        {it.actionLabel != null && (
                          <span
                            className="ds-notif__item-action"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); it.onAction?.(); }}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); it.onAction?.(); } }}
                          >
                            {it.actionLabel}
                          </span>
                        )}
                      </button>
                      {!it.read && (
                        <button type="button" className="ds-notif__item-dismiss" aria-label="Mark as read" onClick={() => onMarkRead?.(it.id)}>
                          <span className="ds-notif__item-dot" aria-hidden="true" />
                          <XIcon className="ds-notif__item-x" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
