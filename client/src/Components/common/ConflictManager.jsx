import { useEffect, useState } from "react";
import { getPatientConflicts } from "../../Services/syncConflictService";
export default function ConflictManager({
  conflict,
  patient,
  onClose,
  onKeepServer,
  onKeepLocal,
  isResolving = false,
}) {
  if (!conflict) {
    return null;
  }
  const [conflicts, setConflicts] = useState([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  const patientName =
    patient?.generalInfo?.name ||
    patient?.name ||
    patient?.fullName ||
    "Selected Patient";

  const localData = conflict.localData || {};
  const serverData = conflict.serverData || {};
  useEffect(() => {
    if (!patientId) {
      setConflicts([]);
      return;
    }

    let cancelled = false;

    const loadConflicts = async () => {
      try {
        setLoadingConflicts(true);
        setConflictError(null);

        const result = await getPatientConflicts(patientId);

        if (!cancelled) {
          setConflicts(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error("[Conflict UI] Failed to load conflicts:", error);

        if (!cancelled) {
          setConflictError(error?.message || "Failed to load conflicts.");
        }
      } finally {
        if (!cancelled) {
          setLoadingConflicts(false);
        }
      }
    };

    loadConflicts();

    return () => {
      cancelled = true;
    };
  }, [patientId]);
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
            disabled={isResolving}
            className="rounded-full p-2 text-lg text-text-muted transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close conflict dialog"
          >
            ✕
          </button>
        </div>

        {/* WARNING */}
        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-900">
              This patient was changed on the server after this device made an
              offline change. Review both versions before deciding which version
              should be kept.
            </p>
          </div>
        </div>
        {loadingConflicts && (
          <div>Checking for synchronization conflicts...</div>
        )}

        {conflictError && <div>{conflictError}</div>}

        {!loadingConflicts && !conflictError && conflicts.length > 0 && (
          <div>
            <strong>
              {conflicts.length} pending conflict
              {conflicts.length !== 1 ? "s" : ""} found.
            </strong>
          </div>
        )}

        {/* CONFLICT INFORMATION */}
        <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
          {/* LOCAL */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

              <h3 className="font-bold text-blue-900">Your Offline Changes</h3>
            </div>

            <p className="mt-2 text-sm leading-5 text-blue-800">
              Changes made on this device while offline.
            </p>

            <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-white p-4 text-xs leading-5 text-slate-800">
              {JSON.stringify(localData, null, 2)}
            </pre>
          </div>

          {/* SERVER */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />

              <h3 className="font-bold text-purple-900">Server Version</h3>
            </div>

            <p className="mt-2 text-sm leading-5 text-purple-800">
              The version currently stored on the server.
            </p>

            <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-white p-4 text-xs leading-5 text-slate-800">
              {JSON.stringify(serverData, null, 2)}
            </pre>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-border-soft px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isResolving}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Review Later
          </button>

          <button
            type="button"
            onClick={onKeepServer}
            disabled={isResolving}
            className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResolving ? "Resolving..." : "Keep Server Version"}
          </button>

          <button
            type="button"
            onClick={onKeepLocal}
            disabled={isResolving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isResolving ? "Resolving..." : "Keep My Changes"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-6">
          <p className="text-center text-xs text-text-muted">
            Keeping the server version discards this device's pending change.
            Keeping your changes will send the offline version to the server.
          </p>
        </div>
      </div>
    </div>
  );
}
