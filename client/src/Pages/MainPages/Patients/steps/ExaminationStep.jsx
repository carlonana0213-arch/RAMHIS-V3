const ExaminationStep = ({ form, setForm }) => {
  const exam = form.examination || {};

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      examination: {
        ...prev.examination,
        [field]: value,
      },
    }));
  };

  const computeBMI = (height, weight) => {
    if (!height || !weight) return "";

    const heightInMeters = Number(height) / 100;
    const weightInKg = Number(weight);

    if (!heightInMeters || !weightInKg) return "";

    return (
      weightInKg /
      (heightInMeters * heightInMeters)
    ).toFixed(1);
  };

  const updateHeight = (height) => {
    const bmi = computeBMI(
      height,
      exam.weight,
    );

    setForm((prev) => ({
      ...prev,
      examination: {
        ...prev.examination,
        height,
        bmi,
      },
    }));
  };

  const updateWeight = (weight) => {
    const bmi = computeBMI(
      exam.height,
      weight,
    );

    setForm((prev) => ({
      ...prev,
      examination: {
        ...prev.examination,
        weight,
        bmi,
      },
    }));
  };

  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const container =
      e.currentTarget.closest(".step-wrapper");

    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll(
        'input:not([readonly]), select, textarea',
      ),
    );

    const currentIndex =
      elements.indexOf(e.target);

    const nextElement =
      elements[currentIndex + 1];

    if (nextElement) {
      nextElement.focus();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm font-medium text-text-primary outline-none transition-all duration-200 placeholder:font-normal placeholder:text-text-subtle hover:border-border-strong focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary";

  const bpParts = (exam.bp || "").split("/");
  const systolic = bpParts[0] || "";
  const diastolic = bpParts[1] || "";

  const bmiValue = Number(exam.bmi || 0);

  const getBmiStatus = () => {
    if (!exam.bmi) {
      return {
        label: "Awaiting measurements",
        className:
          "bg-slate-100 text-text-muted",
      };
    }

    if (bmiValue < 18.5) {
      return {
        label: "Underweight",
        className:
          "bg-status-warning-bg text-status-warning-text",
      };
    }

    if (bmiValue < 25) {
      return {
        label: "Normal range",
        className:
          "bg-status-stable-bg text-status-stable-text",
      };
    }

    if (bmiValue < 30) {
      return {
        label: "Overweight",
        className:
          "bg-status-warning-bg text-status-warning-text",
      };
    }

    return {
      label: "Obesity range",
      className:
        "bg-status-critical-bg text-status-critical-text",
    };
  };

  const bmiStatus = getBmiStatus();

  return (
    <div
      className="step-wrapper"
      onKeyDown={handleEnterKey}
    >
      <div className="overflow-hidden rounded-[20px] border border-border-soft bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

        {/* HEADER */}
        <div className="border-b border-border-soft px-5 py-5 sm:px-6">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
            Clinical Assessment
          </span>

          <h3 className="text-xl font-bold tracking-tight text-primary-900">
            Physical Examination
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Record the patient's vital signs and
            physical measurements.
          </p>
        </div>

        {/* FORM */}
        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* BLOOD PRESSURE */}
            <div>
              <label className={labelClass}>
                Blood Pressure

                <span className="text-xs font-medium text-text-subtle">
                  mmHg
                </span>
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted p-2 transition focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10">

                <input
                  placeholder="Systolic"
                  value={systolic}
                  onChange={(e) => {
                    handleChange(
                      "bp",
                      `${e.target.value}/${diastolic}`,
                    );
                  }}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-center text-sm font-semibold text-text-primary outline-none placeholder:font-normal placeholder:text-text-subtle"
                />

                <span className="text-lg font-bold text-text-subtle">
                  /
                </span>

                <input
                  placeholder="Diastolic"
                  value={diastolic}
                  onChange={(e) => {
                    handleChange(
                      "bp",
                      `${systolic}/${e.target.value}`,
                    );
                  }}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-center text-sm font-semibold text-text-primary outline-none placeholder:font-normal placeholder:text-text-subtle"
                />

              </div>

              <p className="mt-2 text-[11px] text-text-subtle">
                Enter systolic and diastolic readings.
              </p>
            </div>

            {/* TEMPERATURE */}
            <div>
              <label className={labelClass}>
                Temperature

                <span className="text-xs font-medium text-text-subtle">
                  °C
                </span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 36.8"
                  value={exam.temp || ""}
                  onChange={(e) =>
                    handleChange(
                      "temp",
                      e.target.value,
                    )
                  }
                  className={`${inputClass} pr-12`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-subtle">
                  °C
                </span>
              </div>

              <p className="mt-2 text-[11px] text-text-subtle">
                Record the patient's body temperature.
              </p>
            </div>

            {/* HEIGHT */}
            <div>
              <label className={labelClass}>
                Height

                <span className="text-xs font-medium text-text-subtle">
                  cm
                </span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="Enter height"
                  value={exam.height || ""}
                  onChange={(e) =>
                    updateHeight(
                      e.target.value,
                    )
                  }
                  className={`${inputClass} pr-14`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-subtle">
                  cm
                </span>
              </div>
            </div>

            {/* WEIGHT */}
            <div>
              <label className={labelClass}>
                Weight

                <span className="text-xs font-medium text-text-subtle">
                  kg
                </span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter weight"
                  value={exam.weight || ""}
                  onChange={(e) =>
                    updateWeight(
                      e.target.value,
                    )
                  }
                  className={`${inputClass} pr-14`}
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-subtle">
                  kg
                </span>
              </div>
            </div>

            {/* BMI RESULT */}
            <div className="md:col-span-2">

              <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4 sm:p-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
                      Calculated Measurement
                    </span>

                    <h4 className="mt-1 text-base font-bold text-primary-900">
                      Body Mass Index
                    </h4>

                    <p className="mt-1 text-xs text-text-muted">
                      Automatically calculated from height
                      and weight.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <div className="text-right">
                      <strong className="block text-3xl font-bold leading-none tracking-tight text-primary-900">
                        {exam.bmi || "—"}
                      </strong>

                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        kg/m²
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${bmiStatus.className}`}
                    >
                      {bmiStatus.label}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ExaminationStep;