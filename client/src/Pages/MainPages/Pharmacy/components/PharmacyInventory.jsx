import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Package,
  AlertTriangle,
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
        error.message || "Failed to load pharmacy inventory.",
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
      setAlertMessage("Please enter a medicine name.");
      return;
    }

    if (quantity === "" || Number(quantity) < 0) {
      setAlertMessage("Please enter a valid quantity.");
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

      setAlertMessage("Medicine added successfully.");
    } catch (error) {
      console.error("Failed to add medicine:", error);

      setAlertMessage(
        error.message || "Failed to add medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);

      await deleteMedicine(deleteTarget._id);

      setDeleteTarget(null);

      await loadMedicines();

      setAlertMessage("Medicine deleted successfully.");
    } catch (error) {
      console.error("Failed to delete medicine:", error);

      setAlertMessage(
        error.message || "Failed to delete medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (medicine) => {
    setEditingId(medicine._id);
    setEditQuantity(medicine.quantity ?? 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity("");
  };

  const handleUpdate = async (id) => {
    if (editQuantity === "" || Number(editQuantity) < 0) {
      setAlertMessage("Please enter a valid quantity.");
      return;
    }

    try {
      setSaving(true);

      await updateMedicine(id, {
        quantity: Number(editQuantity),
      });

      handleCancelEdit();

      await loadMedicines();

      setAlertMessage("Medicine stock updated successfully.");
    } catch (error) {
      console.error("Failed to update medicine:", error);

      setAlertMessage(
        error.message || "Failed to update medicine.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getMedicineName = (medicine) => {
    if (Array.isArray(medicine.names)) {
      return medicine.names.join(", ");
    }

    return medicine.name || "Unnamed Medicine";
  };

  const totalMedicines = medicines.length;

  const lowStockCount = medicines.filter(
    (medicine) => Number(medicine.quantity) < 10,
  ).length;

  return (
    <div className="space-y-6">
      {/* =========================
          INVENTORY HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Pharmacy Inventory
              </h2>

              <p className="text-sm text-text-muted">
                Manage medicine stocks and availability.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium text-text-muted">
              Total Medicines
            </p>

            <p className="mt-1 text-xl font-bold text-text-primary">
              {totalMedicines}
            </p>
          </div>

          <div className="rounded-xl border border-status-watch-border bg-status-watch-bg px-4 py-3">
            <p className="text-xs font-medium text-status-watch-text">
              Low Stock
            </p>

            <p className="mt-1 text-xl font-bold text-amber-800">
              {lowStockCount}
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          ADD MEDICINE
      ========================= */}

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-bold text-text-primary">
            Add Medicine
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Add a new medicine to the pharmacy inventory.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Medicine Name"
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Quantity"
            type="number"
            min="0"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Input
            label="Dosage"
            type="number"
            min="0"
            placeholder="Enter dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            leftIcon={<Plus size={18} />}
            loading={saving}
            onClick={handleAdd}
          >
            Add Medicine
          </Button>
        </div>
      </div>

      {/* =========================
          INVENTORY TABLE
      ========================= */}

      {loading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h3 className="text-base font-bold text-text-primary">
              Medicine Stock
            </h3>

            <p className="mt-1 text-sm text-text-muted">
              View and update available medicine quantities.
            </p>
          </div>

          {medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-text-subtle">
                <Package size={26} />
              </div>

              <h4 className="mt-4 font-semibold text-text-primary">
                No medicines found
              </h4>

              <p className="mt-1 text-sm text-text-muted">
                Add a medicine above to start building the inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Medicine
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                      Dosage
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-soft">
                  {medicines.map((medicine) => {
                    const quantityValue = Number(
                      medicine.quantity ?? 0,
                    );

                    const isLowStock = quantityValue < 10;

                    return (
                      <tr
                        key={medicine._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* MEDICINE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                              <Package size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-text-primary">
                                {getMedicineName(medicine)}
                              </p>

                              {isLowStock && (
                                <div className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                                  <AlertTriangle size={13} />
                                  Low stock
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* QUANTITY */}

                        <td className="px-6 py-4">
                          {editingId === medicine._id ? (
                            <input
                              type="number"
                              min="0"
                              value={editQuantity}
                              onChange={(e) =>
                                setEditQuantity(e.target.value)
                              }
                              className="w-28 rounded-lg border border-border-strong px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />
                          ) : (
                            <span
                              className={`font-bold ${
                                isLowStock
                                  ? "text-status-watch-text"
                                  : "text-text-primary"
                              }`}
                            >
                              {quantityValue}
                            </span>
                          )}
                        </td>

                        {/* DOSAGE */}

                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {medicine.dosage ?? 0}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {editingId === medicine._id ? (
                              <>
                                <Button
                                  size="sm"
                                  leftIcon={<Save size={15} />}
                                  loading={saving}
                                  onClick={() =>
                                    handleUpdate(medicine._id)
                                  }
                                >
                                  Save
                                </Button>

                                <Button
                                  size="sm"
                                  variant="secondary"
                                  leftIcon={<X size={15} />}
                                  onClick={handleCancelEdit}
                                  disabled={saving}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  leftIcon={<Pencil size={15} />}
                                  onClick={() =>
                                    handleStartEdit(medicine)
                                  }
                                >
                                  Edit
                                </Button>

                                <Button
                                  size="sm"
                                  variant="danger"
                                  leftIcon={<Trash2 size={15} />}
                                  onClick={() =>
                                    setDeleteTarget(medicine)
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
                  })}
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
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* =========================
          ALERT
      ========================= */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
}

export default PharmacyInventory;