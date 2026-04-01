import { useMemo, useState } from "react";
import Spinner from "./Spinner.jsx";

export default function Upload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const fileLabel = useMemo(() => file?.name || "Choose .xlsx or .csv file", [file]);

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">Upload data</div>
          <div className="mt-1 text-xs text-slate-500">
            Import your transactions from Excel/CSV, then we’ll run detection for duplicates, expense
            spikes, and cash-flow risk.
          </div>

          <label className="mt-4 block">
            <div className="text-xs font-medium text-slate-600">File</div>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">{fileLabel}</div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          {busy ? <Spinner label="Uploading & analyzing..." /> : null}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || busy}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload & Analyze
          </button>
        </div>
      </div>
    </section>
  );
}

