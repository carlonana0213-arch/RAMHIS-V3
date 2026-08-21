const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
];

const statusConfig = {
  waiting: {
    label: "Waiting",
    className:
      "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },

  beingSeen: {
    label: "Being Served",
    className:
      "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },

  forPharmacy: {
    label: "For Pharmacy",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },

  released: {
    label: "Released",
    className:
      "bg-slate-50 text-text-secondary ring-slate-200",
    dot: "bg-slate-400",
  },
};

function QueueSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="animate-pulse">

        <div className="h-20 bg-slate-100" />

        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-4 border-t border-border-soft px-5 py-4"
            >
              {Array.from({
                length: 7,
              }).map((__, cell) => (
                <div
                  key={cell}
                  className="h-4 rounded bg-slate-200"
                />
              ))}
            </div>
          )
        )}

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

  const safePage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );

  const displayedCount =
    patients.length;

  const firstDisplayed =
    totalPatients === 0
      ? 0
      : (safePage - 1) * 15 + 1;

  const lastDisplayed =
    totalPatients === 0
      ? 0
      : firstDisplayed +
        displayedCount -
        1;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

      {/* HEADER */}
      <div className="border-b border-border px-5 py-5 sm:px-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-base font-bold text-text-primary">
              Patient Queue
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              View and manage patients in
              the current medical mission.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch?.(
                    event.target.value
                  )
                }
                placeholder="Search patient..."
                className="h-10 w-full rounded-xl border border-border bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-blue-400 focus:bg-surface focus:ring-4 focus:ring-blue-50 sm:w-60"
              />

            </div>

            {/* DEPARTMENT */}
            <select
              value={
                departmentFilter
              }
              onChange={(event) =>
                setDepartmentFilter?.(
                  event.target.value
                )
              }
              className="h-10 rounded-xl border border-border bg-slate-50 px-3 text-sm font-medium text-text-secondary outline-none transition focus:border-blue-400 focus:bg-surface focus:ring-4 focus:ring-blue-50"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                )
              )}
            </select>

          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <div className="min-w-[1000px]">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[60px_2fr_80px_90px_1.2fr_140px_100px] items-center bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-subtle">

            <span>#</span>

            <span>
              Patient
            </span>

            <span>
              Age
            </span>

            <span>
              Sex
            </span>

            <span>
              Department
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>

          </div>

          {/* EMPTY */}
          {patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-text-subtle">
                ♡
              </div>

              <h3 className="mt-4 text-sm font-bold text-text-primary">
                No patients found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-text-muted">
                There are no active patients
                matching your current search
                or department filter.
              </p>

            </div>
          ) : (
            patients.map(
              (patient, index) => {
                const status =
                  statusConfig[
                    patient.status
                  ];

                const patientName =
                  patient
                    .generalInfo
                    ?.name ||
                  "Unnamed Patient";

                return (
                  <div
                    key={patient._id}
                    className="grid grid-cols-[60px_2fr_80px_90px_1.2fr_140px_100px] items-center border-t border-border-soft px-5 py-4 transition hover:bg-primary-50/40"
                  >

                    {/* NUMBER */}
                    <span className="text-xs font-semibold text-text-subtle">
                      {firstDisplayed +
                        index}
                    </span>

                    {/* PATIENT */}
                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          patient.isPriority
                            ? "bg-red-50 text-red-600"
                            : "bg-primary-50 text-primary-600",
                        ].join(" ")}
                      >
                        {patientName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-text-primary">
                          {patientName}
                        </p>

                        {patient.isPriority && (
                          <span className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600 ring-1 ring-red-100">
                            Priority
                          </span>
                        )}

                      </div>
                    </div>

                    {/* AGE */}
                    <span className="text-sm text-text-secondary">
                      {patient
                        .generalInfo
                        ?.age ||
                        "--"}
                    </span>

                    {/* SEX */}
                    <span className="text-sm text-text-secondary">
                      {patient
                        .generalInfo
                        ?.sex ||
                        patient
                          .generalInfo
                          ?.gender ||
                        "--"}
                    </span>

                    {/* DEPARTMENT */}
                    <span className="text-sm font-medium text-text-secondary">
                      {patient.department ||
                        "--"}
                    </span>

                    {/* STATUS */}
                    <span>
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                          "text-[11px] font-semibold ring-1",
                          status?.className ||
                            "bg-slate-50 text-text-secondary ring-slate-200",
                        ].join(" ")}
                      >

                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            status?.dot ||
                              "bg-slate-400",
                          ].join(" ")}
                        />

                        {status?.label ||
                          patient.status ||
                          "Unknown"}

                      </span>
                    </span>

                    {/* VIEW */}
                    <button
                      type="button"
                      onClick={() =>
                        onSelectPatient?.(
                          patient
                        )
                      }
                      className="inline-flex w-fit items-center justify-center rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-600 transition hover:bg-primary-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                      View
                    </button>

                  </div>
                );
              }
            )
          )}

        </div>
      </div>

      {/* PAGINATION */}
      {totalPatients > 0 && (
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-text-muted">

            Showing{" "}

            <span className="font-semibold text-slate-700">
              {firstDisplayed}
            </span>

            {" "}to{" "}

            <span className="font-semibold text-slate-700">
              {lastDisplayed}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-700">
              {totalPatients}
            </span>

            {" "}patients

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={
                safePage === 1
              }
              onClick={() =>
                setCurrentPage?.(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700">
              {safePage} /{" "}
              {Math.max(
                1,
                totalPages
              )}
            </span>

            <button
              type="button"
              disabled={
                safePage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage?.(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </div>
      )}

    </section>
  );
}