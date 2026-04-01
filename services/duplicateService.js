/**
 * Duplicate payment detection:
 * same vendor + same amount + second payment within 3–5 calendar days of another
 * (we also flag 1–2 day gaps as suspicious for demo flexibility; primary window 1–5 days).
 */

function dayDiff(a, b) {
  const ms = Math.abs(new Date(a) - new Date(b));
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * @param {Array<{date: Date, amount: number, vendor: string}>} transactions
 * @returns {{ duplicates: Array<{ vendor: string, amount: number, dates: string[] }> }}
 */
export function findDuplicatePayments(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const groups = new Map();

  for (const t of expenses) {
    const key = `${String(t.vendor).toLowerCase()}::${Number(t.amount).toFixed(2)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }

  const duplicates = [];

  for (const [, list] of groups) {
    if (list.length < 2) continue;
    list.sort((a, b) => new Date(a.date) - new Date(b.date));

    const flaggedDates = new Set();
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const d = dayDiff(list[i].date, list[j].date);
        // Spec: "within 3–5 days" — we treat 1..5 as suspicious duplicate window
        if (d >= 1 && d <= 5) {
          flaggedDates.add(list[i].date.toISOString().slice(0, 10));
          flaggedDates.add(list[j].date.toISOString().slice(0, 10));
        }
      }
    }

    if (flaggedDates.size >= 2) {
      const sortedDates = [...flaggedDates].sort();
      duplicates.push({
        vendor: list[0].vendor,
        amount: list[0].amount,
        dates: sortedDates,
      });
    }
  }

  return { duplicates };
}
