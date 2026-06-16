import "../components.css";
import * as React from "react";

export interface OtpInputProps {
  /** Number of segments. */
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  /** Fired once all segments are filled. */
  onComplete?: (value: string) => void;
  /** "numeric" restricts to digits + sets numeric inputmode. */
  type?: "numeric" | "alphanumeric";
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  id?: string;
}

/** One-time-code / PIN entry — N single-character boxes with auto-advance, Backspace-retreat, full
 *  paste-to-fill, and arrow-key nav. Controlled via value/onChange (the joined string). */
export function OtpInput({
  length = 6, value, onChange, onComplete, type = "numeric", disabled, error, autoFocus, id, ...aria
}: OtpInputProps) {
  const [internal, setInternal] = React.useState("");
  const current = (value ?? internal).slice(0, length);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => current[i] ?? "");

  const pattern = type === "numeric" ? /[^0-9]/g : /[^0-9a-zA-Z]/g;

  function commit(next: string) {
    const clean = next.replace(pattern, "").slice(0, length);
    if (value === undefined) setInternal(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  }

  // Focus must run AFTER the controlled re-render commits (setting value re-renders the inputs and
  // would otherwise drop the focus we set synchronously). Defer to a microtask + re-read the ref.
  function focusSlot(idx: number) {
    queueMicrotask(() => { const el = refs.current[idx]; el?.focus(); el?.select(); });
  }

  function setAt(i: number, ch: string) {
    const cleaned = ch.replace(pattern, "");
    if (!cleaned) return;
    const arr = chars.slice();
    arr[i] = cleaned[cleaned.length - 1];
    const joined = commit(arr.join("").slice(0, length));
    const nextIdx = Math.min(i + 1, length - 1);
    if (joined.length > i) focusSlot(nextIdx);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = chars.slice();
      if (arr[i]) { arr[i] = ""; commit(arr.join("")); }
      else if (i > 0) { arr[i - 1] = ""; commit(arr.join("")); focusSlot(i - 1); }
    } else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); focusSlot(i - 1); }
    else if (e.key === "ArrowRight" && i < length - 1) { e.preventDefault(); focusSlot(i + 1); }
  }

  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const joined = commit(e.clipboardData.getData("text"));
    focusSlot(Math.min(joined.length, length - 1));
  }

  return (
    <div
      className={["ds-otp", error ? "ds-otp--error" : "", disabled ? "ds-otp--disabled" : ""].filter(Boolean).join(" ")}
      role="group"
      aria-label={aria["aria-label"] ?? "Verification code"}
      id={id}
    >
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="ds-otp__slot"
          type="text"
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={ch}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
