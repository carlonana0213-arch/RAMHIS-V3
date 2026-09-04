import { useEffect, useMemo, useState } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPlus,
  FaUsers,
} from "react-icons/fa";

import {
  getAllEvents,
  deleteEvent,
  updateEvent,
  updateParticipantStatus,
} from "../../../Services/eventService";

import EventModal from "../../../Components/events/EventModal";
import EventViewModal from "../../../Components/events/EventViewModal";

const STATUS_STYLES = {
  Upcoming:
    "border-blue-200 bg-primary-50 text-primary-700",

  Ongoing:
    "border-status-stable-border bg-status-stable-bg text-status-stable-text",

  Completed:
    "border-border bg-slate-100 text-text-secondary",

  Cancelled:
    "border-status-critical-border bg-status-critical-bg text-status-critical-text",
};

const TABS = [
  "All",
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
];

const EventManagement = () => {
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("All");

  const [editEvent, setEditEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================================
  // LOAD EVENTS
  // ============================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllEvents();

      const eventList =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.events)
              ? response.events
              : [];

      setEvents(eventList);

      return eventList;
    } catch (err) {
      console.error(
        "Failed to load events:",
        err
      );

      setEvents([]);

      setError(
        err?.message ||
          "Failed to load events. Please try again."
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ============================================================
  // FILTER EVENTS
  // ============================================================

  const filteredEvents = useMemo(() => {
    if (activeTab === "All") {
      return events;
    }

    return events.filter(
      (event) =>
        event.status === activeTab
    );
  }, [events, activeTab]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    return {
      total: events.length,

      upcoming: events.filter(
        (event) =>
          event.status === "Upcoming"
      ).length,

      ongoing: events.filter(
        (event) =>
          event.status === "Ongoing"
      ).length,

      completed: events.filter(
        (event) =>
          event.status === "Completed"
      ).length,
    };
  }, [events]);

  // ============================================================
  // CREATE EVENT
  // ============================================================

  const handleCreateEvent = () => {
    setEditEvent(null);

    setShowModal(true);
  };

  // ============================================================
  // OPEN EVENT VIEW
  // ============================================================

  const handleViewEvent = (event) => {
    setSelectedEvent(event);

    setShowViewModal(true);
  };

  // ============================================================
  // EDIT EVENT
  // ============================================================

  const handleEditEvent = (event) => {
    setEditEvent(event);

    setShowViewModal(false);

    setShowModal(true);
  };

  // ============================================================
  // DELETE EVENT
  // ============================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this event? This action cannot be undone."
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteEvent(id);

      setShowViewModal(false);

      setSelectedEvent(null);

      await fetchEvents();
    } catch (err) {
      console.error(
        "Delete event error:",
        err
      );

      window.alert(
        err?.message ||
          "Failed to delete event."
      );
    }
  };

  // ============================================================
  // UPDATE PARTICIPANT STATUS
  // ============================================================

  const handleParticipantStatus = async (
    eventId,
    userId,
    status
  ) => {
    try {
      const response =
        await updateParticipantStatus(
          eventId,
          userId,
          status
        );

      const refreshedEvents =
        await fetchEvents();

      if (response?.data) {
        setSelectedEvent(response.data);
        return;
      }

      const refreshedEvent =
        refreshedEvents.find(
          (event) =>
            event._id === eventId
        );

      if (refreshedEvent) {
        setSelectedEvent(
          refreshedEvent
        );
      }
    } catch (err) {
      console.error(
        "Update participant status error:",
        err
      );

      window.alert(
        err?.message ||
          "Failed to update participant status."
      );
    }
  };

  // ============================================================
  // UPDATE EVENT STATUS
  // ============================================================

  const handleStatusChange = async (
    event,
    newStatus
  ) => {
    if (!event?._id) {
      return;
    }

    if (
      ![
        "Upcoming",
        "Ongoing",
        "Completed",
        "Cancelled",
      ].includes(newStatus)
    ) {
      return;
    }

    try {
      const response =
        await updateEvent(
          event._id,
          {
            status: newStatus,
          }
        );

      const refreshedEvents =
        await fetchEvents();

      if (response?.data) {
        setSelectedEvent(
          response.data
        );

        return;
      }

      const refreshedEvent =
        refreshedEvents.find(
          (item) =>
            item._id === event._id
        );

      if (refreshedEvent) {
        setSelectedEvent(
          refreshedEvent
        );
      }
    } catch (err) {
      console.error(
        "Update event status error:",
        err
      );

      window.alert(
        err?.message ||
          "Failed to update event status."
      );
    }
  };

  return (
    <main className="min-h-screen w-full overflow-y-scroll bg-slate-50 px-4 py-5 pb-6 text-text-primary sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8">

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">

        {/* PAGE HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">

            <div className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <FaCalendarAlt size={21} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Mission Management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
                Event Management
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                Create, manage, and monitor community health missions.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleCreateEvent}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:self-auto"
          >
            <FaPlus size={14} />
            Create New Event
          </button>

        </div>

        {/* STATISTICS */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            label="Total Events"
            value={statistics.total}
            icon={<FaCalendarAlt size={18} />}
            iconClass="bg-primary-50 text-primary-700"
          />

          <StatCard
            label="Upcoming"
            value={statistics.upcoming}
            icon={<FaCalendarAlt size={18} />}
            iconClass="bg-indigo-50 text-indigo-700"
          />

          <StatCard
            label="Ongoing"
            value={statistics.ongoing}
            icon={<FaUsers size={18} />}
            iconClass="bg-status-stable-bg text-status-stable-text"
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            icon={<FaMapMarkerAlt size={18} />}
            iconClass="bg-slate-100 text-slate-700"
          />

        </section>

        {/* EVENTS TABLE */}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-lg font-extrabold text-text-primary">
                Events
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Manage your health missions and events.
              </p>

            </div>

            {/* STATUS TABS */}

            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">

              {TABS.map((tab) => (

                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeTab === tab
                      ? "bg-blue-950 text-white shadow-sm"
                      : "border border-border bg-surface text-text-secondary hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>

              ))}

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="border-b border-red-100 bg-status-critical-bg px-5 py-4 text-sm font-medium text-status-critical-text">
              {error}
            </div>

          )}

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] table-fixed">

              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[14%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
              </colgroup>

              <thead className="border-b border-border bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                    Event
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                    Date & Time
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                    Location
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                    Type
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                    Status
                  </th>

                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-text-muted">
                    Participants
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-border-soft">

                {loading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <div className="inline-flex items-center gap-3 text-sm font-medium text-text-muted">
                        Loading events...
                      </div>
                    </td>

                  </tr>

                ) : filteredEvents.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto flex max-w-sm flex-col items-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                          <FaCalendarAlt size={20} />
                        </div>

                        <p className="mt-4 text-sm font-bold text-slate-700">
                          No events found
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          No events are available for this status.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredEvents.map(
                    (event) => (

                      <tr
                        key={event._id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          handleViewEvent(
                            event
                          )
                        }
                        onKeyDown={(keyboardEvent) => {
                          if (
                            keyboardEvent.key === "Enter" ||
                            keyboardEvent.key === " "
                          ) {
                            keyboardEvent.preventDefault();

                            handleViewEvent(
                              event
                            );
                          }
                        }}
                        className="cursor-pointer outline-none transition hover:bg-slate-50/80 focus:bg-slate-50/80"
                      >

                        <td className="px-6 py-4">

                          <div className="max-w-[280px]">

                            <p className="truncate text-sm font-bold text-text-primary">
                              {event.title}
                            </p>

                            <p className="mt-1 truncate text-xs text-text-muted">
                              {event.description ||
                                "No description provided"}
                            </p>

                          </div>

                        </td>

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium text-slate-700">
                            {event.date
                              ? new Date(
                                  event.date
                                ).toLocaleDateString()
                              : "--"}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {event.startTime ||
                              "--"}

                            {event.endTime
                              ? ` - ${event.endTime}`
                              : ""}
                          </p>

                        </td>

                        <td className="px-4 py-4">

                          <p className="max-w-[200px] truncate text-sm font-medium text-slate-700">
                            {event.location ||
                              "--"}
                          </p>

                        </td>

                        <td className="px-4 py-4">

                          <span className="text-sm font-medium text-text-secondary">
                            {event.type ||
                              "--"}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                              STATUS_STYLES[
                                event.status
                              ] ||
                              "border-border bg-slate-100 text-text-secondary"
                            }`}
                          >
                            {event.status ||
                              "Unknown"}
                          </span>

                        </td>

                        <td className="px-4 py-4 text-center">

                          <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                            {event.participants
                              ?.length || 0}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

      {/* VIEW EVENT MODAL */}

      {showViewModal &&
        selectedEvent && (

          <EventViewModal
            event={selectedEvent}
            onClose={() => {
              setShowViewModal(false);
              setSelectedEvent(null);
            }}
            onParticipantAction={
              handleParticipantStatus
            }
            onDelete={
              handleDelete
            }
            onRefresh={
              fetchEvents
            }
            onEdit={
              handleEditEvent
            }
            onStatusChange={
              handleStatusChange
            }
          />

        )}

      {/* CREATE / EDIT EVENT MODAL */}

      {showModal && (

        <EventModal
          event={editEvent}
          onClose={() => {
            setShowModal(false);
            setEditEvent(null);
          }}
          refreshEvents={
            fetchEvents
          }
        />

      )}

    </main>
  );
};

function StatCard({
  label,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-text-muted">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default EventManagement;