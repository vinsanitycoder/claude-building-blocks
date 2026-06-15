"use client";

/**
 * CsvImporter — a reusable drag-drop CSV/Excel importer with a validation preview.
 *
 * Flow: download template → drop a file → parse client-side → per-row validate → preview (✓/⚠ per row)
 *       → commit only the valid rows via `onImport`.
 *
 * Generic over the row type `T`. You supply:
 *   - `columns`: the template/preview column spec
 *   - `validateRow`: pure (raw → {ok, value} | {ok:false, errors})  — runs in the browser for instant feedback
 *   - `onImport`: commits valid rows (in a real app: a server action that RE-validates and inserts)
 *
 * Backend-agnostic: parsing + preview are fully client-side, so it works in the playground with a stub onImport.
 */
import { useRef, useState } from "react";
import Papa from "papaparse";
import { parseSpreadsheet } from "./parseSpreadsheet";

export interface ImportColumn {
  key: string;
  label: string;
  required?: boolean;
  example: string;
}

export type ValidateResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

type RowState<T> =
  | { n: number; raw: Record<string, string>; ok: true; value: T }
  | { n: number; raw: Record<string, string>; ok: false; errors: string[] };

export function CsvImporter<T>({
  title,
  columns,
  validateRow,
  onImport,
  templateName = "import-template.csv",
  noun = "row",
  maxFileMB = 10,
}: {
  title: string;
  columns: ImportColumn[];
  validateRow: (raw: Record<string, string>) => ValidateResult<T>;
  onImport: (rows: T[]) => Promise<{ imported: number; skipped: { row: number; reason: string }[] }>;
  templateName?: string;
  noun?: string;
  maxFileMB?: number;
}) {
  const [rows, setRows] = useState<RowState<T>[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: { row: number; reason: string }[] } | null>(null);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const valid = rows.filter((r): r is Extract<RowState<T>, { ok: true }> => r.ok);
  const invalid = rows.filter((r) => !r.ok);
  // Preview columns: the required ones first, capped so the table stays readable.
  const previewCols = [...columns].sort((a, b) => Number(!!b.required) - Number(!!a.required)).slice(0, 4);

  function downloadTemplate() {
    const csv = Papa.unparse({ fields: columns.map((c) => c.key), data: [columns.map((c) => c.example)] });
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = templateName;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(file: File) {
    setResult(null);
    setParseError(null);
    setRows([]);
    setFileName(file.name);
    if (file.size > maxFileMB * 1024 * 1024) {
      setParseError(`That file is over ${maxFileMB} MB. Split it into smaller files.`);
      return;
    }
    try {
      const { rows: raw } = await parseSpreadsheet(file);
      if (raw.length === 0) {
        setParseError("That file has no data rows.");
        return;
      }
      setRows(
        raw.map((r, i) => {
          const v = validateRow(r);
          return v.ok ? { n: i + 1, raw: r, ok: true, value: v.value } : { n: i + 1, raw: r, ok: false, errors: v.errors };
        }),
      );
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }

  async function commit() {
    setPending(true);
    try {
      const res = await onImport(valid.map((r) => r.value));
      setResult(res);
      setRows([]);
      setFileName(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Import failed — please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-foreground)]">{title}</h2>
        <button onClick={downloadTemplate} className="ds-btn ds-btn--outline ds-btn--sm">
          ⬇ Download template
        </button>
      </div>

      {result ? (
        <div
          className="ds-card p-4 text-sm"
          style={{
            background: "color-mix(in srgb, var(--color-success) 10%, var(--color-card))",
            borderColor: "color-mix(in srgb, var(--color-success) 30%, var(--color-border))",
          }}
        >
          <div className="font-semibold" style={{ color: "var(--color-success)" }}>
            Imported {result.imported} {result.imported === 1 ? noun : `${noun}s`} ✓
          </div>
          {result.skipped.length > 0 ? (
            <div className="mt-2 text-[var(--color-muted-foreground)]">
              Skipped {result.skipped.length}:
              <ul className="mt-1 list-disc pl-5 text-xs text-[var(--color-muted-foreground)]">
                {result.skipped.slice(0, 20).map((s, i) => <li key={i}>Row {s.row}: {s.reason}</li>)}
              </ul>
            </div>
          ) : null}
          <button onClick={() => setResult(null)} className="ds-btn ds-btn--primary ds-btn--sm mt-3">
            Import another file
          </button>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition"
            style={{
              borderColor: dragging ? "var(--color-primary)" : "var(--color-border)",
              background: dragging ? "var(--color-accent)" : "var(--color-card)",
              color: "var(--color-foreground)",
            }}
          >
            <div className="text-3xl">📄</div>
            <div className="mt-2 text-sm font-medium">Drag a CSV or Excel file here, or click to choose</div>
            <div className="mt-1 text-xs text-[var(--color-muted-foreground)]">{fileName ? `Loaded: ${fileName}` : "Use the template above for the right columns."}</div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {parseError ? (
            <div
              className="rounded-lg px-4 py-2 text-sm"
              style={{
                background: "color-mix(in srgb, var(--color-destructive) 10%, var(--color-card))",
                color: "var(--color-destructive)",
              }}
            >
              {parseError}
            </div>
          ) : null}

          {rows.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="ds-badge ds-badge--success">{valid.length} ready</span>
                {invalid.length > 0 ? <span className="ds-badge ds-badge--destructive">{invalid.length} with errors (skipped)</span> : null}
                <button onClick={commit} disabled={pending || valid.length === 0} className="ds-btn ds-btn--primary ml-auto">
                  {pending ? "Importing…" : `Import ${valid.length} ${valid.length === 1 ? noun : `${noun}s`}`}
                </button>
              </div>

              <div
                className="max-h-96 overflow-auto rounded-xl border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <table className="w-full text-sm" style={{ color: "var(--color-foreground)" }}>
                  <thead
                    className="sticky top-0 text-left text-xs uppercase tracking-wide"
                    style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
                  >
                    <tr>
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      {previewCols.map((c) => <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 200).map((r) => (
                      <tr
                        key={r.n}
                        style={{
                          borderTop: "1px solid var(--color-border)",
                          background: r.ok ? undefined : "color-mix(in srgb, var(--color-destructive) 6%, transparent)",
                        }}
                      >
                        <td className="px-3 py-1.5 text-[var(--color-muted-foreground)]">{r.n}</td>
                        <td className="px-3 py-1.5">
                          {r.ok
                            ? <span style={{ color: "var(--color-success)" }}>✓ ready</span>
                            : <span style={{ color: "var(--color-destructive)" }}>⚠ {r.errors.join("; ")}</span>}
                        </td>
                        {previewCols.map((c) => <td key={c.key} className="px-3 py-1.5 text-[var(--color-foreground)]">{r.raw[c.key] || "—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 200 ? <p className="text-xs text-[var(--color-muted-foreground)]">Showing first 200 of {rows.length} rows.</p> : null}
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
