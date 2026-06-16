import "../components.css";
import * as React from "react";

export type TimelineTone = "default" | "success" | "warning" | "destructive" | "muted";

export interface TimelineItem {
  id: string;
  /** Marker tone (colours the dot). */
  tone?: TimelineTone;
  /** Optional custom marker (icon/avatar) replacing the dot. */
  marker?: React.ReactNode;
  title: React.ReactNode;
  /** Right-aligned timestamp / meta. */
  time?: React.ReactNode;
  description?: React.ReactNode;
}

export interface TimelineProps extends React.OlHTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

/** Vertical, time-ordered event feed — audit logs, deal/ticket history, status trails. Renders as an
 *  ordered list with a connector rail; markers convey tone via colour + the text always carries the
 *  meaning (never colour alone). */
export function Timeline({ items, className = "", ...rest }: TimelineProps) {
  return (
    <ol className={["ds-timeline", className].filter(Boolean).join(" ")} {...rest}>
      {items.map((it) => (
        <li key={it.id} className="ds-timeline__item">
          <span className={`ds-timeline__marker ds-timeline__marker--${it.tone ?? "default"}`} aria-hidden="true">
            {it.marker}
          </span>
          <div className="ds-timeline__content">
            <div className="ds-timeline__head">
              <span className="ds-timeline__title">{it.title}</span>
              {it.time != null && <span className="ds-timeline__time">{it.time}</span>}
            </div>
            {it.description != null && <div className="ds-timeline__desc">{it.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
