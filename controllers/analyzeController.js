import { Transaction } from "../models/Transaction.js";
import { runFullAnalysis } from "../services/analysisService.js";
import { log } from "../utils/logger.js";

/**
 * GET /api/analyze — runs analysis on all stored transactions
 */
export async function analyze(req, res) {
  try {
    const transactions = await Transaction.find().lean();
    if (!transactions.length) {
      return res.json({
        duplicates: [],
        anomalies: [],
        cashFlowRisk: "LOW",
        incomeTotal: 0,
        expenseTotal: 0,
        financialHealthScore: 100,
        message: "No transactions yet. Upload a file first.",
      });
    }

    const result = runFullAnalysis(transactions);
    log.info("analysis run", {
      txCount: transactions.length,
      cashFlowRisk: result.cashFlowRisk,
      health: result.financialHealthScore,
    });

    return res.json(result);
  } catch (err) {
    log.error("analyze failed", err);
    return res.status(500).json({ error: err.message || "Analysis failed" });
  }
}
