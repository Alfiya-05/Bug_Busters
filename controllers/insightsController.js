import axios from "axios";
import { Transaction } from "../models/Transaction.js";
import { runFullAnalysis } from "../services/analysisService.js";
import { log } from "../utils/logger.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * POST /api/insights — optional body: { "useStored": true } (default) uses DB + analysis summary
 */
export async function generateInsights(req, res) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "OPENROUTER_API_KEY is not configured",
      });
    }

    const transactions = await Transaction.find().lean();
    const analysis =
      transactions.length > 0
        ? runFullAnalysis(transactions)
        : {
            duplicates: [],
            anomalies: [],
            cashFlowRisk: "LOW",
            incomeTotal: 0,
            expenseTotal: 0,
            financialHealthScore: 100,
          };

    const summary = buildSummaryText(analysis);

    const prompt = `Explain the following financial issues in simple terms for a small business owner. Be concise (3-5 sentences), actionable, and encouraging. If there are no issues, give a brief positive summary.

Data summary:
${summary}`;

    const { data } = await axios.post(
      OPENROUTER_URL,
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
          "X-Title": "AI CFO for SMBs",
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "No insight text returned from the model.";

    log.info("insights generated", { model: data?.model });

    return res.json({ insight: text });
  } catch (err) {
    log.error("insights failed", err);
    const detail = err.response?.data || err.message;
    return res.status(500).json({
      error: "Failed to generate insights",
      detail: typeof detail === "string" ? detail : JSON.stringify(detail),
    });
  }
}

function buildSummaryText(analysis) {
  const lines = [
    `Cash flow risk: ${analysis.cashFlowRisk}.`,
    `Income total: ${analysis.incomeTotal?.toFixed?.(2) ?? analysis.incomeTotal}; Expense total: ${analysis.expenseTotal?.toFixed?.(2) ?? analysis.expenseTotal}.`,
    `Financial health score (0-100): ${analysis.financialHealthScore}.`,
    `Duplicate payment groups: ${analysis.duplicates?.length ?? 0}.`,
    `Expense anomalies: ${(analysis.anomalies || []).join(" | ") || "none"}.`,
  ];
  if (analysis.duplicates?.length) {
    lines.push(`Duplicate details: ${JSON.stringify(analysis.duplicates)}`);
  }
  return lines.join("\n");
}
