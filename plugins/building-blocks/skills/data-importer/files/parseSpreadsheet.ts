/** Robust client-side spreadsheet parsing: PapaParse for CSV, SheetJS for Excel. Reusable, no backend. */
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, string>[];
}

function trimRow(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) out[k] = String(v ?? "").trim();
  return out;
}

/** Parse a CSV or Excel File into { headers, rows }. Auto-detects by extension. */
export async function parseSpreadsheet(file: File): Promise<ParsedSheet> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]!];
    if (!sheet) return { headers: [], rows: [] };
    const matrix = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: "" });
    const headers = (matrix[0] ?? []).map((h) => String(h).trim());
    const rows = matrix
      .slice(1)
      .filter((r) => r.some((c) => String(c).trim() !== ""))
      .map((r) => trimRow(Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))));
    return { headers, rows };
  }

  // CSV (also handles tab/semicolon via auto-detect)
  return new Promise<ParsedSheet>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
      complete: (res) => resolve({ headers: res.meta.fields ?? [], rows: res.data.map(trimRow) }),
      error: (err) => reject(err),
    });
  });
}
