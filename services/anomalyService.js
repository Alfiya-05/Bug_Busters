/**
 * Expense anomaly: compare current month total (latest month in data) to
 * the average of prior months. If current > 1.5 × average → flag.
 * Also flags category-level spikes for clearer messages.
 */

function monthKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * @param {Array<{date: Date, amount: number, category: string, type: string}>} transactions
 * @returns {{ anomalies: string[] }}
 */
export function findExpenseAnomalies(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");
  if (expenses.length === 0) return { anomalies: [] };

  // Total per month
  const monthTotals = new Map();
  for (const t of expenses) {
    const k = monthKey(t.date);
    monthTotals.set(k, (monthTotals.get(k) || 0) + t.amount);
  }

  const months = [...monthTotals.keys()].sort();
  if (months.length < 2) return { anomalies: [] };

  const currentMonth = months[months.length - 1];
  const priorMonths = months.slice(0, -1);
  const currentTotal = monthTotals.get(currentMonth);
  const avgPrior =
    priorMonths.reduce((s, m) => s + monthTotals.get(m), 0) / priorMonths.length;

  const anomalies = [];

  if (avgPrior > 0 && currentTotal > 1.5 * avgPrior) {
    const pct = Math.round(((currentTotal - avgPrior) / avgPrior) * 100);
    anomalies.push(
      `Total monthly expenses increased by ${pct}% vs your prior-month average — review discretionary spend.`
    );
  }

  // Per-category: current month vs average for that category
  const byCatMonth = new Map();
  for (const t of expenses) {
    const cat = t.category || "General";
    const mk = `${cat}::${monthKey(t.date)}`;
    byCatMonth.set(mk, (byCatMonth.get(mk) || 0) + t.amount);
  }

  const categories = new Set(expenses.map((t) => t.category || "General"));
  for (const cat of categories) {
    const catMonths = months.filter((m) => byCatMonth.has(`${cat}::${m}`));
    if (catMonths.length < 2) continue;
    const last = catMonths[catMonths.length - 1];
    const prev = catMonths.slice(0, -1);
    const cur = byCatMonth.get(`${cat}::${last}`) || 0;
    const prevAvg = prev.reduce((s, m) => s + (byCatMonth.get(`${cat}::${m}`) || 0), 0) / prev.length;
    if (prevAvg > 0 && cur > 1.5 * prevAvg) {
      const pct = Math.round(((cur - prevAvg) / prevAvg) * 100);
      anomalies.push(`${cat} expenses increased by ${pct}% compared to your historical average.`);
    }
  }

  // Dedupe similar messages
  const unique = [...new Set(anomalies)];
  return { anomalies: unique };
}
