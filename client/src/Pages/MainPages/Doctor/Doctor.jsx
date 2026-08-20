import { useCallback, useEffect, useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";

import DoctorQueue from "./components/DoctorQueue";
import PatientCard from "./components/PatientCard";
import PatientDoctorView from "./components/PatientDoctorView";

import { getDoctorQueue } from "../../../services/doctorService";

export default function Doctor() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consultation modal stays CLOSED initially.
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [search, setSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState("all");

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDoctorQueue({
        page: 1,
        limit: 1000,
        search,
        queueFilter,
        department: "General",
        role: "doctor",
      });

      const queueData =
        response?.patients ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setPatients(queueData);
    } catch (error) {
      console.error("Failed to load doctor queue:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [search, queueFilter]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const stats = useMemo(() => {
    const normalized = patients.map((patient) => ({
      ...patient,
      status: String(patient?.status || "").toLowerCase(),
    }));

    return {
      total: normalized.length,

      waiting: normalized.filter(
        (patient) =>
          patient.status === "waiting" ||
          patient.status === "unconsulted",
      ).length,

      beingSeen: normalized.filter(
        (patient) => patient.status === "beingseen",
      ).length,

      forPharmacy: normalized.filter(
        (patient) => patient.status === "forpharmacy",
      ).length,

      priority: normalized.filter(
        (patient) => patient.isPriority,
      ).length,
    };
  }, [patients]);

  const currentPatient = useMemo(() => {
    return patients.find((patient) => {
      const status = String(patient?.status || "").toLowerCase();

      return (
        status === "waiting" ||
        status === "unconsulted" ||
        status === "beingseen"
      );
    });
  }, [patients]);

  // ============================================================
  // OPEN CONSULTATION MODAL
  // ============================================================

  const openDoctorView = (patient) => {
    if (!patient) return;

    setSelectedPatient(patient);
  };

  // ============================================================
  // CLOSE CONSULTATION MODAL
  // ============================================================

  const handleCloseConsultation = () => {
    setSelectedPatient(null);
  };

  // ============================================================
  // AFTER RECORD IS SAVED
  // ============================================================

  const handleRecordSaved = async () => {
    setSelectedPatient(null);

    await loadQueue();
  };

  // ============================================================
  // NEXT PATIENT
  // ============================================================

  const handleNextPatient = () => {
    if (!currentPatient) return;

    const currentIndex = patients.findIndex(
      (patient) => patient._id === currentPatient._id,
    );

    if (currentIndex === -1) return;

    for (
      let index = currentIndex + 1;
      index < patients.length;
      index += 1
    ) {
      const patient = patients[index];

      const status = String(
        patient?.status || "",
      ).toLowerCase();

      if (
        status === "waiting" ||
        status === "unconsulted" ||
        status === "beingseen"
      ) {
        // Only open this patient's consultation modal.
        setSelectedPatient(patient);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* PAGE HEADER */}

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Stethoscope size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Doctor
            </h1>

            <p className="text-sm text-slate-500">
              Manage patient consultations and medical records.
            </p>
          </div>
        </div>

        {/* STATISTICS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Patients"
            value={stats.total}
            valueClassName="text-slate-800"
          />

          <StatCard
            label="Waiting"
            value={stats.waiting}
            valueClassName="text-amber-600"
          />

          <StatCard
            label="Being Served"
            value={stats.beingSeen}
            valueClassName="text-blue-600"
          />

          <StatCard
            label="For Pharmacy"
            value={stats.forPharmacy}
            valueClassName="text-emerald-600"
          />

          <StatCard
            label="Priority"
            value={stats.priority}
            valueClassName="text-rose-600"
          />
        </div>

        {/* CURRENT PATIENT + DOCTOR QUEUE */}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* LEFT SIDE */}

          <div className="w-full xl:w-[360px]">
            <PatientCard
              patient={currentPatient}
              onSelect={openDoctorView}
              onNextPatient={handleNextPatient}
            />
          </div>

          {/* RIGHT SIDE */}

          <div className="min-w-0">
            <DoctorQueue
              patients={patients}
              loading={loading}
              search={search}
              setSearch={setSearch}
              queueFilter={queueFilter}
              setQueueFilter={setQueueFilter}
              onOpenDoctorView={openDoctorView}
            />
          </div>
        </div>

        {/* CONSULTATION MODAL */}

        {selectedPatient && (
          <PatientDoctorView
            patient={selectedPatient}
            open={true}
            onClose={handleCloseConsultation}
            onSaved={handleRecordSaved}
            refreshQueue={loadQueue}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName = "text-slate-800",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}