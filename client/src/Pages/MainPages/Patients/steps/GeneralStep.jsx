const GeneralStep = ({ form, setForm }) => {
  const general = form.generalInfo || {};

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        [field]: value,
      },
    }));
  };

  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const container = e.currentTarget.closest(".step-wrapper");

    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll(
        "input, select, textarea, .button-group",
      ),
    );

    const current =
      e.target.closest(".button-group") || e.target;

    const index = elements.indexOf(current);
    const next = elements[index + 1];

    if (next) {
      if (next.classList.contains("button-group")) {
        const firstButton =
          next.querySelector("button");

        if (firstButton) {
          firstButton.focus();
        }
      } else {
        next.focus();
      }
    } else {
      document.querySelector(".next-btn")?.click();
    }
  };

  const handleBirthdateChange = (birthdate) => {
    let age = "";

    if (birthdate) {
      const today = new Date();
      const birth = new Date(birthdate);

      age =
        today.getFullYear() -
        birth.getFullYear();

      const monthDifference =
        today.getMonth() -
        birth.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
          today.getDate() < birth.getDate())
      ) {
        age--;
      }
    }

    setForm((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        birthdate,
        age,
      },
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition-all duration-200 placeholder:text-text-subtle hover:border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const readOnlyClass =
    "w-full rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm font-semibold text-text-secondary outline-none";

  const labelClass =
    "mb-2 block text-sm font-semibold text-text-primary";

  const optionButton = (active) =>
    `flex min-h-[48px] flex-1 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      active
        ? "border-primary-700 bg-primary-700 text-white shadow-[0_6px_16px_rgba(30,42,94,0.18)]"
        : "border-border-soft bg-surface text-text-secondary hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
    }`;

  return (
    <div className="step-wrapper w-full">
      <div className="rounded-[24px] border border-border-soft bg-surface p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">

        {/* ================= HEADER ================= */}
        <div className="mb-8 border-b border-border-soft pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-600">
                  Step 1 of Patient Registration
                </p>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-primary-900 sm:text-2xl">
                General Information
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
                Enter the patient's basic personal and health information.
              </p>
            </div>

            <div className="self-start rounded-xl bg-primary-50 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary-700">
                Personal Profile
              </span>
            </div>

          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

          {/* FULL NAME */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>

            <input
              value={general.name || ""}
              onChange={(e) =>
                handleChange(
                  "name",
                  e.target.value,
                )
              }
              onKeyDown={handleEnterKey}
              placeholder="Enter patient's full name"
              className={inputClass}
            />
          </div>

          {/* BIRTHDATE */}
          <div>
            <label className={labelClass}>
              Birthdate <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={general.birthdate || ""}
              onChange={(e) =>
                handleBirthdateChange(
                  e.target.value,
                )
              }
              onKeyDown={handleEnterKey}
              className={inputClass}
            />
          </div>

          {/* AGE */}
          <div>
            <label className={labelClass}>
              Age
            </label>

            <input
              value={general.age || ""}
              readOnly
              onKeyDown={handleEnterKey}
              placeholder="Automatically calculated"
              className={readOnlyClass}
            />
          </div>

          {/* SEX */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Sex <span className="text-red-500">*</span>
            </label>

            <div className="button-group flex flex-col gap-3 sm:flex-row">
              {["Male", "Female"].map((sex) => (
                <button
                  key={sex}
                  type="button"
                  className={optionButton(
                    general.sex === sex,
                  )}
                  onClick={() =>
                    handleChange(
                      "sex",
                      sex,
                    )
                  }
                  onKeyDown={handleEnterKey}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>

          {/* INSURANCE */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Insurance
            </label>

            <input
              value={general.insurance || ""}
              onChange={(e) =>
                handleChange(
                  "insurance",
                  e.target.value,
                )
              }
              onKeyDown={handleEnterKey}
              placeholder="Enter insurance provider"
              className={inputClass}
            />
          </div>

          {/* TOBACCO */}
          <div>
            <label className={labelClass}>
              Tobacco Use
            </label>

            <div className="button-group flex gap-3">
              {["Yes", "No"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={optionButton(
                    general.tobacco === value,
                  )}
                  onClick={() =>
                    handleChange(
                      "tobacco",
                      value,
                    )
                  }
                  onKeyDown={handleEnterKey}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* ALCOHOL */}
          <div>
            <label className={labelClass}>
              Alcohol Use
            </label>

            <div className="button-group flex gap-3">
              {["Yes", "No"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={optionButton(
                    general.alcohol === value,
                  )}
                  onClick={() =>
                    handleChange(
                      "alcohol",
                      value,
                    )
                  }
                  onKeyDown={handleEnterKey}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* ALLERGIES */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Allergies
            </label>

            <input
              value={general.allergies || ""}
              onChange={(e) =>
                handleChange(
                  "allergies",
                  e.target.value,
                )
              }
              onKeyDown={handleEnterKey}
              placeholder="Enter known allergies or none"
              className={inputClass}
            />
          </div>

          {/* VACCINE */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Vaccine
            </label>

            <input
              value={general.vaccine || ""}
              onChange={(e) =>
                handleChange(
                  "vaccine",
                  e.target.value,
                )
              }
              onKeyDown={handleEnterKey}
              placeholder="Enter vaccination information"
              className={inputClass}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default GeneralStep;