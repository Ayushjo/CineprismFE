export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
      <div className="mt-6 border border-slate-800 rounded-lg p-8 bg-slate-900/50 max-w-lg">
        <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-3">Porting in progress</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          This admin screen is being ported to the new site with identical
          functionality. It will be wired to the same backend endpoints shortly.
        </p>
      </div>
    </div>
  );
}
