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

    const current = e.target.closest(".button-group") || e.target;
    const index = elements.indexOf(current);
    const next = elements[index + 1];

    if (next) {
      if (next.classList.contains("button-group")) {
        next.focus();

        const firstButton = next.querySelector("button");

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

      age = today.getFullYear() - birth.getFullYear();

      const monthDifference =
        today.getMonth() - birth.getMonth();

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
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const readOnlyClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const optionButton = (active) =>
    `flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
      active
        ? "border-blue-700 bg-blue-700 text-white shadow-sm"
        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
    }`;

  return (
    <div className="step-wrapper">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Step 1
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-800">
            General Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the patient's basic personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* NAME */}
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name</label>

            <input
              value={general.name || ""}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              onKeyDown={handleEnterKey}
              placeholder="Enter patient's full name"
              className={inputClass}
            />
          </div>

          {/* BIRTHDATE */}
          <div>
            <label className={labelClass}>Birthdate</label>

            <input
              type="date"
              value={general.birthdate || ""}
              onChange={(e) =>
                handleBirthdateChange(e.target.value)
              }
              onKeyDown={handleEnterKey}
              className={inputClass}
            />
          </div>

          {/* AGE */}
          <div>
            <label className={labelClass}>Age</label>

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
            <label className={labelClass}>Sex</label>

            <div className="button-group flex gap-3">
              {["Male", "Female"].map((sex) => (
                <button
                  key={sex}
                  type="button"
                  className={optionButton(
                    general.sex === sex,
                  )}
                  onClick={() =>
                    handleChange("sex", sex)
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