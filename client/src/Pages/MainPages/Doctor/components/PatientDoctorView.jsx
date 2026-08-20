import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { X } from "lucide-react";

import Modal from "../../../../Components/ui/modal";

import { getMedicines } from "../../../../Services/pharmacyService";

import {
  loadPatientPrescriptions,
  saveDoctorRecord,
  savePrescription,
  markMedicineGiven,
  updatePatientStatus,
  deleteDoctorRecord,
} from "../../../../Services/doctorService";

import AlertModal from "../../../../Components/ui/AlertModal";
import ConfirmModal from "../../../../Components/ui/ConfirmModal";

const EMPTY_DOCTOR_SHEET = {
  examination: {
    generalAppearance: "",
    heent: "",
    pulmonary: "",
    cardiovascular: "",
    gastrointestinal: "",
    musculoskeletal: "",
    genitourinary: "",
    neuroPsych: "",
    checkupPanel: "",
  },

  initComplaint: "",
  diagnosis: "",
  treatment: "",
  medication: "",
};

const createEmptyDoctorSheet = (
  complaint = ""
) => ({
  examination: {
    ...EMPTY_DOCTOR_SHEET.examination,
  },

  initComplaint: complaint,

  diagnosis: "",
  treatment: "",
  medication: "",
});

function PatientDoctorView({
  patient,
  onClose,
  refreshQueue,
}) {
  const storedUser = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  const DEPARTMENTS = [
    "Pediatrics",
    "Ortho",
    "Opta",
    "Dental",
    "Cardio",
    "General",
  ];

  const [doctorSheet, setDoctorSheet] =
    useState(
      createEmptyDoctorSheet(
        patient?.initComplaint || ""
      )
    );

  const [
    existingPrescriptions,
    setExistingPrescriptions,
  ] = useState([]);

  const [medicines, setMedicines] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("current");

  const [
    nextPatientStatus,
    setNextPatientStatus,
  ] = useState("forPharmacy");

  const [
    prescriptionItems,
    setPrescriptionItems,
  ] = useState([
    {
      medicine: "",
      quantity: "",
      directions: "",
    },
  ]);

  const [
    medicineSearch,
    setMedicineSearch,
  ] = useState({});

  const [
    activeDropdown,
    setActiveDropdown,
  ] = useState(null);

  const [showReferral, setShowReferral] =
    useState(false);

  const [referralDept, setReferralDept] =
    useState("");

  const [referralReason, setReferralReason] =
    useState("");

  const [
    newComplaint,
    setNewComplaint,
  ] = useState("");

  const [
    alertMessage,
    setAlertMessage,
  ] = useState("");

  const [
    confirmState,
    setConfirmState,
  ] = useState(null);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const hasHistory =
    Array.isArray(
      patient?.doctorSheets
    ) &&
    patient.doctorSheets.length > 0;

  const activePrescriptions =
    useMemo(() => {
      return Array.isArray(
        existingPrescriptions
      )
        ? existingPrescriptions
        : [];
    }, [
      existingPrescriptions,
    ]);

  /*
   * =========================================================
   * INITIALIZE PATIENT
   * =========================================================
   */

  useEffect(() => {
    if (!patient?._id) {
      return;
    }

    setActiveTab("current");

    if (
      Array.isArray(
        patient.doctorSheets
      ) &&
      patient.doctorSheets.length > 0
    ) {
      const latest =
        patient.doctorSheets[
          patient.doctorSheets.length -
            1
        ];

      setDoctorSheet({
        examination: {
          ...EMPTY_DOCTOR_SHEET.examination,
          ...(latest.examination ||
            {}),
        },

        initComplaint:
          latest.initComplaint ||
          patient.initComplaint ||
          "",

        diagnosis:
          latest.diagnosis || "",

        treatment:
          latest.treatment || "",

        medication:
          latest.medication || "",
      });
    } else {
      setDoctorSheet(
        createEmptyDoctorSheet(
          patient.initComplaint || ""
        )
      );
    }

    setPrescriptionItems([
      {
        medicine: "",
        quantity: "",
        directions: "",
      },
    ]);

    setMedicineSearch({});
    setActiveDropdown(null);

    setNextPatientStatus(
      "forPharmacy"
    );

    setNewComplaint("");

    setShowReferral(false);

    setReferralDept("");

    setReferralReason("");

    setIsSaving(false);

    loadPrescriptions(
      patient._id
    );
  }, [
    patient?._id,
  ]);

  /*
   * =========================================================
   * LOAD PRESCRIPTIONS
   * =========================================================
   */

  const loadPrescriptions =
    async (patientId) => {
      try {
        if (!patientId) {
          return;
        }

        const data =
          await loadPatientPrescriptions(
            patientId
          );

        setExistingPrescriptions(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load prescriptions:",
          error
        );

        setExistingPrescriptions([]);
      }
    };

  /*
   * =========================================================
   * LOAD MEDICINES
   * =========================================================
   */

  useEffect(() => {
    const loadMedicines =
      async () => {
        try {
          const data =
            await getMedicines();

          setMedicines(
            Array.isArray(data)
              ? data
              : data?.medicines ||
                  []
          );
        } catch (error) {
          console.error(
            "Failed to load medicines:",
            error
          );

          setMedicines([]);
        }
      };

    loadMedicines();
  }, []);

  /*
   * =========================================================
   * CLOSE WITHOUT FINALIZING
   *
   * Doctor.jsx will restore the previous status.
   * =========================================================
   */

  const handleCancelClose = () => {
    if (isSaving) {
      return;
    }

    onClose();
  };

  /*
   * =========================================================
   * UPDATE EXAMINATION
   * =========================================================
   */

  const handleExaminationChange = (
    field,
    value
  ) => {
    setDoctorSheet(
      (previous) => ({
        ...previous,

        examination: {
          ...previous.examination,
          [field]: value,
        },
      })
    );
  };

  /*
   * =========================================================
   * PRESCRIPTION ITEM CHANGE
   * =========================================================
   */

  const updatePrescriptionItem = (
    index,
    field,
    value
  ) => {
    setPrescriptionItems(
      (previous) =>
        previous.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  };

  const addPrescriptionItem = () => {
    setPrescriptionItems(
      (previous) => [
        ...previous,
        {
          medicine: "",
          quantity: "",
          directions: "",
        },
      ]
    );
  };

  const removePrescriptionItem = (
    index
  ) => {
    setPrescriptionItems(
      (previous) =>
        previous.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  };

  /*
   * =========================================================
   * SAVE PRESCRIPTION
   * =========================================================
   */

  const handleSavePrescription =
    async () => {
      if (!patient?._id) {
        return;
      }

      const validItems =
        prescriptionItems
          .filter(
            (item) =>
              item.medicine &&
              Number(
                item.quantity
              ) > 0
          )
          .map((item) => ({
            medicine: item.medicine,
            quantity: Number(
              item.quantity
            ),
            directions:
              item.directions || "",
          }));

      if (
        validItems.length === 0
      ) {
        setAlertMessage(
          "Add at least one valid medicine and quantity."
        );

        return;
      }

      try {
        await savePrescription({
          patient: patient._id,

          doctor:
            storedUser?._id ||
            storedUser?.id,

          items: validItems,
        });

        await loadPrescriptions(
          patient._id
        );

        setPrescriptionItems([
          {
            medicine: "",
            quantity: "",
            directions: "",
          },
        ]);

        setAlertMessage(
          "Prescription saved successfully."
        );
      } catch (error) {
        console.error(
          "Failed to save prescription:",
          error
        );

        setAlertMessage(
          error?.message ||
            "Failed to save prescription."
        );
      }
    };

  /*
   * =========================================================
   * MARK MEDICINE GIVEN
   * =========================================================
   */

  const handleGiveMedicine = (
    prescriptionId,
    itemId
  ) => {
    setConfirmState({
      message:
        "Mark this medicine as given?",

      onConfirm: async () => {
        try {
          await markMedicineGiven(
            prescriptionId,
            itemId
          );

          await loadPrescriptions(
            patient._id
          );

          setConfirmState(null);

          setAlertMessage(
            "Medicine marked as given."
          );
        } catch (error) {
          console.error(
            "Failed to give medicine:",
            error
          );

          setConfirmState(null);

          setAlertMessage(
            error?.message ||
              "Failed to update medicine."
          );
        }
      },
    });
  };

  /*
   * =========================================================
   * DELETE DOCTOR RECORD
   * =========================================================
   */

  const handleDeleteRecord = (
    recordId
  ) => {
    if (!recordId) {
      return;
    }

    setConfirmState({
      message:
        "Are you sure you want to delete this doctor record?",

      onConfirm: async () => {
        try {
          await deleteDoctorRecord(
            patient._id,
            recordId,
            storedUser?.name ||
              "Unknown User"
          );

          setConfirmState(null);

          await refreshQueue?.();

          setAlertMessage(
            "Doctor record deleted successfully."
          );
        } catch (error) {
          console.error(
            "Failed to delete doctor record:",
            error
          );

          setConfirmState(null);

          setAlertMessage(
            error?.message ||
              "Failed to delete doctor record."
          );
        }
      },
    });
  };

  /*
   * =========================================================
   * STATUS BUTTONS
   * =========================================================
   */

  const handleSelectForPharmacy =
    () => {
      setNextPatientStatus(
        "forPharmacy"
      );
    };

  const handleSelectReleased = () => {
    setNextPatientStatus(
      "released"
    );
  };

  /*
   * =========================================================
   * FINALIZE CONSULTATION
   *
   * This is the important fix.
   *
   * Order:
   *
   * 1. Save doctor record
   * 2. Update status
   * 3. Refresh queue
   * 4. Tell parent consultation was finalized
   * 5. Parent closes modal
   *
   * =========================================================
   */

  const finalizeConsultation =
    async () => {
      if (
        !patient?._id ||
        isSaving
      ) {
        return;
      }

      if (
        nextPatientStatus !==
          "forPharmacy" &&
        nextPatientStatus !==
          "released"
      ) {
        setAlertMessage(
          "Please select For Pharmacy or Release Patient."
        );

        return;
      }

      setIsSaving(true);

      try {
        // =========================
        // 1. SAVE DOCTOR RECORD
        // =========================

        const savedPatient =
          await saveDoctorRecord(
            patient._id,
            {
              examination: {
                ...EMPTY_DOCTOR_SHEET.examination,
                ...(doctorSheet.examination ||
                  {}),
              },

              initComplaint:
                newComplaint.trim() ||
                doctorSheet.initComplaint ||
                patient.initComplaint ||
                "",

              diagnosis:
                doctorSheet.diagnosis ||
                "",

              treatment:
                doctorSheet.treatment ||
                "",

              medication:
                doctorSheet.medication ||
                "",

              doctorName:
                storedUser?.name ||
                storedUser?.fullName ||
                "Doctor",

              department:
                patient.department ||
                storedUser
                  ?.doctorInfo
                  ?.specialization ||
                storedUser
                  ?.specialization ||
                "General",

              recordType:
                hasHistory
                  ? "follow-up"
                  : "initial",

              referral:
                showReferral &&
                referralDept
                  ? {
                      department:
                        referralDept,

                      reason:
                        referralReason ||
                        "",
                    }
                  : undefined,
            }
          );

        // =========================
        // 2. UPDATE STATUS
        // =========================

        const updatedPatient =
          await updatePatientStatus(
            patient._id,
            {
              status:
                nextPatientStatus,
            }
          );

        console.log(
          "Consultation status updated:",
          {
            savedPatient,
            updatedPatient,
            status:
              nextPatientStatus,
          }
        );

        // =========================
        // 3. REFRESH QUEUE
        // =========================

        if (refreshQueue) {
          await refreshQueue();
        }

        // =========================
        // 4. CLOSE AS FINALIZED
        //
        // This prevents Doctor.jsx
        // from changing status back
        // to waiting.
        // =========================

        onClose({
          finalized: true,

          patientId:
            patient._id,

          status:
            nextPatientStatus,
        });
      } catch (error) {
        console.error(
          "Failed to finalize consultation:",
          error
        );

        setAlertMessage(
          error?.message ||
            "Failed to save the consultation record."
        );
      } finally {
        setIsSaving(false);
      }
    };

  /*
   * =========================================================
   * REFERRAL
   * =========================================================
   */

  const handleReferralToggle =
    () => {
      setShowReferral(
        (previous) => !previous
      );
    };

  /*
   * =========================================================
   * MEDICINE SEARCH
   * =========================================================
   */

  const getMedicineName = (
    medicine
  ) => {
    if (!medicine) {
      return "";
    }

    if (
      Array.isArray(
        medicine.names
      )
    ) {
      return medicine.names.join(
        ", "
      );
    }

    return (
      medicine.name ||
      medicine.genericName ||
      medicine.medicineName ||
      ""
    );
  };

  const filteredMedicines = (
    index
  ) => {
    const query =
      (
        medicineSearch[index] ||
        ""
      )
        .trim()
        .toLowerCase();

    if (!query) {
      return medicines.slice(
        0,
        10
      );
    }

    return medicines
      .filter((medicine) =>
        getMedicineName(medicine)
          .toLowerCase()
          .includes(query)
      )
      .slice(0, 10);
  };

  return (
    <>
      <Modal
        open={true}
        onClose={handleCancelClose}
        title="Patient Consultation"
        subtitle={
          patient?.generalInfo?.name ||
          "Patient"
        }
        size="xl"
        closeOnOverlay={
          !isSaving
        }
      >
        <div className="max-h-[68vh] space-y-6 overflow-y-auto pr-1">

          {/* PATIENT INFO */}

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Patient
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {patient?.generalInfo
                    ?.name ||
                    "Unnamed Patient"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Age
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {patient?.generalInfo
                    ?.age ??
                    "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sex
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {patient?.generalInfo
                    ?.gender ||
                    patient?.generalInfo
                      ?.sex ||
                    "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {patient?.department ||
                    "General"}
                </p>
              </div>

            </div>

          </section>

          {/* TABS */}

          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "current"
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeTab ===
                "current"
                  ? "bg-blue-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Current Record
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "history"
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeTab ===
                "history"
                  ? "bg-blue-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Previous Records
            </button>

            <button
              type="button"
              onClick={() => {
                setDoctorSheet(
                  createEmptyDoctorSheet(
                    patient?.initComplaint ||
                      ""
                  )
                );

                setNewComplaint("");

                setActiveTab(
                  "current"
                );
              }}
              className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              + New Record
            </button>

          </div>

          {/* =====================================================
              CURRENT RECORD
          ====================================================== */}

          {activeTab ===
            "current" && (
            <div className="space-y-6">

              {/* EXAMINATION */}

              <section>

                <div className="mb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Examination
                  </h3>

                  <p className="text-sm text-slate-500">
                    Record the clinical
                    examination findings.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  {Object.entries(
                    doctorSheet.examination
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                      >
                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          {key
                            .replace(
                              /([A-Z])/g,
                              " $1"
                            )
                            .replace(
                              /^./,
                              (letter) =>
                                letter.toUpperCase()
                            )}
                        </label>

                        <textarea
                          value={
                            value || ""
                          }
                          onChange={(
                            event
                          ) =>
                            handleExaminationChange(
                              key,
                              event.target
                                .value
                            )
                          }
                          rows={3}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                        />
                      </div>
                    )
                  )}

                </div>

              </section>

              {/* COMPLAINT */}

              <section>

                <label className="mb-2 block text-sm font-extrabold text-slate-900">
                  Chief Complaint
                </label>

                <textarea
                  value={
                    doctorSheet.initComplaint ||
                    ""
                  }
                  onChange={(event) =>
                    setDoctorSheet(
                      (previous) => ({
                        ...previous,

                        initComplaint:
                          event.target.value,
                      })
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />

              </section>

              {/* FOLLOW-UP COMPLAINT */}

              {hasHistory && (
                <section>

                  <label className="mb-2 block text-sm font-extrabold text-slate-900">
                    New Complaint
                    (Follow-up)
                  </label>

                  <textarea
                    value={
                      newComplaint
                    }
                    onChange={(
                      event
                    ) =>
                      setNewComplaint(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter a new complaint if applicable..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />

                </section>
              )}

              {/* DIAGNOSIS */}

              <section>

                <label className="mb-2 block text-sm font-extrabold text-slate-900">
                  Diagnosis
                </label>

                <textarea
                  value={
                    doctorSheet.diagnosis ||
                    ""
                  }
                  onChange={(event) =>
                    setDoctorSheet(
                      (previous) => ({
                        ...previous,

                        diagnosis:
                          event.target.value,
                      })
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />

              </section>

              {/* TREATMENT */}

              <section>

                <label className="mb-2 block text-sm font-extrabold text-slate-900">
                  Treatment
                </label>

                <textarea
                  value={
                    doctorSheet.treatment ||
                    ""
                  }
                  onChange={(event) =>
                    setDoctorSheet(
                      (previous) => ({
                        ...previous,

                        treatment:
                          event.target.value,
                      })
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />

              </section>

              {/* MEDICATION NOTES */}

              <section>

                <label className="mb-2 block text-sm font-extrabold text-slate-900">
                  Medication Notes
                </label>

                <textarea
                  value={
                    doctorSheet.medication ||
                    ""
                  }
                  onChange={(event) =>
                    setDoctorSheet(
                      (previous) => ({
                        ...previous,

                        medication:
                          event.target.value,
                      })
                    )
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />

              </section>

              {/* REFERRAL */}

              <section className="rounded-2xl border border-slate-200 p-4">

                <button
                  type="button"
                  onClick={
                    handleReferralToggle
                  }
                  className="text-sm font-extrabold text-blue-950"
                >
                  {showReferral
                    ? "Hide Referral"
                    : "Add Referral"}
                </button>

                {showReferral && (

                  <div className="mt-4 grid gap-4">

                    <select
                      value={
                        referralDept
                      }
                      onChange={(
                        event
                      ) =>
                        setReferralDept(
                          event.target.value
                        )
                      }
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-sky-400"
                    >
                      <option value="">
                        Select Department
                      </option>

                      {DEPARTMENTS.map(
                        (
                          department
                        ) => (
                          <option
                            key={
                              department
                            }
                            value={
                              department
                            }
                          >
                            {
                              department
                            }
                          </option>
                        )
                      )}
                    </select>

                    <textarea
                      value={
                        referralReason
                      }
                      onChange={(
                        event
                      ) =>
                        setReferralReason(
                          event.target.value
                        )
                      }
                      placeholder="Referral reason"
                      rows={3}
                      className="resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-400"
                    />

                  </div>

                )}

              </section>

              {/* PRESCRIPTION */}

              <section className="rounded-2xl border border-slate-200 p-4">

                <div className="mb-4">

                  <h3 className="text-base font-extrabold text-slate-900">
                    Prescription
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add medicines for the
                    patient.
                  </p>

                </div>

                <div className="space-y-4">

                  {prescriptionItems.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 p-3"
                      >

                        <div className="grid gap-3 md:grid-cols-4">

                          {/* MEDICINE */}

                          <div className="relative">

                            <input
                              type="text"
                              value={
                                medicineSearch[
                                  index
                                ] ||
                                ""
                              }
                              placeholder="Search medicine"
                              onFocus={() =>
                                setActiveDropdown(
                                  index
                                )
                              }
                              onChange={(
                                event
                              ) => {
                                updatePrescriptionItem(
                                  index,
                                  "medicine",
                                  ""
                                );

                                setMedicineSearch(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,

                                    [index]:
                                      event
                                        .target
                                        .value,
                                  })
                                );

                                setActiveDropdown(
                                  index
                                );
                              }}
                              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
                            />

                            {activeDropdown ===
                              index && (
                              <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">

                                {filteredMedicines(
                                  index
                                ).map(
                                  (
                                    medicine
                                  ) => (

                                    <button
                                      type="button"
                                      key={
                                        medicine._id
                                      }
                                      onClick={() => {
                                        updatePrescriptionItem(
                                          index,
                                          "medicine",
                                          medicine._id
                                        );

                                        setMedicineSearch(
                                          (
                                            previous
                                          ) => ({
                                            ...previous,

                                            [index]:
                                              getMedicineName(
                                                medicine
                                              ),
                                          })
                                        );

                                        setActiveDropdown(
                                          null
                                        );
                                      }}
                                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                      {getMedicineName(
                                        medicine
                                      )}

                                      {medicine.dosage
                                        ? ` (${medicine.dosage})`
                                        : ""}
                                    </button>

                                  )
                                )}

                              </div>
                            )}

                          </div>

                          {/* QUANTITY */}

                          <input
                            type="number"
                            min="1"
                            value={
                              item.quantity
                            }
                            placeholder="Quantity"
                            onChange={(
                              event
                            ) =>
                              updatePrescriptionItem(
                                index,
                                "quantity",
                                event.target
                                  .value
                              )
                            }
                            className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
                          />

                          {/* DIRECTIONS */}

                          <input
                            type="text"
                            value={
                              item.directions
                            }
                            placeholder="Directions"
                            onChange={(
                              event
                            ) =>
                              updatePrescriptionItem(
                                index,
                                "directions",
                                event.target
                                  .value
                              )
                            }
                            className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
                          />

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removePrescriptionItem(
                                index
                              )
                            }
                            disabled={
                              prescriptionItems.length ===
                              1
                            }
                            className="rounded-xl border border-rose-200 px-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

                <div className="mt-4 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={
                      addPrescriptionItem
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    + Add Medicine
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSavePrescription
                    }
                    className="rounded-xl bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                  >
                    Save Prescription
                  </button>

                </div>

              </section>

              {/* STATUS SELECTION */}

              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <h3 className="text-base font-extrabold text-slate-900">
                  Consultation Result
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select the patient's next
                  status before saving the
                  consultation record.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  {/* FOR PHARMACY */}

                  <button
                    type="button"
                    onClick={
                      handleSelectForPharmacy
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${
                      nextPatientStatus ===
                      "forPharmacy"
                        ? "bg-emerald-800 ring-4 ring-emerald-200"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    For Pharmacy
                  </button>

                  {/* RELEASE */}

                  <button
                    type="button"
                    onClick={
                      handleSelectReleased
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${
                      nextPatientStatus ===
                      "released"
                        ? "bg-slate-900 ring-4 ring-slate-300"
                        : "bg-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    Release Patient
                  </button>

                </div>

                <div className="mt-4 rounded-xl bg-white p-3 text-sm">

                  <span className="font-semibold text-slate-500">
                    Selected status:{" "}
                  </span>

                  <span className="font-extrabold text-slate-900">
                    {nextPatientStatus ===
                    "forPharmacy"
                      ? "For Pharmacy"
                      : "Released"}
                  </span>

                </div>

              </section>

              {/* SAVE RECORD */}

              <div className="flex justify-end border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={
                    finalizeConsultation
                  }
                  disabled={
                    isSaving
                  }
                  className="rounded-xl bg-blue-950 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : "Save Record"}
                </button>

              </div>

            </div>
          )}

          {/* =====================================================
              PREVIOUS RECORDS
          ====================================================== */}

          {activeTab ===
            "history" && (

            <div className="space-y-6">

              <section>

                <h3 className="mb-4 text-base font-extrabold text-slate-900">
                  Previous Doctor Records
                </h3>

                {Array.isArray(
                  patient?.doctorSheets
                ) &&
                patient.doctorSheets.length >
                  0 ? (

                  <div className="space-y-4">

                    {patient.doctorSheets
                      .slice()
                      .reverse()
                      .map(
                        (
                          record,
                          index
                        ) => (

                          <article
                            key={
                              record._id ||
                              index
                            }
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                          >

                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">

                              <div>

                                <p className="font-extrabold text-slate-900">
                                  {record.doctorName ||
                                    "Unknown Doctor"}
                                </p>

                                <p className="mt-1 text-xs font-medium text-slate-500">
                                  {record.department ||
                                    "General"}

                                  {" • "}

                                  {record.date
                                    ? new Date(
                                        record.date
                                      ).toLocaleString()
                                    : "No date"}
                                </p>

                              </div>

                              {record._id && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteRecord(
                                      record._id
                                    )
                                  }
                                  className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                                >
                                  Delete
                                </button>

                              )}

                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                              <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                  Complaint
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                  {record.initComplaint ||
                                    "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                  Diagnosis
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                  {record.diagnosis ||
                                    "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                  Treatment
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                  {record.treatment ||
                                    "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-bold uppercase text-slate-500">
                                  Medication
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                  {record.medication ||
                                    "-"}
                                </p>
                              </div>

                            </div>

                            <div className="mt-5">

                              <p className="mb-3 text-xs font-bold uppercase text-slate-500">
                                Examination
                              </p>

                              <div className="grid gap-3 md:grid-cols-2">

                                {Object.entries(
                                  record.examination ||
                                    {}
                                ).map(
                                  (
                                    [
                                      key,
                                      value,
                                    ]
                                  ) => (

                                    <div
                                      key={
                                        key
                                      }
                                      className="rounded-xl bg-slate-50 p-3"
                                    >

                                      <p className="text-xs font-bold text-slate-500">
                                        {key
                                          .replace(
                                            /([A-Z])/g,
                                            " $1"
                                          )
                                          .replace(
                                            /^./,
                                            (
                                              letter
                                            ) =>
                                              letter.toUpperCase()
                                          )}
                                      </p>

                                      <p className="mt-1 text-sm text-slate-700">
                                        {value ||
                                          "-"}
                                      </p>

                                    </div>

                                  )
                                )}

                              </div>

                            </div>

                            {record.referral
                              ?.department && (

                              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                <p className="text-sm font-extrabold text-blue-950">
                                  Referral:
                                  {" "}
                                  {
                                    record
                                      .referral
                                      .department
                                  }
                                </p>

                                <p className="mt-1 text-sm text-blue-900">
                                  {record
                                    .referral
                                    .reason ||
                                    "-"}
                                </p>

                              </div>

                            )}

                          </article>

                        )
                      )}

                  </div>

                ) : (

                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">

                    <p className="font-bold text-slate-700">
                      No previous records
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      This patient does not
                      have previous doctor
                      consultation records.
                    </p>

                  </div>

                )}

              </section>

              {/* PRESCRIPTION HISTORY */}

              <section>

                <h3 className="mb-4 text-base font-extrabold text-slate-900">
                  Prescription History
                </h3>

                {activePrescriptions.length ===
                0 ? (

                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">

                    <p className="font-bold text-slate-700">
                      No previous prescriptions
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {activePrescriptions.map(
                      (
                        prescription
                      ) => (

                        <article
                          key={
                            prescription._id
                          }
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >

                          {prescription.items?.map(
                            (item) => (

                              <div
                                key={
                                  item._id
                                }
                                className="border-b border-slate-100 py-3 last:border-0"
                              >

                                <p className="font-bold text-slate-900">

                                  {item
                                    .medicine
                                    ?.names?.join(
                                      ", "
                                    ) ||
                                    item
                                      .medicine
                                      ?.name ||
                                    "Unknown Medicine"}

                                </p>

                                <p className="mt-1 text-sm text-slate-500">

                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                                <p className="mt-1 text-sm text-slate-500">

                                  Directions:
                                  {" "}
                                  {
                                    item.directions ||
                                    "-"
                                  }

                                </p>

                                {item.status !==
                                  "given" &&
                                  item._id && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleGiveMedicine(
                                          prescription._id,
                                          item._id
                                        )
                                      }
                                      className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                                    >
                                      Mark as Given
                                    </button>
                                  )}

                              </div>

                            )
                          )}

                        </article>

                      )
                    )}

                  </div>

                )}

              </section>

            </div>

          )}

        </div>
      </Modal>

      {/* CONFIRMATION */}

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

      {/* ALERT */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() =>
            setAlertMessage("")
          }
        />
      )}
    </>
  );
}

export default PatientDoctorView;