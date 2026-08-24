import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPatientById,
  updatePatient,
} from "../../../../Services/patientService";

import {
  dashboardBadgeVariants,
} from "../../../../ui/variants";

/* ============================================================
   SECTION
============================================================ */

function Section({
  eyebrow,
  title,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border-soft bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.04)]">

      <div className="border-b border-border-soft px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-1">

          {eyebrow && (
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
              {eyebrow}
            </span>
          )}

          <h3 className="text-base font-bold tracking-tight text-primary-900">
            {title}
          </h3>

        </div>
      </div>

      <div className="p-4 sm:p-5">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (
    <div className="min-w-0 rounded-2xl border border-border-soft bg-surface-muted px-4 py-3">

      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 break-words text-sm font-semibold",
          hasValue
            ? "text-text-primary"
            : "text-text-subtle",
        ].join(" ")}
      >
        {hasValue
          ? String(value)
          : "Not provided"}
      </p>

    </div>
  );
}

/* ============================================================
   YES / NO FIELD
============================================================ */

function YesNoField({
  label,
  value,
}) {
  let display = "Not provided";

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

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}) {
  const config = {
    waiting: {
      label: "Waiting",
      classes:
        "bg-status-watch-bg text-status-watch-text",
      dot:
        "bg-status-watch-dot",
    },

    beingSeen: {
      label: "Being Served",
      classes:
        "bg-primary-50 text-primary-700",
      dot:
        "bg-primary-600",
    },

    forPharmacy: {
      label: "For Pharmacy",
      classes:
        "bg-status-stable-bg text-status-stable-text",
      dot:
        "bg-status-stable-dot",
    },

    released: {
      label: "Released",
      classes:
        "bg-slate-100 text-text-secondary",
      dot:
        "bg-slate-400",
    },
  };

  const item =
    config[status] || {
      label:
        status || "Unknown",
      classes:
        "bg-slate-100 text-text-secondary",
      dot:
        "bg-slate-400",
    };

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full",
        "px-3 py-1.5 text-[10px] font-bold uppercase",
        "tracking-[0.08em]",
        item.classes,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          item.dot,
        ].join(" ")}
      />

      {item.label}
    </span>
  );
}

/* ============================================================
   HISTORY CONDITION
============================================================ */

function HistoryCondition({
  label,
  active,
  value,
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-center justify-between gap-3",
        "rounded-2xl border px-4 py-3",
        active
          ? "border-primary-100 bg-primary-50"
          : "border-border-soft bg-surface-muted",
      ].join(" ")}
    >

      <span
        className={[
          "text-sm font-semibold",
          active
            ? "text-primary-900"
            : "text-text-muted",
        ].join(" ")}
      >
        {label}
      </span>

      {active ? (
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-700 shadow-sm">
          {value || "Yes"}
        </span>
      ) : (
        <span className="text-xs font-medium text-text-subtle">
          —
        </span>
      )}

    </div>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function PatientSkeleton() {
  return (
    <div className="space-y-5">

      {Array.from(
        { length: 5 },
      ).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="animate-pulse overflow-hidden rounded-[22px] border border-border-soft bg-surface"
        >

          <div className="border-b border-border-soft px-5 py-4">
            <div className="h-3 w-24 rounded bg-slate-200" />

            <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">

            {Array.from(
              { length: 3 },
            ).map((_, fieldIndex) => (
              <div
                key={fieldIndex}
                className="rounded-2xl border border-border-soft bg-surface-muted p-4"
              >
                <div className="h-2.5 w-16 rounded bg-slate-200" />

                <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
              </div>
            ))}

          </div>

        </div>
      ))}

    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function PatientViewModal({
  patient,
  onClose,
}) {
  const [
    patientDetails,
    setPatientDetails,
  ] = useState(null);

  const [
    loadingPatient,
    setLoadingPatient,
  ] = useState(false);

  const [
    isPriority,
    setIsPriority,
  ] = useState(
    Boolean(patient?.isPriority),
  );

  const [
    savingPriority,
    setSavingPriority,
  ] = useState(false);

  /* ==========================================================
     LOAD COMPLETE PATIENT RECORD
  ========================================================== */

  useEffect(() => {
    const loadPatientDetails =
      async () => {
        if (!patient?._id) {
          setPatientDetails(null);
          return;
        }

        try {
          setLoadingPatient(true);

          const data =
            await getPatientById(
              patient._id,
            );

          setPatientDetails(data);
        } catch (error) {
          console.error(
            "Failed to load patient details:",
            error,
          );

          setPatientDetails(
            patient,
          );
        } finally {
          setLoadingPatient(false);
        }
      };

    loadPatientDetails();
  }, [patient?._id]);

  /* ==========================================================
     UPDATE PRIORITY WHEN PATIENT CHANGES
  ========================================================== */

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

  /* ==========================================================
     CURRENT PATIENT
  ========================================================== */

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

  const medicalHistory =
    Array.isArray(
      currentPatient.medicalHistory,
    )
      ? currentPatient.medicalHistory
      : [];

  const familyHistory =
    Array.isArray(
      currentPatient.familyHistory,
    )
      ? currentPatient.familyHistory
      : [];

  /* ==========================================================
     HELPERS
  ========================================================== */

  const hasMedicalHistory =
    (condition) =>
      medicalHistory.includes(
        condition,
      );

  const hasFamilyHistory =
    (condition) =>
      familyHistory.includes(
        condition,
      );

  const formatHistory =
    (
      history,
      otherValue,
    ) => {
      if (!history.length) {
        return "No history recorded";
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

  /* ==========================================================
     PATIENT INFORMATION
  ========================================================== */

  const name =
    general.name ||
    currentPatient.name ||
    "Unnamed Patient";

  const sex =
    general.sex ||
    general.gender ||
    currentPatient.sex ||
    "Not provided";

  const age =
    general.age ??
    currentPatient.age ??
    "Not provided";

  const department =
    currentPatient.department ||
    "Not assigned";

  const status =
    currentPatient.status ||
    "Unknown";

  const initials =
    useMemo(() => {
      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) =>
          word
            .charAt(0)
            .toUpperCase(),
        )
        .join("");
    }, [name]);

  /* ==========================================================
     PRIORITY UPDATE
  ========================================================== */

  const handlePriorityToggle =
    async () => {
      const newValue =
        !isPriority;

      try {
        setSavingPriority(true);

        await updatePatient(
          currentPatient._id,
          {
            isPriority:
              newValue,
          },
        );

        setIsPriority(
          newValue,
        );

        setPatientDetails(
          (previous) =>
            previous
              ? {
                  ...previous,
                  isPriority:
                    newValue,
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

  /* ==========================================================
     RENDER
  ========================================================== */

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

      <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-surface shadow-2xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="border-b border-border bg-surface px-5 py-5 sm:px-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* PATIENT IDENTITY */}

            <div className="flex min-w-0 items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-lg font-extrabold text-primary-700 ring-1 ring-primary-100">
                {initials || "PT"}
              </div>

              <div className="min-w-0">

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
                  Patient Record
                </span>

                <h2 className="mt-1 truncate text-xl font-extrabold tracking-tight text-primary-900 sm:text-2xl">
                  {name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-text-muted">

                  <span>
                    {age !== "Not provided"
                      ? `${age} years old`
                      : age}
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

            {/* ACTIONS */}

            <div className="flex flex-wrap items-center gap-3">

              <StatusBadge
                status={status}
              />

              <div
                className={[
                  "flex items-center gap-3 rounded-2xl border px-3 py-2",
                  isPriority
                    ? "border-status-critical-bg bg-status-critical-bg"
                    : "border-border-soft bg-surface-muted",
                ].join(" ")}
              >

                <div className="hidden sm:block">

                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">
                    Queue Status
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-text-primary">
                    Priority Patient
                  </p>

                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    isPriority
                  }
                  disabled={
                    savingPriority ||
                    loadingPatient
                  }
                  onClick={
                    handlePriorityToggle
                  }
                  className={[
                    "relative h-7 w-12 shrink-0 rounded-full transition",
                    isPriority
                      ? "bg-status-critical-text"
                      : "bg-slate-300",
                    savingPriority ||
                    loadingPatient
                      ? "cursor-not-allowed opacity-60"
                      : "",
                  ].join(" ")}
                >

                  <span
                    className={[
                      "absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition",
                      isPriority
                        ? "left-6"
                        : "left-1",
                    ].join(" ")}
                  />

                </button>

              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft text-xl font-medium text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
                aria-label="Close"
              >
                ×
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">

          {loadingPatient ? (
            <PatientSkeleton />
          ) : (
            <div className="space-y-5">

              {/* GENERAL INFORMATION */}

              <Section
                eyebrow="Personal Profile"
                title="General Information"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Full Name"
                    value={name}
                  />

                  <Field
                    label="Birthdate"
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
                    label="Tobacco Use"
                    value={
                      general.tobacco
                    }
                  />

                  <YesNoField
                    label="Alcohol Use"
                    value={
                      general.alcohol
                    }
                  />

                </div>

              </Section>

              {/* PATIENT INFORMATION */}

              <Section
                eyebrow="Clinical Notes"
                title="Patient Information"
              >

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

                  <Field
                    label="Known Allergies"
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
                    label="Initial Complaint"
                    value={
                      currentPatient.initComplaint
                    }
                  />

                </div>

              </Section>

              {/* EXAMINATION */}

              <Section
                eyebrow="Clinical Assessment"
                title="Examination"
              >

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

              <Section
                eyebrow="Health Background"
                title="Medical History"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <HistoryCondition
                    label="Diabetes"
                    active={
                      hasMedicalHistory(
                        "Diabetes",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Hypertension"
                    active={
                      hasMedicalHistory(
                        "Hypertension",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Asthma"
                    active={
                      hasMedicalHistory(
                        "Asthma",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Cancer"
                    active={
                      hasMedicalHistory(
                        "Cancer",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Stroke"
                    active={
                      hasMedicalHistory(
                        "Stroke",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Epilepsy"
                    active={
                      hasMedicalHistory(
                        "Epilepsy",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Tuberculosis"
                    active={
                      hasMedicalHistory(
                        "Tuberculosis",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Other"
                    active={
                      hasMedicalHistory(
                        "Other",
                      )
                    }
                    value={
                      currentPatient.medicalOther
                    }
                  />

                </div>

              </Section>

              {/* FAMILY HISTORY */}

              <Section
                eyebrow="Health Background"
                title="Family History"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <HistoryCondition
                    label="Diabetes"
                    active={
                      hasFamilyHistory(
                        "Diabetes",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Hypertension"
                    active={
                      hasFamilyHistory(
                        "Hypertension",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Asthma"
                    active={
                      hasFamilyHistory(
                        "Asthma",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Cancer"
                    active={
                      hasFamilyHistory(
                        "Cancer",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Stroke"
                    active={
                      hasFamilyHistory(
                        "Stroke",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Epilepsy"
                    active={
                      hasFamilyHistory(
                        "Epilepsy",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Tuberculosis"
                    active={
                      hasFamilyHistory(
                        "Tuberculosis",
                      )
                    }
                  />

                  <HistoryCondition
                    label="Other"
                    active={
                      hasFamilyHistory(
                        "Other",
                      )
                    }
                    value={
                      currentPatient.familyOther
                    }
                  />

                </div>

              </Section>

              {/* OBSTETRIC HISTORY */}

              <Section
                eyebrow="Maternal Information"
                title="Obstetric History"
              >

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

              <Section
                eyebrow="Newborn Information"
                title="Perinatal History"
              >

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

              {/* RECORD SUMMARY */}

              <Section
                eyebrow="Record Overview"
                title="History Summary"
              >

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

                  <Field
                    label="Medical History Summary"
                    value={formatHistory(
                      medicalHistory,
                      currentPatient.medicalOther,
                    )}
                  />

                  <Field
                    label="Family History Summary"
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

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-4 sm:px-7">

          <span
            className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
          >
            Patient Record
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
          >
            Close Record
          </button>

        </div>

      </div>

    </div>
  );
}