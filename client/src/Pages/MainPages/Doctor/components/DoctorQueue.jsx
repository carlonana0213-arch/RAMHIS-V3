import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

import {
  dashboardCardVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

function DoctorQueue({
  patients = [],
  loading = false,
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
      totalPatients / ITEMS_PER_PAGE,
    ),
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
      endIndex,
    );

  const firstDisplayed =
    totalPatients === 0
      ? 0
      : startIndex + 1;

  const displayedCount =
    Math.min(
      endIndex,
      totalPatients,
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
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  return (
    <section
      className={[
        dashboardCardVariants.base,
        "flex min-w-0 flex-1 flex-col overflow-hidden",
        "rounded-[22px] border-0",
        "shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
      ].join(" ")}
    >
      {/* HEADER */}

      <div className="flex flex-col gap-5 border-b border-border-soft px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">

        {/* TITLE */}

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <SlidersHorizontal
              size={19}
              strokeWidth={2.2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  Consultation
                </span>

                <h2 className="text-base font-bold tracking-tight text-primary-900">
                  Patient Queue
                </h2>
              </div>

              <span
                className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
              >
                {totalPatients.toLocaleString()} Patients
              </span>

            </div>

            <p className="mt-1 text-xs text-text-muted">
              Review and manage patients waiting for medical consultation.
            </p>

          </div>

        </div>

        {/* CONTROLS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* SEARCH */}

          <div className="relative min-w-0 sm:w-64">

            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle"
            />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-border-soft bg-slate-50/70 pl-10 pr-4 text-sm font-medium text-text-primary outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-500/10"
            />

          </div>

          {/* FILTERS */}

          <div className="flex rounded-xl border border-border-soft bg-slate-50/70 p-1">

            <button
              type="button"
              className={[
                "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                queueFilter === "all"
                  ? "bg-primary-900 text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary",
              ].join(" ")}
              onClick={() =>
                setQueueFilter(
                  "all",
                )
              }
            >
              All
            </button>

            <button
              type="button"
              className={[
                "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                queueFilter ===
                "priority"
                  ? "bg-primary-900 text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary",
              ].join(" ")}
              onClick={() =>
                setQueueFilter(
                  "priority",
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
            <tr className="border-b border-border-soft bg-slate-50/70">

              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted sm:px-6">
                Patient
              </th>

              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Age
              </th>

              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Gender
              </th>

              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Complaint
              </th>

              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Status
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted sm:px-6">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-border-soft">

            {/* LOADING */}

            {loading ? (

              Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <tr
                    key={index}
                    className="animate-pulse"
                  >
                    <td className="px-5 py-4 sm:px-6">

                      <div className="flex items-center gap-3">

                        <div className="h-10 w-10 rounded-xl bg-slate-200" />

                        <div>
                          <div className="h-3 w-32 rounded bg-slate-200" />
                          <div className="mt-2 h-2.5 w-20 rounded bg-slate-100" />
                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-4">
                      <div className="h-3 w-8 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-3 w-14 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-3 w-32 rounded bg-slate-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-6 w-24 rounded-full bg-slate-200" />
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <div className="ml-auto h-9 w-24 rounded-xl bg-slate-200" />
                    </td>

                  </tr>
                ),
              )

            ) : patients.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="px-5 py-20 text-center"
                >

                  <div className="mx-auto flex max-w-sm flex-col items-center">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                      <UsersRound
                        size={24}
                      />
                    </div>

                    <p className="text-sm font-bold text-text-primary">
                      No patients found
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-text-muted">
                      There are currently no patients in this consultation queue.
                    </p>

                  </div>

                </td>

              </tr>

            ) : displayedPatients.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="px-5 py-20 text-center"
                >

                  <div className="mx-auto flex max-w-sm flex-col items-center">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                      <Search
                        size={24}
                      />
                    </div>

                    <p className="text-sm font-bold text-text-primary">
                      No matching patients
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      Try adjusting your search or queue filter.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              displayedPatients.map(
                (patient) => {

                  const patientName =
                    patient.generalInfo
                      ?.name ||
                    "Unnamed Patient";

                  const normalizedStatus =
                    String(
                      patient.status || "",
                    )
                      .trim()
                      .replace(
                        /\s+/g,
                        "",
                      )
                      .toLowerCase();

                  return (
                    <tr
                      key={patient._id}
                      className={[
                        "group transition-colors",
                        "hover:bg-primary-50/40",
                        patient.isPriority
                          ? "bg-status-watch-bg/20"
                          : "",
                      ].join(" ")}
                    >

                      {/* PATIENT */}

                      <td className="px-5 py-4 sm:px-6">

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center",
                              "rounded-xl text-sm font-bold",
                              patient.isPriority
                                ? "bg-status-watch-bg text-status-watch-text"
                                : "bg-primary-50 text-primary-700",
                            ].join(" ")}
                          >
                            {patientName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <p className="truncate text-sm font-bold text-text-primary">
                                {patientName}
                              </p>

                              {patient.isPriority && (

                                <span className="rounded-full bg-status-watch-bg px-2 py-0.5 text-[9px] font-extrabold tracking-[0.08em] text-status-watch-text">
                                  PRIORITY
                                </span>

                              )}

                            </div>

                            <p className="mt-1 text-[11px] text-text-subtle">
                              Patient record
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* AGE */}

                      <td className="px-4 py-4 text-sm font-semibold text-text-secondary">

                        {patient.generalInfo
                          ?.age ??
                          "--"}

                      </td>

                      {/* GENDER */}

                      <td className="px-4 py-4 text-sm font-medium text-text-secondary">

                        {patient.generalInfo
                          ?.gender ||
                          patient.generalInfo
                            ?.sex ||
                          "--"}

                      </td>

                      {/* COMPLAINT */}

                      <td className="max-w-[240px] px-4 py-4">

                        <p className="truncate text-sm font-medium text-text-secondary">

                          {patient.initComplaint ||
                            "No complaint provided"}

                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span
                          className={[
                            "inline-flex items-center rounded-full",
                            "px-2.5 py-1 text-xs font-bold",
                            statusStyles[
                              normalizedStatus
                            ] ||
                              "bg-slate-100 text-text-secondary ring-1 ring-inset ring-slate-200",
                          ].join(" ")}
                        >

                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                          {statusLabels[
                            normalizedStatus
                          ] ||
                            patient.status ||
                            "Unknown"}

                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-right sm:px-6">

                        <button
                          type="button"
                          onClick={() =>
                            onOpenDoctorView(
                              patient,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-primary-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-500/15 active:translate-y-0"
                        >

                          <FileText
                            size={15}
                          />

                          Consult

                        </button>

                      </td>

                    </tr>
                  );
                },
              )

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      {totalPatients > 0 && (

        <div className="flex flex-col gap-3 border-t border-border-soft bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <p className="text-xs font-medium text-text-muted">

            Showing{" "}

            <span className="font-bold text-text-primary">
              {firstDisplayed}–
              {displayedCount}
            </span>

            {" "}of{" "}

            <span className="font-bold text-text-primary">
              {totalPatients.toLocaleString()}
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
                      previous - 1,
                    ),
                )
              }
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-border-soft bg-surface px-3 text-xs font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={15}
              />

              Previous

            </button>

            <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary-50 px-3 text-xs font-bold text-primary-700">

              {currentPage}

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
                      previous + 1,
                    ),
                )
              }
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-border-soft bg-surface px-3 text-xs font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
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