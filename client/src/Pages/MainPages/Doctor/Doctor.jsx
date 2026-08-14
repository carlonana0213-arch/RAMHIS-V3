import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ClipboardList,
  Clock3,
  Stethoscope,
  Users,
} from "lucide-react";

import { updatePatientStatus } from "../../../Services/doctorService";
import { getPatientQueue } from "../../../Services/patientService";

import DoctorQueue from "./components/DoctorQueue";
import PatientCard from "./components/PatientCard";
import PatientDoctorView from "./components/PatientDoctorView";

import ConfirmModal from "../../../Components/ui/ConfirmModal";
import TableSkeleton from "../../../Components/ui/TableSkeleton";
import PatientCardSkeleton from "../../../Components/ui/PatientCardSkeleton";

function Doctor() {
  const [patients, setPatients] = useState([]);
  const [ongoingEvent, setOngoingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState("all");

  const [showDoctorView, setShowDoctorView] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [showReleaseConfirm, setShowReleaseConfirm] =
    useState(false);

  const hasLoadedRef = useRef(false);

  const loadQueue = useCallback(async () => {
    try {
      if (!hasLoadedRef.current) {
        setLoading(true);
      }

      const response = await getPatientQueue();

      const patientList = Array.isArray(response)
        ? response
        : response?.patients || [];

      const currentEvent = Array.isArray(response)
        ? null
        : response?.ongoingEvent || null;

      const activePatients = patientList.filter(
        (patient) => patient?.status !== "released"
      );

      setPatients(activePatients);
      setOngoingEvent(currentEvent);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Failed to load doctor queue:", error);

      setPatients([]);
      setOngoingEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();

    const interval = setInterval(() => {
      loadQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadQueue]);

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = [...patients];

    if (normalizedSearch) {
      result = result.filter((patient) =>
        (patient?.generalInfo?.name || "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    if (queueFilter === "priority") {
      result = result.filter(
        (patient) => patient?.isPriority
      );
    }

    return result;
  }, [patients, search, queueFilter]);

  useEffect(() => {
    setQueueIndex(0);
  }, [search, queueFilter]);

  const queueStats = useMemo(() => {
    return {
      total: patients.length,
      waiting: patients.filter(
        (patient) => patient.status === "waiting"
      ).length,
      beingSeen: patients.filter(
        (patient) => patient.status === "beingSeen"
      ).length,
      pharmacy: patients.filter(
        (patient) => patient.status === "forPharmacy"
      ).length,
      priority: patients.filter(
        (patient) => patient.isPriority
      ).length,
    };
  }, [patients]);

  const openDoctorView = async (patient) => {
    if (!patient?._id) return;

    try {
      setSelectedPatient({
        ...patient,
        status: "beingSeen",
      });

      setShowDoctorView(true);

      await updatePatientStatus(patient._id, {
        status: "beingSeen",
      });

      await loadQueue();
    } catch (error) {
      console.error(
        "Failed to update patient status:",
        error
      );

      setShowDoctorView(false);
      setSelectedPatient(null);

      window.alert(
        error?.message ||
          "Failed to open the patient's doctor sheet."
      );
    }
  };

  const currentPatient =
    filteredPatients[queueIndex] || null;

  const handleNextPatient = () => {
    if (!currentPatient) return;

    setShowReleaseConfirm(true);
  };

  const confirmReleaseAndNext = async () => {
    if (!currentPatient?._id) return;

    try {
      await updatePatientStatus(
        currentPatient._id,
        {
          status: "released",
        }
      );

      setShowReleaseConfirm(false);

      await loadQueue();

      setQueueIndex(0);
    } catch (error) {
      console.error(
        "Failed to release patient:",
        error
      );

      window.alert(
        error?.message ||
          "Failed to release the patient."
      );
    }
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Stethoscope size={21} strokeWidth={2.2} />
                </div>

                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">
                  Clinical Services
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Doctor's Queue
              </h1>

              {ongoingEvent ? (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Current mission:{" "}
                  <span className="font-bold text-slate-700">
                    {ongoingEvent.title}
                  </span>

                  {ongoingEvent.location && (
                    <>
                      {" "}
                      · {ongoingEvent.location}
                    </>
                  )}
                </p>
              ) : (
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <AlertCircle size={15} />
                  No ongoing mission. Showing unfinished
                  patients from previous missions.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Total Queue
                </p>

                <p className="mt-0.5 text-xl font-extrabold text-slate-900">
                  {queueStats.total}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-amber-600">
                  Priority
                </p>

                <p className="mt-0.5 text-xl font-extrabold text-amber-700">
                  {queueStats.priority}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUEUE SUMMARY
        ====================================================== */}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users size={18} />
              </div>

              <span className="text-xs font-bold text-slate-400">
                QUEUE
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {queueStats.total}
            </p>

            <p className="text-xs font-medium text-slate-500">
              Active patients
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 size={18} />
              </div>

              <span className="text-xs font-bold text-slate-400">
                WAITING
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {queueStats.waiting}
            </p>

            <p className="text-xs font-medium text-slate-500">
              Awaiting consultation
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <Activity size={18} />
              </div>

              <span className="text-xs font-bold text-slate-400">
                ACTIVE
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {queueStats.beingSeen}
            </p>

            <p className="text-xs font-medium text-slate-500">
              Currently being served
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ClipboardList size={18} />
              </div>

              <span className="text-xs font-bold text-slate-400">
                PHARMACY
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {queueStats.pharmacy}
            </p>

            <p className="text-xs font-medium text-slate-500">
              Awaiting pharmacy service
            </p>
          </div>

        </section>

        {/* =====================================================
            CURRENT PATIENT + QUEUE
        ====================================================== */}

        <section className="grid min-w-0 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">

          {loading ? (
            <PatientCardSkeleton />
          ) : (
            <PatientCard
              patient={currentPatient}
              onSelect={openDoctorView}
              onNextPatient={handleNextPatient}
            />
          )}

          {loading ? (
            <TableSkeleton
              rows={8}
              columns={6}
            />
          ) : (
            <DoctorQueue
              patients={filteredPatients}
              search={search}
              setSearch={setSearch}
              queueFilter={queueFilter}
              setQueueFilter={setQueueFilter}
              onOpenDoctorView={openDoctorView}
            />
          )}

        </section>
      </div>

      {/* =====================================================
          DOCTOR SHEET MODAL
      ====================================================== */}

      {showDoctorView && selectedPatient && (
        <PatientDoctorView
          patient={selectedPatient}
          onClose={() => {
            setShowDoctorView(false);
            setSelectedPatient(null);
            loadQueue();
          }}
          refreshQueue={loadQueue}
        />
      )}

      {/* =====================================================
          RELEASE CONFIRMATION
      ====================================================== */}

      {showReleaseConfirm && (
        <ConfirmModal
          message="Are you sure you want to release the current patient? This will remove the patient from the active doctor queue."
          onConfirm={confirmReleaseAndNext}
          onCancel={() =>
            setShowReleaseConfirm(false)
          }
        />
      )}
    </main>
  );
}

export default Doctor;