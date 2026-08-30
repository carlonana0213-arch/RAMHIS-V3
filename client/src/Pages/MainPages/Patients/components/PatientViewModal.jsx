import { useEffect, useMemo, useState } from "react";

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
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border-soft bg-slate-50/70 px-5 py-4">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            {eyebrow}
          </p>
        )}

        <h3 className="mt-1 text-sm font-bold text-text-primary">
          {title}
        </h3>
      </div>

      <div className="p-5">
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
  editing = false,
  type = "text",
  onChange,
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-slate-50/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
        {label}
      </p>

      {editing ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      ) : (
        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value === null ||
          value === undefined ||
          value === ""
            ? "—"
            : String(value)}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   SELECT FIELD
============================================================ */

function SelectField({
  label,
  value,
  options,
  editing = false,
  onChange,
}) {
  if (!editing) {
    return (
      <Field
        label={label}
        value={value}
      />
    );
  }

  return (
    <div className="rounded-xl border border-border-soft bg-slate-50/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
        {label}
      </p>

      <select
        value={value ?? ""}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border border-border-soft bg-surface px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      >
        <option value="">
          Select
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ============================================================
   YES / NO FIELD
============================================================ */

function YesNoField({
  label,
  value,
  editing = false,
  onChange,
}) {
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

  if (!editing) {
    return (
      <Field
        label={label}
        value={display}
      />
    );
  }

  return (
    <SelectField
      label={label}
      value={
        value === true ||
        value === "Yes" ||
        value === "yes"
          ? "Yes"
          : value === false ||
              value === "No" ||
              value === "no"
            ? "No"
            : ""
      }
      options={["Yes", "No"]}
      editing
      onChange={(event) =>
        onChange(
          event.target.value === "Yes"
        )
      }
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
        "bg-status-watch-text",
    },

    beingSeen: {
      label: "Being Served",
      classes:
        "bg-primary-50 text-primary-700",
      dot:
        "bg-primary-700",
    },

    forPharmacy: {
      label: "For Pharmacy",
      classes:
        "bg-status-stable-bg text-status-stable-text",
      dot:
        "bg-status-stable-text",
    },

    released: {
      label: "Released",
      classes:
        "bg-slate-100 text-text-secondary",
      dot:
        "bg-slate-400",
    },

    unconsulted: {
      label: "Unconsulted",
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
      ).map(
        (_, sectionIndex) => (
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
              ).map(
                (_, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className="rounded-2xl border border-border-soft bg-surface-muted p-4"
                  >
                    <div className="h-2.5 w-16 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                  </div>
                ),
              )}
            </div>
          </div>
        ),
      )}
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

  /*
   * EDIT MODE
   */
  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    editForm,
    setEditForm,
  ] = useState(null);

  const [
    savingChanges,
    setSavingChanges,
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
     RESET WHEN PATIENT CHANGES
  ========================================================== */

  useEffect(() => {
    setIsEditing(false);
    setEditForm(null);

    setIsPriority(
      Boolean(patient?.isPriority),
    );
  }, [
    patient?._id,
    patient?.isPriority,
  ]);

  /* ==========================================================
     CURRENT PATIENT
  ========================================================== */

  const currentPatient =
    patientDetails || patient;

  /* ==========================================================
     CREATE EDIT FORM
  ========================================================== */

  const createEditForm = (
    source,
  ) => {
    const generalInfo =
      source?.generalInfo || {};

    const examination =
      source?.examination || {};

    const obstetricHistory =
      source?.obstetricHistory || {};

    const perinatalHistory =
      source?.perinatalHistory || {};

    return {
      generalInfo: {
        name:
          generalInfo.name || "",

        age:
          generalInfo.age ?? "",

        birthdate:
          generalInfo.birthdate || "",

        sex:
          generalInfo.sex ||
          generalInfo.gender ||
          "",

        insurance:
          generalInfo.insurance || "",

        tobacco:
          generalInfo.tobacco || "",

        alcohol:
          generalInfo.alcohol || "",

        allergies:
          generalInfo.allergies || "",

        vaccine:
          generalInfo.vaccine || "",
      },

      examination: {
        bp:
          examination.bp || "",

        temp:
          examination.temp || "",

        height:
          examination.height || "",

        weight:
          examination.weight || "",

        bmi:
          examination.bmi || "",
      },

      obstetricHistory: {
        contraception:
          Boolean(
            obstetricHistory.contraception,
          ),

        type:
          obstetricHistory.type || "",

        gpfpal:
          obstetricHistory.gpfpal || "",

        bf:
          obstetricHistory.bf || "",

        birthHistory:
          obstetricHistory.birthHistory ||
          "",

        deliverySite:
          obstetricHistory.deliverySite ||
          "",

        lmp:
          obstetricHistory.lmp || "",
      },

      perinatalHistory: {
        bw:
          perinatalHistory.bw || "",

        bf:
          perinatalHistory.bf || "",

        birthHistory:
          perinatalHistory.birthHistory ||
          "",

        deliverySite:
          perinatalHistory.deliverySite ||
          "",
      },

      medicalHistory:
        Array.isArray(
          source?.medicalHistory,
        )
          ? [
              ...source.medicalHistory,
            ]
          : [],

      familyHistory:
        Array.isArray(
          source?.familyHistory,
        )
          ? [
              ...source.familyHistory,
            ]
          : [],

      department:
        source?.department || "",

      initComplaint:
        source?.initComplaint || "",

      isPriority:
        Boolean(
          source?.isPriority,
        ),
    };
  };

  /* ==========================================================
     START EDITING
  ========================================================== */

  const handleStartEditing =
    () => {
      setEditForm(
        createEditForm(
          currentPatient,
        ),
      );

      setIsEditing(true);
    };

  /* ==========================================================
     CANCEL EDITING
  ========================================================== */

  const handleCancelEditing =
    () => {
      setEditForm(
        createEditForm(
          currentPatient,
        ),
      );

      setIsPriority(
        Boolean(
          currentPatient?.isPriority,
        ),
      );

      setIsEditing(false);
    };

  /* ==========================================================
     UPDATE NESTED FIELD
  ========================================================== */

  const handleFieldChange = (
    section,
    field,
    value,
  ) => {
    setEditForm(
      (previous) => ({
        ...previous,

        [section]: {
          ...(previous?.[section] ||
            {}),
          [field]: value,
        },
      }),
    );
  };

  /* ==========================================================
     UPDATE ROOT FIELD
  ========================================================== */

  const handleRootFieldChange = (
    field,
    value,
  ) => {
    setEditForm(
      (previous) => ({
        ...previous,
        [field]: value,
      }),
    );
  };

  /* ==========================================================
     SAVE CHANGES
  ========================================================== */

  const handleSaveChanges =
    async () => {
      if (
        !currentPatient?._id ||
        !editForm ||
        savingChanges
      ) {
        return;
      }

      try {
        setSavingChanges(true);

        const payload = {
          generalInfo: {
            name:
              editForm.generalInfo
                ?.name || "",

            age:
              editForm.generalInfo
                ?.age === ""
                ? undefined
                : Number(
                    editForm.generalInfo
                      ?.age,
                  ),

            birthdate:
              editForm.generalInfo
                ?.birthdate || "",

            sex:
              editForm.generalInfo
                ?.sex || "",

            insurance:
              editForm.generalInfo
                ?.insurance || "",

            tobacco:
              editForm.generalInfo
                ?.tobacco || "",

            alcohol:
              editForm.generalInfo
                ?.alcohol || "",

            allergies:
              editForm.generalInfo
                ?.allergies || "",

            vaccine:
              editForm.generalInfo
                ?.vaccine || "",
          },

          examination: {
            bp:
              editForm.examination
                ?.bp || "",

            temp:
              editForm.examination
                ?.temp || "",

            height:
              editForm.examination
                ?.height || "",

            weight:
              editForm.examination
                ?.weight || "",

            bmi:
              editForm.examination
                ?.bmi || "",
          },

          obstetricHistory: {
            contraception:
              Boolean(
                editForm
                  .obstetricHistory
                  ?.contraception,
              ),

            type:
              editForm
                .obstetricHistory
                ?.type || "",

            gpfpal:
              editForm
                .obstetricHistory
                ?.gpfpal || "",

            bf:
              editForm
                .obstetricHistory
                ?.bf || "",

            birthHistory:
              editForm
                .obstetricHistory
                ?.birthHistory ||
              "",

            deliverySite:
              editForm
                .obstetricHistory
                ?.deliverySite ||
              "",

            lmp:
              editForm
                .obstetricHistory
                ?.lmp || "",
          },

          perinatalHistory: {
            bw:
              editForm
                .perinatalHistory
                ?.bw || "",

            bf:
              editForm
                .perinatalHistory
                ?.bf || "",

            birthHistory:
              editForm
                .perinatalHistory
                ?.birthHistory ||
              "",

            deliverySite:
              editForm
                .perinatalHistory
                ?.deliverySite ||
              "",
          },

          medicalHistory:
            editForm.medicalHistory ||
            [],

          familyHistory:
            editForm.familyHistory ||
            [],

          department:
            editForm.department ||
            "",

          initComplaint:
            editForm.initComplaint ||
            "",

          isPriority:
            Boolean(
              editForm.isPriority ??
                isPriority,
            ),
        };

        const updated =
          await updatePatient(
            currentPatient._id,
            payload,
          );

        /*
         * Update local modal state first.
         * This keeps the data correct if
         * the modal is ever reused without
         * immediately unmounting.
         */
        setPatientDetails(
          updated || {
            ...currentPatient,
            ...payload,
          },
        );

        setIsPriority(
          Boolean(
            payload.isPriority,
          ),
        );

        setIsEditing(false);

        /*
         * IMPORTANT:
         * Close only after the update succeeds.
         *
         * Patients.jsx already refreshes the
         * patient queue inside its onClose handler.
         */
        await onClose?.();

      } catch (error) {
        console.error(
          "Failed to save patient changes:",
          error,
        );

        alert(
          error?.message ||
            "Failed to save patient changes.",
        );
      } finally {
        setSavingChanges(false);
      }
    };

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
            isPriority: newValue,
          },
        );

        setIsPriority(
          newValue,
        );

        setPatientDetails(
          (previous) => ({
            ...(previous ||
              currentPatient),
            isPriority:
              newValue,
          }),
        );

        setEditForm(
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
          "Failed to update priority:",
          error,
        );

        alert(
          error?.message ||
            "Failed to update patient priority.",
        );
      } finally {
        setSavingPriority(false);
      }
    };

  /* ==========================================================
     DATA
  ========================================================== */

  const general =
    currentPatient.generalInfo ||
    {};

  const examination =
    currentPatient.examination ||
    {};

  const obstetric =
    currentPatient.obstetricHistory ||
    {};

  const perinatal =
    currentPatient.perinatalHistory ||
    {};

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
     HISTORY HELPERS
  ========================================================== */

  const formatHistory = (
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

  if (!patient) {
    return null;
  }

  /* ==========================================================
     EDIT VALUES
  ========================================================== */

  const editGeneral =
    editForm?.generalInfo || {};

  const editExamination =
    editForm?.examination || {};

  const editObstetric =
    editForm?.obstetricHistory || {};

  const editPerinatal =
    editForm?.perinatalHistory || {};

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">

      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-border-soft bg-surface shadow-2xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-7">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-sm font-bold text-primary-700">
              {initials || "P"}
            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
                Patient Record
              </p>

              <h2 className="truncate text-xl font-bold tracking-tight text-primary-900">
                {name}
              </h2>

              <p className="mt-0.5 truncate text-xs font-medium text-text-muted">
                {age} years old
                {" • "}
                {sex}
                {" • "}
                {department}
              </p>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-3">

            <StatusBadge
              status={status}
            />

            {/* PRIORITY */}

            <div
              className={[
                "hidden items-center gap-3 rounded-xl border px-3 py-2 sm:flex",
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

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">

          {loadingPatient ? (
            <PatientSkeleton />
          ) : (
            <div className="space-y-5">

              {/* =================================================
                  GENERAL INFORMATION
              ================================================= */}

              <Section
                eyebrow="Personal Profile"
                title="General Information"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Full Name"
                    value={
                      isEditing
                        ? editGeneral.name
                        : name
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "name",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Birthdate"
                    value={
                      isEditing
                        ? editGeneral.birthdate
                        : general.birthdate
                    }
                    editing={
                      isEditing
                    }
                    type="date"
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "birthdate",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Age"
                    value={
                      isEditing
                        ? editGeneral.age
                        : age
                    }
                    editing={
                      isEditing
                    }
                    type="number"
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "age",
                        event.target
                          .value,
                      )
                    }
                  />

                  <SelectField
                    label="Sex"
                    value={
                      isEditing
                        ? editGeneral.sex
                        : sex
                    }
                    options={[
                      "Male",
                      "Female",
                    ]}
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "sex",
                        event.target
                          .value,
                      )
                    }
                  />

                  <SelectField
                    label="Department"
                    value={
                      isEditing
                        ? editForm?.department
                        : department
                    }
                    options={[
                      "Pediatrics",
                      "Ortho",
                      "Opta",
                      "Dental",
                      "Cardio",
                      "General",
                    ]}
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleRootFieldChange(
                        "department",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Insurance"
                    value={
                      isEditing
                        ? editGeneral.insurance
                        : general.insurance
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "insurance",
                        event.target
                          .value,
                      )
                    }
                  />

                  <YesNoField
                    label="Tobacco Use"
                    value={
                      isEditing
                        ? editGeneral.tobacco
                        : general.tobacco
                    }
                    editing={
                      isEditing
                    }
                    onChange={(value) =>
                      handleFieldChange(
                        "generalInfo",
                        "tobacco",
                        value
                          ? "Yes"
                          : "No",
                      )
                    }
                  />

                  <YesNoField
                    label="Alcohol Use"
                    value={
                      isEditing
                        ? editGeneral.alcohol
                        : general.alcohol
                    }
                    editing={
                      isEditing
                    }
                    onChange={(value) =>
                      handleFieldChange(
                        "generalInfo",
                        "alcohol",
                        value
                          ? "Yes"
                          : "No",
                      )
                    }
                  />

                </div>

              </Section>

              {/* =================================================
                  PATIENT INFORMATION
              ================================================= */}

              <Section
                eyebrow="Clinical Notes"
                title="Patient Information"
              >

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

                  <Field
                    label="Known Allergies"
                    value={
                      isEditing
                        ? editGeneral.allergies
                        : general.allergies
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "allergies",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Vaccination"
                    value={
                      isEditing
                        ? editGeneral.vaccine
                        : general.vaccine
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "generalInfo",
                        "vaccine",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Initial Complaint"
                    value={
                      isEditing
                        ? editForm?.initComplaint
                        : currentPatient.initComplaint
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleRootFieldChange(
                        "initComplaint",
                        event.target
                          .value,
                      )
                    }
                  />

                </div>

              </Section>

              {/* =================================================
                  EXAMINATION
              ================================================= */}

              <Section
                eyebrow="Clinical Assessment"
                title="Examination"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <Field
                    label="Blood Pressure"
                    value={
                      isEditing
                        ? editExamination.bp
                        : examination.bp
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "examination",
                        "bp",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Temperature"
                    value={
                      isEditing
                        ? editExamination.temp
                        : examination.temp
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "examination",
                        "temp",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Height"
                    value={
                      isEditing
                        ? editExamination.height
                        : examination.height
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "examination",
                        "height",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Weight"
                    value={
                      isEditing
                        ? editExamination.weight
                        : examination.weight
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "examination",
                        "weight",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="BMI"
                    value={
                      isEditing
                        ? editExamination.bmi
                        : examination.bmi
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "examination",
                        "bmi",
                        event.target
                          .value,
                      )
                    }
                  />

                </div>

              </Section>

              {/* =================================================
                  OBSTETRIC HISTORY
              ================================================= */}

              <Section
                eyebrow="Maternal Information"
                title="Obstetric History"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <YesNoField
                    label="Contraception"
                    value={
                      isEditing
                        ? editObstetric.contraception
                        : obstetric.contraception
                    }
                    editing={
                      isEditing
                    }
                    onChange={(value) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "contraception",
                        value,
                      )
                    }
                  />

                  <Field
                    label="Type"
                    value={
                      isEditing
                        ? editObstetric.type
                        : obstetric.type
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "type",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="G/P (F/P/A/L)"
                    value={
                      isEditing
                        ? editObstetric.gpfpal
                        : obstetric.gpfpal
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "gpfpal",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="BF"
                    value={
                      isEditing
                        ? editObstetric.bf
                        : obstetric.bf
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "bf",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Birth History"
                    value={
                      isEditing
                        ? editObstetric.birthHistory
                        : obstetric.birthHistory
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "birthHistory",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Delivery Site"
                    value={
                      isEditing
                        ? editObstetric.deliverySite
                        : obstetric.deliverySite
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "deliverySite",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Last Menstrual Period"
                    value={
                      isEditing
                        ? editObstetric.lmp
                        : obstetric.lmp
                    }
                    editing={
                      isEditing
                    }
                    type="date"
                    onChange={(event) =>
                      handleFieldChange(
                        "obstetricHistory",
                        "lmp",
                        event.target
                          .value,
                      )
                    }
                  />

                </div>

              </Section>

              {/* =================================================
                  PERINATAL HISTORY
              ================================================= */}

              <Section
                eyebrow="Newborn Information"
                title="Perinatal History"
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <Field
                    label="Birth Weight"
                    value={
                      isEditing
                        ? editPerinatal.bw
                        : perinatal.bw
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "perinatalHistory",
                        "bw",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="BF"
                    value={
                      isEditing
                        ? editPerinatal.bf
                        : perinatal.bf
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "perinatalHistory",
                        "bf",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Birth History"
                    value={
                      isEditing
                        ? editPerinatal.birthHistory
                        : perinatal.birthHistory
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "perinatalHistory",
                        "birthHistory",
                        event.target
                          .value,
                      )
                    }
                  />

                  <Field
                    label="Delivery Site"
                    value={
                      isEditing
                        ? editPerinatal.deliverySite
                        : perinatal.deliverySite
                    }
                    editing={
                      isEditing
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        "perinatalHistory",
                        "deliverySite",
                        event.target
                          .value,
                      )
                    }
                  />

                </div>

              </Section>

              {/* =================================================
                  RECORD SUMMARY
              ================================================= */}

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
        ====================================================== */}

        <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-4 sm:px-7">

          <span
            className={`${dashboardBadgeVariants.base} ${dashboardBadgeVariants.overview}`}
          >
            Patient Record
          </span>

          <div className="flex items-center gap-3">

            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={
                    handleCancelEditing
                  }
                  disabled={
                    savingChanges
                  }
                  className="rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-sm font-bold text-text-secondary shadow-sm transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSaveChanges
                  }
                  disabled={
                    savingChanges
                  }
                  className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingChanges
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={
                    handleStartEditing
                  }
                  disabled={
                    loadingPatient
                  }
                  className="rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-sm font-bold text-text-secondary shadow-sm transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Edit Record
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800"
                >
                  Close Record
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}