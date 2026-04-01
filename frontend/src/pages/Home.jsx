import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Upload from "../components/Upload.jsx";
import Dashboard from "../components/Dashboard.jsx";
import Alerts from "../components/Alerts.jsx";
import Insights from "../components/Insights.jsx";
import { fetchAnalysis, generateInsights, uploadFile } from "../lib/api.js";
import { Toast } from "../components/Toast.jsx";

function buildSummary(analysis) {
  if (!analysis) return "";
  return JSON.stringify(
    {
      cashFlowRisk: analysis.cashFlowRisk,
      incomeTotal: analysis.incomeTotal,
      expenseTotal: analysis.expenseTotal,
      financialHealthScore: analysis.financialHealthScore,
      duplicates: analysis.duplicates,
      anomalies: analysis.anomalies
    },
    null,
    2
  );
}

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [insight, setInsight] = useState("");
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [toast, setToast] = useState(null);

  const summaryText = useMemo(() => buildSummary(analysis), [analysis]);

  function showToast(next) {
    setToast(next);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 4500);
  }

  async function handleUpload(file) {
    setInsight("");
    setLoadingAnalyze(true);
    try {
      const up = await uploadFile(file);
      showToast({ type: "success", title: "Upload complete", message: `Imported ${up.count} transactions.` });

      const a = await fetchAnalysis();
      setAnalysis(a);
      showToast({ type: "success", title: "Analysis ready", message: `Cash flow risk: ${a.cashFlowRisk}. Score: ${a.financialHealthScore}/100.` });
    } catch (err) {
      const detail = err?.response?.data?.error || err?.message || "Upload failed";
      showToast({ type: "error", title: "Something went wrong", message: detail });
    } finally {
      setLoadingAnalyze(false);
    }
  }

  async function handleGenerateInsights() {
    if (!analysis) {
      showToast({ type: "error", title: "Upload first", message: "Upload a file and run analysis before generating insights." });
      return;
    }
    setLoadingInsights(true);
    try {
      // Backend currently uses stored transactions; we still pass summary for future-proofing.
      const res = await generateInsights(summaryText);
      setInsight(res.insight || "");
      showToast({ type: "success", title: "Insights generated" });
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Insights failed";
      showToast({ type: "error", title: "Insights failed", message: String(detail) });
    } finally {
      setLoadingInsights(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 p-[1px] shadow-sm">
          <div className="rounded-3xl bg-white px-6 py-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Finance dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Upload transactions to detect duplicate payments, unusual expenses, and cash-flow risk.
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Tip: try the backend sample file at <span className="font-semibold">backend/sample-data/sample-transactions.csv</span>
              </div>
            </div>
          </div>
        </div>

        <Upload onUpload={handleUpload} />

        {loadingAnalyze ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            Analyzing…
          </div>
        ) : analysis ? (
          <>
            <Dashboard analysis={analysis} />
            <Alerts analysis={analysis} />
            <Insights
              insight={insight}
              onGenerate={handleGenerateInsights}
              loading={loadingInsights}
              disabled={!analysis}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Get started</div>
            <div className="mt-2 text-sm text-slate-600">
              Upload an Excel or CSV file to see your financial stats, alerts, and AI insights.
            </div>
          </div>
        )}
      </main>

      {toast ? (
        <div className="fixed bottom-4 right-4 w-[min(420px,calc(100vw-2rem))]">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      ) : null}
    </div>
  );
}

