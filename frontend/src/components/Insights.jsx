import Spinner from "./Spinner.jsx";

export default function Insights({ insight, onGenerate, loading, disabled }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">AI insights</div>
          <div className="mt-1 text-xs text-slate-500">
            Plain-language explanation for a small business owner (via OpenRouter).
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading ? <Spinner label="Generating..." /> : null}
          <button
            type="button"
            onClick={onGenerate}
            disabled={disabled || loading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Insights
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {insight ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {insight}
          </p>
        ) : (
          <div className="text-sm text-slate-500">
            Click <span className="font-semibold">Generate Insights</span> to get an explanation of
            duplicates, anomalies, and cash-flow risk.
          </div>
        )}
      </div>
    </section>
  );
}

