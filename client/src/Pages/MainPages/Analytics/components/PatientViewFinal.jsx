import {
  FiActivity,
  FiCalendar,
  FiChevronRight,
  FiClipboard,
  FiClock,
  FiFileText,
  FiHeart,
  FiInfo,
  FiMapPin,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const EMPTY = "Not provided";

const PatientViewFinal = ({ patient, onClose }) => {
  if (!patient) return null;

  const generalInfo = patient.generalInfo || {};
  const examination = patient.examination || {};
  const medicalHistory = patient.medicalHistory || {};
  const familyHistory = patient.familyHistory || {};
  const doctorSheets = Array.isArray(patient.doctorSheets)
    ? patient.doctorSheets
    : [];

  const name =
    patient.name ||
    generalInfo.name ||
    [
      generalInfo.firstName,
      generalInfo.middleName,
      generalInfo.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unnamed Patient";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "PT";

  const age =
    generalInfo.age ??
    patient.age ??
    EMPTY;

  const sex =
    generalInfo.gender ||
    generalInfo.sex ||
    patient.sex ||
    EMPTY;

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return EMPTY;
    }

    if (Array.isArray(value)) {
      return value.length
        ? value.join(", ")
        : EMPTY;
    }

    if (typeof value === "object") {
      const values = Object.entries(value)
        .filter(([, item]) => item)
        .map(([key]) =>
          key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (letter) =>
              letter.toUpperCase(),
            ),
        );

      return values.length
        ? values.join(", ")
        : EMPTY;
    }

    return String(value);
  };

  const formatDate = (value) => {
    if (!value) return EMPTY;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return formatValue(value);
    }

    return date.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const getSheetDate = (sheet) =>
    sheet.date ||
    sheet.createdAt ||
    sheet.updatedAt ||
    sheet.visitDate;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-[1400px] flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-[calc(100vh-32px)] sm:rounded-[28px]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="shrink-0 border-b border-border-soft bg-surface px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-lg font-extrabold text-primary-700 ring-1 ring-primary-100 sm:h-16 sm:w-16">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-600">
                    Patient Medical Record
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {doctorSheets.length}{" "}
                    {doctorSheets.length === 1
                      ? "Visit"
                      : "Visits"}
                  </span>
                </div>

                <h2 className="mt-1 truncate text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
                  {name}
                </h2>

                <p className="mt-1 text-xs font-medium text-text-muted sm:text-sm">
                  {age !== EMPTY
                    ? `${age} years old`
                    : age}
                  {" • "}
                  {sex}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-surface text-text-muted transition hover:bg-slate-100 hover:text-text-primary active:scale-95"
              aria-label="Close patient record"
            >
              <FiX size={19} />
            </button>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1320px] p-4 sm:p-6 lg:p-7">
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">

              {/* =================================================
                  LEFT PATIENT PROFILE
              ================================================= */}

              <aside className="space-y-5">

                <Section
                  eyebrow="Patient Profile"
                  title="General Information"
                  icon={<FiUser size={17} />}
                >
                  <div className="grid gap-3">
                    <InfoRow
                      label="Full Name"
                      value={name}
                    />

                    <InfoRow
                      label="Birthdate"
                      value={formatDate(
                        generalInfo.birthdate ||
                          generalInfo.dateOfBirth ||
                          patient.birthdate,
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        label="Age"
                        value={age}
                      />

                      <InfoRow
                        label="Sex"
                        value={sex}
                      />
                    </div>

                    <InfoRow
                      label="Address"
                      value={formatValue(
                        generalInfo.address ||
                          patient.address,
                      )}
                    />

                    <InfoRow
                      label="Contact Number"
                      value={formatValue(
                        generalInfo.contactNumber ||
                          generalInfo.phone ||
                          patient.contactNumber,
                      )}
                    />

                    <InfoRow
                      label="Insurance"
                      value={formatValue(
                        generalInfo.insurance ||
                          generalInfo.philHealth ||
                          patient.insurance,
                      )}
                    />
                  </div>
                </Section>

                <Section
                  eyebrow="Clinical Snapshot"
                  title="Vital Signs"
                  icon={<FiActivity size={17} />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <VitalCard
                      label="Blood Pressure"
                      value={
                        examination.bloodPressure ||
                        examination.bp
                      }
                    />

                    <VitalCard
                      label="Temperature"
                      value={
                        examination.temperature
                      }
                    />

                    <VitalCard
                      label="Heart Rate"
                      value={
                        examination.heartRate ||
                        examination.pulseRate
                      }
                    />

                    <VitalCard
                      label="Respiratory Rate"
                      value={
                        examination.respiratoryRate
                      }
                    />

                    <VitalCard
                      label="Weight"
                      value={
                        examination.weight
                      }
                    />

                    <VitalCard
                      label="Height"
                      value={
                        examination.height
                      }
                    />
                  </div>
                </Section>

                <Section
                  eyebrow="Health Background"
                  title="Medical History"
                  icon={<FiHeart size={17} />}
                >
                  <HistoryContent
                    data={medicalHistory}
                  />
                </Section>

                <Section
                  eyebrow="Family Background"
                  title="Family History"
                  icon={<FiUsers size={17} />}
                >
                  <HistoryContent
                    data={familyHistory}
                  />
                </Section>
              </aside>

              {/* =================================================
                  DOCTOR RECORDS
              ================================================= */}

              <section className="min-w-0 space-y-5">
                <div className="flex flex-col gap-2 border-b border-border-soft pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-600">
                      Consultation History
                    </span>

                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-text-primary">
                      Doctor Records
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                      Clinical assessments and treatment
                      records for this patient.
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
                    {doctorSheets.length} total{" "}
                    {doctorSheets.length === 1
                      ? "record"
                      : "records"}
                  </span>
                </div>

                {doctorSheets.length === 0 ? (
                  <EmptyDoctorState />
                ) : (
                  <div className="space-y-4">
                    {doctorSheets.map(
                      (sheet, index) => {
                        const isLatest =
                          index ===
                          doctorSheets.length - 1;

                        const diagnosis =
                          sheet.diagnosis ||
                          sheet.assessment ||
                          sheet.impression;

                        const treatment =
                          sheet.treatment ||
                          sheet.plan ||
                          sheet.medication;

                        const doctor =
                          sheet.doctorName ||
                          sheet.doctor ||
                          sheet.physician ||
                          EMPTY;

                        const department =
                          sheet.department ||
                          sheet.clinic ||
                          sheet.specialization ||
                          EMPTY;

                        return (
                          <DoctorRecordCard
                            key={
                              sheet._id ||
                              sheet.id ||
                              `${getSheetDate(
                                sheet,
                              )}-${index}`
                            }
                            sheet={sheet}
                            index={index}
                            isLatest={isLatest}
                            diagnosis={diagnosis}
                            treatment={treatment}
                            doctor={doctor}
                            department={department}
                            date={formatDate(
                              getSheetDate(sheet),
                            )}
                            formatValue={formatValue}
                          />
                        );
                      },
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="shrink-0 border-t border-border-soft bg-surface px-5 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="hidden text-xs text-text-muted sm:block">
              Patient information displayed from
              available medical records.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-10 items-center justify-center rounded-xl bg-primary-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800 active:scale-[0.98]"
            >
              Close Record
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* =========================================================
   DOCTOR RECORD CARD
========================================================= */

function DoctorRecordCard({
  sheet,
  index,
  isLatest,
  diagnosis,
  treatment,
  doctor,
  department,
  date,
  formatValue,
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-surface shadow-sm ${
        isLatest
          ? "border-primary-200 ring-1 ring-primary-100"
          : "border-border-soft"
      }`}
    >
      <div
        className={`border-b px-5 py-4 sm:px-6 ${
          isLatest
            ? "border-primary-100 bg-primary-50/60"
            : "border-border-soft bg-slate-50/70"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                isLatest
                  ? "bg-primary-700 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {isLatest
                ? <FiActivity size={17} />
                : doctorSheetsNumber(index)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {isLatest && (
                  <span className="rounded-full bg-primary-700 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Latest Record
                  </span>
                )}

                <span className="text-xs font-bold text-text-muted">
                  Visit #{index + 1}
                </span>
              </div>

              <h4 className="mt-1 truncate text-sm font-extrabold text-text-primary">
                {doctor}
              </h4>

              <p className="mt-0.5 truncate text-xs text-text-muted">
                {department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <FiCalendar size={14} />
            {date}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ClinicalBlock
            label="Diagnosis / Assessment"
            icon={<FiClipboard size={15} />}
            value={diagnosis}
          />

          <ClinicalBlock
            label="Treatment / Plan"
            icon={<FiHeart size={15} />}
            value={treatment}
          />
        </div>

        {(sheet.notes ||
          sheet.remarks ||
          sheet.findings) && (
          <ClinicalBlock
            label="Clinical Notes"
            icon={<FiFileText size={15} />}
            value={
              sheet.notes ||
              sheet.remarks ||
              sheet.findings
            }
          />
        )}

        {(sheet.referral ||
          sheet.referralTo ||
          sheet.referredTo) && (
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-sky-700">
                <FiChevronRight size={17} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-sky-700">
                  Referral
                </p>

                <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
                  {formatValue(
                    sheet.referral ||
                      sheet.referralTo ||
                      sheet.referredTo,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border-soft pt-4 text-xs text-text-muted">
          {sheet.visitPlace && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
              <FiMapPin size={13} />
              {sheet.visitPlace}
            </span>
          )}

          {sheet.time && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
              <FiClock size={13} />
              {sheet.time}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function Section({
  eyebrow,
  title,
  icon,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
      <div className="flex items-center gap-3 border-b border-border-soft px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          {icon}
        </div>

        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-primary-600">
            {eyebrow}
          </span>

          <h3 className="mt-0.5 text-sm font-extrabold text-text-primary">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3.5 py-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-text-subtle">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-text-secondary">
        {value || EMPTY}
      </p>
    </div>
  );
}

function VitalCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-slate-50 px-3 py-3">
      <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-text-subtle">
        {label}
      </p>

      <p className="mt-1 text-sm font-extrabold text-text-primary">
        {value || "—"}
      </p>
    </div>
  );
}

function HistoryContent({ data }) {
  const entries = Object.entries(
    data || {},
  ).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== false,
  );

  if (!entries.length) {
    return (
      <EmptyText>
        No recorded history available.
      </EmptyText>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => {
        const label =
          typeof value === "string" &&
          value.trim()
            ? `${key}: ${value}`
            : key;

        return (
          <span
            key={key}
            className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700"
          >
            {label
              .replace(
                /([A-Z])/g,
                " $1",
              )
              .replace(
                /^./,
                (letter) =>
                  letter.toUpperCase(),
              )}
          </span>
        );
      })}
    </div>
  );
}

function ClinicalBlock({
  label,
  icon,
  value,
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-primary-700">
        {icon}

        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-text-secondary">
        {value || "No information recorded."}
      </p>
    </div>
  );
}

function EmptyText({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-slate-50 px-4 py-5 text-center text-xs font-medium text-text-muted">
      {children}
    </div>
  );
}

function EmptyDoctorState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
        <FiFileText size={24} />
      </div>

      <h4 className="mt-4 text-sm font-extrabold text-text-primary">
        No doctor records available
      </h4>

      <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
        This patient currently has no recorded
        consultation or clinical assessment history.
      </p>
    </div>
  );
}

function doctorSheetsNumber(index) {
  return index + 1;
}

export default PatientViewFinal;