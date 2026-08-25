import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Users } from "lucide-react";

import {
  getPatientQueue,
  getPatientQueueSummary,
} from "../../../Services/patientService";

import { getCurrentMission } from "../../../Services/eventService";

import PatientQueue from "./components/PatientQueue";
import PatientDashboard from "./components/PatientDashboard";
import AddPatientModal from "./components/AddPatientModal";
import PatientViewModal from "./components/PatientViewModal";

const ITEMS_PER_PAGE = 15;

export default function Patients() {
  const [patients, setPatients] = useState([]);

  const [queueSummary, setQueueSummary] =
    useState({
      Pediatrics: 0,
      Ortho: 0,
      Opta: 0,
      Dental: 0,
      Cardio: 0,
      General: 0,
    });

  const [ongoingEvent, setOngoingEvent] =
    useState(null);

  const [totalPatients, setTotalPatients] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [summaryLoading, setSummaryLoading] =
    useState(true);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState(null);


    /*
|--------------------------------------------------------------------------
| LOAD CURRENT MISSION
|--------------------------------------------------------------------------
*/

const fetchCurrentMission = useCallback(async () => {
  try {
    const result = await getCurrentMission();

    const mission =
      result?.ongoingEvent ||
      result?.event ||
      result?.mission ||
      result ||
      null;

    setOngoingEvent(mission);
  } catch (error) {
    console.error(
      "Failed to load current mission:",
      error
    );

    setOngoingEvent(null);
  }
}, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD QUEUE
  |--------------------------------------------------------------------------
  */

  const fetchQueue = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const result =
          await getPatientQueue({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search,
            department:
              departmentFilter,
          });

        setPatients(
          Array.isArray(result.patients)
            ? result.patients
            : []
        );

        setTotalPatients(
          result.total || 0
        );

        setTotalPages(
          Math.max(
            1,
            result.totalPages || 1
          )
        );

      } catch (error) {
        console.error(
          "Failed to load patient queue:",
          error
        );

        setPatients([]);
        setTotalPatients(0);
        setTotalPages(1);
        setOngoingEvent(null);
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      search,
      departmentFilter,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | LOAD DEPARTMENT SUMMARY
  |--------------------------------------------------------------------------
  */

  const fetchQueueSummary =
    useCallback(
      async (silent = false) => {
        if (!silent) {
          setSummaryLoading(true);
        }

        try {
          const summary =
            await getPatientQueueSummary();

          setQueueSummary(summary);
        } catch (error) {
          console.error(
            "Failed to load patient queue summary:",
            error
          );

          setQueueSummary({
            Pediatrics: 0,
            Ortho: 0,
            Opta: 0,
            Dental: 0,
            Cardio: 0,
            General: 0,
          });
        } finally {
          setSummaryLoading(false);
        }
      },
      []
    );

  /*
  |--------------------------------------------------------------------------
  | INITIAL + REAL-TIME-LIKE REFRESH
  |--------------------------------------------------------------------------
  */
useEffect(() => {
  fetchCurrentMission();
}, [fetchCurrentMission]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    fetchQueueSummary();
  }, [fetchQueueSummary]);

  /*
   * Keep the queue and department summary
   * reasonably fresh.
   *
   * Later, this can be replaced with
   * Socket.IO queueUpdated events.
   */
  useEffect(() => {
  const interval = setInterval(() => {
    fetchCurrentMission();
    fetchQueue(true);
    fetchQueueSummary(true);
  }, 5000);

  return () => {
    clearInterval(interval);
  };
}, [
  fetchCurrentMission,
  fetchQueue,
  fetchQueueSummary,
]);

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN FILTER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    departmentFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | KEEP PAGE VALID
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /*
  |--------------------------------------------------------------------------
  | REFRESH AFTER MODALS
  |--------------------------------------------------------------------------
  */

  const refreshPatientData =
  async () => {
    await Promise.all([
      fetchCurrentMission(),
      fetchQueue(true),
      fetchQueueSummary(true),
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}
<div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

  <div className="flex items-start gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
      <Users size={22} />
    </div>

    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
        RAMHIS Patient Services
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
        Patient Queue
      </h1>

      <p className="mt-1 max-w-2xl text-sm text-text-muted">
        Manage patient registration, department queues, and current
        medical mission activity.
      </p>
    </div>

  </div>

          <button
            type="button"
            onClick={() => {
  console.log("ADD PATIENT CLICKED");
  setShowAddModal(true);
}}
            disabled={!ongoingEvent}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3",
              "text-sm font-semibold shadow-sm transition",
              "focus:outline-none focus:ring-4 focus:ring-blue-100",

              ongoingEvent
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-200 text-text-subtle",
            ].join(" ")}
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Patient
          </button>
        </div>

        {/* CURRENT EVENT */}
        {ongoingEvent && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <span className="text-lg">
                    ✚
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                    Ongoing Mission
                  </p>

                  <h2 className="mt-1 text-base font-bold text-text-primary">
                    {ongoingEvent.title ||
                      "Medical Mission"}
                  </h2>

                  {ongoingEvent.location && (
                    <p className="mt-1 text-sm text-text-muted">
                      {ongoingEvent.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-status-stable-bg px-3 py-1.5 text-xs font-semibold text-status-stable-text sm:self-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                Ongoing
              </div>
            </div>
          </div>
        )}

        {!ongoingEvent &&
          !loading && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-status-watch-border bg-status-watch-bg px-5 py-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 font-bold text-status-watch-text">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  No ongoing medical
                  mission
                </p>

                <p className="mt-0.5 text-xs text-status-watch-text">
                  Patient registration is
                  currently unavailable
                  until an event is ongoing.
                </p>
              </div>
            </div>
          )}

        {/* DEPARTMENT SUMMARY */}
        <PatientDashboard
          summary={queueSummary}
          loading={summaryLoading}
        />

        {/* QUEUE */}
        <div className="mt-6">
          <PatientQueue
            patients={patients}
            loading={loading}
            search={search}
            setSearch={setSearch}
            departmentFilter={
              departmentFilter
            }
            setDepartmentFilter={
              setDepartmentFilter
            }
            currentPage={currentPage}
            setCurrentPage={
              setCurrentPage
            }
            totalPatients={
              totalPatients
            }
            totalPages={totalPages}
            onSelectPatient={
              setSelectedPatient
            }
          />
        </div>
      </div>

      {/* ADD PATIENT MODAL */}
      {showAddModal &&
        ongoingEvent && (
          <AddPatientModal
            ongoingEvent={
              ongoingEvent
            }
            onClose={async () => {
              setShowAddModal(false);

              await refreshPatientData();
            }}
          />
        )}

      {/* PATIENT RECORD MODAL */}
      {selectedPatient && (
        <PatientViewModal
          patient={selectedPatient}
          onClose={async () => {
            setSelectedPatient(null);

            await refreshPatientData();
          }}
        />
      )}
    </main>
  );
}