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

    const h = Number(height) / 100;
    const w = Number(weight);

    if (!h || !w) return "";

    return (w / (h * h)).toFixed(1);
  };

  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const container =
      e.currentTarget.closest(".step-wrapper");

    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll(
        "input, select, textarea, .button-group",
      ),
    );

    const current =
      e.target.closest(".button-group") ||
      e.target;

    const index = elements.indexOf(current);
    const next = elements[index + 1];

    if (next) {
      next.focus();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

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

  return (
    <div
      className="step-wrapper"
      onKeyDown={handleEnterKey}
    >
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Clinical Assessment
          </p>

          <h3 className="mt-1 text-xl font-bold text-text-primary">
            Examination
          </h3>

          <p className="mt-1 text-sm text-text-muted">
            Record the patient's vital measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* BLOOD PRESSURE */}
          <div>
            <label className={labelClass}>
              Blood Pressure
            </label>

            <div className="flex items-center gap-3">
              <input
                placeholder="Systolic"
                value={
                  exam.bp?.split("/")[0] || ""
                }
                onChange={(e) => {
                  const sys = e.target.value;
                  const dia =
                    exam.bp?.split("/")[1] || "";

                  handleChange(
                    "bp",
                    `${sys}/${dia}`,
                  );
                }}
                className={inputClass}
              />

              <span className="font-bold text-text-subtle">
                /
              </span>

              <input
                placeholder="Diastolic"
                value={
                  exam.bp?.split("/")[1] || ""
                }
                onChange={(e) => {
                  const dia = e.target.value;
                  const sys =
                    exam.bp?.split("/")[0] || "";

                  handleChange(
                    "bp",
                    `${sys}/${dia}`,
                  );
                }}
                className={inputClass}
              />
            </div>
          </div>

          {/* TEMPERATURE */}
          <div>
            <label className={labelClass}>
              Temperature
            </label>

            <input
              placeholder="e.g. 36.8 °C"
              value={exam.temp || ""}
              onChange={(e) =>
                handleChange(
                  "temp",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          {/* HEIGHT */}
          <div>
            <label className={labelClass}>
              Height
            </label>

            <div className="relative">
              <input
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
            </label>

            <div className="relative">
              <input
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

          {/* BMI */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Body Mass Index
            </label>

            <div className="flex items-center gap-3">
              <input
                placeholder="Automatically calculated"
                value={exam.bmi || ""}
                readOnly
                className="w-full rounded-xl border border-blue-100 bg-primary-50 px-4 py-3 text-sm font-bold text-blue-800 outline-none"
              />

              <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-text-muted">
                BMI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationStep;