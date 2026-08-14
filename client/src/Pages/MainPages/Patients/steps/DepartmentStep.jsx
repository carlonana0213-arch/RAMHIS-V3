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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Patient Concern
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-800">
            Initial Remarks
          </h3>

          <p className="mt-1 text-sm text-slate-500">
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
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>

      {/* DEPARTMENT */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Medical Service
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-800">
            Select Department
          </h3>

          <p className="mt-1 text-sm text-slate-500">
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
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                    ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
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
            ? "border-blue-300 bg-blue-50"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Priority Patient
            </p>

            <p className="mt-1 text-sm text-slate-500">
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
                ? "bg-blue-700"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
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
