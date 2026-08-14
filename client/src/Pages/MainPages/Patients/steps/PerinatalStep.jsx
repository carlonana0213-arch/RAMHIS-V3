const PerinatalStep = ({
  form,
  setForm,
  handleEnterKey,
}) => {
  const handleChange = (
    section,
    field,
    value,
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div
      className="step-wrapper space-y-5"
      onKeyDown={handleEnterKey}
    >
      {/* OBSTETRIC */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Maternal Information
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-800">
            Obstetric History
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Record relevant obstetric information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CONTRACEPTION */}
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={
                  form.obstetricHistory
                    ?.contraception || false
                }
                onChange={(e) =>
                  handleChange(
                    "obstetricHistory",
                    "contraception",
                    e.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
              />

              <span className="text-sm font-semibold text-slate-700">
                Contraception
              </span>
            </label>
          </div>

          <div>
            <label className={labelClass}>
              Type
            </label>

            <input
              placeholder="Contraception type"
              value={
                form.obstetricHistory?.type ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "type",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              G/P (F/P/A/L)
            </label>

            <input
              placeholder="e.g. G2P1"
              value={
                form.obstetricHistory?.gpfpal ||
                ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "gpfpal",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              BF
            </label>

            <input
              placeholder="Breastfeeding information"
              value={
                form.obstetricHistory?.bf || ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "bf",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Birth History
            </label>

            <input
              placeholder="Enter birth history"
              value={
                form.obstetricHistory
                  ?.birthHistory || ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "birthHistory",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Delivery Site
            </label>

            <input
              placeholder="Enter delivery site"
              value={
                form.obstetricHistory
                  ?.deliverySite || ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "deliverySite",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Last Menstrual Period
            </label>

            <input
              type="date"
              value={
                form.obstetricHistory?.lmp || ""
              }
              onChange={(e) =>
                handleChange(
                  "obstetricHistory",
                  "lmp",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* PERINATAL */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Newborn Information
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-800">
            Perinatal History
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Birth Weight
            </label>

            <input
              placeholder="Enter birth weight"
              value={
                form.perinatalHistory?.bw || ""
              }
              onChange={(e) =>
                handleChange(
                  "perinatalHistory",
                  "bw",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              BF
            </label>

            <input
              placeholder="Breastfeeding information"
              value={
                form.perinatalHistory?.bf || ""
              }
              onChange={(e) =>
                handleChange(
                  "perinatalHistory",
                  "bf",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Birth History
            </label>

            <input
              placeholder="Enter birth history"
              value={
                form.perinatalHistory
                  ?.birthHistory || ""
              }
              onChange={(e) =>
                handleChange(
                  "perinatalHistory",
                  "birthHistory",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Delivery Site
            </label>

            <input
              placeholder="Enter delivery site"
              value={
                form.perinatalHistory
                  ?.deliverySite || ""
              }
              onChange={(e) =>
                handleChange(
                  "perinatalHistory",
                  "deliverySite",
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerinatalStep;