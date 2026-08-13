import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiHeart,
  FiInfo,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";

const PatientViewFinal = ({
  patient,
  onClose,
}) => {
  if (!patient) return null;

  const name =
    patient.generalInfo?.name ||
    "Unnamed Patient";

  const age =
    patient.generalInfo?.age || "--";

  const gender =
    patient.generalInfo?.gender ||
    patient.generalInfo?.sex ||
    "--";

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-extrabold text-blue-700">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">
                {name}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{age} years old</span>

                <span className="text-slate-300">
                  •
                </span>

                <span>{gender}</span>

                {patient.generalInfo?.insurance && (
                  <>
                    <span className="text-slate-300">
                      •
                    </span>

                    <span>
                      {patient.generalInfo.insurance}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <FiX size={17} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ====================================================== */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">

            {/* =================================================
                LEFT
            ================================================== */}

            <div className="space-y-5">

              {/* GENERAL */}

              <InfoSection
                icon={<FiUser />}
                title="General Information"
              >
                <InfoGrid
                  items={[
                    [
                      "Insurance",
                      patient.generalInfo?.insurance,
                    ],
                    [
                      "Birthdate",
                      patient.generalInfo?.birthdate,
                    ],
                    [
                      "Tobacco",
                      patient.generalInfo?.tobacco,
                    ],
                    [
                      "Alcohol",
                      patient.generalInfo?.alcohol,
                    ],
                    [
                      "Allergies",
                      patient.generalInfo?.allergies,
                    ],
                    [
                      "Vaccines",
                      patient.generalInfo?.vaccine,
                    ],
                  ]}
                />
              </InfoSection>

              {/* VITALS */}

              <InfoSection
                icon={<FiActivity />}
                title="Vitals"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Vital
                    label="Blood Pressure"
                    value={patient.examination?.bp}
                  />

                  <Vital
                    label="Temperature"
                    value={patient.examination?.temp}
                  />

                  <Vital
                    label="Height"
                    value={patient.examination?.height}
                  />

                  <Vital
                    label="Weight"
                    value={patient.examination?.weight}
                  />

                  <Vital
                    label="BMI"
                    value={patient.examination?.bmi}
                  />
                </div>
              </InfoSection>

              {/* HISTORY */}

              <InfoSection
                icon={<FiHeart />}
                title="Medical History"
              >
                <ChipList
                  items={patient.medicalHistory}
                  empty="No medical history recorded."
                />

                <div className="my-5 border-t border-slate-100" />

                <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Family History
                </h4>

                <ChipList
                  items={patient.familyHistory}
                  empty="No family history recorded."
                />
              </InfoSection>
            </div>

            {/* =================================================
                RIGHT
            ================================================== */}

            <div>
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <FiShield />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Doctor Records
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Medical records documented during patient visits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {patient.doctorSheets?.length > 0 ? (
                    patient.doctorSheets
                      .slice()
                      .reverse()
                      .map((record, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
                        >
                          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-extrabold text-slate-900">
                                {record.doctorName ||
                                  "Doctor"}
                              </p>

                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {record.department ||
                                  "General"}
                              </p>
                            </div>

                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                              <FiCalendar />
                              {record.date
                                ? new Date(
                                    record.date,
                                  ).toLocaleString()
                                : "—"}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <RecordField
                              label="Chief Complaint"
                              value={
                                record.initComplaint
                              }
                            />

                            <RecordField
                              label="Diagnosis"
                              value={
                                record.diagnosis
                              }
                            />

                            <RecordField
                              label="Treatment"
                              value={
                                record.treatment
                              }
                            />

                            <RecordField
                              label="Medication"
                              value={
                                record.medication
                              }
                            />
                          </div>

                          {record.referral?.department && (
                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                              <div className="flex gap-3">
                                <FiAlertCircle className="mt-0.5 shrink-0 text-blue-600" />

                                <div>
                                  <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                                    Referral
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-blue-900">
                                    {
                                      record.referral
                                        .department
                                    }
                                  </p>

                                  <p className="mt-2 text-xs leading-5 text-blue-800">
                                    <strong>
                                      Reason:
                                    </strong>{" "}
                                    {record.referral.reason ||
                                      "—"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {Object.keys(
                            record.examination || {},
                          ).length > 0 && (
                            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                Examination
                              </p>

                              <div className="grid gap-3 sm:grid-cols-2">
                                {Object.entries(
                                  record.examination || {},
                                ).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="rounded-lg bg-slate-50 px-3 py-2.5"
                                    >
                                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                        {key
                                          .replace(
                                            /([A-Z])/g,
                                            " $1",
                                          )
                                          .replace(
                                            /^./,
                                            (s) =>
                                              s.toUpperCase(),
                                          )}
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {value || "—"}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <FiInfo />
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-700">
                        No doctor records
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        There are no medical records available for this patient.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-slate-200 bg-white px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoSection({
  icon,
  title,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </div>

        <h3 className="text-sm font-extrabold text-slate-900">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid gap-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
        >
          <span className="text-xs font-medium text-slate-400">
            {label}
          </span>

          <span className="text-right text-xs font-bold text-slate-700">
            {value || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

function Vital({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function ChipList({ items, empty }) {
  return items?.length ? (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-xs text-slate-400">
      {empty}
    </p>
  );
}

function RecordField({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

export default PatientViewFinal;