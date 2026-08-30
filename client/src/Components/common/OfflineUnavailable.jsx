export default function OfflineUnavailable() {
  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-red-600">
          Offline mode
        </p>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          You are in offline mode
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Patient and Doctor modules remain available. Reconnect to access this
          module.
        </p>
      </section>
    </div>
  );
}
