import { useEffect, useState } from "react";
import { getPatientConflicts } from "../../Services/syncConflictService";

export default function ConflictManager({
  conflict,
  patient,
  patientId,
  onClose,
  onKeepServer,
  onKeepLocal,
  onResolveCandidate,
  isResolving = false,
}) {
  // ---------------------------------------------------------
  // State
  // ---------------------------------------------------------

  const [conflicts, setConflicts] = useState([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  // ---------------------------------------------------------
  // Patient name
  // ---------------------------------------------------------

  const patientName =
    patient?.generalInfo?.name ||
    patient?.name ||
    patient?.fullName ||
    "Selected Patient";

  // ---------------------------------------------------------
  // Existing local conflict data
  // ---------------------------------------------------------

  const localData = conflict?.localData || {};
  const serverData = conflict?.serverData || {};

  // ---------------------------------------------------------
  // Load all server-side conflict candidates
  //
  // This is important for the multi-user conflict system.
  // Doctor.jsx detects that a conflict exists locally, while
  // this component retrieves ALL candidates stored by the
  // backend.
  // ---------------------------------------------------------

  useEffect(() => {
    if (!conflict || !patientId) {
      setConflicts([]);
      setConflictError(null);
      return;
    }

    let cancelled = false;

    const loadConflicts = async () => {
      try {
        setLoadingConflicts(true);
        setConflictError(null);

        console.log("[Conflict UI] Loading conflicts for patient:", patientId);

        const result = await getPatientConflicts(patientId);

        console.log("[Conflict UI] Backend conflict response:", result);

        if (!cancelled) {
          setConflicts(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error("[Conflict UI] Failed to load conflicts:", error);

        if (!cancelled) {
          setConflictError(
            error?.message || "Failed to load synchronization conflicts.",
          );
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
  }, [conflict, patientId]);

  // ---------------------------------------------------------
  // IMPORTANT:
  // Hooks must run before this conditional return.
  // ---------------------------------------------------------

  if (!conflict) {
    return null;
  }

  // ---------------------------------------------------------
  // Get the first pending conflict group.
  //
  // At this stage we are only displaying the information.
  // Actual candidate selection/resolution comes next.
  // ---------------------------------------------------------

  const activeConflict = conflicts.length > 0 ? conflicts[0] : null;

  const candidates = activeConflict?.candidates || [];

  // ---------------------------------------------------------
  // Identify candidate types
  // ---------------------------------------------------------

  const serverCandidates = candidates.filter(
    (candidate) => candidate.source === "server",
  );

  const offlineCandidates = candidates.filter(
    (candidate) => candidate.source === "offline",
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

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

        {/* =====================================================
            WARNING
        ====================================================== */}

        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-900">
              This patient was changed after an offline change was made. Review
              the available versions before deciding which information should be
              kept.
            </p>
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loadingConflicts && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">
                Checking for synchronization conflicts...
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {conflictError && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                {conflictError}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            DEBUG / STATUS
        ====================================================== */}

        {!loadingConflicts && !conflictError && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Pending conflict groups: {conflicts.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Patient ID: {patientId}
                  </p>
                </div>

                {activeConflict && (
                  <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {candidates.length} version
                    {candidates.length !== 1 ? "s" : ""} found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MULTI-USER CANDIDATE SUMMARY
        ====================================================== */}

        {activeConflict && candidates.length > 0 && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-900">
                Available versions
              </p>

              <p className="mt-1 text-sm text-indigo-700">
                The server currently has{" "}
                <strong>{serverCandidates.length}</strong> server version
                {serverCandidates.length !== 1 ? "s" : ""} and{" "}
                <strong>{offlineCandidates.length}</strong> offline version
                {offlineCandidates.length !== 1 ? "s" : ""}.
              </p>

              <p className="mt-2 text-xs text-indigo-600">
                All offline submissions are preserved so they can be reviewed
                before a final version is chosen.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            ALL BACKEND CANDIDATES
        ====================================================== */}

        {activeConflict && candidates.length > 0 && (
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900">
                  Stored Conflict Versions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  These are all versions currently preserved by the
                  synchronization system.
                </p>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate, index) => {
                  const isServer = candidate.source === "server";

                  const owner = candidate.ownerKey || "Unknown user";

                  const operation =
                    candidate.operationId || `Candidate ${index + 1}`;
                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => {
                      onResolveCandidate(candidate.operationId, candidate.data);
                    }}
                    className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isServer
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isResolving ? "Resolving..." : "Use This Version"}
                  </button>;
                  return (
                    <div
                      key={
                        candidate.operationId || `${candidate.source}-${index}`
                      }
                      className={`rounded-2xl border p-4 ${
                        isServer
                          ? "border-purple-200 bg-purple-50"
                          : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              isServer ? "text-purple-900" : "text-blue-900"
                            }`}
                          >
                            {isServer
                              ? "Server Version"
                              : `Offline Version ${index}`}
                          </p>

                          {!isServer && (
                            <p className="mt-1 text-xs text-blue-700">
                              User: {owner}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-slate-500">
                            Operation: {operation}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isServer
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isServer ? "Server" : "Offline"}
                        </span>
                      </div>

                      <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-white p-4 text-xs leading-5 text-slate-800">
                        {JSON.stringify(candidate.data || {}, null, 2)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-border-soft px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isResolving}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Review Later
          </button>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="px-6 pb-6">
          <p className="text-center text-xs text-text-muted">
            No changes are automatically selected at this stage. The available
            versions are preserved until a final resolution is chosen.
          </p>
        </div>
      </div>
    </div>
  );
}
