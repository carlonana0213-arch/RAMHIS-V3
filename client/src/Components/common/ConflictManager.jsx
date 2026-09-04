import { useEffect, useState } from "react";
import { getPatientConflicts } from "../../Services/syncConflictService";

// ---------------------------------------------------------
// Helper: Format date/time
// ---------------------------------------------------------
function formatDateTime(dateValue) {
  if (!dateValue) {
    return "Unknown date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------
// Helper: Get the owner's display name
// ---------------------------------------------------------
function getOwnerName(ownerKey) {
  if (!ownerKey) {
    return "Unknown user";
  }

  // Populated User document
  if (typeof ownerKey === "object") {
    return (
      ownerKey.name ||
      ownerKey.full_name ||
      ownerKey.username ||
      ownerKey.email ||
      "Unknown user"
    );
  }

  // Fallback if backend did not populate ownerKey
  return String(ownerKey);
}

// ---------------------------------------------------------
// Helper: Convert field names into readable labels
// ---------------------------------------------------------
function formatFieldName(fieldName) {
  if (!fieldName) {
    return "";
  }

  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

// ---------------------------------------------------------
// Helper: Display nested values without showing raw schema
// ---------------------------------------------------------
function FieldValue({ value }) {
  if (value === null || value === undefined || value === "") {
    return (
      <span className="text-slate-400 italic">No information provided</span>
    );
  }

  if (typeof value === "boolean") {
    return <span>{value ? "Yes" : "No"}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-slate-400 italic">None</span>;
    }

    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2"
          >
            <FieldValue value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return (
        <span className="text-slate-400 italic">No information provided</span>
      );
    }

    return (
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        {entries.map(([key, nestedValue]) => (
          <div key={key}>
            <p className="mb-1 text-xs font-semibold text-slate-500">
              {formatFieldName(key)}
            </p>

            <div className="text-sm text-slate-800">
              <FieldValue value={nestedValue} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="whitespace-pre-wrap break-words">{String(value)}</span>
  );
}

// ---------------------------------------------------------
// Render the candidate's actual fields
// ---------------------------------------------------------
function CandidateFields({ data }) {
  if (!data || typeof data !== "object") {
    return (
      <div className="rounded-xl bg-white p-4 text-sm text-slate-500">
        No field data available.
      </div>
    );
  }

  const excludedFields = new Set(["_id", "__v", "createdAt", "updatedAt"]);

  const fields = Object.entries(data).filter(
    ([key]) => !excludedFields.has(key),
  );

  if (fields.length === 0) {
    return (
      <div className="rounded-xl bg-white p-4 text-sm text-slate-500">
        No editable fields available.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {fields.map(([key, value]) => (
        <div
          key={key}
          className="rounded-xl border border-slate-200 bg-white p-3"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            {formatFieldName(key)}
          </p>

          <div className="text-sm leading-6 text-slate-800">
            <FieldValue value={value} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------
// Main component
// ---------------------------------------------------------
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
  // -------------------------------------------------------
  // State
  // -------------------------------------------------------

  const [conflicts, setConflicts] = useState([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // -------------------------------------------------------
  // Patient name
  // -------------------------------------------------------

  const patientName =
    patient?.generalInfo?.name ||
    patient?.name ||
    patient?.fullName ||
    "Selected Patient";

  // -------------------------------------------------------
  // Load all conflict candidates from backend
  // -------------------------------------------------------

  useEffect(() => {
    if (!conflict || !patientId) {
      setConflicts([]);
      setConflictError(null);
      setSelectedCandidateId(null);
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

  // -------------------------------------------------------
  // Hooks must finish before conditional return
  // -------------------------------------------------------

  if (!conflict) {
    return null;
  }

  // -------------------------------------------------------
  // Determine active conflict group
  // -------------------------------------------------------

  const activeConflict = conflicts.length > 0 ? conflicts[0] : null;

  const candidates = activeConflict?.candidates || [];

  // -------------------------------------------------------
  // Separate server/offline versions
  // -------------------------------------------------------

  const serverCandidates = candidates.filter(
    (candidate) => candidate.source === "server",
  );

  const offlineCandidates = candidates.filter(
    (candidate) => candidate.source === "offline",
  );

  // -------------------------------------------------------
  // Candidate selection
  // -------------------------------------------------------
  const handleSelectCandidate = async (candidate) => {
    if (
      isResolving ||
      !candidate?.operationId ||
      !onResolveCandidate ||
      !activeConflict?._id
    ) {
      console.error("[Conflict UI] Cannot resolve candidate:", {
        hasConflictId: Boolean(activeConflict?._id),
        operationId: candidate?.operationId,
      });

      return;
    }

    try {
      setSelectedCandidateId(candidate.operationId);

      console.info("[Conflict UI] Selecting candidate:", {
        conflictId: activeConflict._id,
        operationId: candidate.operationId,
        source: candidate.source,
      });

      await onResolveCandidate(
        activeConflict._id,
        candidate.operationId,
        candidate.data,
      );
    } catch (error) {
      console.error("[Conflict UI] Candidate resolution failed:", error);

      setSelectedCandidateId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border-soft bg-white px-6 py-5">
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

        {/* =================================================
            WARNING
        ================================================== */}

        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-900">
              This patient was changed after an offline change was made.
              Multiple versions have been preserved. Review each version before
              deciding which information should become the final patient record.
            </p>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loadingConflicts && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">
                Loading conflict versions...
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {conflictError && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                {conflictError}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            CONFLICT SUMMARY
        ================================================== */}

        {!loadingConflicts && !conflictError && activeConflict && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Pending conflict group
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Patient ID: {patientId}
                  </p>
                </div>

                <div className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                  {candidates.length} version
                  {candidates.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            VERSION SUMMARY
        ================================================== */}

        {activeConflict && candidates.length > 0 && (
          <div className="px-6 pt-5">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-900">
                Available versions
              </p>

              <p className="mt-1 text-sm text-indigo-700">
                The system has <strong>{serverCandidates.length}</strong> server
                version
                {serverCandidates.length !== 1 ? "s" : ""} and{" "}
                <strong>{offlineCandidates.length}</strong> offline version
                {offlineCandidates.length !== 1 ? "s" : ""}.
              </p>

              <p className="mt-2 text-xs leading-5 text-indigo-600">
                Every offline submission is preserved. Selecting one version
                will make it the final version saved for this patient.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            CANDIDATE LIST
        ================================================== */}

        {activeConflict && candidates.length > 0 && (
          <div className="px-6 py-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Choose the version to keep
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review the fields, user, and time of each submission before
                making the final decision.
              </p>
            </div>

            <div className="space-y-5">
              {candidates.map((candidate, index) => {
                const isServer = candidate.source === "server";

                const ownerName = getOwnerName(candidate.ownerKey);

                const candidateDate =
                  candidate.createdAt ||
                  candidate.updatedAt ||
                  candidate.baseUpdatedAt;

                const isSelected =
                  selectedCandidateId === candidate.operationId;

                return (
                  <div
                    key={
                      candidate.operationId || `${candidate.source}-${index}`
                    }
                    className={`rounded-2xl border p-5 transition ${
                      isSelected
                        ? "border-primary-500 ring-2 ring-primary-100"
                        : isServer
                          ? "border-purple-200 bg-purple-50"
                          : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    {/* ---------------------------------------
                        CANDIDATE HEADER
                    ---------------------------------------- */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isServer ? "bg-purple-500" : "bg-blue-500"
                            }`}
                          />

                          <h4
                            className={`text-base font-bold ${
                              isServer ? "text-purple-900" : "text-blue-900"
                            }`}
                          >
                            {isServer
                              ? "Server Version"
                              : `Offline Version ${
                                  offlineCandidates.indexOf(candidate) + 1
                                }`}
                          </h4>
                        </div>

                        {/* User */}

                        <div className="mt-3 grid gap-1 text-xs text-slate-600">
                          <p>
                            <span className="font-semibold">User:</span>{" "}
                            {isServer ? "Current Server Data" : ownerName}
                          </p>

                          {/* Date */}

                          <p>
                            <span className="font-semibold">Date & Time:</span>{" "}
                            {formatDateTime(candidateDate)}
                          </p>

                          {/* Base version */}

                          {candidate.baseUpdatedAt && (
                            <p>
                              <span className="font-semibold">Based on:</span>{" "}
                              {formatDateTime(candidate.baseUpdatedAt)}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
                          isServer
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isServer ? "Server" : "Offline"}
                      </span>
                    </div>

                    {/* ---------------------------------------
                        DATA FIELDS
                    ---------------------------------------- */}

                    <div className="mt-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Patient Data
                      </p>

                      <CandidateFields data={candidate.data} />
                    </div>

                    {/* ---------------------------------------
                        SELECT BUTTON
                    ---------------------------------------- */}

                    <button
                      type="button"
                      disabled={isResolving || !candidate.operationId}
                      onClick={() => handleSelectCandidate(candidate)}
                      className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        isServer
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isSelected && isResolving
                        ? "Saving this version..."
                        : "Use This Version"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================
            NO CONFLICT DATA
        ================================================== */}

        {!loadingConflicts && !conflictError && !activeConflict && (
          <div className="px-6 py-10">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="font-semibold text-slate-700">
                No pending conflict versions were found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                The conflict may already have been resolved.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-soft px-6 py-5">
          <p className="text-xs leading-5 text-text-muted">
            Nothing is selected automatically. The version you choose will be
            sent to the server as the final resolution.
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={isResolving}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Review Later
          </button>
        </div>
      </div>
    </div>
  );
}
