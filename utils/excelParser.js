import * as XLSX from "xlsx";

/**
 * Normalizes header keys so "Date", "DATE", "date " all map consistently.
 */
function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/**
 * Maps common column name variants to our schema fields.
 */
const FIELD_ALIASES = {
  date: ["date", "txn_date", "transaction_date", "posted", "posted_date"],
  amount: ["amount", "value", "amt", "total"],
  vendor: ["vendor", "merchant", "payee", "supplier", "description", "name"],
  type: ["type", "txn_type", "transaction_type", "direction"],
  category: ["category", "cat", "account", "class"],
};

function pickField(row, aliases) {
  const keys = Object.keys(row);
  const lowerMap = new Map();
  for (const k of keys) {
    lowerMap.set(normalizeHeader(k), row[k]);
  }
  for (const alias of aliases) {
    if (lowerMap.has(alias)) return lowerMap.get(alias);
  }
  return undefined;
}

function parseType(raw) {
  if (raw == null || raw === "") return "expense";
  const s = String(raw).trim().toLowerCase();
  if (["income", "in", "credit", "cr", "revenue"].includes(s)) return "income";
  if (["expense", "out", "debit", "dr", "payment"].includes(s)) return "expense";
  // Negative amounts often mean expense in spreadsheets
  return "expense";
}

function parseAmount(val) {
  if (typeof val === "number" && !Number.isNaN(val)) return Math.abs(val);
  const s = String(val ?? "")
    .replace(/[,\s]/g, "")
    .replace(/[$€£]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.abs(n) : 0;
}

/**
 * Excel serial numbers (~30000–60000) → JavaScript Date (UTC midnight).
 */
function excelSerialToDate(serial) {
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}

function parseDate(val) {
  if (val instanceof Date && !Number.isNaN(val.getTime())) return val;
  if (typeof val === "number" && val > 20000 && val < 80000) {
    return excelSerialToDate(val);
  }
  const parsed = new Date(val);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

/**
 * Converts one raw row object into a transaction shape or null if invalid.
 */
export function rowToTransaction(row) {
  const dateRaw = pickField(row, FIELD_ALIASES.date);
  const amountRaw = pickField(row, FIELD_ALIASES.amount);
  const vendorRaw = pickField(row, FIELD_ALIASES.vendor);
  const typeRaw = pickField(row, FIELD_ALIASES.type);
  const categoryRaw = pickField(row, FIELD_ALIASES.category);

  const date = parseDate(dateRaw);
  if (!date) return null;

  let amount = parseAmount(amountRaw);
  const type = parseType(typeRaw);

  // If amount was negative in sheet, treat as expense direction hint
  const rawStr = String(amountRaw ?? "");
  if (rawStr.includes("-") && amount > 0) {
    // already abs in parseAmount; infer type from minus
  }

  if (amount === 0) return null;

  return {
    date,
    amount,
    vendor: vendorRaw != null ? String(vendorRaw).trim() : "Unknown",
    type,
    category: categoryRaw != null ? String(categoryRaw).trim() : "General",
  };
}

/**
 * Parses buffer as .xlsx or .csv using SheetJS.
 * Returns array of plain transaction objects ready for Mongoose.
 */
export function parseWorkbookBuffer(buffer, originalName = "") {
  const isCsv = /\.csv$/i.test(originalName);
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    raw: false,
    ...(isCsv ? { FS: "," } : {}),
  });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  const out = [];

  for (const row of rows) {
    const tx = rowToTransaction(row);
    if (tx) out.push(tx);
  }

  return out;
}
