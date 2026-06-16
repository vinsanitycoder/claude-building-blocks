import "../components.css";
import * as React from "react";

export interface ResizableProps {
  /** Two children = the two panels (start, end). */
  children: [React.ReactNode, React.ReactNode];
  orientation?: "horizontal" | "vertical";
  /** Initial size of the FIRST panel, in percent (0–100). */
  defaultSize?: number;
  /** Clamp the first panel (percent). */
  min?: number;
  max?: number;
  /** Keyboard step (percent). */
  step?: number;
  className?: string;
  "aria-label"?: string;
}

/** Two resizable panels with a draggable splitter. Pointer-drag or keyboard (arrows / Home / End).
 *  The handle is role="separator" with aria-valuenow/min/max. Uncontrolled size in percent. */
export function Resizable({
  children, orientation = "horizontal", defaultSize = 50, min = 10, max = 90, step = 2, className = "", ...aria
}: ResizableProps) {
  const [size, setSize] = React.useState(defaultSize);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const horizontal = orientation === "horizontal";

  const clamp = React.useCallback((n: number) => Math.max(min, Math.min(max, n)), [min, max]);

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const pct = horizontal ? ((e.clientX - r.left) / r.width) * 100 : ((e.clientY - r.top) / r.height) * 100;
      setSize(clamp(pct));
    }
    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [horizontal, clamp]);

  function startDrag() {
    dragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = horizontal ? "col-resize" : "row-resize";
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const dec = horizontal ? "ArrowLeft" : "ArrowUp";
    const inc = horizontal ? "ArrowRight" : "ArrowDown";
    if (e.key === dec) { e.preventDefault(); setSize((s) => clamp(s - step)); }
    else if (e.key === inc) { e.preventDefault(); setSize((s) => clamp(s + step)); }
    else if (e.key === "Home") { e.preventDefault(); setSize(clamp(min)); }
    else if (e.key === "End") { e.preventDefault(); setSize(clamp(max)); }
  }

  return (
    <div
      ref={ref}
      className={["ds-resizable", horizontal ? "ds-resizable--h" : "ds-resizable--v", className].filter(Boolean).join(" ")}
    >
      <div className="ds-resizable__panel" style={{ flexBasis: `${size}%` }}>{children[0]}</div>
      <div
        className="ds-resizable__handle"
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(size)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={aria["aria-label"] ?? "Resize panels"}
        onPointerDown={(e) => { e.preventDefault(); startDrag(); }}
        onKeyDown={onKeyDown}
      >
        <span className="ds-resizable__grip" aria-hidden="true" />
      </div>
      <div className="ds-resizable__panel" style={{ flexBasis: `${100 - size}%` }}>{children[1]}</div>
    </div>
  );
}
