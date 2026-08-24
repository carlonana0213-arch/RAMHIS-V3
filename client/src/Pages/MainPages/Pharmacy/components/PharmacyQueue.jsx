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

import {
  dashboardCardVariants,
  dashboardBadgeVariants,
} from "../../../../ui/variants";

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
      console.error(
        "Failed to mark prescription as given:",
        error,
      );

      setConfirmState(null);

      setAlertMessage(
        error.message ||
          "Failed to mark prescription as given.",
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
      .flatMap(
        (prescription) =>
          prescription.items || [],
      )
      .filter((item) => !item.isGiven).length;
  }, [prescriptions]);

  const givenCount = useMemo(() => {
    return prescriptions
      .flatMap(
        (prescription) =>
          prescription.items || [],
      )
      .filter((item) => item.isGiven).length;
  }, [prescriptions]);

  const filteredPrescriptions = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return prescriptions
      .map((prescription) => {
        const filteredItems =
          (prescription.items || []).filter(
            (item) => {
              const patientName =
                getPatientName(
                  prescription,
                ).toLowerCase();

              const medicineName =
                getMedicineName(
                  item.medicine,
                ).toLowerCase();

              const matchesSearch =
                !searchTerm ||
                patientName.includes(
                  searchTerm,
                ) ||
                medicineName.includes(
                  searchTerm,
                );

              const matchesFilter =
                filter === "Pending"
                  ? !item.isGiven
                  : item.isGiven;

              return (
                matchesSearch &&
                matchesFilter
              );
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

  const groupedByPatient = useMemo(() => {
  const map = new Map();

  filteredPrescriptions.forEach((prescription) => {
    const patientId =
      prescription?.patient?._id ||
      prescription?.patient?.id ||
      prescription?.patientId ||
      getPatientName(prescription);

    const patientName =
      getPatientName(prescription);

    const itemsWithPrescriptionData =
      prescription.filteredItems.map((item) => ({
        ...item,
        prescriptionId: prescription._id,
        doctorName:
          prescription.doctor?.name ||
          "Unknown Doctor",
      }));

    if (!map.has(patientId)) {
      map.set(patientId, {
        patientId,
        patientName,
        items: itemsWithPrescriptionData,
      });
    } else {
      map.get(patientId).items.push(
        ...itemsWithPrescriptionData,
      );
    }
  });

  return Array.from(map.values());
}, [filteredPrescriptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  


  const totalPages = Math.max(
    1,
    Math.ceil(
      groupedByPatient.length /
        ITEMS_PER_PAGE,
    ),
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const displayedGroups =
    groupedByPatient.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );

  const startDisplay =
    groupedByPatient.length === 0
      ? 0
      : startIndex + 1;

  const endDisplay = Math.min(
    startIndex + ITEMS_PER_PAGE,
    groupedByPatient.length,
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-critical-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-status-critical-text">
          <XCircle size={13} />
          Out of Stock
        </span>
      );
    }

    if (stock.type === "low") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-watch-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-status-watch-text">
          <AlertTriangle size={13} />
          Low Stock
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-status-stable-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-status-stable-text">
        <CheckCircle2 size={13} />
        Ready
      </span>
    );
  };

  const renderAction = (
    prescription,
    item,
  ) => {
    if (item.isGiven) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-stable-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-status-stable-text">
          <CheckCircle2 size={13} />
          Given
        </span>
      );
    }

    const stock = Number(
      item.medicine?.quantity ?? 0,
    );

    const requiredQuantity = Number(
      item.quantity ?? 0,
    );

    if (stock <= 0) {
      return (
        <span className="inline-flex cursor-not-allowed items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-text-subtle">
          Out of Stock
        </span>
      );
    }

    if (stock < requiredQuantity) {
      return (
        <span className="inline-flex cursor-not-allowed items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-text-subtle">
          Insufficient Stock
        </span>
      );
    }

    return (
      <Button
        size="sm"
        onClick={() =>
  setConfirmState({
    message:
      "Mark this prescription as given?",
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
    <section className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

        <div>
          <div className="mb-2 flex items-center gap-2">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-stable-dot opacity-40" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-stable-dot" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Medicine Distribution
            </span>

          </div>

          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
            Pharmacy Queue
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Manage prescription fulfillment and
            medicine distribution.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Package size={20} />
          </div>

          <div className="rounded-2xl border border-border-soft bg-surface px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">

            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Queue Status
            </span>

            <strong className="mt-0.5 block text-sm font-semibold text-primary-900">
              {pendingCount.toLocaleString()} Pending
            </strong>

          </div>

        </div>

      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div
          className={`${dashboardCardVariants.base} relative overflow-hidden rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Prescriptions in Queue
              </span>

              <p className="mt-3 text-3xl font-bold tracking-tight text-primary-900">
                {pendingCount.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-text-subtle">
                Waiting to be released
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-status-watch-bg text-status-watch-text">
              <Clock3 size={19} />
            </div>

          </div>
        </div>

        <div
          className={`${dashboardCardVariants.base} relative overflow-hidden rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Prescriptions Given
              </span>

              <p className="mt-3 text-3xl font-bold tracking-tight text-primary-900">
                {givenCount.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-text-subtle">
                Successfully released
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-status-stable-bg text-status-stable-text">
              <CheckCircle2 size={19} />
            </div>

          </div>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div
        className={`${dashboardCardVariants.base} flex flex-col gap-4 rounded-[20px] border-0 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between`}
      >

        <div className="relative w-full lg:max-w-md">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient or medicine..."
            className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 pl-11 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />

        </div>

        <div className="flex w-full rounded-xl bg-surface-muted p-1 sm:w-auto">

          <button
            type="button"
            onClick={() =>
              setFilter("Pending")
            }
            className={`flex-1 rounded-lg px-5 py-2.5 text-xs font-bold transition sm:flex-none ${
              filter === "Pending"
                ? "bg-surface text-primary-700 shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Pending
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter("Given")
            }
            className={`flex-1 rounded-lg px-5 py-2.5 text-xs font-bold transition sm:flex-none ${
              filter === "Given"
                ? "bg-surface text-primary-700 shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Given
          </button>

        </div>

      </div>

      {/* QUEUE TABLE */}
      <div
        className={`${dashboardCardVariants.base} overflow-hidden rounded-[20px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
      >

        {/* TABLE HEADER */}
        <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
              Prescription Records
            </span>

            <h3 className="text-lg font-bold tracking-tight text-primary-900">
              {filter === "Pending"
                ? "Prescriptions in Queue"
                : "Released Prescriptions"}
            </h3>

            <p className="mt-1 text-xs text-text-muted">
  {groupedByPatient.length.toLocaleString()}{" "}
  patient
  {groupedByPatient.length === 1 ? "" : "s"} found
</p>
          </div>

          <span
            className={`${dashboardBadgeVariants.base} ${
              filter === "Pending"
                ? dashboardBadgeVariants.overview
                : dashboardBadgeVariants.stable
            } self-start sm:self-auto`}
          >
            {filter}
          </span>

        </div>

        {loading ? (
          <TableSkeleton
            rows={8}
            columns={7}
          />
        ) : groupedByPatient.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-subtle">
              <Package size={25} />
            </div>

            <h4 className="mt-5 text-base font-bold text-text-primary">
              No prescriptions found
            </h4>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
              {search
                ? "Try changing your search or use a different keyword."
                : filter === "Pending"
                  ? "There are currently no pending prescriptions waiting for release."
                  : "No prescriptions have been marked as given yet."}
            </p>

          </div>

        ) : (
          <>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>
                  <tr className="border-b border-border-soft bg-surface-muted">

                    {[
                      "Patient",
                      "Medicine",
                      "Dosage",
                      "Quantity",
                      "Prescribed By",
                      "Stock",
                    ].map((column) => (
                      <th
                        key={column}
                        className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted"
                      >
                        {column}
                      </th>
                    ))}

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-border-soft">

                  {displayedGroups.map((group) => {
  const items = group.items;
  const patientName = group.patientName;

                      

                      const hasMultiple =
                        items.length > 1;

                      /* SINGLE MEDICINE */
                      if (!hasMultiple) {
                        const item = items[0];

                        return (
                          <tr
                            key={`${group.patientId}-${item._id}`}
                            className="transition-colors hover:bg-slate-50/80"
                          >

                            <td className="px-6 py-5">
                              <p className="font-semibold text-text-primary">
                                {patientName}
                              </p>
                            </td>

                            <td className="px-6 py-5">

                              <div className="font-medium text-text-primary">
                                {getMedicineName(
                                  item.medicine,
                                )}
                              </div>

                              {item.directions && (
                                <p className="mt-1 max-w-xs truncate text-xs text-text-subtle">
                                  {item.directions}
                                </p>
                              )}

                            </td>

                            <td className="px-6 py-5 text-sm text-text-secondary">
                              {item.medicine?.dosage ??
                                "-"}
                            </td>

                            <td className="px-6 py-5">
                              <span className="font-semibold text-primary-900">
                                {item.quantity}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-sm text-text-secondary">
                              {items[0]?.doctorName ||
  "Unknown Doctor"}
                            </td>

                            <td className="px-6 py-5">
                              {renderStockBadge(
                                item.medicine,
                              )}
                            </td>

                            <td className="px-6 py-5 text-right">
                              {renderAction(
  { _id: item.prescriptionId },
  item,
)}
                            </td>

                          </tr>
                        );
                      }

                      /* MULTIPLE MEDICINES */
                      const isExpanded =
                        !!expandedPatients[
                          group.patientId
                        ];

                      return (
                        <tr
                          key={group.patientId}
                          className="bg-surface"
                        >
                          <td
                            colSpan={7}
                            className="p-0"
                          >

                            <button
                              type="button"
                              onClick={() =>
                                togglePatient(
                                  group.patientId,
                                )
                              }
                              className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-50/80"
                            >

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">

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
                                  {items.length} medicines prescribed
                                </p>

                              </div>

                              <div className="hidden text-right sm:block">

                                <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">
                                  Prescribed by
                                </span>

                                <span className="mt-1 block text-sm font-medium text-text-secondary">
                                  {items[0]?.doctorName ||
  "Unknown Doctor"}
                                </span>

                              </div>

                            </button>

                            {isExpanded && (

                              <div className="border-t border-border-soft bg-surface-muted/60">

                                {items.map(
                                  (item) => (

                                    <div
                                      key={item._id}
                                      className="grid gap-4 border-b border-border-soft px-6 py-5 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto]"
                                    >

                                      <div className="pl-12">

                                        <p className="font-semibold text-text-primary">
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

                                      <div className="flex items-center gap-2">

                                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">
                                          Qty
                                        </span>

                                        <span className="font-semibold text-primary-900">
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
  { _id: item.prescriptionId },
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
            <div className="flex flex-col gap-4 border-t border-border-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-text-muted">
                Showing{" "}

                <span className="font-semibold text-text-secondary">
                  {startDisplay}
                </span>

                {" "}to{" "}

                <span className="font-semibold text-text-secondary">
                  {endDisplay}
                </span>

                {" "}of{" "}

                <span className="font-semibold text-text-secondary">
                  {groupedByPatient.length}
                </span>

                {" "}records
              </p>

              <div className="flex items-center gap-2">

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

                <div className="flex h-9 min-w-[72px] items-center justify-center rounded-xl border border-border-soft bg-surface px-3 text-xs font-bold text-primary-900">
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

      {/* CONFIRM MODAL */}
      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={
            confirmState.onConfirm
          }
          onCancel={() =>
            setConfirmState(null)
          }
        />
      )}

      {/* ALERT MODAL */}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() =>
            setAlertMessage("")
          }
        />
      )}

    </section>
  );
}

export default PharmacyQueue;