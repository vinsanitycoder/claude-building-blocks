import "../components.css";
import * as React from "react";

/** Pure-SVG, dependency-free charts using the standard's --chart-1..8 Okabe-Ito palette.
 *  Use for the 80% case (bars, lines, areas, sparklines). For rich interactivity (tooltips,
 *  stacked bars, scatter), reach for Recharts directly with the same --chart-* tokens. */

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

function Axes({ width, height, min, max, labels, formatValue }: { width: number; height: number; min: number; max: number; labels?: string[]; formatValue?: (n: number) => string }) {
  const ts = ticks(min, max);
  const fmt = formatValue ?? ((n: number) => (Math.abs(n) >= 1000 ? `${Math.round(n / 100) / 10}k` : String(Math.round(n * 10) / 10)));
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

/** Line chart — over-time data. */
export function LineChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors = DEFAULT_COLORS, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  return (
    <div className="ds-chart" {...rest}>
      <svg width={width} height={height} role="img" aria-label="Line chart">
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) => {
          const n = Math.max(1, s.data.length - 1);
          const d = s.data.map((v, i) => {
            const x = PAD.left + (i / n) * plotW;
            const y = PAD.top + plotH - ((v - min) / (max - min)) * plotH;
            return `${i === 0 ? "M" : "L"}${x},${y}`;
          }).join(" ");
          return <path key={s.name} d={d} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />;
        })}
      </svg>
      {legend && <Legend series={series} colors={colors} />}
    </div>
  );
}

/** Bar chart — categorical comparison. Bars ALWAYS start at zero (per the standard). */
export function BarChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors = DEFAULT_COLORS, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  const cats = series[0]?.data.length ?? 0;
  const groupW = plotW / Math.max(1, cats);
  const barW = (groupW * 0.72) / Math.max(1, series.length);
  const zeroY = PAD.top + plotH - ((0 - min) / (max - min)) * plotH;
  return (
    <div className="ds-chart" {...rest}>
      <svg width={width} height={height} role="img" aria-label="Bar chart">
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) =>
          s.data.map((v, i) => {
            const groupCenter = PAD.left + (i + 0.5) * groupW;
            const x = groupCenter - (series.length * barW) / 2 + si * barW;
            const y = PAD.top + plotH - ((v - min) / (max - min)) * plotH;
            const h = Math.abs(zeroY - y);
            return <rect key={`${si}-${i}`} x={x} y={Math.min(y, zeroY)} width={barW} height={h} fill={colors[si % colors.length]} rx={2} />;
          })
        )}
      </svg>
      {legend && <Legend series={series} colors={colors} />}
    </div>
  );
}

/** Area chart — magnitude over time. */
export function AreaChart({ series, labels, width = 480, height = 220, legend = true, formatValue, colors = DEFAULT_COLORS, ...rest }: BaseChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const { min, max } = bounds(series);
  const plotW = width - PAD.left - PAD.right, plotH = height - PAD.top - PAD.bottom;
  return (
    <div className="ds-chart" {...rest}>
      <svg width={width} height={height} role="img" aria-label="Area chart">
        <Axes width={width} height={height} min={min} max={max} labels={labels} formatValue={formatValue} />
        {series.map((s, si) => {
          const n = Math.max(1, s.data.length - 1);
          const pts = s.data.map((v, i) => {
            const x = PAD.left + (i / n) * plotW;
            const y = PAD.top + plotH - ((v - min) / (max - min)) * plotH;
            return { x, y };
          });
          const top = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
          const fill = `${top} L${pts[pts.length - 1]!.x},${PAD.top + plotH} L${pts[0]!.x},${PAD.top + plotH} Z`;
          return (
            <g key={s.name}>
              <path d={fill} fill={colors[si % colors.length]} opacity={0.18} />
              <path d={top} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
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
export function Sparkline({ data, width = 80, height = 24, color = "var(--chart-1)", className = "", ...rest }: SparklineProps) {
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
