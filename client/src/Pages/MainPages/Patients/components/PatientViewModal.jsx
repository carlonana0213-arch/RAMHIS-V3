import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPatientById,
  updatePatient,
} from "../../../../Services/patientService";

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
  const [patientDetails, setPatientDetails] =
    useState(null);

  const [loadingPatient, setLoadingPatient] =
    useState(false);

  const [isPriority, setIsPriority] =
    useState(Boolean(patient?.isPriority));

  const [savingPriority, setSavingPriority] =
    useState(false);

  /*
  |----------------------------------------------------------------
  | LOAD COMPLETE PATIENT DETAILS
  |----------------------------------------------------------------
  */

  useEffect(() => {
    const loadPatientDetails = async () => {
      if (!patient?._id) {
        setPatientDetails(null);
        return;
      }

      try {
        setLoadingPatient(true);

        const data =
          await getPatientById(
            patient._id
          );

        setPatientDetails(data);
      } catch (error) {
        console.error(
          "Failed to load patient details:",
          error,
        );

        /*
         * Keep the queue patient as fallback.
         */
        setPatientDetails(patient);
      } finally {
        setLoadingPatient(false);
      }
    };

    loadPatientDetails();
  }, [patient?._id]);

  /*
  |----------------------------------------------------------------
  | UPDATE PRIORITY STATE WHEN PATIENT CHANGES
  |----------------------------------------------------------------
  */

  useEffect(() => {
    setIsPriority(
      Boolean(
        patientDetails?.isPriority ??
          patient?.isPriority,
      ),
    );
  }, [
    patientDetails?.isPriority,
    patient?.isPriority,
  ]);

  if (!patient) {
    return null;
  }

  /*
  |----------------------------------------------------------------
  | USE COMPLETE BACKEND PATIENT RECORD
  |----------------------------------------------------------------
  */

  const currentPatient =
    patientDetails || patient;

  const general =
    currentPatient.generalInfo || {};

  const examination =
    currentPatient.examination || {};

  const obstetric =
    currentPatient.obstetricHistory || {};

  const perinatal =
    currentPatient.perinatalHistory || {};

  const medicalHistory = Array.isArray(
    currentPatient.medicalHistory,
  )
    ? currentPatient.medicalHistory
    : [];

  const familyHistory = Array.isArray(
    currentPatient.familyHistory,
  )
    ? currentPatient.familyHistory
    : [];

  const hasMedicalHistory = (
    condition,
  ) =>
    medicalHistory.includes(condition);

  const hasFamilyHistory = (
    condition,
  ) =>
    familyHistory.includes(condition);

  const formatHistory = (
    history,
    otherValue,
  ) => {
    if (!history.length) {
      return "—";
    }

    return history
      .map((item) => {
        if (
          item === "Other" &&
          otherValue
        ) {
          return otherValue;
        }

        return item;
      })
      .join(", ");
  };

  const name =
    general.name ||
    currentPatient.name ||
    "Unnamed Patient";

  const sex =
    general.sex ||
    general.gender ||
    currentPatient.sex ||
    "—";

  const age =
    general.age ??
    currentPatient.age ??
    "—";

  const department =
    currentPatient.department ||
    "—";

  const status =
    currentPatient.status ||
    "—";

  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase(),
      )
      .join("");
  }, [name]);

  const handlePriorityToggle =
    async () => {
      const newValue = !isPriority;

      try {
        setSavingPriority(true);

        await updatePatient(
          currentPatient._id,
          {
            isPriority: newValue,
          },
        );

        setIsPriority(newValue);

        setPatientDetails(
          (previous) =>
            previous
              ? {
                  ...previous,
                  isPriority: newValue,
                }
              : previous,
        );
      } catch (error) {
        console.error(
          "Failed to update patient priority:",
          error,
        );
      } finally {
        setSavingPriority(false);
      }
    };

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[70px] z-[90] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">

          <div className="flex min-w-0 items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-lg font-extrabold text-primary-700">
              {initials || "PT"}
            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                Patient Record
              </p>

              <h2 className="mt-1 truncate text-xl font-extrabold text-text-primary sm:text-2xl">
                {name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-text-muted">

                <span>
                  {age !== "—"
                    ? `${age} years`
                    : "—"}
                </span>

                <span>•</span>

                <span>
                  {sex}
                </span>

                <span>•</span>

                <span>
                  {department}
                </span>

              </div>

            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">

            <StatusBadge
              status={status}
            />

            <div className="flex items-center gap-2">

              <span className="hidden text-xs font-bold text-text-secondary sm:inline">
                Priority Patient
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={isPriority}
                disabled={
                  savingPriority ||
                  loadingPatient
                }
                onClick={
                  handlePriorityToggle
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  isPriority
                    ? "bg-status-critical-text"
                    : "bg-slate-300"
                } ${
                  savingPriority ||
                  loadingPatient
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition ${
                    isPriority
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-lg font-bold text-text-secondary transition hover:bg-slate-50 hover:text-text-primary"
              aria-label="Close"
            >
              ×
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">

          {loadingPatient ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600" />
            </div>
          ) : (
            <div className="space-y-5">

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
                      general.birthdate
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
                      general.insurance
                    }
                  />

                  <YesNoField
                    label="Tobacco"
                    value={
                      general.tobacco
                    }
                  />

                  <YesNoField
                    label="Alcohol"
                    value={
                      general.alcohol
                    }
                  />

                </div>

              </Section>

              {/* PATIENT INFORMATION */}
              <Section title="Patient Information">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <Field
                    label="Allergies"
                    value={
                      general.allergies
                    }
                  />

                  <Field
                    label="Vaccination"
                    value={
                      general.vaccine
                    }
                  />

                  <Field
                    label="Complaint"
                    value={
                      currentPatient.initComplaint
                    }
                  />

                </div>

              </Section>

              {/* EXAMINATION */}
              <Section title="Examination">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <Field
                    label="Blood Pressure"
                    value={
                      examination.bp
                    }
                  />

                  <Field
                    label="Temperature"
                    value={
                      examination.temp
                    }
                  />

                  <Field
                    label="Height"
                    value={
                      examination.height
                        ? `${examination.height} cm`
                        : ""
                    }
                  />

                  <Field
                    label="Weight"
                    value={
                      examination.weight
                        ? `${examination.weight} kg`
                        : ""
                    }
                  />

                  <Field
                    label="Body Mass Index"
                    value={
                      examination.bmi
                    }
                  />

                </div>

              </Section>

              {/* MEDICAL HISTORY */}
              <Section title="Medical History">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Diabetes"
                    value={
                      hasMedicalHistory(
                        "Diabetes",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Hypertension"
                    value={
                      hasMedicalHistory(
                        "Hypertension",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Asthma"
                    value={
                      hasMedicalHistory(
                        "Asthma",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Cancer"
                    value={
                      hasMedicalHistory(
                        "Cancer",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Stroke"
                    value={
                      hasMedicalHistory(
                        "Stroke",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Epilepsy"
                    value={
                      hasMedicalHistory(
                        "Epilepsy",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Tuberculosis"
                    value={
                      hasMedicalHistory(
                        "Tuberculosis",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Other"
                    value={
                      hasMedicalHistory(
                        "Other",
                      )
                        ? currentPatient.medicalOther ||
                          "Yes"
                        : "—"
                    }
                  />

                </div>

              </Section>

              {/* FAMILY HISTORY */}
              <Section title="Family History">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Diabetes"
                    value={
                      hasFamilyHistory(
                        "Diabetes",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Hypertension"
                    value={
                      hasFamilyHistory(
                        "Hypertension",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Asthma"
                    value={
                      hasFamilyHistory(
                        "Asthma",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Cancer"
                    value={
                      hasFamilyHistory(
                        "Cancer",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Stroke"
                    value={
                      hasFamilyHistory(
                        "Stroke",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Epilepsy"
                    value={
                      hasFamilyHistory(
                        "Epilepsy",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Tuberculosis"
                    value={
                      hasFamilyHistory(
                        "Tuberculosis",
                      )
                        ? "Yes"
                        : "—"
                    }
                  />

                  <Field
                    label="Other"
                    value={
                      hasFamilyHistory(
                        "Other",
                      )
                        ? currentPatient.familyOther ||
                          "Yes"
                        : "—"
                    }
                  />

                </div>

              </Section>

              {/* OBSTETRIC HISTORY */}
              <Section title="Obstetric History">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <YesNoField
                    label="Contraception"
                    value={
                      obstetric.contraception
                    }
                  />

                  <Field
                    label="Type"
                    value={
                      obstetric.type
                    }
                  />

                  <Field
                    label="G/P (F/P/A/L)"
                    value={
                      obstetric.gpfpal
                    }
                  />

                  <Field
                    label="BF"
                    value={
                      obstetric.bf
                    }
                  />

                  <Field
                    label="Birth History"
                    value={
                      obstetric.birthHistory
                    }
                  />

                  <Field
                    label="Delivery Site"
                    value={
                      obstetric.deliverySite
                    }
                  />

                  <Field
                    label="Last Menstrual Period"
                    value={
                      obstetric.lmp
                    }
                  />

                </div>

              </Section>

              {/* PERINATAL HISTORY */}
              <Section title="Perinatal History">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Birth Weight"
                    value={
                      perinatal.bw
                    }
                  />

                  <Field
                    label="BF"
                    value={
                      perinatal.bf
                    }
                  />

                  <Field
                    label="Birth History"
                    value={
                      perinatal.birthHistory
                    }
                  />

                  <Field
                    label="Delivery Site"
                    value={
                      perinatal.deliverySite
                    }
                  />

                </div>

              </Section>

              {/* HISTORY SUMMARY */}
              <Section title="History Summary">

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

                  <Field
                    label="Medical History"
                    value={formatHistory(
                      medicalHistory,
                      currentPatient.medicalOther,
                    )}
                  />

                  <Field
                    label="Family History"
                    value={formatHistory(
                      familyHistory,
                      currentPatient.familyOther,
                    )}
                  />

                </div>

              </Section>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-4 sm:px-7">

          <p className="text-xs font-medium text-text-muted">
            Patient record
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}