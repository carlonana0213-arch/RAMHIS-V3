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
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div
      className="step-wrapper space-y-5"
      onKeyDown={handleEnterKey}
    >
      {/* =====================================================
          STEP INTRO
      ====================================================== */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">
          Step Information
        </p>

        <h3 className="mt-1 text-xl font-bold tracking-tight text-primary-900">
          Perinatal & Obstetric History
        </h3>

        <p className="mt-2 text-sm text-text-muted">
          Record relevant maternal, obstetric, and perinatal
          information for the patient.
        </p>
      </div>

      {/* =====================================================
          OBSTETRIC HISTORY
      ====================================================== */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        {/* SECTION HEADER */}
        <div className="mb-6">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Maternal Information
          </span>

          <h4 className="text-lg font-bold tracking-tight text-text-primary">
            Obstetric History
          </h4>

          <p className="mt-1 text-sm text-text-muted">
            Record the patient&apos;s pregnancy and obstetric
            history.
          </p>
        </div>

        {/* CONTRACEPTION */}
        <label
          className={[
            "mb-6 flex cursor-pointer items-center justify-between gap-4",
            "rounded-2xl border p-4 transition",
            form.obstetricHistory?.contraception
              ? "border-primary-200 bg-primary-50"
              : "border-border bg-slate-50 hover:border-primary-200",
          ].join(" ")}
        >
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Contraception Use
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Enable if the patient currently uses contraception.
            </p>
          </div>

          <input
            type="checkbox"
            checked={
              form.obstetricHistory?.contraception ||
              false
            }
            onChange={(e) =>
              handleChange(
                "obstetricHistory",
                "contraception",
                e.target.checked,
              )
            }
            className="h-5 w-5 shrink-0 rounded border-border-strong text-primary-700 focus:ring-primary-500"
          />
        </label>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* TYPE */}
          <div>
            <label className={labelClass}>
              Contraception Type
            </label>

            <input
              placeholder="Enter contraception type"
              value={
                form.obstetricHistory?.type || ""
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

          {/* G/P */}
          <div>
            <label className={labelClass}>
              G/P (F/P/A/L)
            </label>

            <input
              placeholder="e.g. G2P1"
              value={
                form.obstetricHistory?.gpfpal || ""
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

          {/* BF */}
          <div>
            <label className={labelClass}>
              Breastfeeding Information
            </label>

            <input
              placeholder="Enter breastfeeding information"
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

          {/* BIRTH HISTORY */}
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

          {/* DELIVERY SITE */}
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

          {/* LMP */}
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
      </section>

      {/* =====================================================
          PERINATAL HISTORY
      ====================================================== */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        {/* SECTION HEADER */}
        <div className="mb-6">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Newborn Information
          </span>

          <h4 className="text-lg font-bold tracking-tight text-text-primary">
            Perinatal History
          </h4>

          <p className="mt-1 text-sm text-text-muted">
            Record relevant birth and newborn history.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* BIRTH WEIGHT */}
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

          {/* BF */}
          <div>
            <label className={labelClass}>
              Breastfeeding Information
            </label>

            <input
              placeholder="Enter breastfeeding information"
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

          {/* BIRTH HISTORY */}
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

          {/* DELIVERY SITE */}
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
      </section>
    </div>
  );
};

export default PerinatalStep;