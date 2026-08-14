const SummaryItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
};

const SummarySection = ({
  title,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-base font-bold text-slate-800">
        {title}
      </h4>

      {children}
    </div>
  );
};

const SummaryStep = ({ form }) => {
  const medicalHistory =
    form.medicalHistory || [];

  const familyHistory =
    form.familyHistory || [];

  const medicalValues = [
    ...medicalHistory,
    medicalHistory.includes("Other")
      ? form.medicalOther
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const familyValues = [
    ...familyHistory,
    familyHistory.includes("Other")
      ? form.familyOther
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="step-container space-y-5">
      {/* HEADER */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Final Review
        </p>

        <h3 className="mt-1 text-xl font-bold text-blue-950">
          Review Patient Information
        </h3>

        <p className="mt-1 text-sm text-blue-800/70">
          Please review the information before saving the patient record.
        </p>
      </div>

      {/* GENERAL */}
      <SummarySection title="General Information">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryItem
            label="Name"
            value={form.generalInfo?.name}
          />

          <SummaryItem
            label="Age"
            value={form.generalInfo?.age}
          />

          <SummaryItem
            label="Sex"
            value={form.generalInfo?.sex}
          />

          <SummaryItem
            label="Birthdate"
            value={form.generalInfo?.birthdate}
          />

          <SummaryItem
            label="Insurance"
            value={form.generalInfo?.insurance}
          />

          <SummaryItem
            label="Allergies"
            value={form.generalInfo?.allergies}
          />
        </div>
      </SummarySection>

      {/* EXAMINATION */}
      <SummarySection title="Examination">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryItem
            label="Blood Pressure"
            value={form.examination?.bp}
          />

          <SummaryItem
            label="Temperature"
            value={form.examination?.temp}
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

      {/* MEDICAL */}
      <SummarySection title="Medical History">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            {medicalValues || "No medical history recorded"}
          </p>
        </div>
      </SummarySection>

      {/* FAMILY */}
      <SummarySection title="Family History">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            {familyValues || "No family history recorded"}
          </p>
        </div>
      </SummarySection>

      {/* DEPARTMENT */}
      <SummarySection title="Patient Assignment">
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
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Initial Remarks
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {form.initComplaint}
            </p>
          </div>
        )}
      </SummarySection>
    </div>
  );
};

export default SummaryStep;