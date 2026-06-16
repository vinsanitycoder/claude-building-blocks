import "../components.css";
import * as React from "react";
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor, TouchSensor,
  useSensor, useSensors, closestCorners, type CollisionDetection, pointerWithin, getFirstCollision,
  type DragStartEvent, type DragOverEvent, type DragEndEvent, useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ColumnId = string;
export type CardId = string;

export interface KanbanCard {
  id: CardId;
  /** Opaque payload handed back to renderCard. */
  [key: string]: unknown;
}
export interface KanbanColumn {
  id: ColumnId;
  title: React.ReactNode;
  cardIds: CardId[];
  /** Flag/limit the column when card count exceeds this. */
  wipLimit?: number;
}

export interface CardMoveEvent {
  cardId: CardId;
  fromColumnId: ColumnId;
  toColumnId: ColumnId;
  toIndex: number;
  /** Neighbour ids in the target column — let the consumer compute a rank between them. */
  beforeCardId: CardId | null;
  afterCardId: CardId | null;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: Record<CardId, KanbanCard>;
  renderCard: (card: KanbanCard, ctx: { isDragging: boolean; isOverlay: boolean }) => React.ReactNode;
  renderColumnHeader?: (col: KanbanColumn, count: number) => React.ReactNode;
  /** Drag the whole card, or only a dedicated handle (default — avoids fighting text selection/buttons). */
  dragHandle?: "card" | "handle";
  /** Colour-code a card — return any CSS colour (e.g. a CSS var). Renders as a strip on the card. */
  cardAccent?: (card: KanbanCard) => string | undefined;
  /** Where the accent strip sits (default "left", Jira-style). "top" gives a Trello-style bar. */
  accentPosition?: "left" | "top";
  /** Block a drop (e.g. WIP limit / business rules). */
  canDrop?: (e: { cardId: CardId; toColumnId: ColumnId }) => boolean;
  /** The only persistence contract — emits positional intent, never owns ordering/persistence. */
  onCardMove: (e: CardMoveEvent) => void;
  /** Override screen-reader announcements. */
  announce?: (e: { type: "start" | "move" | "end" | "cancel"; cardId: CardId; columnId: ColumnId; index: number; total: number }) => string;
  className?: string;
}

const dragHandleAttr = "data-kanban-handle";

/** Trello-style board with drag-and-drop (dnd-kit). Controlled + backend-agnostic: columns/cards come
 *  in as props, and the single onCardMove callback emits the moved card + target column/index + the two
 *  neighbour ids so the consumer can compute a fractional/LexoRank rank and persist. Keyboard-operable
 *  (pick up / move / drop) with live-region announcements out of the box. */
export function KanbanBoard({
  columns, cards, renderCard, renderColumnHeader, dragHandle = "handle", cardAccent, accentPosition = "left",
  canDrop, onCardMove, announce, className = "",
}: KanbanBoardProps) {
  // Local working copy so cards can move between columns DURING a drag; re-synced from props when idle.
  const [items, setItems] = React.useState<Record<ColumnId, CardId[]>>(() => fromColumns(columns));
  const [activeId, setActiveId] = React.useState<CardId | null>(null);
  const draggingRef = React.useRef(false);
  const lastOverColumn = React.useRef<ColumnId | null>(null);

  React.useEffect(() => {
    if (!draggingRef.current) setItems(fromColumns(columns));
  }, [columns]);

  const columnOrder = columns.map((c) => c.id);
  const colById = React.useMemo(() => Object.fromEntries(columns.map((c) => [c.id, c])), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findColumn(id: string): ColumnId | undefined {
    if (id in items) return id as ColumnId;
    return columnOrder.find((col) => items[col]?.includes(id as CardId));
  }

  // Prefer pointer-within columns, fall back to closest-corners for keyboard/edge cases.
  const collisionDetection: CollisionDetection = React.useCallback((args) => {
    const pointer = pointerWithin(args);
    const collisions = pointer.length ? pointer : closestCorners(args);
    const overId = getFirstCollision(collisions, "id");
    return overId != null ? [{ id: overId }] : [];
  }, []);

  function onDragStart(e: DragStartEvent) {
    draggingRef.current = true;
    setActiveId(e.active.id as CardId);
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeCol = findColumn(active.id as string);
    const overCol = findColumn(over.id as string);
    if (!activeCol || !overCol || activeCol === overCol) return;
    if (canDrop && !canDrop({ cardId: active.id as CardId, toColumnId: overCol })) return;
    lastOverColumn.current = overCol;
    setItems((prev) => {
      const from = prev[activeCol].filter((id) => id !== active.id);
      const to = prev[overCol].slice();
      const overIndex = to.indexOf(over.id as CardId);
      const insertAt = overIndex >= 0 ? overIndex : to.length;
      to.splice(insertAt, 0, active.id as CardId);
      return { ...prev, [activeCol]: from, [overCol]: to };
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    draggingRef.current = false;
    const cardId = active.id as CardId;
    setActiveId(null);
    if (!over) { setItems(fromColumns(columns)); return; }

    const toColumnId = findColumn(over.id as string);
    const fromColumnId = columns.find((c) => c.cardIds.includes(cardId))?.id;
    if (!toColumnId || !fromColumnId) { setItems(fromColumns(columns)); return; }
    if (canDrop && !canDrop({ cardId, toColumnId })) { setItems(fromColumns(columns)); return; }

    const target = items[toColumnId].slice();
    let toIndex = target.indexOf(over.id as CardId);
    if (over.id === toColumnId || toIndex < 0) toIndex = target.length; // dropped on the column/empty area
    // within-column reorder: items already reflects cross-column moves from onDragOver
    if (fromColumnId === toColumnId) {
      const oldIndex = items[toColumnId].indexOf(cardId);
      const reordered = arrayMove(items[toColumnId], oldIndex, toIndex);
      setItems((prev) => ({ ...prev, [toColumnId]: reordered }));
      toIndex = reordered.indexOf(cardId);
    } else {
      toIndex = items[toColumnId].indexOf(cardId);
    }

    const finalCol = items[toColumnId].filter((id) => id !== cardId);
    const beforeCardId = toIndex > 0 ? finalCol[toIndex - 1] ?? null : null;
    const afterCardId = finalCol[toIndex] ?? null;
    onCardMove({ cardId, fromColumnId, toColumnId, toIndex, beforeCardId, afterCardId });
  }

  function onDragCancel() {
    draggingRef.current = false;
    setActiveId(null);
    setItems(fromColumns(columns));
  }

  const announcements = {
    onDragStart: ({ active }: { active: { id: string | number } }) => msg("start", active.id as CardId),
    onDragOver: ({ active }: { active: { id: string | number } }) => msg("move", active.id as CardId),
    onDragEnd: ({ active }: { active: { id: string | number } }) => msg("end", active.id as CardId),
    onDragCancel: ({ active }: { active: { id: string | number } }) => msg("cancel", active.id as CardId),
  };
  function msg(type: "start" | "move" | "end" | "cancel", cardId: CardId) {
    const col = findColumn(cardId);
    const list = col ? items[col] : [];
    const index = list.indexOf(cardId);
    const colTitle = col ? String(colById[col]?.title ?? col) : "";
    if (announce && col) return announce({ type, cardId, columnId: col, index, total: list.length });
    if (type === "start") return `Picked up card. ${describe(cardId)}`;
    if (type === "move") return `${describe(cardId)} — position ${index + 1} of ${list.length} in ${colTitle}.`;
    if (type === "end") return `Dropped. ${describe(cardId)} is now position ${index + 1} of ${list.length} in ${colTitle}.`;
    return "Move cancelled.";
  }
  function describe(cardId: CardId) {
    const c = cards[cardId];
    return (c && (c.title as string)) || `Card ${cardId}`;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      accessibility={{ announcements }}
    >
      <div className={["ds-kanban", className].filter(Boolean).join(" ")}>
        {columnOrder.map((colId) => {
          const col = colById[colId];
          const cardIds = items[colId] ?? [];
          const over = col.wipLimit != null && cardIds.length > col.wipLimit;
          return (
            <KanbanColumnView key={colId} id={colId} over={over}>
              <div className="ds-kanban__col-head">
                {renderColumnHeader ? (
                  renderColumnHeader(col, cardIds.length)
                ) : (
                  <>
                    <span className="ds-kanban__col-title">{col.title}</span>
                    <span className={["ds-kanban__col-count", over ? "ds-kanban__col-count--over" : ""].filter(Boolean).join(" ")}>
                      {col.wipLimit != null ? `${cardIds.length}/${col.wipLimit}` : cardIds.length}
                    </span>
                  </>
                )}
              </div>
              <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                <div className="ds-kanban__col-body">
                  {cardIds.map((cid) =>
                    cards[cid] ? (
                      <SortableCard key={cid} id={cid} dragHandle={dragHandle} accent={cardAccent?.(cards[cid])} accentPosition={accentPosition}>
                        {(ctx) => renderCard(cards[cid], ctx)}
                      </SortableCard>
                    ) : null
                  )}
                  {cardIds.length === 0 && <div className="ds-kanban__empty">Drop here</div>}
                </div>
              </SortableContext>
            </KanbanColumnView>
          );
        })}
      </div>
      <DragOverlay>
        {activeId && cards[activeId] ? (
          <div className={["ds-kanban__card ds-kanban__card--overlay", cardAccent?.(cards[activeId]) ? `ds-kanban__card--accent-${accentPosition}` : ""].filter(Boolean).join(" ")}>
            <CardAccent color={cardAccent?.(cards[activeId])} position={accentPosition} />
            <div className="ds-kanban__card-body">{renderCard(cards[activeId], { isDragging: true, isOverlay: true })}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumnView({ id, over, children }: { id: ColumnId; over: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section
      ref={setNodeRef}
      className={["ds-kanban__col", isOver ? "ds-kanban__col--dropping" : "", over ? "ds-kanban__col--wip" : ""].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}

function CardAccent({ color, position }: { color?: string; position: "left" | "top" }) {
  if (!color) return null;
  return <span className={`ds-kanban__card-accent ds-kanban__card-accent--${position}`} style={{ background: color }} aria-hidden="true" />;
}

function SortableCard({
  id, dragHandle, accent, accentPosition, children,
}: {
  id: CardId; dragHandle: "card" | "handle"; accent?: string; accentPosition: "left" | "top";
  children: (ctx: { isDragging: boolean; isOverlay: boolean }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Translate.toString(transform), transition };
  const whole = dragHandle === "card" ? { ...attributes, ...listeners } : {};
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={["ds-kanban__card", accent ? `ds-kanban__card--accent-${accentPosition}` : "", isDragging ? "ds-kanban__card--dragging" : ""].filter(Boolean).join(" ")}
      {...whole}
    >
      <CardAccent color={accent} position={accentPosition} />
      {dragHandle === "handle" && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="ds-kanban__handle"
          aria-label="Drag card"
          {...attributes}
          {...listeners}
          {...{ [dragHandleAttr]: "" }}
        >
          <span aria-hidden="true">⠿</span>
        </button>
      )}
      <div className="ds-kanban__card-body">{children({ isDragging, isOverlay: false })}</div>
    </div>
  );
}

function fromColumns(columns: KanbanColumn[]): Record<ColumnId, CardId[]> {
  return Object.fromEntries(columns.map((c) => [c.id, c.cardIds.slice()]));
}

export interface KanbanLabel {
  /** Any CSS colour. */
  color: string;
  /** Optional text — renders a pill; omit for a bare colour bar (Trello-style). */
  label?: React.ReactNode;
}

export interface KanbanCardContentProps {
  /** Top colour chips / label bars — use for the SECOND colour dimension (the strip carries the first). */
  labels?: KanbanLabel[];
  title: React.ReactNode;
  /** Subtitle / description — muted, clamped (default 2 lines) so cards stay scannable. */
  description?: React.ReactNode;
  descriptionLines?: number;
  /** Footer meta row — assignee avatar, due date, points, counts. Lays out spread across the row. */
  meta?: React.ReactNode;
}

/** The standard kanban card anatomy: labels → title → description (clamped) → meta footer. Pass this as
 *  the body of `renderCard`. Colour-coding has two slots: the board's `cardAccent` strip (one dimension —
 *  type/priority/owner) and these `labels` chips (multiple tags). Keep colour SUPPLEMENTARY — always pair
 *  it with the label text/title so it never carries meaning alone (WCAG 1.4.1). */
export function KanbanCardContent({ labels, title, description, descriptionLines = 2, meta }: KanbanCardContentProps) {
  return (
    <div className="ds-kanban-card">
      {labels && labels.length > 0 && (
        <div className="ds-kanban-card__labels">
          {labels.map((l, i) =>
            l.label != null ? (
              <span key={i} className="ds-kanban-card__label" style={{ background: `color-mix(in srgb, ${l.color} 18%, transparent)`, color: l.color }}>
                {l.label}
              </span>
            ) : (
              <span key={i} className="ds-kanban-card__label-bar" style={{ background: l.color }} aria-hidden="true" />
            )
          )}
        </div>
      )}
      <div className="ds-kanban-card__title">{title}</div>
      {description != null && (
        <div className="ds-kanban-card__desc" style={{ WebkitLineClamp: descriptionLines } as React.CSSProperties}>{description}</div>
      )}
      {meta != null && <div className="ds-kanban-card__meta">{meta}</div>}
    </div>
  );
}
