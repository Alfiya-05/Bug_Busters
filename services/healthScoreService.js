/**
 * Financial health score 0–100 (bonus).
 * Penalizes duplicate clusters, anomaly strings, and HIGH cash-flow risk.
 */

/**
 * @param {{ duplicates: Array, anomalies: Array, cashFlowRisk: string }} analysis
 * @returns {number} integer 0–100
 */
export function computeHealthScore(analysis) {
  let score = 100;
  const dupCount = analysis.duplicates?.length ?? 0;
  const anomalyCount = analysis.anomalies?.length ?? 0;

  score -= Math.min(30, dupCount * 10);
  score -= Math.min(30, anomalyCount * 8);
  if (analysis.cashFlowRisk === "HIGH") score -= 35;

  return Math.max(0, Math.min(100, Math.round(score)));
}
