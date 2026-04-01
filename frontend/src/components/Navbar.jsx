export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <span className="text-sm font-semibold">AI</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              AI CFO for SMBs
            </div>
            <div className="text-xs text-slate-500">
              Upload → Analyze → Insights
            </div>
          </div>
        </div>
        <a
          className="text-xs font-medium text-brand-700 hover:text-brand-800"
          href="http://localhost:3000/health"
          target="_blank"
          rel="noreferrer"
        >
          Backend health
        </a>
      </div>
    </header>
  );
}

