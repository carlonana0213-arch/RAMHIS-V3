import {
  ArrowRight,
  FileText,
  UserRound,
} from "lucide-react";

function PatientCard({
  patient,
  onSelect,
  onNextPatient,
}) {
  if (!patient) {
    return (
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="h-1.5 w-full bg-primary-700" />

        <div className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
            <UserRound size={28} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-text-primary">
            No Patients in Queue
          </h2>

          <p className="mt-2 max-w-[260px] text-sm leading-6 text-text-muted">
            There are currently no patients available for consultation.
          </p>
        </div>
      </section>
    );
  }

  const name =
    patient.generalInfo?.name || "Unnamed Patient";

  const gender =
    patient.generalInfo?.gender ||
    patient.generalInfo?.sex ||
    "--";

  const age =
    patient.generalInfo?.age || "--";

  const department =
    patient.department || "General";

  const complaint =
    patient.initComplaint ||
    "No initial complaint recorded.";

  const isBeingSeen =
    String(patient.status || "").toLowerCase() ===
    "beingseen";

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      {/* TOP ACCENT */}
      <div className="h-1.5 w-full bg-primary-700" />

      <div className="flex min-h-[420px] flex-col p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
              Current Patient
            </p>

            <h2 className="mt-2 truncate text-xl font-bold tracking-tight text-text-primary">
              {name}
            </h2>
          </div>

          {patient.isPriority && (
            <span className="shrink-0 rounded-full bg-status-watch-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-status-watch-text">
              Priority
            </span>
          )}
        </div>

        {/* PATIENT OVERVIEW */}
        <div className="mt-6 rounded-xl border border-border-soft bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                patient.isPriority
                  ? "bg-status-watch-bg text-status-watch-text"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {name.charAt(0).toUpperCase()}
            </div>

            {/* PATIENT STATUS */}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text-primary">
                {department}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isBeingSeen
                      ? "bg-primary-600"
                      : "bg-status-stable-dot"
                  }`}
                />

                <p className="text-xs font-medium text-text-muted">
                  {isBeingSeen
                    ? "Currently being served"
                    : "Ready for consultation"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PATIENT DETAILS */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
              Age
            </p>

            <p className="mt-1 text-lg font-bold text-text-primary">
              {age}
            </p>
          </div>

          <div className="rounded-xl border border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
              Gender
            </p>

            <p className="mt-1 text-lg font-bold text-text-primary">
              {gender}
            </p>
          </div>
        </div>

        {/* INITIAL COMPLAINT */}
        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
            Initial Complaint
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">
            {complaint}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <button
            type="button"
            onClick={() => onSelect?.(patient)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-[0.98]"
          >
            <FileText size={16} />
            Consult
          </button>

          <button
            type="button"
            onClick={onNextPatient}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-secondary transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/10 active:scale-[0.98]"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PatientCard;