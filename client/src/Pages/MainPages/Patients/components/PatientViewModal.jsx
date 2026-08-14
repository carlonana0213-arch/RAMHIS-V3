import { useState } from "react";

import Registry from "../Registry";

import { updatePatient } from "../../../../Services/patientService";

export default function PatientViewModal({
  patient,
  onClose,
}) {
  const [isPriority, setIsPriority] = useState(
    patient?.isPriority || false
  );

  if (!patient) return null;

  const handlePriorityToggle = async () => {
    try {
      const updatedPriority = !isPriority;

      await updatePatient(patient._id, {
        isPriority: updatedPriority,
      });

      setIsPriority(updatedPriority);
    } catch (err) {
      console.error(
        "Failed to update patient priority:",
        err
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Patient Record
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {patient.generalInfo?.name ||
                "Unnamed Patient"}
            </p>
          </div>

          <div className="flex items-center gap-5">

            {/* PRIORITY */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  isPriority
                    ? "text-red-600"
                    : "text-slate-500"
                }`}
              >
                {isPriority
                  ? "Priority Patient"
                  : "Regular Patient"}
              </span>

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isPriority}
                  onChange={handlePriorityToggle}
                />

                <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-red-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-200">
                  <div className="absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close patient record"
            >
              ×
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Registry
            patientIdFromQueue={patient._id}
          />
        </div>

      </div>
    </div>
  );
}