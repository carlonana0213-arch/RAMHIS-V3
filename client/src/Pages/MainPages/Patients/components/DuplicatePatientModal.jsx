const DuplicatePatientModal = ({
  patient,
  onReuse,
  onUpdate,
  onCreateNew,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          Patient already exists
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="text-base font-semibold text-gray-900">
            {patient?.generalInfo?.name || "Unknown patient"}
          </p>

          <p>
            {patient?.generalInfo?.age ?? "—"} yrs •{" "}
            {patient?.generalInfo?.sex || "—"}
          </p>

          <p>
            Last Updated:{" "}
            {patient?.updatedAt
              ? new Date(patient.updatedAt).toLocaleDateString()
              : "Unknown"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onReuse}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Keep Old Record & Add To Queue
          </button>

          <button
            type="button"
            onClick={onUpdate}
            className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700"
          >
            Update Existing Information
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Create New Patient Anyway
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicatePatientModal;