export default function ConflictManager({
  conflict,
  patient,
  onClose,
  onResolved,
}) {
  if (!conflict) {
    return null;
  }

  const patientName =
    patient?.name ||
    patient?.fullName ||
    patient?.generalInfo?.name ||
    patient?.personalInfo?.name ||
    "Selected Patient";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-border-soft px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Sync Conflict
            </p>

            <h2 className="mt-1 text-xl font-bold text-primary-900">
              Patient information has changed
            </h2>

            <p className="mt-1 text-sm text-text-muted">{patientName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-lg text-text-muted transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close conflict dialog"
          >
            ✕
          </button>
        </div>

        {/* EXPLANATION */}
        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-900">
              This patient's information was changed on this device while
              offline, but the server also contains changes made by another
              user. Please review both versions before continuing.
            </p>
          </div>
        </div>

        {/* COMPARISON */}
        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          {/* LOCAL VERSION */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

              <h3 className="font-bold text-blue-900">Your Offline Changes</h3>
            </div>

            <p className="mt-2 text-sm leading-5 text-blue-800">
              Changes made on this device while it was offline.
            </p>

            <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-white p-4 text-xs leading-5 text-slate-800">
              {JSON.stringify(conflict.localData, null, 2)}
            </pre>
          </div>

          {/* SERVER VERSION */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />

              <h3 className="font-bold text-purple-900">Server Version</h3>
            </div>

            <p className="mt-2 text-sm leading-5 text-purple-800">
              The version currently stored on the server.
            </p>

            <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-white p-4 text-xs leading-5 text-slate-800">
              {JSON.stringify(conflict.serverData, null, 2)}
            </pre>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-border-soft px-6 py-5">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-semibold text-purple-700 opacity-60"
          >
            Keep Server Version
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            Keep My Changes
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 opacity-60"
          >
            Merge Manually
          </button>
        </div>

        {/* CURRENTLY DISABLED NOTICE */}
        <div className="px-6 pb-6">
          <p className="text-center text-xs text-text-muted">
            Conflict resolution will be available after reviewing the changes.
          </p>
        </div>
      </div>
    </div>
  );
}
