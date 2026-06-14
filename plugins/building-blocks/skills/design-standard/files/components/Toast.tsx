import "../components.css";
import * as React from "react";
import { createPortal } from "react-dom";
import { InfoIcon, CheckCircleIcon, AlertIcon, XIcon } from "./icons";

export type ToastVariant = "default" | "success" | "destructive";
export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** ms before auto-dismiss; 0 = persist (use for errors). Default 5000. */
  duration?: number;
}
interface ToastItem extends Required<Pick<ToastOptions, "variant">> { id: number; title?: React.ReactNode; description?: React.ReactNode; }

const Ctx = React.createContext<{ toast: (o: ToastOptions) => void } | null>(null);

export function useToast() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useToast must be used within <ToastProvider>");
  return c;
}

const ICON = { default: InfoIcon, success: CheckCircleIcon, destructive: AlertIcon } as const;

/** Wrap the app once. Call useToast().toast({ title, description, variant }) anywhere below. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);
  const remove = React.useCallback((id: number) => setItems((x) => x.filter((t) => t.id !== id)), []);
  const toast = React.useCallback((o: ToastOptions) => {
    const id = ++idRef.current;
    setItems((x) => [...x, { id, title: o.title, description: o.description, variant: o.variant ?? "default" }]);
    const d = o.duration ?? 5000;
    if (d > 0) setTimeout(() => remove(id), d);
  }, [remove]);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="ds-toast__viewport">
            {items.map((t) => {
              const Icon = ICON[t.variant];
              return (
                <div key={t.id} role="status" className={["ds-toast", t.variant !== "default" ? `ds-toast--${t.variant}` : ""].filter(Boolean).join(" ")}>
                  <span className="ds-toast__icon"><Icon style={{ width: 18, height: 18 }} /></span>
                  <div style={{ flex: 1 }}>
                    {t.title && <p className="ds-toast__title">{t.title}</p>}
                    {t.description && <p className="ds-toast__desc">{t.description}</p>}
                  </div>
                  <button className="ds-toast__close" aria-label="Dismiss" onClick={() => remove(t.id)}>
                    <XIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}
