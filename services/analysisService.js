import { findDuplicatePayments } from "./duplicateService.js";
import { findExpenseAnomalies } from "./anomalyService.js";
import { assessCashFlowRisk } from "./cashflowService.js";
import { computeHealthScore } from "./healthScoreService.js";

/**
 * Runs duplicate, anomaly, and cash-flow analysis on in-memory transaction docs.
 */
export function runFullAnalysis(transactions) {
  const { duplicates } = findDuplicatePayments(transactions);
  const { anomalies } = findExpenseAnomalies(transactions);
  const { cashFlowRisk, incomeTotal, expenseTotal } = assessCashFlowRisk(transactions);

  const financialHealthScore = computeHealthScore({
    duplicates,
    anomalies,
    cashFlowRisk,
  });

  return {
    duplicates,
    anomalies,
    cashFlowRisk,
    incomeTotal,
    expenseTotal,
    financialHealthScore,
  };
}
