import "../components.css";
import * as React from "react";
import { ChevronDownIcon } from "./icons";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  /** Controlled expanded ids. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  "aria-label": string;
}

/** Expand/collapse hierarchy (files, categories, account trees). role="tree" + treeitem with
 *  aria-expanded/-selected/-level; roving tabindex; ↑/↓ move, →/← expand-collapse, Enter selects. */
export function TreeView({ nodes, expanded, defaultExpanded = [], onExpandedChange, selectedId, onSelect, ...aria }: TreeViewProps) {
  const [internalExp, setInternalExp] = React.useState<string[]>(defaultExpanded);
  const exp = expanded ?? internalExp;
  const [focusId, setFocusId] = React.useState<string | null>(null);

  // flatten visible nodes for keyboard traversal
  const visible = React.useMemo(() => {
    const out: { node: TreeNode; level: number; hasChildren: boolean }[] = [];
    const walk = (ns: TreeNode[], level: number) => {
      for (const n of ns) {
        const hasChildren = !!n.children?.length;
        out.push({ node: n, level, hasChildren });
        if (hasChildren && exp.includes(n.id)) walk(n.children!, level + 1);
      }
    };
    walk(nodes, 1);
    return out;
  }, [nodes, exp]);

  function setExpanded(ids: string[]) {
    if (expanded === undefined) setInternalExp(ids);
    onExpandedChange?.(ids);
  }
  function toggle(id: string) {
    setExpanded(exp.includes(id) ? exp.filter((x) => x !== id) : [...exp, id]);
  }

  const activeId = focusId ?? selectedId ?? visible[0]?.node.id ?? null;

  function onKeyDown(e: React.KeyboardEvent, entry: typeof visible[number]) {
    const idx = visible.findIndex((v) => v.node.id === entry.node.id);
    const focus = (i: number) => { const t = visible[Math.max(0, Math.min(visible.length - 1, i))]; if (t) setFocusId(t.node.id); };
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); focus(idx + 1); break;
      case "ArrowUp": e.preventDefault(); focus(idx - 1); break;
      case "Home": e.preventDefault(); focus(0); break;
      case "End": e.preventDefault(); focus(visible.length - 1); break;
      case "ArrowRight":
        e.preventDefault();
        if (entry.hasChildren && !exp.includes(entry.node.id)) toggle(entry.node.id);
        else if (entry.hasChildren) focus(idx + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (entry.hasChildren && exp.includes(entry.node.id)) toggle(entry.node.id);
        else { const parent = [...visible.slice(0, idx)].reverse().find((v) => v.level < entry.level); if (parent) setFocusId(parent.node.id); }
        break;
      case "Enter": case " ": e.preventDefault(); onSelect?.(entry.node.id); if (entry.hasChildren) toggle(entry.node.id); break;
    }
  }

  return (
    <ul role="tree" aria-label={aria["aria-label"]} className="ds-tree">
      {visible.map((entry) => {
        const { node, level, hasChildren } = entry;
        const isExp = exp.includes(node.id);
        const isSel = selectedId === node.id;
        return (
          <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isExp : undefined} aria-selected={isSel} aria-level={level} className="ds-tree__item">
            <div
              className={["ds-tree__row", isSel ? "ds-tree__row--selected" : ""].filter(Boolean).join(" ")}
              style={{ paddingLeft: `calc(${level - 1} * var(--space-5) + var(--space-2))` }}
              tabIndex={activeId === node.id ? 0 : -1}
              ref={(el) => { if (el && focusId === node.id) el.focus(); }}
              onKeyDown={(e) => onKeyDown(e, entry)}
              onClick={() => { setFocusId(node.id); onSelect?.(node.id); if (hasChildren) toggle(node.id); }}
            >
              <span className={["ds-tree__chevron", hasChildren ? "" : "ds-tree__chevron--leaf", isExp ? "ds-tree__chevron--open" : ""].filter(Boolean).join(" ")} aria-hidden="true">
                {hasChildren && <ChevronDownIcon />}
              </span>
              {node.icon && <span className="ds-tree__icon" aria-hidden="true">{node.icon}</span>}
              <span className="ds-tree__label">{node.label}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
