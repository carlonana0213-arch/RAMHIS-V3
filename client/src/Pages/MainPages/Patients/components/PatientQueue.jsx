import { useEffect, useMemo, useState } from "react";

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
};

const ITEMS_PER_PAGE = 15;

function QueueSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="animate-pulse">
        <div className="h-12 bg-slate-100" />

        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 border-t border-slate-100 px-5 py-4"
          >
            {Array.from({ length: 6 }).map((__, cell) => (
              <div
                key={cell}
                className="h-4 rounded bg-slate-200"
              />
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
  onSelectPatient,
}) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter]);

  const filteredPatients = useMemo(() => {
    return patients
      .filter(
        (patient) => patient.status !== "released"
      )
      .filter((patient) =>
        (patient.generalInfo?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter(
        (patient) =>
          departmentFilter === "All" ||
          patient.department === departmentFilter
      )
      .sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;

        return 0;
      });
  }, [patients, search, departmentFilter]);

  const totalPatients = filteredPatients.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalPatients / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * ITEMS_PER_PAGE;

  const displayedPatients =
    filteredPatients.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  const displayedCount = Math.min(
    startIndex + displayedPatients.length,
    totalPatients
  );

  if (loading) {
    return <QueueSkeleton />;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Patient Queue
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select a patient to view their medical record.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search patient..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-60"
              />
            </div>

            {/* DEPARTMENT */}
            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="min-w-[850px]">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[60px_2fr_80px_90px_1.2fr_140px] items-center bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>#</span>
            <span>Patient</span>
            <span>Age</span>
            <span>Sex</span>
            <span>Department</span>
            <span>Status</span>
          </div>

          {displayedPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                ♡
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800">
                No patients found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-slate-500">
                There are no active patients matching
                your current search or department filter.
              </p>
            </div>
          ) : (
            displayedPatients.map((patient, index) => {
              const status =
                statusConfig[patient.status];

              return (
                <button
                  type="button"
                  key={patient._id}
                  onClick={() =>
                    onSelectPatient?.(patient)
                  }
                  className="grid w-full grid-cols-[60px_2fr_80px_90px_1.2fr_140px] items-center border-t border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50/40"
                >
                  <span className="text-xs font-semibold text-slate-400">
                    {startIndex + index + 1}
                  </span>

                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                      {(
                        patient.generalInfo?.name ||
                        "?"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {patient.generalInfo?.name ||
                          "Unnamed Patient"}
                      </span>

                      {patient.isPriority && (
                        <span className="mt-1 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600 ring-1 ring-red-100">
                          Priority
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="text-sm text-slate-600">
                    {patient.generalInfo?.age || "--"}
                  </span>

                  <span className="text-sm text-slate-600">
                    {patient.generalInfo?.sex ||
                      patient.generalInfo?.gender ||
                      "--"}
                  </span>

                  <span className="text-sm font-medium text-slate-600">
                    {patient.department || "--"}
                  </span>

                  <span>
                    <span
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                        "text-[11px] font-semibold ring-1",
                        status?.className ||
                          "bg-slate-50 text-slate-600 ring-slate-200",
                      ].join(" ")}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          status?.dot || "bg-slate-400"
                        }`}
                      />

                      {status?.label ||
                        patient.status ||
                        "Unknown"}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {totalPatients > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {displayedCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalPatients}
            </span>{" "}
            patients
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}