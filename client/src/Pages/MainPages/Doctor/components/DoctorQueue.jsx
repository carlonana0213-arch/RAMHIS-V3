import {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  SlidersHorizontal,
} from "lucide-react";

function DoctorQueue({
  patients = [],
  search = "",
  setSearch,
  onOpenDoctorView,
  queueFilter = "all",
  setQueueFilter,
}) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const ITEMS_PER_PAGE = 15;

  const statusStyles = {
    waiting:
      "bg-status-watch-bg text-status-watch-text ring-1 ring-inset ring-amber-200",

    beingSeen:
      "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",

    forPharmacy:
      "bg-status-stable-bg text-status-stable-text ring-1 ring-inset ring-emerald-200",

    released:
      "bg-slate-100 text-text-secondary ring-1 ring-inset ring-slate-200",

    unconsulted:
      "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  };

  const statusLabels = {
    waiting: "Waiting",
    beingSeen: "Being Served",
    forPharmacy: "For Pharmacy",
    released: "Released",
    unconsulted: "Unconsulted",
  };

  const totalPatients =
    patients.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalPatients / ITEMS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex +
    ITEMS_PER_PAGE;

  const displayedPatients =
    patients.slice(
      startIndex,
      endIndex
    );

  const firstDisplayed =
    totalPatients === 0
      ? 0
      : startIndex + 1;

  const displayedCount =
    Math.min(
      endIndex,
      totalPatients
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    queueFilter,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

      {/* TOOLBAR */}

      <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <SlidersHorizontal
              size={19}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text-primary">
              Patient Queue
            </h2>

            <p className="text-xs font-medium text-text-muted">
              Manage patients waiting for
              medical service
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* SEARCH */}

          <div className="relative min-w-0 sm:w-64">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
            />

            <input
              type="text"
              placeholder="Search patient"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="h-10 w-full rounded-xl border border-border bg-slate-50 pl-9 pr-3 text-sm font-medium text-text-primary outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-sky-400 focus:bg-surface focus:ring-4 focus:ring-sky-400/10"
            />
          </div>

          {/* FILTERS */}

          <div className="flex rounded-xl border border-border bg-slate-50 p-1">

            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                queueFilter === "all"
                  ? "bg-blue-950 text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
              onClick={() =>
                setQueueFilter(
                  "all"
                )
              }
            >
              All
            </button>

            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                queueFilter ===
                "priority"
                  ? "bg-blue-950 text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
              onClick={() =>
                setQueueFilter(
                  "priority"
                )
              }
            >
              Priority
            </button>

          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="min-w-0 overflow-x-auto">

        <table className="w-full min-w-[760px] border-collapse text-left">

          <thead>
            <tr className="border-b border-border bg-slate-50/80">

              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Patient
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Age
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Gender
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Complaint
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Status
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-text-muted">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-border-soft">

            {patients.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                      <Search
                        size={22}
                      />
                    </div>

                    <p className="text-sm font-bold text-slate-700">
                      No patients found
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      There are currently no
                      patients in this queue.
                    </p>

                  </div>
                </td>
              </tr>

            ) : displayedPatients.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center"
                >
                  <p className="text-sm font-bold text-slate-700">
                    No patients match the
                    current filter
                  </p>
                </td>
              </tr>

            ) : (

              displayedPatients.map(
                (patient) => (

                  <tr
                    key={patient._id}
                    className={`group transition-colors hover:bg-primary-50/40 ${
                      patient.isPriority
                        ? "bg-status-watch-bg/35"
                        : ""
                    }`}
                  >

                    {/* PATIENT */}

                    <td className="px-5 py-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            patient.isPriority
                              ? "bg-amber-100 text-status-watch-text"
                              : "bg-primary-50 text-primary-700"
                          }`}
                        >
                          {(
                            patient
                              .generalInfo
                              ?.name ||
                            "?"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <p className="truncate text-sm font-bold text-text-primary">
                              {patient
                                .generalInfo
                                ?.name ||
                                "Unnamed Patient"}
                            </p>

                            {patient.isPriority && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-status-watch-text">
                                PRIORITY
                              </span>
                            )}

                          </div>
                        </div>

                      </div>

                    </td>

                    {/* AGE */}

                    <td className="px-4 py-4 text-sm font-medium text-text-secondary">
                      {patient
                        .generalInfo
                        ?.age ??
                        "--"}
                    </td>

                    {/* GENDER */}

                    <td className="px-4 py-4 text-sm font-medium text-text-secondary">
                      {patient
                        .generalInfo
                        ?.gender ||
                        patient
                          .generalInfo
                          ?.sex ||
                        "--"}
                    </td>

                    {/* COMPLAINT */}

                    <td className="max-w-[240px] px-4 py-4">

                      <p className="truncate text-sm font-medium text-text-secondary">
                        {patient.initComplaint ||
                          "No complaint"}
                      </p>

                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4">

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                          statusStyles[
                            patient.status
                          ] ||
                          "bg-slate-100 text-text-secondary ring-1 ring-inset ring-slate-200"
                        }`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                        {statusLabels[
                          patient.status
                        ] ||
                          patient.status ||
                          "Unknown"}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          onOpenDoctorView(
                            patient
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-sky-400/20 active:scale-[0.98]"
                      >
                        <FileText
                          size={15}
                        />

                        Consult
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {totalPatients > 0 && (

        <div className="flex flex-col gap-3 border-t border-border bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs font-medium text-text-muted">

            Showing{" "}

            <span className="font-bold text-slate-700">
              {firstDisplayed}-
              {displayedCount}
            </span>

            {" "}of{" "}

            <span className="font-bold text-slate-700">
              {totalPatients}
            </span>

            {" "}patients

          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    Math.max(
                      1,
                      previous - 1
                    )
                )
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-bold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft
                size={15}
              />

              Previous
            </button>

            <span className="min-w-20 text-center text-xs font-bold text-text-secondary">
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    Math.min(
                      totalPages,
                      previous + 1
                    )
                )
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-bold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next

              <ChevronRight
                size={15}
              />
            </button>

          </div>

        </div>

      )}

    </section>
  );
}

export default DoctorQueue;