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
| DUPLICATE PATIENT MODAL
|--------------------------------------------------------------------------
*/

function DuplicatePatientModal({
  patient,
  onReuse,
  onUpdate,
  onCreateNew,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-start justify-between gap-4">

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Existing Patient Found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                A patient with matching
                information already exists.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-5">

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Patient Record
            </p>

            <p className="mt-1 text-base font-bold text-slate-900">
              {patient?.generalInfo
                ?.name ||
                "Unnamed Patient"}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-slate-600">

              <div>
                <span className="font-semibold">
                  Birthdate:
                </span>{" "}
                {patient?.generalInfo
                  ?.birthdate ||
                  "--"}
              </div>

              <div>
                <span className="font-semibold">
                  Sex:
                </span>{" "}
                {patient?.generalInfo
                  ?.sex ||
                  "--"}
              </div>

              <div>
                <span className="font-semibold">
                  Department:
                </span>{" "}
                {patient?.department ||
                  "--"}
              </div>

              <div>
                <span className="font-semibold">
                  Status:
                </span>{" "}
                {patient?.status ||
                  "--"}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            What would you like to do
            with this existing record?
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Create New
          </button>

          <button
            type="button"
            onClick={onUpdate}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Update Record
          </button>

          <button
            type="button"
            onClick={onReuse}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Reuse & Queue
          </button>

        </div>
      </div>
    </div>
  );
}

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
        name:
          form.generalInfo
            ?.name || "",

        age:
          form.generalInfo
            ?.age === ""
            ? null
            : Number(
                form.generalInfo
                  ?.age
              ),

        birthdate:
          form.generalInfo
            ?.birthdate || "",

        sex:
          form.generalInfo
            ?.sex || "",

        insurance:
          form.generalInfo
            ?.insurance || "",

        tobacco:
          form.generalInfo
            ?.tobacco || "",

        alcohol:
          form.generalInfo
            ?.alcohol || "",

        allergies:
          form.generalInfo
            ?.allergies || "",

        vaccine:
          form.generalInfo
            ?.vaccine || "",
      },

      examination: {
        bp:
          form.examination
            ?.bp || "",

        temp:
          form.examination
            ?.temp || "",

        height:
          form.examination
            ?.height || "",

        weight:
          form.examination
            ?.weight || "",

        bmi:
          form.examination
            ?.bmi || "",
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
        Boolean(
          form.isPriority
        ),

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
      if (
        !duplicateChecked &&
        !editingExistingPatient
      ) {
        const duplicateFound =
          await checkDuplicatePatient();

        if (duplicateFound) {
          return;
        }

        setDuplicateChecked(
          true
        );
      }

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

          setAlertMessage(
            "Patient record updated and queued successfully."
          );
        } else {
          await addPatient(
            payload
          );

          setAlertMessage(
            "Patient added to the queue successfully."
          );
        }

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

  const updateExistingPatientInfo =
    () => {
      if (!matchedPatient) {
        return;
      }

      setEditingExistingPatient(
        true
      );

      setForm({
        ...createEmptyForm(),
        ...matchedPatient,

        generalInfo: {
          ...createEmptyForm()
            .generalInfo,
          ...(matchedPatient
            .generalInfo || {}),
        },

        examination: {
          ...createEmptyForm()
            .examination,
          ...(matchedPatient
            .examination || {}),
        },

        medicalHistory:
          Array.isArray(
            matchedPatient
              .medicalHistory
          )
            ? matchedPatient
                .medicalHistory
            : [],

        familyHistory:
          Array.isArray(
            matchedPatient
              .familyHistory
          )
            ? matchedPatient
                .familyHistory
            : [],

        obstetricHistory:
          matchedPatient
            .obstetricHistory ||
          {},

        perinatalHistory:
          matchedPatient
            .perinatalHistory ||
          {},

        department:
          matchedPatient
            .department || "",

        initComplaint:
          matchedPatient
            .initComplaint || "",

        isPriority:
          Boolean(
            matchedPatient
              .isPriority
          ),
      });

      setShowDuplicateModal(
        false
      );

      setStep(0);
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
    <div className="modal-overlay">

      {/* CONSENT */}
      {showConsent ? (
        <div className="modal-overlay">

          <div className="consent-container">

            <h3>
              <FiActivity
                style={{
                  color:
                    "var(--primary-blue)",
                }}
              />

              Pakibasa sa pasyente bago
              magpatuloy:
            </h3>

            <div className="consent-text">

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

            <div className="consent-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetAndClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
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
        <div className="modal-box">

          {/* HEADER */}
          <div className="modal-header">

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

          <div className="modal-container">

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
            <div className="modal-actions">

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
            onCancel={() =>
              setShowDuplicateModal(
                false
              )
            }
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
          onCancel={() =>
            setConfirmState(null)
          }
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