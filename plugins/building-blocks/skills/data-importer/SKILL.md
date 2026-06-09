---
name: data-importer
description: Add a drag-and-drop CSV/Excel bulk importer with a downloadable template and a per-row validation preview. Use when a user needs to bulk-load records (deals, contacts, products, anything tabular) by uploading a spreadsheet, seeing which rows are valid before committing, and importing only the good ones. Built on PapaParse + SheetJS; generic over the row type.
when_to_use: user wants to import a CSV or Excel file, bulk upload data, a spreadsheet importer, an import template, drag-and-drop file import, validate rows before importing.
---

# Data importer block (CSV/Excel, drag-drop, validation preview)

A reusable, robust bulk-import control. Don't rebuild this — it already handles the fiddly parts (Excel + CSV parsing, template download, per-row validation UI, formula-injection safety, partial-failure reporting).

## What's here
- `files/CsvImporter.tsx` — the generic component (`columns`, `validateRow`, `onImport`). Parsing + preview are fully client-side.
- `files/parseSpreadsheet.ts` — PapaParse (CSV) + SheetJS (Excel) → `{ headers, rows }`.
- `files/WIRING.md` — an example column spec + `validateRow` (with the formula-injection / number / length hardening) and the **server-side `onImport`** contract (re-validate, dedup, per-row try/catch, row cap).

## How to use it
1. Copy `CsvImporter.tsx` + `parseSpreadsheet.ts` into the app. `npm i papaparse xlsx @types/papaparse`.
2. Define your `columns` spec and a pure `validateRow` (see `WIRING.md` — copy the `deFormula`/`cap`/number checks).
3. Implement `onImport` as a **server action that re-validates and inserts**, returning `{ imported, skipped[] }`.
4. Render `<CsvImporter title=… columns=… validateRow=… onImport=… noun="deal" />`.

## Keep these invariants
- **Re-validate server-side** (client preview is UX only). **Neutralize formula injection**, **cap field lengths**, **reject non-decimal money**, **per-row try/catch** (one bad row ≠ whole-batch failure), **dedup**, **row cap**.

## Preview / iterate
Run `playground/` → "Data importer" demo. It parses real files in the browser with a stub commit, so you can drag a CSV/Excel in and watch the validation preview immediately.
