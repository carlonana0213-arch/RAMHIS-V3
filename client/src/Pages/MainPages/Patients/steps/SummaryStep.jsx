const SummaryItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-muted p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-text-primary">
        {value || "Not provided"}
      </p>
    </div>
  );
};

const SummarySection = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h4 className="text-lg font-bold tracking-tight text-primary-900">
          {title}
        </h4>

        {subtitle && (
          <p className="mt-1 text-sm text-text-muted">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
};

const SummaryStep = ({ form }) => {
  const formatHistory = (
    history = [],
    otherValue,
  ) => {
    const values = history.filter(
      (item) => item !== "Other",
    );

    if (
      history.includes("Other") &&
      otherValue
    ) {
      values.push(otherValue);
    }

    return values.join(", ");
  };

  const medicalValues = formatHistory(
    form.medicalHistory,
    form.medicalOther,
  );

  const familyValues = formatHistory(
    form.familyHistory,
    form.familyOther,
  );

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(
      `${date}T00:00:00`,
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  return (
    <div className="step-container space-y-5">

      {/* STEP HEADER */}
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">

          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-status-stable-dot" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-700">
              Final Review
            </p>

            <h3 className="mt-2 text-xl font-bold tracking-tight text-primary-900">
              Review Patient Information
            </h3>

            <p className="mt-2 text-sm leading-6 text-primary-800/70">
              Review all recorded information before saving
              the patient record.
            </p>
          </div>

        </div>
      </div>

      {/* GENERAL INFORMATION */}
      <SummarySection
        title="General Information"
        subtitle="Basic personal and patient information."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryItem
            label="Full Name"
            value={form.generalInfo?.name}
          />

          <SummaryItem
            label="Age"
            value={
              form.generalInfo?.age !== ""
                ? form.generalInfo?.age
                : ""
            }
          />

          <SummaryItem
            label="Sex"
            value={form.generalInfo?.sex}
          />

          <SummaryItem
            label="Birthdate"
            value={formatDate(
              form.generalInfo?.birthdate,
            )}
          />

          <SummaryItem
            label="Insurance"
            value={form.generalInfo?.insurance}
          />

          <SummaryItem
            label="Allergies"
            value={form.generalInfo?.allergies}
          />

          <SummaryItem
            label="Tobacco Use"
            value={form.generalInfo?.tobacco}
          />

          <SummaryItem
            label="Alcohol Use"
            value={form.generalInfo?.alcohol}
          />

          <SummaryItem
            label="Vaccination"
            value={form.generalInfo?.vaccine}
          />

        </div>
      </SummarySection>

      {/* EXAMINATION */}
      <SummarySection
        title="Examination"
        subtitle="Recorded physical examination measurements."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryItem
            label="Blood Pressure"
            value={form.examination?.bp}
          />

          <SummaryItem
            label="Temperature"
            value={
              form.examination?.temp
                ? `${form.examination.temp} °C`
                : ""
            }
          />

          <SummaryItem
            label="BMI"
            value={form.examination?.bmi}
          />

          <SummaryItem
            label="Height"
            value={
              form.examination?.height
                ? `${form.examination.height} cm`
                : ""
            }
          />

          <SummaryItem
            label="Weight"
            value={
              form.examination?.weight
                ? `${form.examination.weight} kg`
                : ""
            }
          />

        </div>
      </SummarySection>

      {/* MEDICAL HISTORY */}
      <SummarySection
        title="Medical History"
        subtitle="Known medical conditions reported for the patient."
      >
        <div className="rounded-xl border border-border-soft bg-surface-muted p-4">
          <p className="text-sm leading-6 text-text-secondary">
            {medicalValues ||
              "No medical history recorded"}
          </p>
        </div>
      </SummarySection>

      {/* FAMILY HISTORY */}
      <SummarySection
        title="Family History"
        subtitle="Relevant conditions reported in the patient's family."
      >
        <div className="rounded-xl border border-border-soft bg-surface-muted p-4">
          <p className="text-sm leading-6 text-text-secondary">
            {familyValues ||
              "No family history recorded"}
          </p>
        </div>
      </SummarySection>

      {/* PATIENT ASSIGNMENT */}
      <SummarySection
        title="Patient Assignment"
        subtitle="Department and patient priority details."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <SummaryItem
            label="Department"
            value={form.department}
          />

          <SummaryItem
            label="Priority"
            value={
              form.isPriority
                ? "Priority Patient"
                : "Regular Patient"
            }
          />

        </div>

        {form.initComplaint && (
          <div className="mt-4 rounded-xl border border-border-soft bg-surface-muted p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
              Initial Remarks
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
              {form.initComplaint}
            </p>
          </div>
        )}
      </SummarySection>

    </div>
  );
};

export default SummaryStep;