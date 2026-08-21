const HISTORY_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Cancer",
  "Stroke",
  "Epilepsy",
  "Tuberculosis",
  "Other",
];

const MedicalStep = ({ form, setForm }) => {
  const medicalHistory = form.medicalHistory || [];

  const toggle = (value) => {
    setForm((prev) => ({
      ...prev,
      medicalHistory: (
        prev.medicalHistory || []
      ).includes(value)
        ? (prev.medicalHistory || []).filter(
            (v) => v !== value,
          )
        : [
            ...(prev.medicalHistory || []),
            value,
          ],
    }));
  };

  return (
    <div className="step-container">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Medical Background
          </p>

          <h3 className="mt-1 text-xl font-bold text-text-primary">
            Medical History
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Select the patient's known medical conditions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {HISTORY_OPTIONS.map((option) => {
            const active =
              medicalHistory.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-blue-700 bg-primary-700 text-white shadow-sm"
                    : "border-border bg-slate-50 text-text-secondary hover:border-blue-300 hover:bg-primary-50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {medicalHistory.includes("Other") && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-primary-50 p-4">
            <p className="mb-2 text-sm font-semibold text-blue-900">
              Other medical condition
            </p>

            <input
              value={form.medicalOther || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  medicalOther: e.target.value,
                }))
              }
              placeholder="Specify other medical condition..."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalStep;