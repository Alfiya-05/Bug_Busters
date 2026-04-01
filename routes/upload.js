import express from "express";
import multer from "multer";
import { uploadTransactions } from "../controllers/uploadController.js";

const router = express.Router();

// Keep files in memory for xlsx parsing (no disk I/O)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extOk = /\.(xlsx|xls|csv)$/i.test(file.originalname);
    const mimeOk = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/csv",
      "application/octet-stream",
    ].includes(file.mimetype);
    cb(null, extOk || mimeOk);
  },
});

router.post("/", upload.single("file"), uploadTransactions);

export default router;
