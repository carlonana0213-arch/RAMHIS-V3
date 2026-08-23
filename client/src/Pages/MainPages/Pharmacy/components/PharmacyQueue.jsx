import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Search,
  CheckCircle2,
  Package,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { apiFetch } from "../../../../Services/api";
import { API_BASE_URL } from "../../../../Services/apiConfig";

import ConfirmModal from "../../../../Components/ui/ConfirmModal";
import AlertModal from "../../../../Components/ui/AlertModal";
import TableSkeleton from "../../../../Components/ui/TableSkeleton";
import Button from "../../../../Components/ui/button";

function PharmacyQueue() {
  const [prescriptions, setPrescriptions] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Pending");

  const [confirmState, setConfirmState] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const [loading, setLoading] = useState(true);
  const [expandedPatients, setExpandedPatients] = useState({});

  const loadPrescriptions = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(
        `${API_BASE_URL}/api/prescriptions/pending`,
      );

      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load prescription queue:", error);

      setAlertMessage(
        error.message || "Failed to load prescription queue.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleMarkAsGiven = async (prescriptionId, itemId) => {
    try {
      await apiFetch(
        `${API_BASE_URL}/api/prescriptions/${prescriptionId}/${itemId}`,
        {
          method: "PATCH",
        },
      );

      setConfirmState(null);

      await loadPrescriptions();

      setAlertMessage("Prescription marked as given.");
    } catch (error) {
      console.error("Failed to mark prescription as given:", error);

      setConfirmState(null);

      setAlertMessage(
        error.message || "Failed to mark prescription as given.",
      );
    }
  };

  const getPatientName = (prescription) => {
    return (
      prescription?.patient?.generalInfo?.name ||
      "Unknown Patient"
    );
  };

  const getMedicineName = (medicine) => {
    if (Array.isArray(medicine?.names)) {
      return medicine.names.join(", ");
    }

    return medicine?.name || "Unknown Medicine";
  };

  const getStockStatus = (medicine) => {
    const stock = Number(medicine?.quantity ?? 0);

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        type: "out",
      };
    }

    if (stock <= 50) {
      return {
        label: "Low Stock",
        type: "low",
      };
    }

    return {
      label: "Ready",
      type: "ready",
    };
  };

  const pendingCount = useMemo(() => {
    return prescriptions
      .flatMap((prescription) => prescription.items || [])
      .filter((item) => !item.isGiven).length;
  }, [prescriptions]);

  const givenCount = useMemo(() => {
    return prescriptions
      .flatMap((prescription) => prescription.items || [])
      .filter((item) => item.isGiven).length;
  }, [prescriptions]);

  const filteredPrescriptions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return prescriptions
      .map((prescription) => {
        const filteredItems = (prescription.items || []).filter(
          (item) => {
            const patientName =
              getPatientName(prescription).toLowerCase();

            const medicineName =
              getMedicineName(item.medicine).toLowerCase();

            const matchesSearch =
              !searchTerm ||
              patientName.includes(searchTerm) ||
              medicineName.includes(searchTerm);

            const matchesFilter =
              filter === "Pending"
                ? !item.isGiven
                : item.isGiven;

            return matchesSearch && matchesFilter;
          },
        );

        return {
          ...prescription,
          filteredItems,
        };
      })
      .filter(
        (prescription) =>
          prescription.filteredItems.length > 0,
      );
  }, [prescriptions, search, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPrescriptions.length / ITEMS_PER_PAGE,
    ),
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const displayedPrescriptions =
    filteredPrescriptions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

  const startDisplay =
    filteredPrescriptions.length === 0
      ? 0
      : startIndex + 1;

  const endDisplay = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredPrescriptions.length,
  );

  const togglePatient = (id) => {
    setExpandedPatients((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const renderStockBadge = (medicine) => {
    const stock = getStockStatus(medicine);

    if (stock.type === "out") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-critical-bg px-3 py-1.5 text-xs font-semibold text-status-critical-text">
          <XCircle size={14} />
          Out of Stock
        </span>
      );
    }

    if (stock.type === "low") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-watch-bg px-3 py-1.5 text-xs font-semibold text-status-watch-text">
          <AlertTriangle size={14} />
          Low Stock
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-status-stable-bg px-3 py-1.5 text-xs font-semibold text-status-stable-text">
        <CheckCircle2 size={14} />
        Ready
      </span>
    );
  };

  const renderAction = (prescription, item) => {
  if (item.isGiven) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-status-stable-bg px-3 py-1.5 text-xs font-semibold text-status-stable-text">
        <CheckCircle2 size={14} />
        Given
      </span>
    );
  }

  const stock = Number(item.medicine?.quantity ?? 0);
  const requiredQuantity = Number(item.quantity ?? 0);

  // Completely out of stock
  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-text-subtle"
      >
        Out of Stock
      </button>
    );
  }

  // Stock exists, but it is not enough for this prescription
  if (stock < requiredQuantity) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-text-subtle"
      >
        Insufficient Stock
      </button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={() =>
        setConfirmState({
          message: "Mark this prescription as given?",
          onConfirm: () =>
            handleMarkAsGiven(
              prescription._id,
              item._id,
            ),
        })
      }
    >
      Mark as Given
    </Button>
  );
};

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Package size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Prescription Queue
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Manage prescriptions and medicine distribution.
            </p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                Prescriptions in Queue
              </p>

              <p className="mt-2 text-3xl font-extrabold text-text-primary">
                {pendingCount}
              </p>

              <p className="mt-1 text-xs text-text-subtle">
                Waiting to be released
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-watch-bg text-status-watch-text">
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                Prescriptions Given
              </p>

              <p className="mt-2 text-3xl font-extrabold text-text-primary">
                {givenCount}
              </p>

              <p className="mt-1 text-xs text-text-subtle">
                Successfully released
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-stable-bg text-status-stable-text">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient or medicine..."
            className="w-full rounded-xl border border-border-strong bg-surface py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setFilter("Pending")}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              filter === "Pending"
                ? "bg-surface text-primary-700 shadow-sm"
                : "text-text-muted hover:text-slate-700"
            }`}
          >
            Pending
          </button>

          <button
            type="button"
            onClick={() => setFilter("Given")}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              filter === "Given"
                ? "bg-surface text-primary-700 shadow-sm"
                : "text-text-muted hover:text-slate-700"
            }`}
          >
            Given
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <h3 className="text-base font-bold text-text-primary">
            {filter === "Pending"
              ? "Prescriptions In Queue"
              : "Prescriptions Given"}
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            {filteredPrescriptions.length} prescription
            {filteredPrescriptions.length === 1
              ? ""
              : "s"} found
          </p>
        </div>

        {loading ? (
          <TableSkeleton
            rows={8}
            columns={7}
          />
        ) : filteredPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-text-subtle">
              <Package size={26} />
            </div>

            <h4 className="mt-4 font-semibold text-text-primary">
              No prescriptions found
            </h4>

            <p className="mt-1 text-sm text-text-muted">
              {search
                ? "Try changing your search."
                : filter === "Pending"
                  ? "There are currently no pending prescriptions."
                  : "No prescriptions have been marked as given."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-border bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Medicine
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Dosage
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Prescribed By
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-soft">
                  {displayedPrescriptions.map(
                    (prescription) => {
                      const items =
                        prescription.filteredItems;

                      const patientName =
                        getPatientName(
                          prescription,
                        );

                      const hasMultiple =
                        items.length > 1;

                      if (!hasMultiple) {
                        const item = items[0];

                        return (
                          <tr
                            key={`${prescription._id}-${item._id}`}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-4 font-semibold text-text-primary">
                              {patientName}
                            </td>

                            <td className="px-6 py-4">
                              <div className="font-medium text-text-primary">
                                {getMedicineName(
                                  item.medicine,
                                )}
                              </div>

                              {item.directions && (
                                <div className="mt-1 max-w-xs truncate text-xs text-text-subtle">
                                  {item.directions}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-text-secondary">
                              {item.medicine?.dosage ??
                                "-"}
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                              {item.quantity}
                            </td>

                            <td className="px-6 py-4 text-sm text-text-secondary">
                              {prescription.doctor?.name ||
                                "Unknown Doctor"}
                            </td>

                            <td className="px-6 py-4">
                              {renderStockBadge(
                                item.medicine,
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {renderAction(
                                prescription,
                                item,
                              )}
                            </td>
                          </tr>
                        );
                      }

                      const isExpanded =
                        !!expandedPatients[
                          prescription._id
                        ];

                      return (
                        <tr
                          key={prescription._id}
                          className="bg-surface"
                        >
                          <td
                            colSpan={7}
                            className="p-0"
                          >
                            {/* PARENT ROW */}

                            <button
                              type="button"
                              onClick={() =>
                                togglePatient(
                                  prescription._id,
                                )
                              }
                              className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-slate-50"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                                {isExpanded ? (
                                  <ChevronDown
                                    size={17}
                                  />
                                ) : (
                                  <ChevronRight
                                    size={17}
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-text-primary">
                                  {patientName}
                                </p>

                                <p className="mt-1 text-xs text-text-muted">
                                  {items.length} medicines
                                </p>
                              </div>

                              <div className="hidden text-sm text-text-muted sm:block">
                                Prescribed by{" "}
                                <span className="font-medium text-slate-700">
                                  {prescription.doctor?.name ||
                                    "Unknown Doctor"}
                                </span>
                              </div>
                            </button>

                            {/* EXPANDED MEDICINES */}

                            {isExpanded && (
                              <div className="border-t border-border-soft bg-slate-50/70">
                                {items.map(
                                  (item) => (
                                    <div
                                      key={item._id}
                                      className="grid gap-4 border-b border-border-soft px-6 py-4 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto]"
                                    >
                                      <div className="pl-12">
                                        <p className="font-medium text-text-primary">
                                          {getMedicineName(
                                            item.medicine,
                                          )}
                                        </p>

                                        {item.directions && (
                                          <p className="mt-1 text-xs text-text-muted">
                                            {item.directions}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <span className="text-xs text-text-subtle">
                                          Qty
                                        </span>
                                        <span className="font-semibold">
                                          {item.quantity}
                                        </span>
                                      </div>

                                      <div>
                                        {renderStockBadge(
                                          item.medicine,
                                        )}
                                      </div>

                                      <div className="flex justify-end">
                                        {renderAction(
                                          prescription,
                                          item,
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-muted">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {startDisplay}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {endDisplay}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {filteredPrescriptions.length}
                </span>
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1,
                    )
                  }
                >
                  Previous
                </Button>

                <div className="flex items-center rounded-xl border border-border px-4 text-sm font-semibold text-slate-700">
                  {currentPage} / {totalPages}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1,
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CONFIRM */}

      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={confirmState.onConfirm}
          onCancel={() =>
            setConfirmState(null)
          }
        />
      )}

      {/* ALERT */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() =>
            setAlertMessage("")
          }
        />
      )}
    </div>
  );
}

export default PharmacyQueue;