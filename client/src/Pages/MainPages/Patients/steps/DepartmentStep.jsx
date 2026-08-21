const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
];

const DepartmentStep = ({ form, setForm }) => {
  return (
    <div className="step-container space-y-5">
      {/* REMARKS */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Patient Concern
          </p>

          <h3 className="mt-1 text-lg font-bold text-text-primary">
            Initial Remarks
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Record the patient's initial complaint or concern.
          </p>
        </div>

        <textarea
          value={form.initComplaint || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              initComplaint: e.target.value,
            }))
          }
          placeholder="Enter patient's remarks or initial complaint..."
          rows={5}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
        />
      </div>

      {/* DEPARTMENT */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Medical Service
          </p>

          <h3 className="mt-1 text-lg font-bold text-text-primary">
            Select Department
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Choose the department that will handle this patient.
          </p>
        </div>

        <select
          value={form.department || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              department: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
        >
          <option value="" disabled>
            Select Department
          </option>

          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {departments.map((dept) => {
            const active =
              form.department === dept;

            return (
              <button
                key={dept}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    department: dept,
                  }))
                }
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-blue-700 bg-primary-700 text-white shadow-sm"
                    : "border-border bg-slate-50 text-text-secondary hover:border-blue-300 hover:bg-primary-50"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIORITY */}
      <div
        className={`rounded-2xl border p-5 shadow-sm transition ${
          form.isPriority
            ? "border-blue-300 bg-primary-50"
            : "border-border bg-surface"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-text-primary">
              Priority Patient
            </p>

            <p className="mt-1 text-sm text-text-muted">
              Mark this patient for urgent medical attention.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.isPriority || false}
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                isPriority: !prev.isPriority,
              }))
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              form.isPriority
                ? "bg-primary-700"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition ${
                form.isPriority
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStep;
