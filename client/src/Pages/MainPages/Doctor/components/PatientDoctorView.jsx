import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  X,
  Plus,
  Trash2,
  ClipboardList,
  History,
  Stethoscope,
  Pill,
  Send,
  UserRound,
  ChevronRight,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

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
    localStorage.getItem("user") || "{}"
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
      createEmptyDoctorSheet("")
    );

  const [activeTab, setActiveTab] =
    useState("current");

  const [
    existingPrescriptions,
    setExistingPrescriptions,
  ] = useState([]);

  const [
    recordMode,
    setRecordMode,
  ] = useState("existing");

  const [medicines, setMedicines] =
    useState([]);

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

  const [
    showReferral,
    setShowReferral,
  ] = useState(false);

  const [
    referralDept,
    setReferralDept,
  ] = useState("");

  const [
    referralReason,
    setReferralReason,
  ] = useState("");

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

  const patientName =
    patient?.generalInfo?.name ||
    "Unnamed Patient";

  const patientAge =
    patient?.generalInfo?.age ??
    "--";

  const patientSex =
    patient?.generalInfo?.sex ||
    patient?.generalInfo?.gender ||
    "--";

  const latestRecord =
    hasHistory
      ? patient.doctorSheets[
          patient.doctorSheets.length - 1
        ]
      : null;

  /*
   * =========================================================
   * NEW RECORD
   * =========================================================
   */

  const handleNewRecord = () => {
    setRecordMode("new");

    setDoctorSheet(
      createEmptyDoctorSheet(
        patient?.initComplaint || ""
      )
    );

    setPrescriptionItems([
      {
        medicine: "",
        quantity: "",
        directions: "",
      },
    ]);

    setMedicineSearch({});
    setActiveDropdown(null);

    setNewComplaint("");

    setShowReferral(false);
    setReferralDept("");
    setReferralReason("");

    setNextPatientStatus("forPharmacy");

    setActiveTab("current");
  };

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
   * INITIALIZE PATIENT
   * =========================================================
   */

  useEffect(() => {
    if (!patient?._id) {
      return;
    }

    if (recordMode === "new") {
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
          patient.doctorSheets.length - 1
        ];

      setDoctorSheet({
        examination: {
          ...EMPTY_DOCTOR_SHEET.examination,
          ...(latest.examination || {}),
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
    recordMode,
  ]);

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
              : data?.medicines || []
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
   * FORM UPDATES
   * =========================================================
   */

  const updateDoctorSheet = (
    field,
    value
  ) => {
    setDoctorSheet(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  const updateExamination = (
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
   * PRESCRIPTIONS
   * =========================================================
   */

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
      (previous) => {
        if (previous.length === 1) {
          return [
            {
              medicine: "",
              quantity: "",
              directions: "",
            },
          ];
        }

        return previous.filter(
          (_, itemIndex) =>
            itemIndex !== index
        );
      }
    );

    setMedicineSearch(
      (previous) => {
        const updated = {
          ...previous,
        };

        delete updated[index];

        return updated;
      }
    );

    setActiveDropdown(null);
  };

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

  const handleSavePrescription =
    async (index) => {
      const item =
        prescriptionItems[index];

      if (
  !item?.medicine ||
  !String(item.medicine).trim()
) {
  setAlertMessage(
    "Please select a medicine first."
  );
  return;
}

if (!item?.medicineId) {
  setAlertMessage(
    "Please select a medicine from the list."
  );
  return;
}
if (!item?.directions || !String(item.directions).trim) {
    setAlertMessage("Please enter directions for this medicine.");
    return;
  }

      if (
        !patient?._id ||
        isSaving
      ) {
        return;
      }

      try {
        setIsSaving(true);

        await savePrescription(
  patient._id,
  {
    medicine: item.medicineId,
    quantity: item.quantity,
    directions: item.directions,
    doctorId:
      storedUser?._id ||
      storedUser?.id ||
      undefined,
  }
);

        await loadPrescriptions(
          patient._id
        );

        setPrescriptionItems(
          (previous) =>
            previous.map(
              (
                prescription,
                prescriptionIndex
              ) =>
                prescriptionIndex === index
                  ? {
                      medicine: "",
                      quantity: "",
                      directions: "",
                    }
                  : prescription
            )
        );

        setMedicineSearch(
          (previous) => ({
            ...previous,
            [index]: "",
          })
        );

        setActiveDropdown(null);

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
      } finally {
        setIsSaving(false);
      }
    };

  const handleMarkMedicineGiven =
    (prescription) => {
      const prescriptionId =
        prescription?._id ||
        prescription?.id;

      if (!prescriptionId) {
        return;
      }

      setConfirmState({
        message:
          "Mark this medicine as given to the patient?",

        onConfirm: async () => {
          try {
            setIsSaving(true);

            await markMedicineGiven(
              prescriptionId
            );

            setConfirmState(null);

            await loadPrescriptions(
              patient._id
            );

            setAlertMessage(
              "Medicine marked as given."
            );
          } catch (error) {
            console.error(
              "Failed to update medicine status:",
              error
            );

            setConfirmState(null);

            setAlertMessage(
              error?.message ||
                "Failed to update medicine status."
            );
          } finally {
            setIsSaving(false);
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
   * STATUS
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

      if (
        nextPatientStatus ===
          "forPharmacy" &&
        existingPrescriptions.length === 0
      ) {
        setAlertMessage(
          "Please save at least one prescription before sending the patient to Pharmacy."
        );

        return;
      }

      setIsSaving(true);

      try {
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

        if (refreshQueue) {
          await refreshQueue();
        }

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

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const textAreaClass =
    "w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-text-subtle focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const examinationFields = [
    {
      key: "generalAppearance",
      label: "General Appearance",
      placeholder:
        "Describe the patient's overall appearance...",
    },
    {
      key: "heent",
      label: "HEENT",
      placeholder:
        "Head, eyes, ears, nose, and throat findings...",
    },
    {
      key: "pulmonary",
      label: "Pulmonary",
      placeholder:
        "Respiratory and lung examination findings...",
    },
    {
      key: "cardiovascular",
      label: "Cardiovascular",
      placeholder:
        "Cardiac and cardiovascular findings...",
    },
    {
      key: "gastrointestinal",
      label: "Gastrointestinal",
      placeholder:
        "Abdominal and gastrointestinal findings...",
    },
    {
      key: "musculoskeletal",
      label: "Musculoskeletal",
      placeholder:
        "Musculoskeletal examination findings...",
    },
    {
      key: "genitourinary",
      label: "Genitourinary",
      placeholder:
        "Genitourinary examination findings...",
    },
    {
      key: "neuroPsych",
      label: "Neurological / Psychological",
      placeholder:
        "Neurological or psychological findings...",
    },
  ];

  return (
    <>
      <Modal
        open={true}
        onClose={handleCancelClose}
        title="Patient Consultation"
        subtitle={
          recordMode === "new"
            ? "New consultation record"
            : patientName
        }
        size="xl"
        closeOnOverlay={!isSaving}
      >
        <div className="max-h-[72vh] space-y-5 overflow-y-auto pr-1">

          {/* PATIENT SUMMARY */}

          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="h-1.5 w-full bg-blue-950" />

            <div className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                    <UserRound size={25} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                      Patient
                    </p>

                    <h3 className="truncate text-xl font-bold text-text-primary">
                      {patientName}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-text-muted">
                      <span>
                        {patientAge} years old
                      </span>

                      <span>
                        {patientSex}
                      </span>

                      <span>
                        {patient?.department ||
                          "General"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {patient?.isPriority && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                      Priority Patient
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold ${
                      recordMode === "new"
                        ? "bg-primary-100 text-primary-700 ring-1 ring-inset ring-primary-200"
                        : "bg-slate-100 text-text-secondary ring-1 ring-inset ring-slate-200"
                    }`}
                  >
                    {recordMode === "new"
                      ? "New Record"
                      : hasHistory
                        ? "Existing Record"
                        : "Initial Record"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <PatientInfoItem
                  label="Initial Complaint"
                  value={
                    patient?.initComplaint ||
                    "Not provided"
                  }
                />

                <PatientInfoItem
                  label="Department"
                  value={
                    patient?.department ||
                    "General"
                  }
                />

                <PatientInfoItem
                  label="Allergies"
                  value={
                    patient?.generalInfo
                      ?.allergies ||
                    "None recorded"
                  }
                />

                <PatientInfoItem
                  label="Insurance"
                  value={
                    patient?.generalInfo
                      ?.insurance ||
                    "Not provided"
                  }
                />
              </div>
            </div>
          </section>

          {/* NAVIGATION */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
              <button
                type="button"
                onClick={() =>
                  setActiveTab("current")
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  activeTab === "current"
                    ? "bg-surface text-primary-800 shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <ClipboardList size={16} />
                Current Record
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("history")
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  activeTab === "history"
                    ? "bg-surface text-primary-800 shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <History size={16} />
                History

                {hasHistory && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">
                    {
                      patient.doctorSheets
                        .length
                    }
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleNewRecord}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-700 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              New Consultation
            </button>
          </div>

          {/* CURRENT RECORD */}

          {activeTab === "current" && (
            <div className="space-y-5">

              {/* COMPLAINT */}

              <SectionCard
                icon={<ClipboardList size={18} />}
                eyebrow="Consultation"
                title="Patient Complaint"
                description="Record the primary complaint for this consultation."
              >
                <div className="space-y-4">

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Current Complaint
                    </label>

                    <textarea
                      rows={4}
                      value={
                        newComplaint ||
                        doctorSheet.initComplaint ||
                        ""
                      }
                      onChange={(event) => {
                        setNewComplaint(
                          event.target.value
                        );

                        updateDoctorSheet(
                          "initComplaint",
                          event.target.value
                        );
                      }}
                      placeholder="Describe the patient's current complaint..."
                      className={
                        textAreaClass
                      }
                    />
                  </div>

                  {recordMode ===
                    "existing" &&
                    latestRecord?.initComplaint && (
                      <div className="rounded-xl border border-border-soft bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
                          Previous Complaint
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {
                            latestRecord.initComplaint
                          }
                        </p>
                      </div>
                    )}
                </div>
              </SectionCard>

              {/* EXAMINATION */}

              <SectionCard
                icon={<Stethoscope size={18} />}
                eyebrow="Clinical Assessment"
                title="Physical Examination"
                description="Document relevant examination findings."
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {examinationFields.map(
                    (field) => (
                      <div
                        key={field.key}
                      >
                        <label
                          className={
                            labelClass
                          }
                        >
                          {field.label}
                        </label>

                        <textarea
                          rows={4}
                          value={
                            doctorSheet
                              .examination?.[
                              field.key
                            ] || ""
                          }
                          onChange={(
                            event
                          ) =>
                            updateExamination(
                              field.key,
                              event.target.value
                            )
                          }
                          placeholder={
                            field.placeholder
                          }
                          className={
                            textAreaClass
                          }
                        />
                      </div>
                    )
                  )}

                  <div className="lg:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Additional Checkup Notes
                    </label>

                    <textarea
                      rows={4}
                      value={
                        doctorSheet
                          .examination
                          ?.checkupPanel ||
                        ""
                      }
                      onChange={(event) =>
                        updateExamination(
                          "checkupPanel",
                          event.target.value
                        )
                      }
                      placeholder="Enter additional clinical observations..."
                      className={
                        textAreaClass
                      }
                    />
                  </div>
                </div>
              </SectionCard>

              {/* DIAGNOSIS */}

              <SectionCard
                icon={<ClipboardList size={18} />}
                eyebrow="Clinical Impression"
                title="Diagnosis"
                description="Record the diagnosis or clinical assessment."
              >
                <textarea
                  rows={5}
                  value={
                    doctorSheet.diagnosis ||
                    ""
                  }
                  onChange={(event) =>
                    updateDoctorSheet(
                      "diagnosis",
                      event.target.value
                    )
                  }
                  placeholder="Enter diagnosis..."
                  className={
                    textAreaClass
                  }
                />
              </SectionCard>

              {/* TREATMENT */}

              <SectionCard
                icon={<CheckCircle2 size={18} />}
                eyebrow="Care Plan"
                title="Treatment"
                description="Document treatment, procedures, or medical advice."
              >
                <textarea
                  rows={5}
                  value={
                    doctorSheet.treatment ||
                    ""
                  }
                  onChange={(event) =>
                    updateDoctorSheet(
                      "treatment",
                      event.target.value
                    )
                  }
                  placeholder="Enter treatment plan..."
                  className={
                    textAreaClass
                  }
                />
              </SectionCard>

              {/* MEDICATION NOTES */}

              <SectionCard
                icon={<Pill size={18} />}
                eyebrow="Medication Notes"
                title="Medication Instructions"
                description="Optional general medication instructions."
              >
                <textarea
                  rows={4}
                  value={
                    doctorSheet.medication ||
                    ""
                  }
                  onChange={(event) =>
                    updateDoctorSheet(
                      "medication",
                      event.target.value
                    )
                  }
                  placeholder="Enter general medication notes..."
                  className={
                    textAreaClass
                  }
                />
              </SectionCard>

              {/* PRESCRIPTIONS */}

              <SectionCard
                icon={<Pill size={18} />}
                eyebrow="Pharmacy"
                title="Prescriptions"
                description="Search medicines and create prescription records."
              >
                <div className="space-y-4">

                  {prescriptionItems.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-border bg-slate-50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-text-primary">
                              Prescription{" "}
                              {index + 1}
                            </p>

                            <p className="mt-0.5 text-xs text-text-muted">
                              Add medicine and instructions.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removePrescriptionItem(
                                index
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Remove prescription"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                          <div className="relative lg:col-span-1">
                            <label
                              className={
                                labelClass
                              }
                            >
                              Medicine
                            </label>

                            <input
                              value={
                                medicineSearch[
                                  index
                                ] ??
                                item.medicine
                              }
                              onFocus={() =>
                                setActiveDropdown(
                                  index
                                )
                              }
                              onChange={(
                                event
                              ) => {
                                const value =
                                  event.target
                                    .value;

                                setMedicineSearch(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,
                                    [index]:
                                      value,
                                  })
                                );

                                updatePrescriptionItem(
                                  index,
                                  "medicine",
                                  value
                                );

                                setActiveDropdown(
                                  index
                                );
                              }}
                              placeholder="Search medicine..."
                              className={
                                inputClass
                              }
                            />

                            {activeDropdown ===
                              index && (
                              <div className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
                                {filteredMedicines(
                                  index
                                ).length >
                                0 ? (
                                  filteredMedicines(
                                    index
                                  ).map(
                                    (
                                      medicine
                                    ) => {
                                      const name =
                                        getMedicineName(
                                          medicine
                                        );

                                      return (
                                        <button
                                          key={
                                            medicine._id ||
                                            medicine.id ||
                                            `${name}-${index}`
                                          }
                                          type="button"
                                          onClick={() => {
  updatePrescriptionItem(
    index,
    "medicine",
    name
  );

  updatePrescriptionItem(
    index,
    "medicineId",
    medicine._id || medicine.id
  );

  setMedicineSearch(
    (previous) => ({
      ...previous,
      [index]: name,
    })
  );

  setActiveDropdown(null);
}}
                                          className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                                        >
                                          <div>
                                            <p className="text-sm font-semibold text-text-primary">
                                              {name}
                                            </p>

                                            {medicine
                                              ?.quantity !==
                                              undefined && (
                                              <p className="mt-1 text-xs text-text-muted">
                                                Available:{" "}
                                                {
                                                  medicine.quantity
                                                }
                                              </p>
                                            )}
                                          </div>

                                          <ChevronRight
                                            size={16}
                                            className="mt-0.5 shrink-0 text-text-subtle"
                                          />
                                        </button>
                                      );
                                    }
                                  )
                                ) : (
                                  <div className="px-3 py-6 text-center text-sm text-text-muted">
                                    No medicine found.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Quantity
                            </label>

                            <input
                              value={
                                item.quantity
                              }
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
                              placeholder="e.g. 10"
                              className={
                                inputClass
                              }
                            />
                          </div>

                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Directions
                            </label>

                            <input
                              value={
                                item.directions
                              }
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
                              placeholder="e.g. 1 tablet twice daily"
                              className={
                                inputClass
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            disabled={
                              isSaving
                            }
                            onClick={() =>
                              handleSavePrescription(
                                index
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Pill
                              size={16}
                            />
                            Save Prescription
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={
                      addPrescriptionItem
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-700 transition hover:bg-primary-100"
                  >
                    <Plus size={17} />
                    Add Another Medicine
                  </button>

                  {/* SAVED PRESCRIPTIONS */}

                  {activePrescriptions.length >
                    0 && (
                    <div className="border-t border-border pt-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            Saved Prescriptions
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {activePrescriptions.length}{" "}
                            prescription
                            {activePrescriptions.length !==
                            1
                              ? "s"
                              : ""}{" "}
                            recorded
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activePrescriptions.map(
                          (
                            prescription
                          ) => {
                            const isGiven =
                              Boolean(
                                prescription?.given ||
                                  prescription?.isGiven ||
                                  prescription?.status ===
                                    "given"
                              );

                            return (
                              <div
                                key={
                                  prescription._id ||
                                  prescription.id
                                }
                                className="rounded-xl border border-border bg-surface p-4"
                              >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-text-primary">
                                      {
                                        prescription.medicine
                                      }
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-text-muted">
                                      Qty:{" "}
                                      {
                                        prescription.quantity ||
                                        "--"
                                      }
                                      {" · "}
                                      {
                                        prescription.directions ||
                                        "No directions"
                                      }
                                    </p>
                                  </div>

                                  {isGiven ? (
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                      <CheckCircle2
                                        size={14}
                                      />
                                      Medicine Given
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleMarkMedicineGiven(
                                          prescription
                                        )
                                      }
                                      disabled={
                                        isSaving
                                      }
                                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      <PackageCheck
                                        size={15}
                                      />
                                      Mark as Given
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* REFERRAL */}

              <SectionCard
                icon={<Send size={18} />}
                eyebrow="Patient Routing"
                title="Referral"
                description="Refer the patient to another department when necessary."
              >
                <div className="space-y-4">

                  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-slate-50 p-4">
                    <div>
                      <p className="text-sm font-bold text-text-primary">
                        Refer Patient
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        Enable referral for another medical department.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        showReferral
                      }
                      onClick={
                        handleReferralToggle
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        showReferral
                          ? "bg-primary-700"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-surface shadow-sm transition ${
                          showReferral
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </label>

                  {showReferral && (
                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-primary-100 bg-primary-50 p-4 lg:grid-cols-2">

                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Referral Department
                        </label>

                        <select
                          value={
                            referralDept
                          }
                          onChange={(
                            event
                          ) =>
                            setReferralDept(
                              event.target
                                .value
                            )
                          }
                          className={
                            inputClass
                          }
                        >
                          <option value="">
                            Select department
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
                      </div>

                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Referral Reason
                        </label>

                        <textarea
                          rows={3}
                          value={
                            referralReason
                          }
                          onChange={(
                            event
                          ) =>
                            setReferralReason(
                              event.target
                                .value
                            )
                          }
                          placeholder="Explain the reason for referral..."
                          className={
                            textAreaClass
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* FINAL STATUS */}

              <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                    Consultation Outcome
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-text-primary">
                    Choose Patient Destination
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    Select what should happen after this consultation.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  <button
                    type="button"
                    onClick={
                      handleSelectForPharmacy
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      nextPatientStatus ===
                      "forPharmacy"
                        ? "border-primary-300 bg-primary-50 ring-2 ring-primary-500/10"
                        : "border-border bg-surface hover:border-primary-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          nextPatientStatus ===
                          "forPharmacy"
                            ? "bg-primary-700 text-white"
                            : "bg-primary-50 text-primary-700"
                        }`}
                      >
                        <Pill size={18} />
                      </div>

                      <div>
                        <p className="font-bold text-text-primary">
                          Send to Pharmacy
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          Patient will proceed to the pharmacy queue for prescribed medicines.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSelectReleased
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      nextPatientStatus ===
                      "released"
                        ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-500/10"
                        : "border-border bg-surface hover:border-emerald-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          nextPatientStatus ===
                          "released"
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <CheckCircle2
                          size={18}
                        />
                      </div>

                      <div>
                        <p className="font-bold text-text-primary">
                          Release Patient
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          Consultation is complete and no pharmacy processing is required.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      handleCancelClose
                    }
                    disabled={isSaving}
                    className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-bold text-text-secondary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      finalizeConsultation
                    }
                    disabled={isSaving}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      nextPatientStatus ===
                      "released"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-primary-700 hover:bg-primary-800"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <RotateCcw
                          size={17}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        {nextPatientStatus ===
                        "released" ? (
                          <CheckCircle2
                            size={17}
                          />
                        ) : (
                          <Send size={17} />
                        )}

                        {nextPatientStatus ===
                        "released"
                          ? "Complete & Release"
                          : "Complete & Send to Pharmacy"}
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* HISTORY */}

          {activeTab === "history" && (
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                    Patient Records
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-text-primary">
                    Consultation History
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    Review previous doctor consultations and records.
                  </p>
                </div>

                {hasHistory && (
                  <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-text-secondary">
                    {
                      patient.doctorSheets
                        .length
                    }{" "}
                    record
                    {patient.doctorSheets
                      .length !== 1
                      ? "s"
                      : ""}
                  </span>
                )}
              </div>

              {!hasHistory ? (
                <div className="rounded-2xl border border-dashed border-border-strong bg-slate-50 px-5 py-12 text-center">
                  <History
                    size={34}
                    className="mx-auto text-text-subtle"
                  />

                  <p className="mt-4 text-sm font-bold text-text-primary">
                    No consultation history
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                    This patient does not have any previous doctor records yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    ...patient.doctorSheets,
                  ]
                    .reverse()
                    .map(
                      (
                        record,
                        index
                      ) => (
                        <HistoryRecord
                          key={
                            record._id ||
                            record.id ||
                            index
                          }
                          record={
                            record
                          }
                          index={
                            index
                          }
                          onDelete={() =>
                            handleDeleteRecord(
                              record._id ||
                                record.id
                            )
                          }
                        />
                      )
                    )}
                </div>
              )}
            </section>
          )}
        </div>
      </Modal>

      {alertMessage && (
        <AlertModal
          open={Boolean(
            alertMessage
          )}
          message={
            alertMessage
          }
          onClose={() =>
            setAlertMessage("")
          }
        />
      )}

      {confirmState && (
        <ConfirmModal
          open={Boolean(
            confirmState
          )}
          message={
            confirmState.message
          }
          onConfirm={
            confirmState.onConfirm
          }
          onCancel={() =>
            setConfirmState(null)
          }
          onClose={() =>
            setConfirmState(null)
          }
        />
      )}
    </>
  );
}

/*
 * =========================================================
 * SMALL UI COMPONENTS
 * =========================================================
 */

function PatientInfoItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function SectionCard({
  icon,
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-5 flex gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          {icon}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
            {eyebrow}
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-text-primary">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-text-muted">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function HistoryRecord({
  record,
  index,
  onDelete,
}) {
  const examination =
    record?.examination || {};

  const recordDate =
    record?.createdAt ||
    record?.date;

  const formattedDate =
    recordDate
      ? new Date(
          recordDate
        ).toLocaleString()
      : "Date unavailable";

  const examinationEntries = [
    [
      "General Appearance",
      examination.generalAppearance,
    ],
    [
      "HEENT",
      examination.heent,
    ],
    [
      "Pulmonary",
      examination.pulmonary,
    ],
    [
      "Cardiovascular",
      examination.cardiovascular,
    ],
    [
      "Gastrointestinal",
      examination.gastrointestinal,
    ],
    [
      "Musculoskeletal",
      examination.musculoskeletal,
    ],
    [
      "Genitourinary",
      examination.genitourinary,
    ],
    [
      "Neurological / Psychological",
      examination.neuroPsych,
    ],
    [
      "Additional Notes",
      examination.checkupPanel,
    ],
  ].filter(
    ([, value]) =>
      value &&
      String(value).trim()
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">

      <div className="border-b border-border bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
              Record{" "}
              {index + 1}
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {record?.recordType && (
              <span className="rounded-full bg-primary-100 px-3 py-1 text-[10px] font-bold text-primary-700">
                {record.recordType}
              </span>
            )}

            {record?._id ||
            record?.id ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                title="Delete record"
              >
                <Trash2 size={15} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4">

        <HistoryBlock
          title="Complaint"
          value={
            record?.initComplaint
          }
        />

        <HistoryBlock
          title="Diagnosis"
          value={
            record?.diagnosis
          }
        />

        <HistoryBlock
          title="Treatment"
          value={
            record?.treatment
          }
        />

        <HistoryBlock
          title="Medication"
          value={
            record?.medication
          }
        />

        {record?.referral && (
          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-700">
              Referral
            </p>

            <p className="mt-2 text-sm font-bold text-primary-900">
              {
                record.referral
                  .department
              }
            </p>

            {record.referral
              .reason && (
              <p className="mt-2 text-sm leading-6 text-primary-800">
                {
                  record.referral
                    .reason
                }
              </p>
            )}
          </div>
        )}

        {examinationEntries.length >
          0 && (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-subtle">
              Examination Findings
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {examinationEntries.map(
                ([
                  label,
                  value,
                ]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-slate-50 p-3"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
                      {label}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {value}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function HistoryBlock({
  title,
  value,
}) {
  if (
    !value ||
    !String(value).trim()
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-text-subtle">
        {title}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default PatientDoctorView;