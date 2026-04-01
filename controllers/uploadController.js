import { Transaction } from "../models/Transaction.js";
import { parseWorkbookBuffer } from "../utils/excelParser.js";
import { log } from "../utils/logger.js";

/**
 * POST /api/upload — multer puts file in req.file
 */
export async function uploadTransactions(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "No file uploaded. Use field name: file" });
    }

    const rows = parseWorkbookBuffer(req.file.buffer, req.file.originalname);
    if (!rows.length) {
      return res.status(400).json({
        error: "No valid rows found. Expected columns: Date, Amount, Vendor, Type, Category",
      });
    }

    const inserted = await Transaction.insertMany(rows, { ordered: false });
    log.info("upload completed", { count: inserted.length, filename: req.file.originalname });

    return res.status(201).json({
      message: "Transactions imported",
      count: inserted.length,
    });
  } catch (err) {
    log.error("upload failed", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}
