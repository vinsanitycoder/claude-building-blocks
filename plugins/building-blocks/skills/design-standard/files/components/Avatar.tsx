import "../components.css";
import * as React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** 1–2 letter fallback when no image (e.g. "AT"). */
  initials?: string;
  size?: AvatarSize;
  /** Optional status dot in a corner. */
  status?: "online" | "offline" | "busy" | "away";
}

const SIZE_PX: Record<AvatarSize, number> = { xs: 20, sm: 28, md: 32, lg: 40, xl: 56 };

export function Avatar({ src, alt = "", initials, size = "md", status, className = "", style, ...rest }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const px = SIZE_PX[size];
  const showImg = src && !errored;
  return (
    <span
      className={["ds-avatar", `ds-avatar--${size}`, className].filter(Boolean).join(" ")}
      style={{ width: px, height: px, fontSize: Math.round(px * 0.4), ...style }}
      {...rest}
    >
      {showImg
        ? <img src={src} alt={alt} onError={() => setErrored(true)} />
        : <span aria-hidden={!alt}>{initials || (alt ? alt[0]!.toUpperCase() : "?")}</span>}
      {status && <span className={`ds-avatar__status ds-avatar__status--${status}`} aria-label={status} />}
    </span>
  );
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maximum avatars shown before showing "+N". */
  max?: number;
  size?: AvatarSize;
}

/** Overlapping stack of avatars + "+N" overflow. */
export function AvatarGroup({ max = 4, size = "md", className = "", children, ...rest }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;
  return (
    <span className={["ds-avatar-group", className].filter(Boolean).join(" ")} {...rest}>
      {visible}
      {extra > 0 && <Avatar size={size} initials={`+${extra}`} aria-label={`${extra} more`} />}
    </span>
  );
}
