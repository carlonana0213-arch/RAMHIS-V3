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

const FamilyStep = ({ form, setForm }) => {
  const familyHistory = form.familyHistory || [];

  const toggle = (value) => {
    setForm((prev) => {
      const current = prev.familyHistory || [];

      return {
        ...prev,
        familyHistory: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  return (
    <div className="step-wrapper">
      <div className="rounded-[20px] border border-border-soft bg-surface p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-6">

        {/* HEADER */}
        <div className="mb-7">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Step 3 · Medical Background
          </span>

          <h3 className="text-xl font-bold tracking-tight text-primary-900">
            Family History
          </h3>

          <p className="mt-2 text-sm text-text-muted">
            Select all conditions known to be present in the patient's family.
          </p>
        </div>

        {/* OPTIONS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {HISTORY_OPTIONS.map((option) => {
            const active = familyHistory.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className={[
                  "flex min-h-[48px] items-center justify-between rounded-xl border px-4 py-3",
                  "text-left text-sm font-semibold transition-all duration-200",
                  active
                    ? "border-primary-200 bg-primary-50 text-primary-800 shadow-sm"
                    : "border-border-soft bg-surface text-text-secondary hover:border-primary-200 hover:bg-primary-50/60",
                ].join(" ")}
              >
                <span>{option}</span>

                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition",
                    active
                      ? "border-primary-600 bg-primary-700 text-white"
                      : "border-border-strong bg-surface text-transparent",
                  ].join(" ")}
                >
                  ✓
                </span>
              </button>
            );
          })}
        </div>

        {/* OTHER */}
        {familyHistory.includes("Other") && (
          <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/60 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-semibold text-primary-900">
              Other family condition
            </label>

            <p className="mb-4 text-xs text-text-muted">
              Provide additional information about the family medical condition.
            </p>

            <input
              value={form.familyOther || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  familyOther: e.target.value,
                }))
              }
              placeholder="Specify the family medical condition..."
              className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyStep;