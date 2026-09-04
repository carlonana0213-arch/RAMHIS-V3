import {
  useEffect,
  useState,
} from "react";

import {
  FiActivity,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClipboard,
  FiLock,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

import {
  addPatient,
  updatePatient,
  searchPatients,
} from "../../../../Services/patientService";

import AlertModal from "../../../../Components/ui/AlertModal";
import ConfirmModal from "../../../../Components/ui/ConfirmModal";

import GeneralStep from "../steps/GeneralStep";
import HistoryStep from "../steps/HistoryStep";
import ExaminationStep from "../steps/ExaminationStep";
import DepartmentStep from "../steps/DepartmentStep";
import PerinatalStep from "../steps/PerinatalStep";
import SummaryStep from "../steps/SummaryStep";
import DuplicatePatientModal from "./DuplicatePatientModal";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const createEmptyForm = () => ({
  generalInfo: {
    name: "",
    age: "",
    birthdate: "",
    sex: "",
    insurance: "",
    tobacco: "",
    alcohol: "",
    allergies: "",
    vaccine: "",
  },

  medicalHistory: [],
  familyHistory: [],

  medicalOther: "",
  familyOther: "",

  examination: {
    bp: "",
    temp: "",
    height: "",
    weight: "",
    bmi: "",
  },

  obstetricHistory: {},
  perinatalHistory: {},

  department: "",
  initComplaint: "",

  isPriority: false,
});

const getSteps = (form) => {
  const steps = [
    "General",
    "History",
    "Examination",
  ];

  if (
    form.generalInfo?.sex ===
    "Female"
  ) {
    steps.push(
      "Perinatal & OB"
    );
  }

  steps.push(
    "Department",
    "Summary"
  );

  return steps;
};

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

const AddPatientModal = ({
  onClose,
  ongoingEvent,
}) => {
  const [
    step,
    setStep,
  ] = useState(0);

  const [
    showConsent,
    setShowConsent,
  ] = useState(true);

  const [
    showDuplicateModal,
    setShowDuplicateModal,
  ] = useState(false);

  const [
    matchedPatient,
    setMatchedPatient,
  ] = useState(null);

  const [
    alertMessage,
    setAlertMessage,
  ] = useState("");

  /*
   * Determines whether closing the alert should also
   * close the Add Patient modal.
   *
   * false = validation/error alert
   * true  = successful save alert
   */
  const [
    closeAfterAlert,
    setCloseAfterAlert,
  ] = useState(false);

  const [
    confirmState,
    setConfirmState,
  ] = useState(null);

  const [
    editingExistingPatient,
    setEditingExistingPatient,
  ] = useState(false);

  const [
    duplicateChecked,
    setDuplicateChecked,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState(
    createEmptyForm()
  );

  const steps = getSteps(form);

  const currentStep =
    steps[step];

  /*
  |--------------------------------------------------------------------------
  | STEP MANAGEMENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      step >= steps.length
    ) {
      setStep(
        Math.max(
          0,
          steps.length - 1
        )
      );
    }
  }, [
    steps.length,
    step,
  ]);

  const next = () => {
    setStep((current) =>
      Math.min(
        current + 1,
        steps.length - 1
      )
    );
  };

  const prev = () => {
    setStep((current) =>
      Math.max(
        current - 1,
        0
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | DUPLICATE CHECK
  |--------------------------------------------------------------------------
  */

  const checkDuplicatePatient =
    async () => {
      const name =
        form.generalInfo?.name?.trim();

      const birthdate =
        form.generalInfo?.birthdate;

      if (
        !name ||
        !birthdate
      ) {
        return false;
      }

      try {
        const matches =
          await searchPatients(
            name,
            birthdate
          );

        if (
          Array.isArray(matches) &&
          matches.length > 0
        ) {
          setMatchedPatient(
            matches[0]
          );

          setShowDuplicateModal(
            true
          );

          return true;
        }

        return false;
      } catch (error) {
        console.error(
          "Duplicate patient check failed:",
          error
        );

        /*
         * Don't block registration if the
         * duplicate search itself fails.
         */
        return false;
      }
    };

  /*
  |--------------------------------------------------------------------------
  | BUILD PAYLOAD
  |--------------------------------------------------------------------------
  */

  const buildPayload = () => {
    const medicalHistory =
      Array.isArray(
        form.medicalHistory
      )
        ? form.medicalHistory.map(
            (item) =>
              item === "Other"
                ? form.medicalOther ||
                  "Other"
                : item
          )
        : [];

    const familyHistory =
      Array.isArray(
        form.familyHistory
      )
        ? form.familyHistory.map(
            (item) =>
              item === "Other"
                ? form.familyOther ||
                  "Other"
                : item
          )
        : [];

    return {
      generalInfo: {
        ...form.generalInfo,

        name:
          form.generalInfo?.name ||
          "",

        age:
          form.generalInfo?.age ===
          ""
            ? null
            : Number(
                form.generalInfo?.age
              ),
      },

      examination: {
        ...form.examination,
      },

      medicalHistory,

      familyHistory,

      obstetricHistory:
        form.obstetricHistory ||
        {},

      perinatalHistory:
        form.perinatalHistory ||
        {},

      department:
        form.department || "",

      initComplaint:
        form.initComplaint || "",

      isPriority:
        Boolean(form.isPriority),

      location:
        ongoingEvent?.location ||
        "",

      missionDate:
        ongoingEvent?.date ||
        new Date(),

      eventId:
        ongoingEvent?._id || "",

      eventTitle:
        ongoingEvent?.title || "",

      status: "waiting",
    };
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT NEW / UPDATED PATIENT
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async () => {
      const missingFields = [];

      const name =
        form.generalInfo?.name?.trim();

      const sex =
        form.generalInfo?.sex?.trim();

      const birthdate =
        form.generalInfo?.birthdate?.trim();

      const department =
        form.department?.trim();

      if (!name) {
        missingFields.push({
          step: "Step 1",
          message:
            "Name is required.",
        });
      }

      if (!sex) {
        missingFields.push({
          step: "Step 1",
          message:
            "Gender is required.",
        });
      }

      if (!birthdate) {
        missingFields.push({
          step: "Step 1",
          message:
            "Birthday is required.",
        });
      }

      if (!department) {
        missingFields.push({
          step: "Step 4",
          message:
            "Department is required.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | STOP SUBMISSION IF REQUIRED FIELDS ARE MISSING
      |--------------------------------------------------------------------------
      */

      if (
        missingFields.length > 0
      ) {
        const step1Fields =
          missingFields
            .filter(
              (field) =>
                field.step ===
                "Step 1"
            )
            .map(
              (field) =>
                `- ${field.message}`
            )
            .join("\n");

        const step4Fields =
          missingFields
            .filter(
              (field) =>
                field.step ===
                "Step 4"
            )
            .map(
              (field) =>
                `- ${field.message}`
            )
            .join("\n");

        const sections = [];

        if (step1Fields) {
          sections.push(
            `Step 1\n\n${step1Fields}`
          );
        }

        if (step4Fields) {
          sections.push(
            `Step 4\n\n${step4Fields}`
          );
        }

        /*
         * IMPORTANT:
         * This is only a validation alert.
         * Closing it must NOT close the
         * Add Patient modal.
         */
        setCloseAfterAlert(false);

        setAlertMessage(
          `Required Fields Missing:\n\n${sections.join(
            "\n\n"
          )}\n\nPlease complete the required fields before submitting the patient.`
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | DUPLICATE PATIENT CHECK
      |--------------------------------------------------------------------------
      */

      if (
        !editingExistingPatient &&
        !duplicateChecked
      ) {
        const duplicateFound =
          await checkDuplicatePatient();

        /*
         * Stop here if duplicate was found.
         * DuplicatePatientModal handles the next action.
         */
        if (duplicateFound) {
          return;
        }

        /*
         * No duplicate found.
         * Allow actual submission.
         */
        setDuplicateChecked(true);
      }

      /*
      |--------------------------------------------------------------------------
      | SAVE PATIENT
      |--------------------------------------------------------------------------
      */

      try {
        const payload =
          buildPayload();

        if (
          editingExistingPatient &&
          matchedPatient?._id
        ) {
          await updatePatient(
            matchedPatient._id,
            payload
          );

          /*
           * Successful save:
           * Alert can close the parent modal.
           */
          setCloseAfterAlert(true);

          setAlertMessage(
            "Patient record updated and queued successfully."
          );
        } else {
          console.log(
            "🚨 addPatient is being called",
            payload
          );

          await addPatient(
            payload
          );

          /*
           * Successful save:
           * Alert can close the parent modal.
           */
          setCloseAfterAlert(true);

          setAlertMessage(
            "Patient added to the queue successfully."
          );
        }

        /*
         * Reset duplicate-flow state.
         */
        setDuplicateChecked(
          false
        );

        setEditingExistingPatient(
          false
        );
      } catch (error) {
        console.error(
          "Failed to save patient:",
          error
        );

        /*
         * Error alert must keep the
         * Add Patient modal open.
         */
        setCloseAfterAlert(false);

        setDuplicateChecked(
          false
        );

        setAlertMessage(
          error?.message ||
            "Failed to save patient."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | REUSE EXISTING PATIENT
  |--------------------------------------------------------------------------
  */

  const reusePatientRecord =
    async () => {
      if (
        !matchedPatient?._id
      ) {
        return;
      }

      try {
        await updatePatient(
          matchedPatient._id,
          {
            status: "waiting",

            department:
              form.department?.trim()
                ? form.department
                : matchedPatient
                    .department ||
                  "General",

            initComplaint:
              form.initComplaint?.trim()
                ? form.initComplaint
                : matchedPatient
                    .initComplaint ||
                  "",

            isPriority:
              Boolean(
                form.isPriority ??
                  matchedPatient.isPriority
              ),

            missionDate:
              ongoingEvent?.date ||
              new Date(),

            location:
              ongoingEvent?.location ||
              matchedPatient.location ||
              "",

            eventId:
              ongoingEvent?._id ||
              matchedPatient.eventId ||
              "",

            eventTitle:
              ongoingEvent?.title ||
              matchedPatient.eventTitle ||
              "",
          }
        );

        setShowDuplicateModal(
          false
        );

        /*
         * Reusing the patient was successful.
         */
        setCloseAfterAlert(true);

        setAlertMessage(
          "Existing patient record added to the current queue."
        );
      } catch (error) {
        console.error(
          "Failed to reuse patient:",
          error
        );

        /*
         * Error must keep the
         * Add Patient modal open.
         */
        setCloseAfterAlert(false);

        setAlertMessage(
          error?.message ||
            "Failed to add patient to queue."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE EXISTING PATIENT INFO
  |--------------------------------------------------------------------------
  */

  const updateExistingPatientInfo =
    () => {
      if (
        !matchedPatient?._id
      ) {
        return;
      }

      console.log(
        "✏️ UPDATING EXISTING PATIENT ID:",
        matchedPatient._id
      );

      setEditingExistingPatient(
        true
      );

      setDuplicateChecked(
        true
      );

      setShowDuplicateModal(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | CREATE NEW ANYWAY
  |--------------------------------------------------------------------------
  */

  const createNewPatientAnyway =
    () => {
      setShowDuplicateModal(
        false
      );

      setMatchedPatient(
        null
      );

      setDuplicateChecked(
        true
      );
    };

  /*
  |--------------------------------------------------------------------------
  | CLOSE / RESET
  |--------------------------------------------------------------------------
  */

  const resetAndClose =
    () => {
      setForm(
        createEmptyForm()
      );

      setStep(0);

      setShowConsent(true);

      setShowDuplicateModal(
        false
      );

      setMatchedPatient(
        null
      );

      setDuplicateChecked(
        false
      );

      setEditingExistingPatient(
        false
      );

      setConfirmState(
        null
      );

      setAlertMessage("");

      setCloseAfterAlert(
        false
      );

      onClose?.();
    };

  /*
  |--------------------------------------------------------------------------
  | KEYBOARD NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleEnterKey =
    (event) => {
      if (
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      const container =
        event.currentTarget.closest(
          ".step-wrapper"
        );

      if (!container) {
        return;
      }

      const elements =
        Array.from(
          container.querySelectorAll(
            "input, select, textarea, .button-group"
          )
        );

      const current =
        event.target.closest(
          ".button-group"
        ) ||
        event.target;

      const index =
        elements.indexOf(
          current
        );

      const nextElement =
        elements[index + 1];

      if (nextElement) {
        if (
          nextElement.classList.contains(
            "button-group"
          )
        ) {
          nextElement.focus();

          nextElement
            .querySelector(
              "button"
            )
            ?.focus();
        } else {
          nextElement.focus();
        }
      } else {
        document
          .querySelector(
            ".next-btn"
          )
          ?.click();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">

      {/* =====================================================
          CONSENT SCREEN
      ====================================================== */}

      {showConsent ? (
        <div className="w-full max-w-3xl overflow-hidden rounded-[24px] border border-border-soft bg-surface shadow-2xl">

          {/* CONSENT HEADER */}

          <div className="border-b border-border-soft bg-primary-50/60 px-6 py-6 sm:px-8">
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-xl text-white shadow-lg shadow-primary-700/20">
                <FiActivity />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-700">
                  Patient Registration
                </span>

                <h3 className="mt-1 text-xl font-bold tracking-tight text-primary-900">
                  Patient Consent
                </h3>

                <p className="mt-1 text-sm text-text-muted">
                  Please read the following consent information before continuing.
                </p>
              </div>

            </div>
          </div>

          {/* CONSENT CONTENT */}

          <div className="max-h-[62vh] overflow-y-auto px-6 py-6 sm:px-8">

            <div className="rounded-2xl border border-border-soft bg-surface-muted/50 p-5 sm:p-6">

              <div className="space-y-5 text-sm leading-7 text-text-secondary">

                <p>
                  Ang mga boluntaryo ng RAM
                  (doktor, dentista, siruhano,
                  therapist atbp) ay maaring
                  hindi makapagbigay sa akin ng
                  lahat ng mga serbisyo na
                  kailangan ko.
                </p>

                <p>
                  <strong className="font-bold text-text-primary">
                    PERO
                  </strong>{" "}
                  nais ko pa ring kumunsulta sa
                  RAM volunteer team at
                  tumanggap ng uri ng paggamot
                  na inaalok ngayon.
                </p>

                <p>
                  <strong className="font-bold text-text-primary">
                    PINALALAYA
                  </strong>{" "}
                  at inilabas ko ang RAM
                  Philippines o sinumang tao o
                  mga organisasyon na kumikilos
                  para sa kanila o nag-sponsor o
                  nagboluntaryo sa klinika na
                  ito...
                </p>

                <p>
                  Ibinibigay ko sa RAM at mga
                  ahente nito ang karapatang
                  gamitin ang aking mga larawan,
                  boses, at iba pa para sa
                  advertising or publishing ng
                  mga serbisyo ng RAM.
                </p>

              </div>
            </div>

            {/* PRIVACY NOTICE */}

            <div className="mt-4 flex gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">

              <FiLock className="mt-0.5 shrink-0 text-primary-700" />

              <div>
                <p className="text-xs font-bold text-primary-900">
                  Patient Information
                </p>

                <p className="mt-1 text-xs leading-5 text-primary-700">
                  Patient information entered in this form will be used for
                  medical record management and healthcare services.
                </p>
              </div>

            </div>
          </div>

          {/* CONSENT ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-border-soft bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">

            <button
              type="button"
              onClick={
                resetAndClose
              }
              className="rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-muted"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() =>
                setShowConsent(false)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-700/20 transition hover:bg-primary-800"
            >
              <FiCheck />

              I Understand, Continue
            </button>

          </div>
        </div>
      ) : (

        /* =====================================================
            REGISTRATION MODAL
        ====================================================== */

        <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-border-soft bg-surface shadow-2xl">

          {/* =================================================
              MODAL HEADER
          ================================================= */}

          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border-soft bg-surface px-5 py-4 sm:px-6">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <FiClipboard size={19} />
              </div>

              <div className="min-w-0">

                <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  Patient Registration
                </span>

                <h2 className="truncate text-base font-bold tracking-tight text-primary-900 sm:text-lg">
                  {editingExistingPatient
                    ? "Update Patient Record"
                    : "Register Patient"}
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  Step {step + 1} of{" "}
                  {steps.length}

                  <span className="mx-1.5 text-border-strong">
                    ·
                  </span>

                  {currentStep}
                </p>

              </div>
            </div>

            <button
              type="button"
              aria-label="Close patient registration"
              onClick={() =>
                setConfirmState({
                  message:
                    "Close patient registration? Unsaved changes will be lost.",
                  onConfirm:
                    resetAndClose,
                })
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-text-muted transition-all hover:border-border-soft hover:bg-surface-muted hover:text-status-critical-text"
            >
              <FiX size={19} />
            </button>

          </div>

          {/* =================================================
              PROGRESS STEPS
          ================================================= */}

          <div className="shrink-0 border-b border-border-soft bg-surface-muted/30 px-5 py-4 sm:px-6">

            <div className="flex w-full items-start gap-0 overflow-x-auto pb-1">

              {steps.map(
                (
                  label,
                  index
                ) => {
                  const isCompleted =
                    index < step;

                  const isActive =
                    index === step;

                  return (
                    <div
                      key={label}
                      className="flex min-w-[115px] flex-1 items-start last:flex-none"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setStep(index)
                        }
                        className="group flex w-full flex-col items-start text-left"
                      >

                        <div className="flex w-full items-center">

                          {/* STEP NUMBER */}

                          <div
                            className={[
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",

                              isCompleted
                                ? "bg-primary-700 text-white"
                                : isActive
                                ? "bg-primary-700 text-white ring-4 ring-primary-100"
                                : "border border-border-strong bg-surface text-text-muted group-hover:border-primary-300 group-hover:text-primary-700",
                            ].join(
                              " "
                            )}
                          >
                            {isCompleted ? (
                              <FiCheck
                                size={
                                  15
                                }
                              />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {/* CONNECTOR */}

                          {index <
                            steps.length -
                              1 && (
                            <div
                              className={[
                                "mx-2 hidden h-px flex-1 sm:block",

                                isCompleted
                                  ? "bg-primary-400"
                                  : "bg-border-soft",
                              ].join(
                                " "
                              )}
                            />
                          )}

                        </div>

                        <span
                          className={[
                            "mt-2 max-w-[110px] text-[10px] font-semibold leading-tight sm:text-[11px]",

                            isActive
                              ? "text-primary-700"
                              : isCompleted
                              ? "text-text-primary"
                              : "text-text-muted",
                          ].join(
                            " "
                          )}
                        >
                          {label}
                        </span>

                      </button>

                    </div>
                  );
                }
              )}

            </div>
          </div>

          {/* =================================================
              FORM CONTENT
          ================================================= */}

          <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted/20">

            <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-6 sm:py-8">

              {currentStep ===
                "General" && (
                <GeneralStep
                  form={form}
                  setForm={
                    setForm
                  }
                />
              )}

              {currentStep ===
                "History" && (
                <HistoryStep
                  form={form}
                  setForm={
                    setForm
                  }
                />
              )}

              {currentStep ===
                "Examination" && (
                <ExaminationStep
                  form={form}
                  setForm={
                    setForm
                  }
                />
              )}

              {currentStep ===
                "Perinatal & OB" && (
                <PerinatalStep
                  form={form}
                  setForm={
                    setForm
                  }
                  handleEnterKey={
                    handleEnterKey
                  }
                />
              )}

              {currentStep ===
                "Department" && (
                <DepartmentStep
                  form={form}
                  setForm={
                    setForm
                  }
                />
              )}

              {currentStep ===
                "Summary" && (
                <SummaryStep
                  form={form}
                />
              )}

            </div>
          </div>

          {/* =================================================
              FOOTER ACTIONS
          ================================================= */}

          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border-soft bg-surface px-5 py-4 sm:px-6">

            <div className="min-w-0">

              {step > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-surface-muted"
                >
                  <FiArrowLeft />

                  <span className="hidden sm:inline">
                    Back
                  </span>
                </button>
              )}

            </div>

            <div className="flex items-center gap-3">

              {step <
              steps.length - 1 ? (
                <button
                  type="button"
                  className="next-btn inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-700/20 transition-all hover:bg-primary-800 hover:shadow-primary-700/30"
                  onClick={next}
                >
                  Continue

                  <FiArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-700/20 transition-all hover:bg-primary-800 hover:shadow-primary-700/30"
                >
                  <FiUserPlus />

                  {editingExistingPatient
                    ? "Update & Queue"
                    : "Submit Patient"}
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          DUPLICATE PATIENT MODAL
      ====================================================== */}

      {showDuplicateModal &&
        matchedPatient && (
          <DuplicatePatientModal
            patient={
              matchedPatient
            }

            onReuse={() =>
              setConfirmState({
                message:
                  "Reuse this patient record and add them to the current medical mission queue?",

                onConfirm:
                  async () => {
                    setConfirmState(
                      null
                    );

                    await reusePatientRecord();
                  },
              })
            }

            onUpdate={
              updateExistingPatientInfo
            }

            onCreateNew={
              createNewPatientAnyway
            }

            onCancel={() => {
              resetAndClose();
            }}
          />
        )}

      {/* =====================================================
          CONFIRM MODAL
      ====================================================== */}

      {confirmState && (
        <ConfirmModal
          message={
            confirmState.message
          }

          onConfirm={
            confirmState.onConfirm
          }

          onCancel={
            resetAndClose
          }
        />
      )}

      {/* =====================================================
          ALERT MODAL
      ====================================================== */}

      {alertMessage && (
        <AlertModal
          message={
            alertMessage
          }

          onClose={() => {
            const shouldClose =
              closeAfterAlert;

            /*
             * Always remove the alert first.
             */
            setAlertMessage("");

            setCloseAfterAlert(
              false
            );

            /*
             * ONLY successful operations
             * close the Add Patient modal.
             *
             * Validation/error alerts simply
             * disappear and leave the form open.
             */
            if (shouldClose) {
              resetAndClose();
            }
          }}
        />
      )}

    </div>
  );
};

export default AddPatientModal;