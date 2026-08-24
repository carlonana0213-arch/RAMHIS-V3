import { FaExclamationTriangle } from "react-icons/fa";

const DuplicatePatientModal = ({
  patient,
  onReuse,
  onUpdate,
  onCreateNew,
  onCancel,
}) => {
  const name =
    patient?.generalInfo?.name || "Unknown patient";

  const age =
    patient?.generalInfo?.age ?? "—";

  const sex =
    patient?.generalInfo?.sex || "—";

  const updatedAt =
    patient?.updatedAt
      ? new Date(
          patient.updatedAt,
        ).toLocaleDateString()
      : "Unknown";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-patient-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-[24px] border border-border-soft bg-surface shadow-[0_24px_60px_rgba(15,23,42,0.18)]">

        {/* HEADER */}
        <div className="border-b border-border-soft px-5 py-5 sm:px-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-status-warning-bg text-status-warning-text">
              <FaExclamationTriangle size={18} />
            </div>

            <div className="min-w-0">

              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Duplicate Patient Detected
              </span>

              <h3
                id="duplicate-patient-title"
                className="text-xl font-bold tracking-tight text-primary-900"
              >
                Patient Already Exists
              </h3>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                We found an existing patient record with similar
                information.
              </p>

            </div>

          </div>

        </div>

        {/* PATIENT INFORMATION */}
        <div className="px-5 py-5 sm:px-6">

          <div className="rounded-2xl border border-border-soft bg-surface-muted p-4">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
                  Existing Record
                </span>

                <p
                  className="mt-1 truncate text-base font-bold text-text-primary"
                  title={name}
                >
                  {name}
                </p>

              </div>

              <span className="rounded-full bg-status-warning-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-status-warning-text">
                Found
              </span>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">
                  Patient Details
                </p>

                <p className="mt-1 text-sm font-semibold text-text-secondary">
                  {age} yrs · {sex}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-semibold text-text-secondary">
                  {updatedAt}
                </p>
              </div>

            </div>

          </div>

          {/* ACTION DESCRIPTION */}
          <div className="mt-5">

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
              Choose an Action
            </span>

            <p className="mt-1 text-sm text-text-muted">
              Select how you want to handle the existing patient
              record.
            </p>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-4 space-y-3">

            {/* REUSE */}
            <button
              type="button"
              onClick={onReuse}
              className="group flex w-full items-center justify-between rounded-2xl border border-primary-100 bg-primary-50 px-4 py-4 text-left transition hover:border-primary-300 hover:bg-primary-100/60"
            >
              <div>
                <p className="text-sm font-bold text-primary-900">
                  Keep Existing Record
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Use the old patient information and add the patient
                  to the queue.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm font-bold text-primary-700 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

            {/* UPDATE */}
            <button
              type="button"
              onClick={onUpdate}
              className="group flex w-full items-center justify-between rounded-2xl border border-border-soft bg-surface px-4 py-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:border-primary-200 hover:bg-surface-muted"
            >
              <div>
                <p className="text-sm font-bold text-text-primary">
                  Update Existing Information
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Edit the existing patient record with the new
                  information.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm font-bold text-primary-700 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

            {/* CREATE NEW */}
            <button
              type="button"
              onClick={onCreateNew}
              className="group flex w-full items-center justify-between rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-4 text-left transition hover:border-primary-300 hover:bg-primary-50/50"
            >
              <div>
                <p className="text-sm font-bold text-text-primary">
                  Create New Patient Anyway
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Continue and create a separate patient record.
                </p>
              </div>

              <span className="ml-4 shrink-0 text-sm font-bold text-text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-border-soft bg-surface-muted px-5 py-4 sm:px-6">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-slate-200/70 hover:text-text-primary"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default DuplicatePatientModal;