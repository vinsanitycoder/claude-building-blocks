import { CsvImporter, type ImportColumn, type ValidateResult } from "../../plugins/building-blocks/skills/data-importer/files/CsvImporter";

interface DemoRow {
  company: string;
  email: string | null;
  valueCents: number | null;
}

const COLUMNS: ImportColumn[] = [
  { key: "company", label: "Company", required: true, example: "Acme Co" },
  { key: "email", label: "Email", example: "jane@acme.com" },
  { key: "value", label: "Value (USD)", example: "5000" },
];

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const deFormula = (s: string) => (/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);

function validateRow(raw: Record<string, string>): ValidateResult<DemoRow> {
  const errors: string[] = [];
  const company = (raw.company ?? "").trim();
  if (!company) errors.push("Company is required");

  let valueCents: number | null = null;
  if (raw.value) {
    const cleaned = raw.value.replace(/[$,\s]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) errors.push(`Value "${raw.value}" must be a plain number`);
    else if (Number(cleaned) > 1e12) errors.push("Value is too large");
    else valueCents = Math.round(Number(cleaned) * 100);
  }
  const email = (raw.email ?? "").toLowerCase();
  if (email && !EMAIL.test(email)) errors.push(`"${raw.email}" is not a valid email`);

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { company: deFormula(company).slice(0, 200), email: email || null, valueCents } };
}

export function ImporterDemo() {
  async function onImport(rows: DemoRow[]) {
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    return { imported: rows.length, skipped: [] as { row: number; reason: string }[] };
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Data importer</h2>
        <p className="mt-1 text-sm text-slate-500">
          Download the template, fill a couple of rows (try a bad email or a non-number value to see the per-row
          errors), then drop the CSV/Excel back in. Parsing + validation are 100% in the browser; only the final
          commit would hit your server.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 p-4">
        <CsvImporter<DemoRow>
          title="Import demo records"
          columns={COLUMNS}
          validateRow={validateRow}
          onImport={onImport}
          templateName="demo-template.csv"
          noun="record"
        />
      </div>
    </div>
  );
}
