# Wiring `CsvImporter` into a real app

The component handles file → parse → preview → commit. You supply a **column spec**, a **`validateRow`** (pure, runs in the browser), and an **`onImport`** that commits valid rows. The server should **re-validate** (never trust the client).

## Deps
`npm i papaparse xlsx` (+ `@types/papaparse`). `parseSpreadsheet.ts` ships alongside the component.

## 1. Column spec + validator (example)
```ts
export const COLUMNS: ImportColumn[] = [
  { key: "company", label: "Company", required: true, example: "Acme Co" },
  { key: "email",   label: "Email",                   example: "jane@acme.com" },
  { key: "value",   label: "Value (USD)",             example: "5000" },
];

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Neutralize CSV/Excel formula injection: a cell starting with = + - @ executes on re-open.
const deFormula = (s: string) => (/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

export function validateRow(raw: Record<string, string>): ValidateResult<CleanRow> {
  const errors: string[] = [];
  const company = (raw.company ?? "").trim();
  if (!company) errors.push("Company is required");

  let valueCents: number | null = null;
  if (raw.value) {
    const cleaned = raw.value.replace(/[$,\s]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) errors.push(`Value "${raw.value}" must be a plain number`); // rejects hex/scientific/overflow
    else if (Number(cleaned) > 1e12) errors.push("Value is too large");
    else valueCents = Math.round(Number(cleaned) * 100);
  }
  const email = (raw.email ?? "").toLowerCase();
  if (email && !EMAIL.test(email)) errors.push(`"${raw.email}" is not a valid email`);

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { company: cap(deFormula(company), 200), email: email || null, valueCents } };
}
```

## 2. Server commit (`onImport`) — Next.js server action
```ts
"use server";
export async function importRowsAction(rows: CleanRow[]) {
  const me = await getCurrentUser();
  if (me.role !== "admin" && me.role !== "manager") throw new Error("not allowed");
  if (rows.length > 1000) rows = rows.slice(0, 1000);          // cap
  const skipped: { row: number; reason: string }[] = [];
  let imported = 0;
  for (let i = 0; i < rows.length; i++) {
    try {
      const v = validateRow(rows[i] as any);                   // RE-validate server-side
      if (!v.ok) { skipped.push({ row: i + 1, reason: v.errors.join("; ") }); continue; }
      if (await isDuplicate(me.workspaceId, v.value)) { skipped.push({ row: i + 1, reason: "duplicate" }); continue; }
      await insertRow(me.workspaceId, v.value);
      imported++;
    } catch (e) {                                              // one bad row must not abort the batch
      skipped.push({ row: i + 1, reason: "could not save this row" });
    }
  }
  return { imported, skipped };
}
```

## 3. Render
```tsx
<CsvImporter
  title="Import deals"
  columns={COLUMNS}
  validateRow={validateRow}
  onImport={importRowsAction}
  templateName="deals-template.csv"
  noun="deal"
/>
```

## Hardening lessons baked in
- **Re-validate on the server** — the client preview is for UX, not trust.
- **Neutralize formula injection** (`deFormula`) on text fields; **cap lengths**; **reject non-decimal money** (hex/scientific/overflow).
- **Per-row try/catch** server-side so one bad row is skipped, not the whole import; report `skipped[]`.
- **Dedup** by a natural key; **cap** total rows.
