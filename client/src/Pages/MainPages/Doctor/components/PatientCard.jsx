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
      <section className="flex w-full self-start flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
          <UserRound size={28} />
        </div>

        <h2 className="mt-5 text-lg font-extrabold text-text-primary">
          No Patients
        </h2>

        <p className="mt-1 max-w-[220px] text-sm font-medium leading-6 text-text-muted">
          There are currently no patients available in the doctor queue.
        </p>
      </section>
    );
  }

  const name =
    patient.generalInfo?.name || "Unnamed Patient";

  const gender =
    patient.generalInfo?.gender ||
    patient.generalInfo?.sex ||
    "--";

  const isBeingSeen =
    String(patient.status || "").toLowerCase() === "beingseen";

  return (
    <section className="flex min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      {/* Top accent */}
      <div className="h-1.5 w-full bg-blue-950" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary-700">
              Current Patient
            </p>

            <h2 className="mt-2 break-words text-xl font-extrabold tracking-tight text-text-primary">
              {name}
            </h2>
          </div>

          {patient.isPriority && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-status-watch-text ring-1 ring-inset ring-amber-200">
              PRIORITY
            </span>
          )}
        </div>

        {/* Patient overview */}
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
              patient.isPriority
                ? "bg-amber-100 text-status-watch-text"
                : "bg-primary-100 text-blue-800"
            }`}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-text-primary">
              {patient.department || "General"}
            </p>

            <p className="text-xs font-medium text-text-muted">
              {isBeingSeen
                ? "Currently being served"
                : "Ready for consultation"}
            </p>
          </div>
        </div>

        {/* Patient information */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
              Age
            </p>

            <p className="mt-1 text-sm font-extrabold text-text-primary">
              {patient.generalInfo?.age || "--"}
            </p>
          </div>

          <div className="rounded-xl border border-border p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
              Gender
            </p>

            <p className="mt-1 text-sm font-extrabold text-text-primary">
              {gender}
            </p>
          </div>
        </div>

        {/* Complaint */}
        <div className="mt-3 rounded-xl border border-border p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
            Initial Complaint
          </p>

          <p className="mt-1 line-clamp-3 text-sm font-medium leading-5 text-slate-700">
            {patient.initComplaint || "No complaint recorded."}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button
            type="button"
            onClick={() => onSelect?.(patient)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-3 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-sky-400/20 active:scale-[0.98]"
          >
            <FileText size={15} />
            Consult
          </button>

          <button
            type="button"
            onClick={onNextPatient}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-extrabold text-slate-700 transition hover:border-border-strong hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-400/10 active:scale-[0.98]"
          >
            Next
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PatientCard;