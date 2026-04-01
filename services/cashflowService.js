/**
 * Cash flow risk: compare income vs expenses over the full dataset.
 * If total expenses exceed total income → HIGH risk; else LOW.
 */

/**
 * @param {Array<{amount: number, type: string}>} transactions
 * @returns {{ cashFlowRisk: 'HIGH' | 'LOW', incomeTotal: number, expenseTotal: number }}
 */
export function assessCashFlowRisk(transactions) {
  let incomeTotal = 0;
  let expenseTotal = 0;

  for (const t of transactions) {
    if (t.type === "income") incomeTotal += t.amount;
    else expenseTotal += t.amount;
  }

  const cashFlowRisk = expenseTotal > incomeTotal ? "HIGH" : "LOW";

  return { cashFlowRisk, incomeTotal, expenseTotal };
}
