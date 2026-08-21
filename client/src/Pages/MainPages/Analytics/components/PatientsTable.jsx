import { useState, useEffect } from "react";

import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";

const ITEMS_PER_PAGE = 10;

const PatientsTable = ({
  patients = [],
  onSelectPatient,
}) => {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(
      patients.length / ITEMS_PER_PAGE,
    ),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentPatients = patients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  if (!patients.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
            <FiSearch size={20} />
          </div>

          <p className="mt-4 text-sm font-bold text-slate-700">
            No patients found
          </p>

          <p className="mt-1 text-xs text-text-muted">
            There are no patient records to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

      {/* HEADER */}

      <div className="border-b border-border-soft px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-extrabold text-text-primary">
              Patient Records
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              {patients.length} patient record
              {patients.length === 1 ? "" : "s"} found.
            </p>
          </div>

          <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-slate-50/80">
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Patient
              </th>

              <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Sex
              </th>

              <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Age
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                Diagnosis
              </th>

              <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Date of Visit
              </th>

              <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Place of Visit
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-soft">
            {currentPatients.map((p) => {
              const patientName =
                p.name || "Unnamed Patient";

              return (
                <tr
                  key={p.id}
                  onClick={() =>
                    onSelectPatient &&
                    onSelectPatient(p.id)
                  }
                  className="group cursor-pointer transition-colors hover:bg-primary-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-700">
                        {patientName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-text-primary">
                          {patientName}
                        </p>

                        <p className="mt-0.5 text-[11px] text-text-subtle">
                          Patient record
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-medium text-text-secondary">
                    {p.sex || "—"}
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-medium text-text-secondary">
                    {p.age || "—"}
                  </td>

                  <td className="max-w-[240px] px-4 py-4">
                    <p className="truncate text-sm font-medium text-text-secondary">
                      {p.diagnosis || "—"}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-medium text-text-secondary">
                    {p.visitDate &&
                    !isNaN(
                      new Date(
                        p.visitDate,
                      ),
                    )
                      ? new Date(
                          p.visitDate,
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-medium text-text-secondary">
                    {p.visitPlace || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="flex flex-col gap-3 border-t border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-text-muted">
          Showing{" "}
          <span className="font-bold text-slate-700">
            {startIndex + 1}
          </span>
          {" – "}
          <span className="font-bold text-slate-700">
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              patients.length,
            )}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-700">
            {patients.length}
          </span>
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              goToPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={15} />
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1,
          ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                currentPage === page
                  ? "bg-primary-700 text-white shadow-sm"
                  : "border border-border bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              goToPage(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;