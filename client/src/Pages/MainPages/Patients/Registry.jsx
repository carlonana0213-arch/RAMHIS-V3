import {
  useEffect,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import {
  addPatient,
  searchPatients,
  updatePatient,
  deletePatient,
  getPatientById,
} from "../../../Services/patientService";

import AlertModal from "../../../Components/ui/AlertModal";
import ConfirmModal from "../../../Components/ui/ConfirmModal";

const HISTORY_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Cancer",
  "Stroke",
  "Epilepsy",
  "Tuberculosis",
  "Other",
];

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

    examination: {
      bp: "",
      temp: "",
      height: "",
      weight: "",
      bmi: "",
    },

    obstetricHistory: {
      contraception: false,
      type: "",
      gpfpal: "",
      bf: "",
      birthHistory: "",
      deliverySite: "",
      lmp: "",
    },

    perinatalHistory: {
      bw: "",
      bf: "",
      birthHistory: "",
      deliverySite: "",
    },

    medicalHistory: [],
    familyHistory: [],

    department: "",
    initComplaint: "",
  });

function Registry({
  patientIdFromQueue,
}) {
  const [
    form,
    setForm,
  ] = useState(
    createEmptyForm()
  );

  const [
    patientId,
    setPatientId,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState([]);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    loadingPatient,
    setLoadingPatient,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    confirmState,
    setConfirmState,
  ] = useState(null);

  const [
    alertMessage,
    setAlertMessage,
  ] = useState("");

  const location =
    useLocation();

  /*
  |--------------------------------------------------------------------------
  | FIELD HELPERS
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    section,
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,

      [section]: {
        ...(previous[
          section
        ] || {}),
        [field]: value,
      },
    }));
  };

  const toggleCheckbox = (
    section,
    value
  ) => {
    setForm((previous) => {

      const current =
        Array.isArray(
          previous[section]
        )
          ? previous[section]
          : [];

      const exists =
        current.includes(
          value
        );

      return {
        ...previous,

        [section]: exists
          ? current.filter(
              (item) =>
                item !== value
            )
          : [
              ...current,
              value,
            ],
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | BUTTON GROUP KEYBOARD
  |--------------------------------------------------------------------------
  */

  const handleButtonGroupKey = (
    event,
    options,
    currentValue,
    setValue
  ) => {
    const currentIndex =
      options.indexOf(
        currentValue
      );

    if (
      event.key ===
        "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      const next =
        options[
          (currentIndex + 1) %
            options.length
        ];

      setValue(next);
    }

    if (
      event.key ===
        "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      const previous =
        options[
          (currentIndex -
            1 +
            options.length) %
            options.length
        ];

      setValue(previous);
    }

    if (
      event.key ===
      "Enter"
    ) {
      event.preventDefault();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ENTER NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleEnterKey =
    (event) => {
      if (
        event.key !== "Enter"
      ) {
        return;
      }

      if (
        event.target
          ?.placeholder ===
        "Search patient name"
      ) {
        return;
      }

      event.preventDefault();

      const formElement =
        event.target.form;

      if (!formElement) {
        return;
      }

      const elements =
        Array.from(
          formElement.querySelectorAll(
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

      const next =
        elements[index + 1];

      if (!next) {
        return;
      }

      if (
        next.classList.contains(
          "button-group"
        )
      ) {
        next.focus();

        next
          .querySelector(
            "button"
          )
          ?.focus();
      } else {
        next.focus();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | BMI
  |--------------------------------------------------------------------------
  */

  const computeBMI = (
    height,
    weight
  ) => {
    const numericHeight =
      Number(height);

    const numericWeight =
      Number(weight);

    if (
      !numericHeight ||
      !numericWeight ||
      numericHeight <= 0 ||
      numericWeight <= 0
    ) {
      return "";
    }

    const heightMeters =
      numericHeight / 100;

    return (
      numericWeight /
      (heightMeters *
        heightMeters)
    ).toFixed(1);
  };

  /*
  |--------------------------------------------------------------------------
  | PATIENT SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch =
    async () => {
      const value =
        search.trim();

      if (!value) {
        setResults([]);
        return;
      }

      try {
        setSearching(true);

        const data =
          await searchPatients(
            value
          );

        setResults(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Patient search failed:",
          error
        );

        setResults([]);
      } finally {
        setSearching(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | SELECT PATIENT
  |--------------------------------------------------------------------------
  */

  const selectPatient = (
    patient
  ) => {
    if (!patient) {
      return;
    }

    setPatientId(
      patient._id
    );

    const empty =
      createEmptyForm();

    setForm({
      ...empty,

      generalInfo: {
        ...empty.generalInfo,
        ...(patient.generalInfo ||
          {}),
      },

      examination: {
        ...empty.examination,
        ...(patient.examination ||
          {}),
      },

      obstetricHistory: {
        ...empty.obstetricHistory,
        ...(patient.obstetricHistory ||
          {}),
        contraception:
          Boolean(
            patient
              .obstetricHistory
              ?.contraception
          ),
      },

      perinatalHistory: {
        ...empty.perinatalHistory,
        ...(patient.perinatalHistory ||
          {}),
      },

      medicalHistory:
        Array.isArray(
          patient.medicalHistory
        )
          ? patient.medicalHistory
          : [],

      familyHistory:
        Array.isArray(
          patient.familyHistory
        )
          ? patient.familyHistory
          : [],

      department:
        patient.department ||
        "",

      initComplaint:
        patient.initComplaint ||
        "",
    });

    setResults([]);
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD PATIENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadPatient =
      async () => {
        const id =
          patientIdFromQueue ||
          location.state
            ?.patientId;

        if (!id) {
          return;
        }

        try {
          setLoadingPatient(
            true
          );

          const patient =
            await getPatientById(
              id
            );

          if (
            patient?._id
          ) {
            selectPatient(
              patient
            );
          }
        } catch (error) {
          console.error(
            "Error loading patient:",
            error
          );

          setAlertMessage(
            "Failed to load patient record."
          );
        } finally {
          setLoadingPatient(
            false
          );
        }
      };

    loadPatient();
  }, [
    patientIdFromQueue,
    location.state,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CLEAR
  |--------------------------------------------------------------------------
  */

  const clearForm = () => {
    setForm(
      createEmptyForm()
    );

    setPatientId(null);
    setSearch("");
    setResults([]);
  };

  /*
  |--------------------------------------------------------------------------
  | ADD PATIENT
  |--------------------------------------------------------------------------
  */

  const handleAdd =
    async () => {
      try {
        setSaving(true);

        const payload = {
          generalInfo: {
            ...form.generalInfo,

            age:
              form.generalInfo
                .age === ""
                ? undefined
                : Number(
                    form.generalInfo
                      .age
                  ),
          },

          examination: {
            ...form.examination,
          },

          obstetricHistory: {
            ...form.obstetricHistory,

            contraception:
              Boolean(
                form
                  .obstetricHistory
                  .contraception
              ),
          },

          perinatalHistory: {
            ...form.perinatalHistory,
          },

          medicalHistory:
            form.medicalHistory ||
            [],

          familyHistory:
            form.familyHistory ||
            [],

          department:
            form.department ||
            "",

          initComplaint:
            form.initComplaint ||
            "",
        };

        await addPatient(
          payload
        );

        setAlertMessage(
          "Patient added successfully."
        );

        clearForm();
      } catch (error) {
        console.error(
          "Error adding patient:",
          error
        );

        setAlertMessage(
          error?.message ||
            "Failed to add patient."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | EDIT PATIENT
  |--------------------------------------------------------------------------
  */

  const handleEdit =
    async () => {
      if (!patientId) {
        return;
      }

      try {
        setSaving(true);

        const payload = {
          generalInfo: {
            ...form.generalInfo,

            age:
              form.generalInfo
                .age === ""
                ? undefined
                : Number(
                    form.generalInfo
                      .age
                  ),
          },

          examination: {
            ...form.examination,
          },

          obstetricHistory: {
            ...form.obstetricHistory,

            contraception:
              Boolean(
                form
                  .obstetricHistory
                  .contraception
              ),
          },

          perinatalHistory: {
            ...form.perinatalHistory,
          },

          medicalHistory:
            form.medicalHistory ||
            [],

          familyHistory:
            form.familyHistory ||
            [],

          initComplaint:
            form.initComplaint ||
            "",

          department:
            form.department ||
            "",
        };

        await updatePatient(
          patientId,
          payload
        );

        setAlertMessage(
          "Patient updated successfully."
        );
      } catch (error) {
        console.error(
          "Error updating patient:",
          error
        );

        setAlertMessage(
          error?.message ||
            "Failed to update patient."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE PATIENT
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async () => {
      if (!patientId) {
        return;
      }

      try {
        setSaving(true);

        await deletePatient(
          patientId
        );

        setAlertMessage(
          "Patient deleted successfully."
        );

        clearForm();
      } catch (error) {
        console.error(
          "Error deleting patient:",
          error
        );

        setAlertMessage(
          error?.message ||
            "Failed to delete patient."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <form
      className="registry-modern"
      onSubmit={(event) =>
        event.preventDefault()
      }
    >

      {/* SEARCH HEADER */}
      <div className="header-card">

        <div className="patient-info">

          <h2>
            {form.generalInfo
              .name ||
              "New Patient"}
          </h2>

          <p>
            {form.generalInfo
              .age ||
              "--"}{" "}
            yrs •{" "}
            {form.generalInfo
              .sex ||
              "--"}
          </p>

        </div>

        <div className="search-box">

          <input
            placeholder="Search patient name"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                event.preventDefault();
                event.stopPropagation();

                handleSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={
              handleSearch
            }
            disabled={
              searching
            }
          >
            {searching
              ? "Searching..."
              : "Search"}
          </button>

        </div>
      </div>

      {/* SEARCH RESULTS */}
      {results.length >
        0 && (
        <div className="search-results-list">

          {results.map(
            (patient) => (
              <button
                type="button"
                key={
                  patient._id
                }
                className="search-result"
                onClick={() =>
                  selectPatient(
                    patient
                  )
                }
              >
                <span>
                  {patient
                    .generalInfo
                    ?.name ||
                    "Unnamed Patient"}
                </span>

                <small>
                  {patient
                    .generalInfo
                    ?.birthdate ||
                    "--"}
                </small>
              </button>
            )
          )}

        </div>
      )}

      {/* LOADING */}
      {loadingPatient && (
        <div className="py-4 text-center text-sm text-text-muted">
          Loading patient record...
        </div>
      )}

      <div className="main-grid">

        {/* LEFT */}
        <div className="left-column">

          {/* GENERAL */}
          <div className="card">

            <h3>
              General Information
            </h3>

            <div className="general-grid">

              <div className="field-group full-width">

                <label>
                  Name
                </label>

                <input
                  value={
                    form
                      .generalInfo
                      .name
                  }
                  onChange={(event) =>
                    handleChange(
                      "generalInfo",
                      "name",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

              <div className="field-group full-width">

                <label>
                  Birthday
                </label>

                <input
                  type="date"
                  value={
                    form
                      .generalInfo
                      .birthdate
                  }
                  onChange={(event) => {

                    const birthdate =
                      event.target
                        .value;

                    let age = "";

                    if (
                      birthdate
                    ) {
                      const today =
                        new Date();

                      const birth =
                        new Date(
                          `${birthdate}T00:00:00`
                        );

                      age =
                        today.getFullYear() -
                        birth.getFullYear();

                      const monthDifference =
                        today.getMonth() -
                        birth.getMonth();

                      if (
                        monthDifference <
                          0 ||
                        (monthDifference ===
                          0 &&
                          today.getDate() <
                            birth.getDate())
                      ) {
                        age--;
                      }
                    }

                    setForm(
                      (
                        previous
                      ) => ({
                        ...previous,

                        generalInfo: {
                          ...previous.generalInfo,
                          birthdate,
                          age,
                        },
                      })
                    );
                  }}
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

              <div className="field-group full-width">

                <label>
                  Age
                </label>

                <input
                  value={
                    form
                      .generalInfo
                      .age
                  }
                  readOnly
                />

              </div>

              {/* SEX */}
              <div className="field-group">

                <label>
                  Sex
                </label>

                <div
                  className="button-group"
                  tabIndex="0"
                  onKeyDown={(
                    event
                  ) => {
                    handleEnterKey(
                      event
                    );

                    handleButtonGroupKey(
                      event,
                      [
                        "Male",
                        "Female",
                      ],
                      form
                        .generalInfo
                        .sex,
                      (value) =>
                        handleChange(
                          "generalInfo",
                          "sex",
                          value
                        )
                    );
                  }}
                >

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .sex ===
                      "Male"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "sex",
                        "Male"
                      )
                    }
                  >
                    Male
                  </button>

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .sex ===
                      "Female"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "sex",
                        "Female"
                      )
                    }
                  >
                    Female
                  </button>

                </div>
              </div>

              <div className="field-group full-width">

                <label>
                  Insurance
                </label>

                <input
                  value={
                    form
                      .generalInfo
                      .insurance
                  }
                  onChange={(event) =>
                    handleChange(
                      "generalInfo",
                      "insurance",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

              {/* TOBACCO */}
              <div className="field-group">

                <label>
                  Tobacco
                </label>

                <div
                  className="button-group"
                  tabIndex="0"
                  onKeyDown={(
                    event
                  ) => {
                    handleEnterKey(
                      event
                    );

                    handleButtonGroupKey(
                      event,
                      [
                        "Yes",
                        "No",
                      ],
                      form
                        .generalInfo
                        .tobacco,
                      (value) =>
                        handleChange(
                          "generalInfo",
                          "tobacco",
                          value
                        )
                    );
                  }}
                >

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .tobacco ===
                      "Yes"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "tobacco",
                        "Yes"
                      )
                    }
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .tobacco ===
                      "No"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "tobacco",
                        "No"
                      )
                    }
                  >
                    No
                  </button>

                </div>
              </div>

              {/* ALCOHOL */}
              <div className="field-group">

                <label>
                  Alcohol
                </label>

                <div
                  className="button-group"
                  tabIndex="0"
                  onKeyDown={(
                    event
                  ) => {
                    handleEnterKey(
                      event
                    );

                    handleButtonGroupKey(
                      event,
                      [
                        "Yes",
                        "No",
                      ],
                      form
                        .generalInfo
                        .alcohol,
                      (value) =>
                        handleChange(
                          "generalInfo",
                          "alcohol",
                          value
                        )
                    );
                  }}
                >

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .alcohol ===
                      "Yes"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "alcohol",
                        "Yes"
                      )
                    }
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    className={
                      form
                        .generalInfo
                        .alcohol ===
                      "No"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleChange(
                        "generalInfo",
                        "alcohol",
                        "No"
                      )
                    }
                  >
                    No
                  </button>

                </div>
              </div>

              <div className="field-group full-width">

                <label>
                  Allergies
                </label>

                <input
                  value={
                    form
                      .generalInfo
                      .allergies
                  }
                  onChange={(event) =>
                    handleChange(
                      "generalInfo",
                      "allergies",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

              <div className="field-group full-width">

                <label>
                  Vaccine
                </label>

                <input
                  value={
                    form
                      .generalInfo
                      .vaccine
                  }
                  onChange={(event) =>
                    handleChange(
                      "generalInfo",
                      "vaccine",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

            </div>
          </div>

          {/* COMPLAINT */}
          <div className="card">

            <h3>
              Complaint
            </h3>

            <textarea
              placeholder="Complaint"
              value={
                form.initComplaint
              }
              onChange={(event) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,
                    initComplaint:
                      event
                        .target
                        .value,
                  })
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          {/* DEPARTMENT */}
          <div className="card">

            <h3>
              Department
            </h3>

            <select
              value={
                form.department
              }
              onChange={(event) =>
                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,
                    department:
                      event
                        .target
                        .value,
                  })
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >
              <option
                value=""
                disabled
              >
                Select Department
              </option>

              <option value="Pediatrics">
                Pediatrics
              </option>

              <option value="Ortho">
                Ortho
              </option>

              <option value="Opta">
                Opta
              </option>

              <option value="Dental">
                Dental
              </option>

              <option value="Cardio">
                Cardio
              </option>

              <option value="General">
                General
              </option>
            </select>

          </div>

          {/* FEMALE HISTORY */}
          {form
            .generalInfo
            .sex ===
            "Female" && (
            <>
              <div className="card">

                <h3>
                  Obstetric History
                </h3>

                <div className="checkbox-row">

                  <input
                    type="checkbox"
                    checked={Boolean(
                      form
                        .obstetricHistory
                        .contraception
                    )}
                    onChange={(
                      event
                    ) =>
                      handleChange(
                        "obstetricHistory",
                        "contraception",
                        event.target
                          .checked
                      )
                    }
                  />

                  <span>
                    Contraception
                  </span>

                </div>

                <input
                  placeholder="Type"
                  value={
                    form
                      .obstetricHistory
                      .type
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "type",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

                <input
                  placeholder="G/P (F/P/A/L)"
                  value={
                    form
                      .obstetricHistory
                      .gpfpal
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "gpfpal",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

                <input
                  placeholder="BF"
                  value={
                    form
                      .obstetricHistory
                      .bf
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "bf",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

                <input
                  placeholder="Birth History"
                  value={
                    form
                      .obstetricHistory
                      .birthHistory
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "birthHistory",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

                <input
                  placeholder="Delivery Site"
                  value={
                    form
                      .obstetricHistory
                      .deliverySite
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "deliverySite",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

                <input
                  type="date"
                  value={
                    form
                      .obstetricHistory
                      .lmp
                  }
                  onChange={(
                    event
                  ) =>
                    handleChange(
                      "obstetricHistory",
                      "lmp",
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleEnterKey
                  }
                />

              </div>

              <div className="card">

                <h3>
                  Perinatal History
                </h3>

                <div className="perinatal-grid">

                  <input
                    placeholder="Birth Weight"
                    value={
                      form
                        .perinatalHistory
                        .bw
                    }
                    onChange={(
                      event
                    ) =>
                      handleChange(
                        "perinatalHistory",
                        "bw",
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleEnterKey
                    }
                  />

                  <input
                    placeholder="BF"
                    value={
                      form
                        .perinatalHistory
                        .bf
                    }
                    onChange={(
                      event
                    ) =>
                      handleChange(
                        "perinatalHistory",
                        "bf",
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleEnterKey
                    }
                  />

                  <input
                    placeholder="Birth History"
                    value={
                      form
                        .perinatalHistory
                        .birthHistory
                    }
                    onChange={(
                      event
                    ) =>
                      handleChange(
                        "perinatalHistory",
                        "birthHistory",
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleEnterKey
                    }
                  />

                  <input
                    placeholder="Delivery Site"
                    value={
                      form
                        .perinatalHistory
                        .deliverySite
                    }
                    onChange={(
                      event
                    ) =>
                      handleChange(
                        "perinatalHistory",
                        "deliverySite",
                        event.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleEnterKey
                    }
                  />

                </div>
              </div>
            </>
          )}

        </div>

        {/* RIGHT */}
        <div className="right-column">

          {/* MEDICAL HISTORY */}
          <div className="card">

            <h3>
              Medical History
            </h3>

            {HISTORY_OPTIONS.map(
              (option) => (
                <div
                  key={option}
                  className={
                    form.medicalHistory.includes(
                      option
                    )
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() =>
                    toggleCheckbox(
                      "medicalHistory",
                      option
                    )
                  }
                >
                  {option}
                </div>
              )
            )}

          </div>

          {/* FAMILY HISTORY */}
          <div className="card">

            <h3>
              Family History
            </h3>

            {HISTORY_OPTIONS.map(
              (option) => (
                <div
                  key={option}
                  className={
                    form.familyHistory.includes(
                      option
                    )
                      ? "chip active"
                      : "chip"
                  }
                  onClick={() =>
                    toggleCheckbox(
                      "familyHistory",
                      option
                    )
                  }
                >
                  {option}
                </div>
              )
            )}

          </div>

          {/* EXAMINATION */}
          <div className="card">

            <h3>
              Examination
            </h3>

            {/* BP */}
            <div className="bp-group">

              <input
                placeholder="Systolic"
                value={
                  form
                    .examination
                    .bp
                    ?.split(
                      "/"
                    )[0] ||
                  ""
                }
                onChange={(
                  event
                ) => {

                  const sys =
                    event
                      .target
                      .value;

                  const dia =
                    form
                      .examination
                      .bp
                      ?.split(
                        "/"
                      )[1] ||
                    "";

                  handleChange(
                    "examination",
                    "bp",
                    `${sys}/${dia}`
                  );
                }}
                onKeyDown={
                  handleEnterKey
                }
              />

              <span>
                /
              </span>

              <input
                placeholder="Diastolic"
                value={
                  form
                    .examination
                    .bp
                    ?.split(
                      "/"
                    )[1] ||
                  ""
                }
                onChange={(
                  event
                ) => {

                  const dia =
                    event
                      .target
                      .value;

                  const sys =
                    form
                      .examination
                      .bp
                      ?.split(
                        "/"
                      )[0] ||
                    "";

                  handleChange(
                    "examination",
                    "bp",
                    `${sys}/${dia}`
                  );
                }}
                onKeyDown={
                  handleEnterKey
                }
              />

            </div>

            {/* TEMP */}
            <input
              placeholder="Temperature"
              value={
                form
                  .examination
                  .temp
              }
              onChange={(
                event
              ) =>
                handleChange(
                  "examination",
                  "temp",
                  event.target
                    .value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

            {/* HEIGHT */}
            <input
              placeholder="Height"
              value={
                form
                  .examination
                  .height
              }
              onChange={(
                event
              ) => {

                const height =
                  event.target
                    .value;

                const bmi =
                  computeBMI(
                    height,
                    form
                      .examination
                      .weight
                  );

                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    examination: {
                      ...previous.examination,
                      height,
                      bmi,
                    },
                  })
                );
              }}
              onKeyDown={
                handleEnterKey
              }
            />

            {/* WEIGHT */}
            <input
              placeholder="Weight"
              value={
                form
                  .examination
                  .weight
              }
              onChange={(
                event
              ) => {

                const weight =
                  event.target
                    .value;

                const bmi =
                  computeBMI(
                    form
                      .examination
                      .height,
                    weight
                  );

                setForm(
                  (
                    previous
                  ) => ({
                    ...previous,

                    examination: {
                      ...previous.examination,
                      weight,
                      bmi,
                    },
                  })
                );
              }}
              onKeyDown={
                handleEnterKey
              }
            />

            {/* BMI */}
            <input
              placeholder="BMI"
              value={
                form
                  .examination
                  .bmi
              }
              readOnly
            />

          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="action-bar">

        <button
          type="button"
          disabled={
            !patientId ||
            saving
          }
          onClick={() =>
            setConfirmState({
              message:
                "Save changes to this patient?",
              onConfirm:
                async () => {
                  setConfirmState(
                    null
                  );

                  await handleEdit();
                },
            })
          }
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          className="danger"
          disabled={
            !patientId ||
            saving
          }
          onClick={() =>
            setConfirmState({
              message:
                "Are you sure you want to DELETE this patient? This cannot be undone.",

              onConfirm:
                async () => {
                  setConfirmState(
                    null
                  );

                  await handleDelete();
                },
            })
          }
        >
          Delete
        </button>

        <button
          type="button"
          className="ghost"
          onClick={
            clearForm
          }
        >
          Clear
        </button>

      </div>

      {/* CONFIRM */}
      {confirmState && (
        <ConfirmModal
          message={
            confirmState.message
          }
          onConfirm={
            confirmState.onConfirm
          }
          onCancel={() =>
            setConfirmState(
              null
            )
          }
        />
      )}

      {/* ALERT */}
      {alertMessage && (
        <AlertModal
          message={
            alertMessage
          }
          onClose={() =>
            setAlertMessage(
              ""
            )
          }
        />
      )}

    </form>
  );
}

export default Registry;