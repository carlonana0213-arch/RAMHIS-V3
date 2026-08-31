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
import { getPendingOfflineConflicts } from "../../../Services/offlineRepository";
import ConflictManager from "../../../Components/common/ConflictManager";

export default function Doctor() {
  const [patients, setPatients] = useState([]);

  // Only used for the initial loading state.
  // Search/filter refreshes will NOT make the UI flicker.
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [conflictPatient, setConflictPatient] = useState(null);
  const [patientConflict, setPatientConflict] = useState(null);
  const [checkingConflict, setCheckingConflict] = useState(false);

  const [search, setSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState("all");

  // ---------------------------------------------------------
  // DEBOUNCED SEARCH
  // ---------------------------------------------------------
  // Prevents an API request from being made on every
  // individual keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ---------------------------------------------------------
  // LOAD DOCTOR QUEUE
  // ---------------------------------------------------------
  const loadQueue = useCallback(
    async (showLoading = false) => {
      try {
        // Only show the loading state when explicitly requested.
        //
        // This is important because searching/filtering should
        // NOT replace the existing queue with a loading screen.
        if (showLoading) {
          setLoading(true);
        }

        const response = await getDoctorQueue({
          page: 1,
          limit: 1000,
          search: debouncedSearch,
          queueFilter,
          department: "General",
          role: "doctor",
        });

        const queueData =
          response?.patients ||
          response?.data ||
          (Array.isArray(response) ? response : []);

        // Update the queue only after the API request succeeds.
        //
        // We intentionally DO NOT clear patients before the
        // request. This prevents the visible flicker.
        setPatients(queueData);
      } catch (error) {
        console.error("Failed to load doctor queue:", error);

        // Only clear the queue if this was the initial load.
        //
        // During search/filter requests, keeping the existing
        // data is preferable to making the UI flash empty.
        if (showLoading) {
          setPatients([]);
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [debouncedSearch, queueFilter],
  );

  // ---------------------------------------------------------
  // INITIAL LOAD + SEARCH/FILTER REFRESH
  // ---------------------------------------------------------
  useEffect(() => {
    loadQueue(true);
  }, [loadQueue]);

  // ---------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------
  const stats = useMemo(() => {
    const normalized = patients.map((patient) => ({
      ...patient,
      status: String(patient?.status || "").toLowerCase(),
    }));

    return {
      total: normalized.length,

      waiting: normalized.filter(
        (patient) =>
          patient.status === "waiting" || patient.status === "unconsulted",
      ).length,

      beingSeen: normalized.filter((patient) => patient.status === "beingseen")
        .length,

      forPharmacy: normalized.filter(
        (patient) => patient.status === "forpharmacy",
      ).length,

      priority: normalized.filter((patient) => patient.isPriority).length,
    };
  }, [patients]);

  // ---------------------------------------------------------
  // CURRENT PATIENT
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // OPEN CONSULTATION
  // ---------------------------------------------------------
  const openDoctorView = async (patient) => {
    if (!patient) return;

    // Only check for conflicts when online.
    if (!navigator.onLine) {
      setSelectedPatient(patient);
      return;
    }

    try {
      setCheckingConflict(true);

      const conflicts = await getPendingOfflineConflicts();

      const patientId = patient?._id || patient?.id || patient?.serverId;

      const conflict = conflicts.find(
        (item) =>
          item.status === "pending" &&
          (item.entityType === "patient" ||
            item.entityType === "doctorRecord") &&
          String(item.entityKey) === String(patientId),
      );

      if (conflict) {
        // Do NOT open the consultation yet.
        setConflictPatient(patient);
        setPatientConflict(conflict);
        return;
      }

      // No conflict → open normally.
      setSelectedPatient(patient);
    } catch (error) {
      console.error("Failed to check patient conflicts:", error);

      // If conflict checking fails, preserve
      // the existing behaviour and open the patient.
      setSelectedPatient(patient);
    } finally {
      setCheckingConflict(false);
    }
  };

  // ---------------------------------------------------------
  // CLOSE CONSULTATION
  // ---------------------------------------------------------
  const handleCloseConsultation = () => {
    setSelectedPatient(null);
  };

  // ---------------------------------------------------------
  // AFTER CONSULTATION RECORD IS SAVED
  // ---------------------------------------------------------
  const handleRecordSaved = async () => {
    setSelectedPatient(null);

    // Refresh the queue without showing the loading state.
    await loadQueue(false);
  };

  // ---------------------------------------------------------
  // NEXT PATIENT
  // ---------------------------------------------------------
  const handleNextPatient = () => {
    if (!currentPatient) return;

    const currentIndex = patients.findIndex(
      (patient) => patient._id === currentPatient._id,
    );

    if (currentIndex === -1) return;

    for (let index = currentIndex + 1; index < patients.length; index += 1) {
      const patient = patients[index];

      const status = String(patient?.status || "").toLowerCase();

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
    <div className="min-h-full w-full bg-transparent px-4 py-5 pb-6 text-text-primary sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="mt-4.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <Stethoscope size={21} />
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

        {/* SYNC CONFLICT MODAL */}

        {patientConflict && conflictPatient && (
          <ConflictManager
            conflict={patientConflict}
            patient={conflictPatient}
            onClose={() => {
              setPatientConflict(null);
              setConflictPatient(null);
            }}
            onResolved={async () => {
              setPatientConflict(null);
              setConflictPatient(null);

              await loadQueue(false);
            }}
          />
        )}

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

function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="group min-w-0 rounded-[20px] border border-border-soft bg-surface p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
      >
        <Icon size={18} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-text-muted">{label}</p>

        <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-primary-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
