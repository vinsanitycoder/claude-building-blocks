import "../components.css";
import * as React from "react";

/** Pure-SVG, dependency-free charts using the standard's --chart-1..8 Okabe-Ito palette.
 *  Use for the 80% case (bars, lines, areas, sparklines). Includes data-point markers
 *  and hover tooltips. For richer needs (stacked bars, scatter), reach for Recharts
 *  directly with the same --chart-* tokens. */

export type Series = { name: string; data: number[] };

export interface BaseChartProps {
  series: Series[];
  /** X-axis labels — must match series[0].data.length. */
  labels?: string[];
  width?: number;
  height?: number;
  /** Show legend below chart. Default true. */
  legend?: boolean;
  /** Format numeric tick labels (e.g. n => `${n}%`). */
  formatValue?: (n: number) => string;
  /** Override the palette (defaults to Okabe-Ito --chart-1..8). */
  colors?: string[];
}

const DEFAULT_COLORS = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);
// Resolve at the chart element (not :root) so the themed --color-primary applies; --chart-primary overrides.
const CHART_PRIMARY = "var(--chart-primary, var(--color-primary))";
/** Hybrid palette rule (§20): an explicit `colors` prop always wins; otherwise a SINGLE series follows
 *  the brand (`--chart-primary`) so KPIs/StatCards feel on-theme, and MULTI-series uses the fixed,
 *  colourblind-safe Okabe-Ito palette so series stay distinguishable. */
function palette(colors: string[] | undefined, seriesCount: number): string[] {
  if (colors) return colors;
  return seriesCount <= 1 ? [CHART_PRIMARY] : DEFAULT_COLORS;
}
const PAD = { top: 12, right: 12, bottom: 24, left: 36 };

function ticks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const step = (max - min) / count;
  return Array.from({ length: count + 1 }, (_, i) => min + step * i);
}

function bounds(series: Series[]): { min: number; max: number } {
  let min = Infinity, max = -Infinity;
  for (const s of series) for (const v of s.data) { if (v < min) min = v; if (v > max) max = v; }
  if (!isFinite(min)) { min = 0; max = 1; }
  if (min === max) { max = min + 1; }
  return { min: Math.min(0, min), max };
}

function fmtNum(n: number): string {
  if (Math.abs(n) >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(Math.round(n * 10) / 10);
}

function Axes({ width, height, min, max, labels, formatValue }: { width: number; height: number; min: number; max: number; labels?: string[]; formatValue?: (n: number) => string }) {
  const ts = ticks(min, max);
  const fmt = formatValue ?? fmtNum;
  const plotH = height - PAD.top - PAD.bottom;
  return (
    <>
      {ts.map((t, i) => {
        const y = PAD.top + plotH - ((t - min) / (max - min)) * plotH;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={width - PAD.right} y2={y} stroke="var(--color-border)" strokeWidth={1} opacity={0.5} />
            <text x={PAD.left - 6} y={y + 3} fontSize={10} fill="var(--color-muted-foreground)" textAnchor="end">{fmt(t)}</text>
          </g>
        );
      })}
      {labels?.map((l, i, arr) => {
        const x = PAD.left + (i / Math.max(1, arr.length - 1)) * (width - PAD.left - PAD.right);
        return <text key={i} x={x} y={height - 8} fontSize={10} fill="var(--color-muted-foreground)" textAnchor="middle">{l}</text>;
      })}
    </>
  );
}

function Legend({ series, colors }: { series: Series[]; colors: string[] }) {
  return (
    <div className="ds-chart__legend">
      {series.map((s, i) => (
        <span key={s.name} className="ds-chart__legend-item">
          <span className="ds-chart__swatch" style={{ background: colors[i % colors.length] }} aria-hidden="true" />
          {s.name}
        </span>
      ))}
    </div>
  );
}

/** Floating tooltip near the cursor, anchored to the chart container. */
function ChartTooltip({ x, y, label, items }: { x: number; y: number; label: React.ReactNode; items: { name: string; value: number; color: string }[] }) {
  return (
    <div
      className="ds-chart__tooltip"
      style={{ left: x, top: y }}
      role="tooltip"
    >
      <div className="ds-chart__tooltip-label">{label}</div>
      {items.map((it) => (
        <div key={it.name} className="ds-chart__tooltip-row">
          <span className="ds-chart__swatch" style={{ background: it.color }} aria-hidden="true" />
          <span className="ds-chart__tooltip-name">{it.name}</span>
          <span className="ds-chart__tooltip-value">{fmtNum(it.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Shared hook: track the closest data-point index based on mouse X over the plot area. */
function useHoverIndex(svgRef: React.RefObject<SVGSVGElement>, length: number, width: number) {
  const [idx, setIdx] = React.useState<number | null>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || length === 0) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const plotL = PAD.left, plotW = width - PAD.left - PAD.right;
    const rel = Math.max(0, Math.min(1, (x - plotL) / plotW));
    const i = Math.round(rel * (length - 1));
    setIdx(i);
    setPos({ x, y });
  }
  function onLeave() { setIdx(null); setPos(null); }
  return { idx, pos, onMove, onLeave };
}

function tooltipPos(pos: { x: number; y: number } | null, width: number, height: number) {
  if (!pos) return { x: 0, y: 0 };
  // Keep tooltip inside container: prefer right of cursor, flip if past midline.
  const w = 160, h = 70;
  const x = pos.x + (pos.x > width - w - 12 ? -w - 12 : 12);
  const y = Math.min(Math.max(0, pos.y - h - 12), height - h);
  return { x, y };
}

/** Line chart — over-time data. Hover shows the value at the nearest x. */
export function LineChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors: colorsProp, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const colors = palette(colorsProp, series.length);
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const length = series[0]?.data.length ?? 0;
  const { idx, pos, onMove, onLeave } = useHoverIndex(svgRef, length, width);
  const n = Math.max(1, length - 1);
  const xAt = (i: number) => PAD.left + (i / n) * plotW;
  const yAt = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH;
  const tp = tooltipPos(pos, width, height);

  return (
    <div className="ds-chart" {...rest} style={{ position: "relative", ...(rest as any).style }}>
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="Line chart" onMouseMove={onMove} onMouseLeave={onLeave}>
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) => {
          const d = s.data.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(v)}`).join(" ");
          return <path key={s.name} d={d} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />;
        })}
        {/* Data points — small dots on every value */}
        {series.map((s, si) => s.data.map((v, i) => (
          <circle key={`${si}-${i}`} cx={xAt(i)} cy={yAt(v)} r={2.5} fill={colors[si % colors.length]} />
        )))}
        {/* Hover indicator: vertical guide + larger highlighted dots */}
        {idx !== null && (
          <g pointerEvents="none">
            <line x1={xAt(idx)} y1={PAD.top} x2={xAt(idx)} y2={PAD.top + plotH} stroke="var(--color-foreground)" strokeWidth={1} opacity={0.18} strokeDasharray="3 3" />
            {series.map((s, si) => {
              const v = s.data[idx];
              if (v === undefined) return null;
              return <circle key={`h-${si}`} cx={xAt(idx)} cy={yAt(v)} r={5} fill={colors[si % colors.length]} stroke="var(--color-background)" strokeWidth={2} />;
            })}
          </g>
        )}
      </svg>
      {idx !== null && pos && labels && (
        <ChartTooltip
          x={tp.x} y={tp.y}
          label={labels[idx]}
          items={series.map((s, si) => ({ name: s.name, value: s.data[idx] ?? 0, color: colors[si % colors.length]! }))}
        />
      )}
      {legend && <Legend series={series} colors={colors} />}
    </div>
  );
}

/** Bar chart — categorical comparison. Bars ALWAYS start at zero (per the standard).
 *  Hover dims non-active categories, highlights the hovered group, and shows a tooltip. */
export function BarChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors: colorsProp, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const colors = palette(colorsProp, series.length);
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const cats = series[0]?.data.length ?? 0;
  const groupW = plotW / Math.max(1, cats);
  const barW = (groupW * 0.72) / Math.max(1, series.length);
  const zeroY = PAD.top + plotH - ((0 - min) / (max - min)) * plotH;
  const { idx, pos, onMove, onLeave } = useHoverIndex(svgRef, cats, width);
  const tp = tooltipPos(pos, width, height);

  return (
    <div className="ds-chart" {...rest} style={{ position: "relative", ...(rest as any).style }}>
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="Bar chart" onMouseMove={onMove} onMouseLeave={onLeave}>
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) =>
          s.data.map((v, i) => {
            const groupCenter = PAD.left + (i + 0.5) * groupW;
            const x = groupCenter - (series.length * barW) / 2 + si * barW;
            const y = PAD.top + plotH - ((v - min) / (max - min)) * plotH;
            const h = Math.abs(zeroY - y);
            const dim = idx !== null && idx !== i;
            return (
              <rect
                key={`${si}-${i}`}
                x={x} y={Math.min(y, zeroY)} width={barW} height={h}
                fill={colors[si % colors.length]} rx={2}
                opacity={dim ? 0.35 : 1}
                style={{ transition: "opacity 120ms" }}
              />
            );
          })
        )}
        {idx !== null && (
          <rect
            x={PAD.left + idx * groupW} y={PAD.top} width={groupW} height={plotH}
            fill="var(--color-foreground)" opacity={0.04} pointerEvents="none"
          />
        )}
      </svg>
      {idx !== null && pos && labels && (
        <ChartTooltip
          x={tp.x} y={tp.y}
          label={labels[idx]}
          items={series.map((s, si) => ({ name: s.name, value: s.data[idx] ?? 0, color: colors[si % colors.length]! }))}
        />
      )}
      {legend && <Legend series={series} colors={colors} />}
    </div>
  );
}

/** Area chart — magnitude over time. Hover behaves like LineChart. */
export function AreaChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors: colorsProp, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const colors = palette(colorsProp, series.length);
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const length = series[0]?.data.length ?? 0;
  const { idx, pos, onMove, onLeave } = useHoverIndex(svgRef, length, width);
  const n = Math.max(1, length - 1);
  const xAt = (i: number) => PAD.left + (i / n) * plotW;
  const yAt = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH;
  const tp = tooltipPos(pos, width, height);

  return (
    <div className="ds-chart" {...rest} style={{ position: "relative", ...(rest as any).style }}>
      <svg ref={svgRef} width={width} height={height} role="img" aria-label="Area chart" onMouseMove={onMove} onMouseLeave={onLeave}>
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
          const top = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
          const fill = `${top} L${pts[pts.length - 1]!.x},${PAD.top + plotH} L${pts[0]!.x},${PAD.top + plotH} Z`;
          return (
            <g key={s.name}>
              <path d={fill} fill={colors[si % colors.length]} opacity={0.18} />
              <path d={top} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {s.data.map((v, i) => (
                <circle key={i} cx={xAt(i)} cy={yAt(v)} r={2.5} fill={colors[si % colors.length]} />
              ))}
            </g>
          );
        })}
        {idx !== null && (
          <g pointerEvents="none">
            <line x1={xAt(idx)} y1={PAD.top} x2={xAt(idx)} y2={PAD.top + plotH} stroke="var(--color-foreground)" strokeWidth={1} opacity={0.18} strokeDasharray="3 3" />
            {series.map((s, si) => {
              const v = s.data[idx];
              if (v === undefined) return null;
              return <circle key={`h-${si}`} cx={xAt(idx)} cy={yAt(v)} r={5} fill={colors[si % colors.length]} stroke="var(--color-background)" strokeWidth={2} />;
            })}
          </g>
        )}
      </svg>
      {idx !== null && pos && labels && (
        <ChartTooltip
          x={tp.x} y={tp.y}
          label={labels[idx]}
          items={series.map((s, si) => ({ name: s.name, value: s.data[idx] ?? 0, color: colors[si % colors.length]! }))}
        />
      )}
      {legend && <Legend series={series} colors={colors} />}
    </div>
  );
}

export interface SparklineProps extends React.HTMLAttributes<HTMLSpanElement> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

/** Tiny inline trend chart — sits beside a number like 42 ↗. */
export function Sparkline({ data, width = 80, height = 24, color = "var(--chart-primary, var(--color-primary))", className = "", ...rest }: SparklineProps) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const n = Math.max(1, data.length - 1);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${(i / n) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <span className={["ds-sparkline", className].filter(Boolean).join(" ")} {...rest}>
      <svg width={width} height={height} role="img" aria-hidden="true">
        <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </span>
  );
}
