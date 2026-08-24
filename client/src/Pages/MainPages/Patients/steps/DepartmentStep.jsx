import {
  FaBaby,
  FaBone,
  FaEye,
  FaTooth,
  FaHeartbeat,
  FaStethoscope,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const departments = [
  "Pediatrics",
  "Ortho",
  "Opta",
  "Dental",
  "Cardio",
  "General",
];

const departmentConfig = {
  Pediatrics: {
    icon: FaBaby,
    iconBg: "bg-primary-50",
    iconColor: "text-primary-700",
  },

  Ortho: {
    icon: FaBone,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-700",
  },

  Opta: {
    icon: FaEye,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
  },

  Dental: {
    icon: FaTooth,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },

  Cardio: {
    icon: FaHeartbeat,
    iconBg: "bg-status-critical-bg",
    iconColor: "text-status-critical-text",
  },

  General: {
    icon: FaStethoscope,
    iconBg: "bg-slate-100",
    iconColor: "text-text-secondary",
  },
};

const DepartmentStep = ({ form, setForm }) => {
  const selectDepartment = (department) => {
    setForm((prev) => ({
      ...prev,
      department,
    }));
  };

  const updateRemarks = (value) => {
    setForm((prev) => ({
      ...prev,
      initComplaint: value,
    }));
  };

  const togglePriority = () => {
    setForm((prev) => ({
      ...prev,
      isPriority: !prev.isPriority,
    }));
  };

  return (
    <div className="step-wrapper space-y-5">

      {/* INITIAL REMARKS */}
      <div className="overflow-hidden rounded-[20px] border border-border-soft bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

        {/* HEADER */}
        <div className="border-b border-border-soft px-5 py-5 sm:px-6">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
            Patient Concern
          </span>

          <h3 className="text-xl font-bold tracking-tight text-primary-900">
            Initial Remarks
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Record the patient's initial complaint,
            concern, or reason for consultation.
          </p>
        </div>

        {/* TEXTAREA */}
        <div className="p-5 sm:p-6">
          <textarea
            value={form.initComplaint || ""}
            onChange={(e) =>
              updateRemarks(e.target.value)
            }
            placeholder="Describe the patient's remarks or initial complaint..."
            rows={5}
            className="w-full resize-none rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-subtle hover:border-border-strong focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] text-text-subtle">
              Include important symptoms or concerns.
            </p>

            <span className="text-[11px] text-text-subtle">
              {(form.initComplaint || "").length} characters
            </span>
          </div>
        </div>
      </div>

      {/* DEPARTMENT SELECTION */}
      <div className="overflow-hidden rounded-[20px] border border-border-soft bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

        {/* HEADER */}
        <div className="border-b border-border-soft px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
                Medical Service
              </span>

              <h3 className="text-xl font-bold tracking-tight text-primary-900">
                Select Department
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                Assign the patient to the appropriate
                medical department.
              </p>
            </div>

            {form.department && (
              <span className="rounded-full bg-status-stable-bg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-status-stable-text">
                {form.department} Selected
              </span>
            )}

          </div>
        </div>

        {/* DEPARTMENTS */}
        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {departments.map((department) => {
              const active =
                form.department === department;

              const config =
                departmentConfig[department];

              const Icon = config.icon;

              return (
                <button
                  key={department}
                  type="button"
                  onClick={() =>
                    selectDepartment(department)
                  }
                  className={[
                    "group relative flex min-h-[120px] flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200",
                    active
                      ? "border-primary-700 bg-primary-50 shadow-[0_8px_24px_rgba(30,42,94,0.10)]"
                      : "border-border-soft bg-surface hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                  ].join(" ")}
                >

                  {/* SELECTED INDICATOR */}
                  {active && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-[10px] text-white">
                      <FaCheck />
                    </span>
                  )}

                  {/* ICON */}
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-200",
                      "group-hover:scale-105",
                      config.iconBg,
                      config.iconColor,
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </div>

                  {/* TEXT */}
                  <div className="mt-4">
                    <span className="block text-sm font-bold text-text-primary">
                      {department}
                    </span>

                    <span className="mt-1 block text-[11px] text-text-muted">
                      {active
                        ? "Currently selected"
                        : "Select department"}
                    </span>
                  </div>

                </button>
              );
            })}

          </div>

          {!form.department && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-muted px-4 py-3 text-xs text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-status-warning-dot" />

              Select a department to continue.
            </div>
          )}

        </div>
      </div>

      {/* PRIORITY PATIENT */}
      <div
        className={[
          "overflow-hidden rounded-[20px] border transition-all duration-200",
          form.isPriority
            ? "border-status-warning-border bg-status-warning-bg shadow-[0_8px_24px_rgba(244,201,93,0.12)]"
            : "border-border-soft bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
        ].join(" ")}
      >

        <div className="flex items-center justify-between gap-4 p-5 sm:p-6">

          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-4">

            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                form.isPriority
                  ? "bg-white/60 text-status-warning-text"
                  : "bg-slate-100 text-text-muted",
              ].join(" ")}
            >
              <FaExclamationTriangle size={18} />
            </div>

            <div>
              <span
                className={[
                  "mb-1 block text-[10px] font-bold uppercase tracking-[0.14em]",
                  form.isPriority
                    ? "text-status-warning-text"
                    : "text-text-muted",
                ].join(" ")}
              >
                Priority Assessment
              </span>

              <h3 className="text-base font-bold text-text-primary">
                Priority Patient
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                Mark this patient for urgent medical
                attention.
              </p>
            </div>

          </div>

          {/* SWITCH */}
          <button
            type="button"
            role="switch"
            aria-checked={form.isPriority || false}
            onClick={togglePriority}
            className={[
              "relative h-8 w-14 shrink-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-4",
              form.isPriority
                ? "bg-status-warning-dot focus:ring-status-warning-dot/20"
                : "bg-slate-300 focus:ring-slate-200",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200",
                form.isPriority
                  ? "left-7"
                  : "left-1",
              ].join(" ")}
            />
          </button>

        </div>

        {/* ACTIVE PRIORITY MESSAGE */}
        {form.isPriority && (
          <div className="border-t border-status-warning-border bg-white/30 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-warning-dot" />

              <p className="text-xs font-semibold text-status-warning-text">
                This patient will be marked for priority handling.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default DepartmentStep;