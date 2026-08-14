import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { apiFetch } from "../../../Services/api";
import { API_BASE_URL } from "../../../Services/apiConfig";

import PatientQueue from "./components/PatientQueue";
import PatientDashboard from "./components/PatientDashboard";
import AddPatientModal from "./components/AddPatientModal";
import PatientViewModal from "./components/PatientViewModal";

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [ongoingEvent, setOngoingEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchQueue = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const data = await apiFetch(
          `${API_BASE_URL}/api/patients/queue`
        );

        if (Array.isArray(data)) {
          setPatients(data);
          setOngoingEvent(null);
        } else {
          setPatients(data?.patients || []);
          setOngoingEvent(data?.ongoingEvent || null);
        }
      } catch (error) {
        console.error(
          "Failed to load patient queue:",
          error
        );

        setPatients([]);
        setOngoingEvent(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchQueue]);

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                RAMHIS Patient Services
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Patient Queue
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage patient registration, department queues,
              and current medical mission activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={!ongoingEvent}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3",
              "text-sm font-semibold shadow-sm transition",
              "focus:outline-none focus:ring-4 focus:ring-blue-100",
              ongoingEvent
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-200 text-slate-400",
            ].join(" ")}
          >
            <span className="text-lg leading-none">+</span>
            Add Patient
          </button>
        </div>

        {/* CURRENT EVENT */}
        {ongoingEvent && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="text-lg">✚</span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Ongoing Mission
                  </p>

                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    {ongoingEvent.title || "Medical Mission"}
                  </h2>

                  {ongoingEvent.location && (
                    <p className="mt-1 text-sm text-slate-500">
                      {ongoingEvent.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Ongoing
              </div>
            </div>
          </div>
        )}

        {!ongoingEvent && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-900">
                No ongoing medical mission
              </p>

              <p className="mt-0.5 text-xs text-amber-700">
                Patient registration is currently unavailable
                until an event is ongoing.
              </p>
            </div>
          </div>
        )}

        {/* DEPARTMENT SUMMARY */}
        <PatientDashboard
          patients={patients}
          loading={loading}
        />

        {/* QUEUE */}
        <div className="mt-6">
          <PatientQueue
            patients={patients}
            loading={loading}
            onSelectPatient={setSelectedPatient}
          />
        </div>
      </div>

      {/* ADD PATIENT */}
      {showAddModal && ongoingEvent && (
        <AddPatientModal
          ongoingEvent={ongoingEvent}
          onClose={() => {
            setShowAddModal(false);
            fetchQueue(true);
          }}
        />
      )}

      {/* PATIENT VIEW */}
      {selectedPatient && (
        <PatientViewModal
          patient={selectedPatient}
          onClose={() => {
            setSelectedPatient(null);
            fetchQueue(true);
          }}
        />
      )}
    </main>
  );
}