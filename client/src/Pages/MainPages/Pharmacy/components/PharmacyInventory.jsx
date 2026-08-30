import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Package,
  AlertTriangle,
  Pill,
} from "lucide-react";

import {
  getMedicines,
  addMedicine,
  deleteMedicine,
  updateMedicine,
} from "../../../../Services/pharmacyService";

import Button from "../../../../Components/ui/button";
import Input from "../../../../Components/ui/input";
import ConfirmModal from "../../../../Components/ui/ConfirmModal";
import AlertModal from "../../../../Components/ui/AlertModal";
import TableSkeleton from "../../../../Components/ui/TableSkeleton";

import {
  dashboardCardVariants,
  dashboardBadgeVariants,
  statusPillVariants,
} from "../../../../ui/variants";

function PharmacyInventory() {
  const [medicines, setMedicines] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dosage, setDosage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const loadMedicines = async () => {
    try {
      setLoading(true);

      const data = await getMedicines();

      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load medicines:", error);

      setAlertMessage(
        error.message ||
          "Failed to load pharmacy inventory.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      setAlertMessage(
        "Please enter a medicine name.",
      );
      return;
    }

    if (
      quantity === "" ||
      Number(quantity) < 0
    ) {
      setAlertMessage(
        "Please enter a valid quantity.",
      );
      return;
    }

    try {
      setSaving(true);

      await addMedicine({
        names: [name.trim()],
        quantity: Number(quantity),
        dosage: Number(dosage) || 0,
      });

      setName("");
      setQuantity("");
      setDosage("");

      await loadMedicines();

      setAlertMessage(
        "Medicine added successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to add medicine:",
        error,
      );

      setAlertMessage(
        error.message ||
          "Failed to add medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);

      await deleteMedicine(
        deleteTarget._id,
      );

      setDeleteTarget(null);

      await loadMedicines();

      setAlertMessage(
        "Medicine deleted successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to delete medicine:",
        error,
      );

      setAlertMessage(
        error.message ||
          "Failed to delete medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (medicine) => {
    setEditingId(medicine._id);

    setEditQuantity(
      medicine.quantity ?? 0,
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity("");
  };

  const handleUpdate = async (id) => {
    if (
      editQuantity === "" ||
      Number(editQuantity) < 0
    ) {
      setAlertMessage(
        "Please enter a valid quantity.",
      );
      return;
    }

    try {
      setSaving(true);

      await updateMedicine(id, {
        quantity: Number(editQuantity),
      });

      handleCancelEdit();

      await loadMedicines();

      setAlertMessage(
        "Medicine stock updated successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to update medicine:",
        error,
      );

      setAlertMessage(
        error.message ||
          "Failed to update medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getMedicineName = (medicine) => {
    if (Array.isArray(medicine.names)) {
      return medicine.names.join(", ");
    }

    return (
      medicine.name ||
      "Unnamed Medicine"
    );
  };

  const totalMedicines =
    medicines.length;

  const lowStockCount =
    medicines.filter(
      (medicine) =>
        Number(
          medicine.quantity,
        ) < 10,
    ).length;

  const totalStock =
    medicines.reduce(
      (total, medicine) =>
        total +
        Number(
          medicine.quantity || 0,
        ),
      0,
    );

return (
  <div className="min-h-full w-full px-4 py-5 pb-6 text-text-primary sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
    <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-5">

      {/* HEADER */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
    <div className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <Package size={21} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Pharmacy Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
              Medicine Inventory
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Manage medicine stocks and monitor inventory availability.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <span
            className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
          >
            {totalMedicines.toLocaleString()} Medicines
          </span>

          {lowStockCount > 0 && (
            <span
              className={`${statusPillVariants.base} ${statusPillVariants.watch}`}
            >
              {lowStockCount} Low Stock
            </span>
          )}
        </div>
      </header>

      {/* =========================
          INVENTORY METRICS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* TOTAL MEDICINES */}

        <div
          className={`${dashboardCardVariants.base} min-w-0 rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-xs font-semibold text-text-muted">
                Total Medicines
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-primary-900">
                {totalMedicines.toLocaleString()}
              </p>

              <p className="mt-2 text-[11px] text-text-subtle">
                Medicine types available
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <Package size={19} />
            </div>

          </div>
        </div>

        {/* TOTAL STOCK */}

        <div
          className={`${dashboardCardVariants.base} min-w-0 rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-xs font-semibold text-text-muted">
                Total Stock
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-primary-900">
                {totalStock.toLocaleString()}
              </p>

              <p className="mt-2 text-[11px] text-text-subtle">
                Total units currently available
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Pill size={19} />
            </div>

          </div>
        </div>

        {/* LOW STOCK */}

        <div
          className={`${dashboardCardVariants.base} min-w-0 rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-xs font-semibold text-text-muted">
                Low Stock Alerts
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-status-watch-text">
                {lowStockCount.toLocaleString()}
              </p>

              <p className="mt-2 text-[11px] text-text-subtle">
                Medicines below 10 units
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-status-watch-bg text-status-watch-text">
              <AlertTriangle size={19} />
            </div>

          </div>
        </div>

      </div>

      {/* =========================
          ADD MEDICINE
      ========================= */}

      <div
        className={`${dashboardCardVariants.base} rounded-[20px] border-0 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-6`}
      >

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
              Inventory Control
            </span>

            <h3 className="text-lg font-bold text-primary-900">
              Add Medicine
            </h3>

            <p className="mt-1 text-sm text-text-muted">
              Register a new medicine and its
              available stock.
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Plus size={19} />
          </div>

        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto] lg:items-end">

          <Input
            label="Medicine Name"
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <Input
            label="Quantity"
            type="number"
            min="0"
            placeholder="0"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

          <Input
            label="Dosage"
            type="number"
            min="0"
            placeholder="0"
            value={dosage}
            onChange={(e) =>
              setDosage(e.target.value)
            }
          />

          <Button
            leftIcon={<Plus size={18} />}
            loading={saving}
            onClick={handleAdd}
            className="h-[46px] whitespace-nowrap"
          >
            Add Medicine
          </Button>

        </div>

      </div>

      {/* =========================
          INVENTORY TABLE
      ========================= */}

      {loading ? (
        <div
          className={`${dashboardCardVariants.base} overflow-hidden rounded-[20px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >
          <TableSkeleton
            rows={6}
            columns={4}
          />
        </div>
      ) : (
        <div
          className={`${dashboardCardVariants.base} overflow-hidden rounded-[20px] border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)]`}
        >

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Stock Monitoring
              </span>

              <h3 className="text-lg font-bold text-primary-900">
                Medicine Stock
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                View and update available medicine
                quantities.
              </p>
            </div>

            <span
              className={`${statusPillVariants.base} ${statusPillVariants.stable}`}
            >
              {totalMedicines.toLocaleString()} Items
            </span>

          </div>

          {medicines.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-700">
                <Package size={27} />
              </div>

              <h4 className="mt-5 text-base font-bold text-primary-900">
                No medicines found
              </h4>

              <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                Your pharmacy inventory is currently
                empty. Add a medicine above to start
                building the inventory.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead>
                  <tr className="border-b border-border-soft bg-surface-muted">

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Medicine
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Dosage
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-border-soft">

                  {medicines.map(
                    (medicine) => {
                      const quantityValue =
                        Number(
                          medicine.quantity ?? 0,
                        );

                      const isLowStock =
                        quantityValue < 10;

                      return (
                        <tr
                          key={medicine._id}
                          className="transition-colors hover:bg-slate-50/80"
                        >

                          {/* MEDICINE */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                                <Pill size={18} />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-text-primary">
                                  {getMedicineName(
                                    medicine,
                                  )}
                                </p>

                                {isLowStock ? (
                                  <div className="mt-1 flex items-center gap-1.5">

                                    <span className="h-1.5 w-1.5 rounded-full bg-status-watch-dot" />

                                    <span className="text-[11px] font-medium text-status-watch-text">
                                      Low stock
                                    </span>

                                  </div>
                                ) : (
                                  <div className="mt-1 flex items-center gap-1.5">

                                    <span className="h-1.5 w-1.5 rounded-full bg-status-stable-dot" />

                                    <span className="text-[11px] font-medium text-text-subtle">
                                      Available
                                    </span>

                                  </div>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* QUANTITY */}

                          <td className="px-6 py-4">

                            {editingId ===
                            medicine._id ? (
                              <input
                                type="number"
                                min="0"
                                value={
                                  editQuantity
                                }
                                onChange={(e) =>
                                  setEditQuantity(
                                    e.target.value,
                                  )
                                }
                                className="w-28 rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-text-primary outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                              />
                            ) : (
                              <div>

                                <p
                                  className={`text-lg font-bold ${
                                    isLowStock
                                      ? "text-status-watch-text"
                                      : "text-primary-900"
                                  }`}
                                >
                                  {quantityValue.toLocaleString()}
                                </p>

                                <p className="mt-0.5 text-[10px] text-text-subtle">
                                  units available
                                </p>

                              </div>
                            )}

                          </td>

                          {/* DOSAGE */}

                          <td className="px-6 py-4">

                            <div className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-text-secondary">
                              {medicine.dosage ?? 0}
                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              {editingId ===
                              medicine._id ? (
                                <>

                                  <Button
                                    size="sm"
                                    leftIcon={
                                      <Save size={15} />
                                    }
                                    loading={
                                      saving
                                    }
                                    onClick={() =>
                                      handleUpdate(
                                        medicine._id,
                                      )
                                    }
                                  >
                                    Save
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    leftIcon={
                                      <X size={15} />
                                    }
                                    onClick={
                                      handleCancelEdit
                                    }
                                    disabled={
                                      saving
                                    }
                                  >
                                    Cancel
                                  </Button>

                                </>
                              ) : (
                                <>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    leftIcon={
                                      <Pencil
                                        size={15}
                                      />
                                    }
                                    onClick={() =>
                                      handleStartEdit(
                                        medicine,
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="danger"
                                    leftIcon={
                                      <Trash2
                                        size={15}
                                      />
                                    }
                                    onClick={() =>
                                      setDeleteTarget(
                                        medicine,
                                      )
                                    }
                                  >
                                    Delete
                                  </Button>

                                </>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    },
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${getMedicineName(
            deleteTarget,
          )}" from the inventory?`}
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteTarget(null)
          }
        />
      )}

      {/* =========================
          ALERT
      ========================= */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() =>
            setAlertMessage("")
          }
        />
      )}
    </div>
    </div>
  );
}

export default PharmacyInventory;