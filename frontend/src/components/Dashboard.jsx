import StatsCard from "./StatsCard.jsx";

function money(n) {
  const val = Number(n || 0);
  return val.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export default function Dashboard({ analysis }) {
  const income = analysis?.incomeTotal ?? 0;
  const expenses = analysis?.expenseTotal ?? 0;
  const score = analysis?.financialHealthScore ?? 100;

  const pct = Math.round(clamp01(score / 100) * 100);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Total Income" value={money(income)} subtitle="Across uploaded data" />
        <StatsCard title="Total Expenses" value={money(expenses)} subtitle="Across uploaded data" />
        <StatsCard
          title="Financial Health Score"
          value={`${score}/100`}
          subtitle={score >= 80 ? "Healthy" : score >= 60 ? "Watchlist" : "Needs attention"}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Health progress</div>
            <div className="mt-1 text-xs text-slate-500">
              Quick read on overall financial stability (demo heuristic).
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-900">{pct}%</div>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

