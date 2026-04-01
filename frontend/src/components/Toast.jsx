export function Toast({ toast, onClose }) {
  const tone =
    toast.type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : toast.type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-slate-200 bg-white text-slate-800";

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm ${tone}`}
      role="status"
    >
      <div>
        <div className="text-sm font-semibold">{toast.title}</div>
        {toast.message ? (
          <div className="mt-1 text-xs opacity-90">{toast.message}</div>
        ) : null}
      </div>
      <button
        className="rounded-lg px-2 py-1 text-xs font-medium hover:bg-black/5"
        onClick={onClose}
        type="button"
      >
        Close
      </button>
    </div>
  );
}

