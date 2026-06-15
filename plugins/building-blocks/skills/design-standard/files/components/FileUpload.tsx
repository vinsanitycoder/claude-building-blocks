import "../components.css";
import * as React from "react";
import { UploadIcon } from "./icons";

export interface FileUploadProps {
  onFiles: (files: File[]) => void;
  /** e.g. "image/png,image/jpeg,.pdf" — passed to the input + used to hint the label. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Max size per file in bytes — rejected files go to onReject. */
  maxSize?: number;
  onReject?: (files: { file: File; reason: string }[]) => void;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  id?: string;
}

/** Drag-and-drop dropzone + click-to-browse. Dragover highlight, keyboard-openable, validates
 *  size/type before calling onFiles. Backend-agnostic — you receive File[] and do the upload. */
export function FileUpload({
  onFiles, accept, multiple = false, disabled, maxSize, onReject, title, hint, id,
}: FileUploadProps) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function accepts(file: File): boolean {
    if (!accept) return true;
    const pats = accept.split(",").map((s) => s.trim().toLowerCase());
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return pats.some((p) =>
      p.startsWith(".") ? name.endsWith(p) : p.endsWith("/*") ? type.startsWith(p.slice(0, -1)) : type === p
    );
  }

  function handle(list: FileList | null) {
    if (!list) return;
    const ok: File[] = [];
    const bad: { file: File; reason: string }[] = [];
    Array.from(list).forEach((f) => {
      if (!accepts(f)) bad.push({ file: f, reason: "Unsupported type" });
      else if (maxSize && f.size > maxSize) bad.push({ file: f, reason: "Too large" });
      else ok.push(f);
    });
    if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
    if (bad.length) onReject?.(bad);
  }

  return (
    <div
      className={["ds-dropzone", over ? "ds-dropzone--over" : "", disabled ? "ds-dropzone--disabled" : ""].filter(Boolean).join(" ")}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { if (disabled) return; e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { if (disabled) return; e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="ds-dropzone__input"
        onChange={(e) => { handle(e.target.files); e.target.value = ""; }}
      />
      <span className="ds-dropzone__icon" aria-hidden="true"><UploadIcon /></span>
      <span className="ds-dropzone__title">{title ?? (<>Drop file{multiple ? "s" : ""} here, or <span className="ds-dropzone__browse">browse</span></>)}</span>
      {hint && <span className="ds-dropzone__hint">{hint}</span>}
    </div>
  );
}
