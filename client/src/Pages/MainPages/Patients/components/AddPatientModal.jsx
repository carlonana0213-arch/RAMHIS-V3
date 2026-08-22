import {
  useEffect,
  useState,
} from "react";

import {
  FiActivity,
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

const createEmptyForm =
  () => ({
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

const getSteps = (
  form
) => {
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
         * Don't block registration
         * when the duplicate search
         * itself fails.
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
  const medicalHistory = Array.isArray(
    form.medicalHistory
  )
    ? form.medicalHistory.map((item) =>
        item === "Other"
          ? form.medicalOther || "Other"
          : item
      )
    : [];

  const familyHistory = Array.isArray(
    form.familyHistory
  )
    ? form.familyHistory.map((item) =>
        item === "Other"
          ? form.familyOther || "Other"
          : item
      )
    : [];

  return {
    generalInfo: {
      ...form.generalInfo,

      name:
        form.generalInfo?.name || "",

      age:
        form.generalInfo?.age === ""
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
      form.obstetricHistory || {},

    perinatalHistory:
      form.perinatalHistory || {},

    department:
      form.department || "",

    initComplaint:
      form.initComplaint || "",

    isPriority:
      Boolean(form.isPriority),

    location:
      ongoingEvent?.location || "",

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

  const handleSubmit = async () => {
  // First submission: check for duplicate
  if (!editingExistingPatient && !duplicateChecked) {
    const duplicateFound = await checkDuplicatePatient();

    // STOP here if duplicate was found.
    // Do NOT continue to addPatient().
    if (duplicateFound) {
      return;
    }

    // No duplicate, now allow actual submission
    setDuplicateChecked(true);
  }

  try {
    const payload = buildPayload();

    if (
      editingExistingPatient &&
      matchedPatient?._id
    ) {
      await updatePatient(
        matchedPatient._id,
        payload
      );

      setAlertMessage(
        "Patient record updated and queued successfully."
      );
    } else {
  console.log(
    "🚨 addPatient is being called",
    payload
  );

  await addPatient(payload);
      
      

      setAlertMessage(
        "Patient added to the queue successfully."
      );
    }

    setDuplicateChecked(false);
    setEditingExistingPatient(false);

  } catch (error) {
    console.error(
      "Failed to save patient:",
      error
    );

    setDuplicateChecked(false);

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

        setAlertMessage(
          "Existing patient record added to the current queue."
        );
      } catch (error) {
        console.error(
          "Failed to reuse patient:",
          error
        );

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

  const updateExistingPatientInfo = () => {
  if (!matchedPatient?._id) {
    return;
  }

  console.log(
    "✏️ UPDATING EXISTING PATIENT ID:",
    matchedPatient._id
  );

  setEditingExistingPatient(true);
  setDuplicateChecked(true);
  setShowDuplicateModal(false);
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
      setMatchedPatient(null);
      setDuplicateChecked(
        false
      );
      setEditingExistingPatient(
        false
      );
      setConfirmState(null);
      setAlertMessage("");

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
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      {/* CONSENT */}
   {showConsent ? (
  <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
    <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">

            <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <FiActivity
                style={{
                  color:
                    "var(--primary-blue)",
                }}
              />

              Pakibasa sa pasyente bago
              magpatuloy:
            </h3>

           <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">

              <p>
                Ang mga boluntaryo ng RAM
                (doktor, dentista, siruhano,
                therapist atbp) ay maaring
                hindi makapagbigay sa akin ng
                lahat ng mga serbisyo na
                kailangan ko.
              </p>

              <p>
                <strong>
                  PERO
                </strong>{" "}
                nais ko pa ring kumunsulta sa
                RAM volunteer team at
                tumanggap ng uri ng paggamot
                na inaalok ngayon.
              </p>

              <p>
                <strong>
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

            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">

              <button
  type="button"
  onClick={resetAndClose}
>
  Cancel
</button>

              <button
                type="button"
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                onClick={() =>
                  setShowConsent(false)
                }
              >
                Proceed
              </button>

            </div>
          </div>
        </div>
      ) : (
  <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">

            <h2>
              {editingExistingPatient
                ? "Update Patient"
                : steps[step]}
            </h2>

            <button
              type="button"
              className="close-btn"
              onClick={() =>
                setConfirmState({
                  message:
                    "Close patient registration? Unsaved changes will be lost.",
                  onConfirm:
                    resetAndClose,
                })
              }
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">

            {/* PROGRESS */}
            <div className="progress-container">

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
                      className={`progress-step ${
                        isCompleted
                          ? "completed"
                          : ""
                      } ${
                        isActive
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setStep(index)
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >

                      <div className="circle">
                        {isCompleted
                          ? "✓"
                          : index + 1}
                      </div>

                      <span className="label">
                        {label}
                      </span>

                    </div>
                  );
                }
              )}
            </div>

            {/* STEP CONTENT */}

            {currentStep ===
              "General" && (
              <GeneralStep
                form={form}
                setForm={setForm}
                handleEnterKey={
                  handleEnterKey
                }
              />
            )}

            {currentStep ===
              "History" && (
              <HistoryStep
                form={form}
                setForm={setForm}
              />
            )}

            {currentStep ===
              "Examination" && (
              <ExaminationStep
                form={form}
                setForm={setForm}
                handleEnterKey={
                  handleEnterKey
                }
              />
            )}

            {currentStep ===
              "Perinatal & OB" && (
              <PerinatalStep
                form={form}
                setForm={setForm}
                handleEnterKey={
                  handleEnterKey
                }
              />
            )}

            {currentStep ===
              "Department" && (
              <DepartmentStep
                form={form}
                setForm={setForm}
                handleEnterKey={
                  handleEnterKey
                }
              />
            )}

            {currentStep ===
              "Summary" && (
              <SummaryStep
                form={form}
              />
            )}

            {/* ACTIONS */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">

              {step > 0 && (
                <button
                  type="button"
                  onClick={prev}
                >
                  Back
                </button>
              )}

              {step <
              steps.length - 1 ? (
                <button
                  type="button"
                  className="primary next-btn"
                  onClick={next}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="primary"
                  onClick={
                    handleSubmit
                  }
                >
                  {editingExistingPatient
                    ? "Update & Queue"
                    : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE MODAL */}
{showDuplicateModal &&
  matchedPatient && (
    <DuplicatePatientModal
      patient={matchedPatient}
      onReuse={() =>
        setConfirmState({
          message:
            "Reuse this patient record and add them to the current medical mission queue?",

          onConfirm: async () => {
            setConfirmState(null);
            await reusePatientRecord();
          },
        })
      }
      onUpdate={updateExistingPatientInfo}
      onCreateNew={createNewPatientAnyway}
      onCancel={() => {
        console.log("❌ DUPLICATE CANCEL CLICKED");
        resetAndClose();
      }}
    />
  )}

      {/* CONFIRM MODAL */}
      {confirmState && (
        <ConfirmModal
          message={
            confirmState.message
          }
          onConfirm={
            confirmState.onConfirm
          }
          onCancel={resetAndClose}
        />
      )}

      {/* ALERT MODAL */}
      {alertMessage && (
        <AlertModal
          message={
            alertMessage
          }
          onClose={() => {
            setAlertMessage(
              ""
            );

            resetAndClose();
          }}
        />
      )}
    </div>
  );
};

export default AddPatientModal;