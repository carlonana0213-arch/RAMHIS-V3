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

const HistoryChecklist = ({
  title,
  values = [],
  otherValue,
  onToggle,
  onOtherChange,
}) => {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-bold tracking-tight text-text-primary">
          {title}
        </h3>

        <p className="mt-1 text-sm text-text-muted">
          Select all applicable conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HISTORY_OPTIONS.map((option) => {
          const checked = values.includes(option);

          return (
            <label
              key={option}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3",
                "transition-all duration-200",
                checked
                  ? "border-primary-500 bg-primary-50 text-primary-800 shadow-sm"
                  : "border-border bg-surface text-text-secondary hover:border-primary-300 hover:bg-primary-50/40",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option)}
                className="h-4 w-4 shrink-0 rounded border-border-strong text-primary-700 focus:ring-primary-500"
              />

              <span className="text-sm font-semibold">
                {option}
              </span>
            </label>
          );
        })}
      </div>

      {values.includes("Other") && (
        <div className="mt-5 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
          <label className="mb-2 block text-sm font-semibold text-primary-900">
            Specify Other
          </label>

          <input
            type="text"
            placeholder={`Specify other ${title.toLowerCase()}...`}
            value={otherValue || ""}
            onChange={(e) =>
              onOtherChange(e.target.value)
            }
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />
        </div>
      )}
    </div>
  );
};

const HistoryStep = ({ form, setForm }) => {
  const toggleMedical = (value) => {
    setForm((prev) => {
      const current =
        prev.medicalHistory || [];

      return {
        ...prev,
        medicalHistory: current.includes(value)
          ? current.filter(
              (item) => item !== value
            )
          : [...current, value],
      };
    });
  };

  const toggleFamily = (value) => {
    setForm((prev) => {
      const current =
        prev.familyHistory || [];

      return {
        ...prev,
        familyHistory: current.includes(value)
          ? current.filter(
              (item) => item !== value
            )
          : [...current, value],
      };
    });
  };

  return (
    <div className="step-wrapper space-y-5">

      {/* STEP HEADER */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
          Step 2
        </p>

        <h3 className="mt-1 text-xl font-bold text-text-primary">
          Medical & Family History
        </h3>

        <p className="mt-1 text-sm text-text-muted">
          Record the patient's existing medical conditions and relevant family history.
        </p>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <HistoryChecklist
          title="Medical History"
          values={form.medicalHistory || []}
          otherValue={form.medicalOther}
          onToggle={toggleMedical}
          onOtherChange={(value) =>
            setForm((prev) => ({
              ...prev,
              medicalOther: value,
            }))
          }
        />
      </div>

      {/* FAMILY HISTORY */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <HistoryChecklist
          title="Family History"
          values={form.familyHistory || []}
          otherValue={form.familyOther}
          onToggle={toggleFamily}
          onOtherChange={(value) =>
            setForm((prev) => ({
              ...prev,
              familyOther: value,
            }))
          }
        />
      </div>

    </div>
  );
};

export default HistoryStep;