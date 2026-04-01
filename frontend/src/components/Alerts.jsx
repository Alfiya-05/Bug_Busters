function Badge({ tone, children }) {
  const cls =
    tone === "high"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "low"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-white text-slate-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export default function Alerts({ analysis }) {
  const duplicates = analysis?.duplicates || [];
  const anomalies = analysis?.anomalies || [];
  const risk = analysis?.cashFlowRisk || "LOW";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Alerts</div>
          <div className="mt-1 text-xs text-slate-500">
            Potential issues found in your uploaded transactions.
          </div>
        </div>
        <Badge tone={risk === "HIGH" ? "high" : "low"}>Cash flow risk: {risk}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-700">Duplicate payments</div>
          {duplicates.length ? (
            <ul className="mt-3 space-y-3">
              {duplicates.map((d, idx) => (
                <li key={idx} className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-900">{d.vendor}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Amount: <span className="font-semibold">{d.amount}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Dates: <span className="font-semibold">{(d.dates || []).join(", ")}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-slate-500">No duplicates detected.</div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-700">Expense anomalies</div>
          {anomalies.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {anomalies.map((a, idx) => (
                <li key={idx} className="leading-snug">
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-slate-500">No anomalies detected.</div>
          )}
        </div>
      </div>

      {risk === "HIGH" ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="text-sm font-semibold text-red-800">
            High cash-flow risk detected
          </div>
          <div className="mt-1 text-xs text-red-700">
            Expenses exceed income in your uploaded dataset. Consider tightening discretionary
            spend or improving collections.
          </div>
        </div>
      ) : null}
    </section>
  );
}

