import { useMemo, useState } from "react";
import { updatePatient } from "../../../../Services/patientService";

function Section({ title, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border-soft bg-slate-50/70 px-5 py-4">
        <h3 className="text-sm font-bold text-text-primary">
          {title}
        </h3>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-border-soft bg-slate-50/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value === null ||
        value === undefined ||
        value === ""
          ? "—"
          : String(value)}
      </p>
    </div>
  );
}

function YesNoField({ label, value }) {
  let display = "—";

  if (
    value === true ||
    value === "Yes" ||
    value === "yes"
  ) {
    display = "Yes";
  }

  if (
    value === false ||
    value === "No" ||
    value === "no"
  ) {
    display = "No";
  }

  return (
    <Field
      label={label}
      value={display}
    />
  );
}

function StatusBadge({ status }) {
  const config = {
    waiting: {
      label: "Waiting",
      classes:
        "bg-status-watch-bg text-status-watch-text ring-amber-200",
    },

    beingSeen: {
      label: "Being Served",
      classes:
        "bg-primary-50 text-primary-700 ring-blue-200",
    },

    forPharmacy: {
      label: "For Pharmacy",
      classes:
        "bg-status-stable-bg text-status-stable-text ring-emerald-200",
    },

    released: {
      label: "Released",
      classes:
        "bg-slate-100 text-text-secondary ring-slate-200",
    },
  };

  const item =
    config[status] || {
      label: status || "Unknown",
      classes:
        "bg-slate-100 text-text-secondary ring-slate-200",
    };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${item.classes}`}
    >
      {item.label}
    </span>
  );
}

export default function PatientViewModal({
  patient,
  onClose,
}) {
  const [isPriority, setIsPriority] =
    useState(Boolean(patient?.isPriority));

  const [savingPriority, setSavingPriority] =
    useState(false);

  if (!patient) {
    return null;
  }

  const general =
    patient.generalInfo || {};

  const medicalHistory = Array.isArray(patient.medicalHistory)
  ? patient.medicalHistory
  : [];

const familyHistory = Array.isArray(patient.familyHistory)
  ? patient.familyHistory
  : [];

const hasMedicalHistory = (condition) =>
  medicalHistory.includes(condition);

const hasFamilyHistory = (condition) =>
  familyHistory.includes(condition);

  const history =
    patient.history || {};

  const perinatal = patient.perinatalHistory || {};

  const obstetric = patient.obstetricHistory || {};

  const examination =
    patient.examination || {};

  const name =
    general.name ||
    patient.name ||
    "Unnamed Patient";

  const sex =
    general.sex ||
    general.gender ||
    patient.sex ||
    "—";

  const age =
    general.age ||
    patient.age ||
    "—";

  const department =
    patient.department ||
    "—";

  const status =
    patient.status ||
    "—";

  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
  }, [name]);

  const handlePriorityToggle =
    async () => {
      const newValue = !isPriority;

      try {
        setSavingPriority(true);

        await updatePatient(
          patient._id,
          {
            isPriority: newValue,
          }
        );

        setIsPriority(newValue);
      } catch (error) {
        console.error(
          "Failed to update patient priority:",
          error
        );
      } finally {
        setSavingPriority(false);
      }
    };

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[70px] z-[90] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex h-full max-h-[calc(100vh-100px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-slate-50 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            MODAL HEADER
        ====================================================== */}
        <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-4 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            {/* AVATAR */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                isPriority
                  ? "bg-status-critical-bg text-red-600"
                  : "bg-primary-50 text-primary-600"
              }`}
            >
              {initials || "P"}
            </div>

            {/* TITLE */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">

                <h2 className="truncate text-base font-bold text-text-primary sm:text-lg">
                  {name}
                </h2>

                {isPriority && (
                  <span className="rounded-full bg-status-critical-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 ring-1 ring-red-100">
                    Priority
                  </span>
                )}

              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">

                <span>
                  {age} years
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span>
                  {sex}
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span>
                  {department}
                </span>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="ml-3 flex shrink-0 items-center gap-3">

            <StatusBadge
              status={status}
            />

            {/* PRIORITY TOGGLE */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-muted">
                Priority
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={isPriority}
                onClick={handlePriorityToggle}
                className={[
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center",
                  "rounded-full border-0 p-0 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1",
                  isPriority
                    ? "bg-red-600"
                    : "bg-slate-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "pointer-events-none block h-5 w-5 rounded-full bg-surface shadow-md",
                    "transform transition-transform duration-200",
                    isPriority
                      ? "translate-x-5"
                      : "translate-x-0.5",
                  ].join(" ")}
                />
              </button>
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-lg font-semibold text-text-subtle transition hover:border-border-strong hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close patient record"
            >
              ×
            </button>

          </div>
        </header>

        {/* =====================================================
            MOBILE PRIORITY
        ====================================================== */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3 sm:hidden">

          <div>
            <p className="text-xs font-semibold text-text-muted">
              Patient Priority
            </p>

            <p
              className={`mt-0.5 text-xs font-bold ${
                isPriority
                  ? "text-red-600"
                  : "text-text-secondary"
              }`}
            >
              {isPriority
                ? "Priority Patient"
                : "Regular Patient"}
            </p>
          </div>

          <button
            type="button"
            disabled={savingPriority}
            onClick={
              handlePriorityToggle
            }
            className={`relative h-6 w-11 rounded-full ${
              isPriority
                ? "bg-red-500"
                : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform ${
                isPriority
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>

        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6">

            {/* GENERAL INFORMATION */}
            <Section title="General Information">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <Field
                  label="Full Name"
                  value={name}
                />

                <Field
                  label="Birthday"
                  value={
                    general.birthdate ||
                    general.birthday ||
                    patient.birthdate
                  }
                />

                <Field
                  label="Age"
                  value={age}
                />

                <Field
                  label="Sex"
                  value={sex}
                />

                <Field
                  label="Department"
                  value={department}
                />

                <Field
                  label="Insurance"
                  value={
                    general.insurance ||
                    patient.insurance
                  }
                />

                <YesNoField
                  label="Tobacco"
                  value={
                    general.tobacco ||
                    general.smoker ||
                    patient.tobacco
                  }
                />

                <YesNoField
                  label="Alcohol"
                  value={
                    general.alcohol ||
                    patient.alcohol
                  }
                />

              </div>
            </Section>

            {/* CONTACT / OTHER INFORMATION */}
            <Section title="Patient Information">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <Field
                  label="Address"
                  value={
                    general.address ||
                    patient.address
                  }
                />

                <Field
                  label="Contact Number"
                  value={
                    general.contactNumber ||
                    general.contact ||
                    patient.contactNumber
                  }
                />

                <Field
                  label="Emergency Contact"
                  value={
                    general.emergencyContact ||
                    patient.emergencyContact
                  }
                />

                <Field
                  label="Allergies"
                  value={
                    general.allergies ||
                    patient.allergies
                  }
                />

                <Field
                  label="Vaccination"
                  value={
                    general.vaccine ||
                    general.vaccination ||
                    patient.vaccine
                  }
                />

                <Field
  label="Complaint"
  value={
    patient.initComplaint ||
    general.complaint ||
    patient.complaint
  }
/>

              </div>
            </Section>

            {/* MEDICAL HISTORY */}
            <Section title="Medical History">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <YesNoField
      label="Diabetes"
      value={hasMedicalHistory("Diabetes")}
    />

    <YesNoField
      label="Hypertension"
      value={hasMedicalHistory("Hypertension")}
    />

    <YesNoField
      label="Asthma"
      value={hasMedicalHistory("Asthma")}
    />

    <YesNoField
      label="Cancer"
      value={hasMedicalHistory("Cancer")}
    />

    <YesNoField
      label="Stroke"
      value={hasMedicalHistory("Stroke")}
    />

    <YesNoField
      label="Epilepsy"
      value={hasMedicalHistory("Epilepsy")}
    />

    <YesNoField
      label="Tuberculosis"
      value={hasMedicalHistory("Tuberculosis")}
    />

    <Field
      label="Other"
      value={
        medicalHistory.find(
          (item) =>
            ![
              "Diabetes",
              "Hypertension",
              "Asthma",
              "Cancer",
              "Stroke",
              "Epilepsy",
              "Tuberculosis",
            ].includes(item)
        )
      }
    />
  </div>
</Section>

            {/* FAMILY HISTORY */}
            <Section title="Family History">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <YesNoField
      label="Diabetes"
      value={hasFamilyHistory("Diabetes")}
    />

    <YesNoField
      label="Hypertension"
      value={hasFamilyHistory("Hypertension")}
    />

    <YesNoField
      label="Asthma"
      value={hasFamilyHistory("Asthma")}
    />

    <YesNoField
      label="Cancer"
      value={hasFamilyHistory("Cancer")}
    />

    <YesNoField
      label="Stroke"
      value={hasFamilyHistory("Stroke")}
    />

    <YesNoField
      label="Epilepsy"
      value={hasFamilyHistory("Epilepsy")}
    />

    <YesNoField
      label="Tuberculosis"
      value={hasFamilyHistory("Tuberculosis")}
    />

    <Field
      label="Other"
      value={
        familyHistory.find(
          (item) =>
            ![
              "Diabetes",
              "Hypertension",
              "Asthma",
              "Cancer",
              "Stroke",
              "Epilepsy",
              "Tuberculosis",
            ].includes(item)
        )
      }
    />
  </div>
</Section>

            {/* PATIENT HISTORY */}
            <Section title="Patient History">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <Field
                  label="Previous Consultation"
                  value={
                    history.previousConsultation ||
                    history.consultation
                  }
                />

                <Field
                  label="Previous Diagnosis"
                  value={
                    history.previousDiagnosis ||
                    history.diagnosis
                  }
                />

                <Field
                  label="Current Medication"
                  value={
                    history.currentMedication ||
                    history.medication
                  }
                />

                <Field
                  label="Other Medical Information"
                  value={
                    history.other ||
                    history.notes
                  }
                />

              </div>
            </Section>

            <Section title="Obstetric History">
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

    <YesNoField
      label="Contraception"
      value={obstetric.contraception}
    />

    <Field
      label="Type"
      value={obstetric.type}
    />

    <Field
      label="G/P (F/P/A/L)"
      value={obstetric.gpfpal}
    />

    <Field
      label="BF"
      value={obstetric.bf}
    />

    <Field
      label="Birth History"
      value={obstetric.birthHistory}
    />

    <Field
      label="Delivery Site"
      value={obstetric.deliverySite}
    />

    <Field
      label="Last Menstrual Period"
      value={obstetric.lmp}
    />

  </div>
</Section>

            {/* PERINATAL */}
            <Section title="Perinatal History">
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

    <Field
      label="Birth Weight"
      value={perinatal.bw}
    />

    <Field
      label="BF"
      value={perinatal.bf}
    />

    <Field
      label="Birth History"
      value={perinatal.birthHistory}
    />

    <Field
      label="Delivery Site"
      value={perinatal.deliverySite}
    />

  </div>
</Section>

            {/* EXAMINATION */}
            <Section title="Examination">

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                <Field
  label="Blood Pressure"
  value={examination.bp}
/>

<Field
  label="Temperature"
  value={examination.temp}
/>

                <Field
                  label="Heart Rate"
                  value={
                    examination.heartRate
                  }
                />

                <Field
                  label="Respiratory Rate"
                  value={
                    examination.respiratoryRate
                  }
                />

                <Field
                  label="Weight"
                  value={
                    examination.weight
                  }
                />

                <Field
                  label="Height"
                  value={
                    examination.height
                  }
                />

                <Field
                  label="BMI"
                  value={
                    examination.bmi
                  }
                />

                <Field
                  label="Diagnosis"
                  value={
                    examination.diagnosis
                  }
                />

              </div>
            </Section>

            {/* FOOTER SPACE */}
            <div className="h-2" />

          </div>
        </div>

        {/* =====================================================
            MODAL FOOTER
        ====================================================== */}
        <footer className="flex shrink-0 items-center justify-between border-t border-border bg-surface px-5 py-3 sm:px-6">

          <p className="hidden text-xs text-text-subtle sm:block">
            Patient record
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Close
          </button>

        </footer>

      </div>
    </div>
  );
}