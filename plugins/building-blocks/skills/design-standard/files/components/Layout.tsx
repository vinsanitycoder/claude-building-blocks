import * as React from "react";

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

function gap(n?: Space) { return n === undefined ? undefined : `var(--space-${n})`; }

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal (row) or vertical (column). Default: column. */
  direction?: "row" | "column";
  /** Gap from the spacing scale (1=4px, 4=16px, 6=24px, 16=64px, …). Default: 4 (16px). */
  gap?: Space;
  /** Align cross-axis. */
  align?: React.CSSProperties["alignItems"];
  /** Justify main-axis. */
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/** Flex stack with spacing-scale gap. Use INSTEAD of arbitrary margins. */
export function Stack({ direction = "column", gap: g = 4, align, justify, wrap, as: As = "div", style, ...rest }: StackProps) {
  const Tag = As as any;
  return (
    <Tag
      style={{
        display: "flex",
        flexDirection: direction,
        gap: gap(g),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max content width preset. */
  size?: "sm" | "md" | "lg" | "xl" | "prose" | "full";
  /** Horizontal padding (px on the spacing scale). Default: scales with viewport. */
  padX?: Space;
}

const MAX: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "640px", md: "768px", lg: "1024px", xl: "1280px", prose: "65ch", full: "100%",
};

/** Centered page-content container with mobile-first gutters. */
export function Container({ size = "xl", padX, className = "", style, ...rest }: ContainerProps) {
  return (
    <div
      className={["ds-container", className].filter(Boolean).join(" ")}
      style={{ maxWidth: MAX[size], marginInline: "auto", paddingInline: padX !== undefined ? gap(padX) : undefined, ...style }}
      {...rest}
    />
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical rhythm between sections. Default: 16 (64px). */
  spacing?: Space;
  as?: keyof JSX.IntrinsicElements;
}

/** Page section with consistent vertical rhythm. */
export function Section({ spacing = 16, as: As = "section", style, ...rest }: SectionProps) {
  const Tag = As as any;
  return <Tag style={{ paddingBlock: gap(spacing), ...style }} {...rest} />;
}
