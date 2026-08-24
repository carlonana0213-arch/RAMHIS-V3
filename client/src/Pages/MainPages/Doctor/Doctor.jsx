import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Stethoscope,
  Users,
  Clock3,
  Activity,
  Pill,
  AlertTriangle,
} from "lucide-react";

import DoctorQueue from "./components/DoctorQueue";
import PatientCard from "./components/PatientCard";
import PatientDoctorView from "./components/PatientDoctorView";

import { getDoctorQueue } from "../../../Services/doctorService";

export default function Doctor() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const openDoctorView = (patient) => {
    if (!patient) return;

    setSelectedPatient(patient);
  };

  const handleCloseConsultation = () => {
    setSelectedPatient(null);
  };

  const handleRecordSaved = async () => {
    setSelectedPatient(null);

    await loadQueue();
  };

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
        setSelectedPatient(patient);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1800px]">

        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <Stethoscope size={22} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Clinical Services
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
                Doctor Queue
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                Manage patient consultations and medical records.
              </p>
            </div>

          </div>

          <div className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
            {stats.waiting.toLocaleString()} waiting
          </div>

        </div>

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">

          <StatCard
            label="Total Patients"
            value={stats.total}
            icon={Users}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
          />

          <StatCard
            label="Waiting"
            value={stats.waiting}
            icon={Clock3}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            label="Being Served"
            value={stats.beingSeen}
            icon={Activity}
            iconBg="bg-primary-50"
            iconColor="text-primary-700"
          />

          <StatCard
            label="For Pharmacy"
            value={stats.forPharmacy}
            icon={Pill}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            label="Priority"
            value={stats.priority}
            icon={AlertTriangle}
            iconBg="bg-status-critical-bg"
            iconColor="text-status-critical-text"
          />

        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[380px_minmax(0,1fr)]">

          {/* CURRENT PATIENT */}
          <div className="min-w-0">
            <PatientCard
              patient={currentPatient}
              onSelect={openDoctorView}
              onNextPatient={handleNextPatient}
            />
          </div>

          {/* DOCTOR QUEUE */}
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
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group min-w-0 rounded-[20px] border border-border-soft bg-surface p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
      >
        <Icon size={18} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-text-muted">
          {label}
        </p>

        <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-primary-900">
          {value.toLocaleString()}
        </p>
      </div>

    </div>
  );
}