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
        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Select all applicable conditions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {HISTORY_OPTIONS.map((option) => {
          const checked =
            values.includes(option);

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                checked
                  ? "border-blue-700 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option)}
                className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
              />

              <span className="text-sm font-semibold">
                {option}
              </span>
            </label>
          );
        })}
      </div>

      {values.includes("Other") && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-blue-900">
            Specify Other
          </label>

          <input
            type="text"
            placeholder={`Specify other ${title.toLowerCase()}...`}
            value={otherValue || ""}
            onChange={(e) =>
              onOtherChange(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
          ? current.filter((v) => v !== value)
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
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  return (
    <div className="step-wrapper space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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