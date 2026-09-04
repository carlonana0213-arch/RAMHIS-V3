import {
  FaSearch,
  FaUserInjured,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  dashboardCardVariants,
  statusPillVariants,
} from "../../../../ui/variants";

const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
  "Neurology",
  "Pathology",
  "Circumcision",
  "Surgery",
  "PT & Rehabilitation",
  "OBGyn",
  "Ophthalmology",
  "Dermatology",
  "Adult Medicine",
];

const statusConfig = {
  waiting: {
    label: "Waiting",
    className: statusPillVariants.watch,
    dot: "bg-amber-500",
  },

  beingSeen: {
    label: "Being Served",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },

  forPharmacy: {
    label: "For Pharmacy",
    className: statusPillVariants.stable,
    dot: "bg-emerald-500",
  },

  released: {
    label: "Released",
    className: "bg-slate-100 text-text-secondary ring-slate-200",
    dot: "bg-slate-400",
  },
};

function QueueSkeleton() {
  return (
    <div className={`${dashboardCardVariants.base} overflow-hidden`}>
      <div className="animate-pulse">
        {/* HEADER */}
        <div className="border-b border-border-soft px-5 py-5 sm:px-6">
          <div className="h-5 w-36 rounded bg-slate-200" />

          <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
        </div>

        {/* SEARCH AREA */}
        <div className="flex gap-3 px-5 py-4 sm:px-6">
          <div className="h-10 flex-1 rounded-xl bg-slate-100" />
          <div className="h-10 w-40 rounded-xl bg-slate-100" />
        </div>

        {/* ROWS */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 border-t border-border-soft px-5 py-5"
          >
            {Array.from({ length: 6 }).map((__, cell) => (
              <div key={cell} className="h-4 rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PatientQueue({
  patients = [],
  loading = false,

  search = "",
  setSearch,

  departmentFilter = "All",
  setDepartmentFilter,

  currentPage = 1,
  setCurrentPage,

  totalPatients = 0,
  totalPages = 1,

  onSelectPatient,
}) {
  if (loading) {
    return <QueueSkeleton />;
  }

  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const displayedCount = patients.length;

  const firstDisplayed = totalPatients === 0 ? 0 : (safePage - 1) * 15 + 1;

  const lastDisplayed =
    totalPatients === 0 ? 0 : firstDisplayed + displayedCount - 1;

  /*
  |--------------------------------------------------------------------------
  | OPEN PATIENT
  |--------------------------------------------------------------------------
  */

  const handlePatientSelect = (patient) => {
    if (!patient) {
      return;
    }

    onSelectPatient?.(patient);
  };

  /*
  |--------------------------------------------------------------------------
  | KEYBOARD SUPPORT
  |--------------------------------------------------------------------------
  */

  const handleRowKeyDown = (event, patient) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      handlePatientSelect(patient);
    }
  };

  return (
    <section className={`${dashboardCardVariants.base} overflow-hidden`}>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-border-soft px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* TITLE */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-xs text-primary-700">
                <FaUserInjured />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Active Mission
              </span>
            </div>

            <h2 className="text-lg font-bold tracking-tight text-primary-900">
              Patient Queue
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              View and manage patients in the current medical mission.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {/* SEARCH */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-text-subtle" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch?.(event.target.value)}
                placeholder="Search patient..."
                className="h-10 w-full rounded-xl border border-border-soft bg-surface-muted pl-9 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary-300 focus:bg-surface focus:ring-4 focus:ring-primary-50"
              />
            </div>

            {/* DEPARTMENT */}
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter?.(event.target.value)}
              className="h-10 rounded-xl border border-border-soft bg-surface-muted px-3 text-sm font-medium text-text-secondary outline-none transition focus:border-primary-300 focus:bg-surface focus:ring-4 focus:ring-primary-50"
            >
              <option value="All">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* TABLE HEADER */}

          <div className="grid grid-cols-[60px_2fr_80px_90px_1.2fr_150px] items-center border-b border-border-soft bg-surface-muted/80 px-5 py-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              #
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Patient
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Age
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Sex
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Department
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Status
            </span>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-xl text-primary-600">
                <FaUserInjured />
              </div>

              <h3 className="mt-4 text-sm font-bold text-text-primary">
                No patients found
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
                There are no active patients matching your current search or
                department filter.
              </p>
            </div>
          ) : (
            patients.map((patient, index) => {
              const status = statusConfig[patient.status];

              const patientName =
                patient.generalInfo?.name || "Unnamed Patient";

              return (
                <div
                  key={patient._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handlePatientSelect(patient)}
                  onKeyDown={(event) => handleRowKeyDown(event, patient)}
                  aria-label={`View patient record for ${patientName}`}
                  className="group grid cursor-pointer grid-cols-[60px_2fr_80px_90px_1.2fr_150px] items-center border-b border-border-soft px-5 py-4 outline-none transition-colors last:border-b-0 hover:bg-primary-50/40 focus:bg-primary-50/40 focus:ring-2 focus:ring-inset focus:ring-primary-200"
                >
                  {/* NUMBER */}
                  <span className="text-xs font-semibold text-text-subtle">
                    {firstDisplayed + index}
                  </span>

                  {/* PATIENT */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                        patient.isPriority
                          ? "bg-status-critical-bg text-status-critical-text"
                          : "bg-primary-50 text-primary-700",
                      ].join(" ")}
                    >
                      {patientName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {patientName}
                      </p>

                      {patient.isPriority && (
                        <span className="mt-1 inline-flex rounded-full bg-status-critical-bg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-status-critical-text">
                          Priority Patient
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AGE */}
                  <span className="text-sm font-medium text-text-secondary">
                    {patient.generalInfo?.age || "--"}
                  </span>

                  {/* SEX */}
                  <span className="text-sm font-medium text-text-secondary">
                    {patient.generalInfo?.sex ||
                      patient.generalInfo?.gender ||
                      "--"}
                  </span>

                  {/* DEPARTMENT */}
                  <span className="text-sm font-medium text-text-secondary">
                    {patient.department || "--"}
                  </span>

                  {/* STATUS */}
                  <span>
                    <span
                      className={[
                        statusPillVariants.base,
                        status?.className ||
                          "bg-slate-100 text-text-secondary ring-slate-200",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          status?.dot || "bg-slate-400",
                        ].join(" ")}
                      />

                      {status?.label || patient.status || "Unknown"}
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {totalPatients > 0 && (
        <div className="flex flex-col gap-4 border-t border-border-soft bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* RESULTS */}

          <p className="text-xs text-text-muted">
            Showing{" "}
            <span className="font-bold text-text-primary">
              {firstDisplayed}
            </span>{" "}
            to{" "}
            <span className="font-bold text-text-primary">{lastDisplayed}</span>{" "}
            of{" "}
            <span className="font-bold text-text-primary">{totalPatients}</span>{" "}
            patients
          </p>

          {/* CONTROLS */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage?.((page) => Math.max(1, page - 1))}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border-soft px-3 text-xs font-semibold text-text-secondary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaChevronLeft className="text-[9px]" />
              Previous
            </button>

            <span className="flex h-9 items-center justify-center rounded-xl bg-primary-50 px-3 text-xs font-bold text-primary-700">
              {safePage} / {Math.max(1, totalPages)}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage?.((page) => Math.min(totalPages, page + 1))
              }
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border-soft px-3 text-xs font-semibold text-text-secondary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FaChevronRight className="text-[9px]" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
