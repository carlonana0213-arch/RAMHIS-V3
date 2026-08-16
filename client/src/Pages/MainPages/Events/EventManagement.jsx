import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaEye,
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
  Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  Ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-100 text-slate-600 border-slate-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const TABS = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"];

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [editEvent, setEditEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setError("");

      const response = await getAllEvents();

      const eventList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.events)
            ? response.events
            : [];

      setEvents(eventList);
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
      setError(
        err?.message || "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === "All") {
      return events;
    }

    return events.filter(
      (event) => event.status === activeTab
    );
  }, [events, activeTab]);

  const statistics = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter(
        (event) => event.status === "Upcoming"
      ).length,
      ongoing: events.filter(
        (event) => event.status === "Ongoing"
      ).length,
      completed: events.filter(
        (event) => event.status === "Completed"
      ).length,
    }),
    [events]
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this event? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteEvent(id);

      setShowViewModal(false);
      setSelectedEvent(null);

      await fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err);

      window.alert(
        err?.message || "Failed to delete event."
      );
    }
  };

  const handleParticipantStatus = async (
    eventId,
    userId,
    status
  ) => {
    try {
      const response = await updateParticipantStatus(
        eventId,
        userId,
        status
      );

      await fetchEvents();

      if (response?.data) {
        setSelectedEvent(response.data);
      } else {
        const refreshedEvent = events.find(
          (event) => event._id === eventId
        );

        if (refreshedEvent) {
          setSelectedEvent(refreshedEvent);
        }
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

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setShowViewModal(false);
    setShowModal(true);
  };

  const handleCreateEvent = () => {
    setEditEvent(null);
    setShowModal(true);
  };

  const handleStatusChange = async (event) => {
    if (!event?._id) return;

    const statusOrder = [
      "Upcoming",
      "Ongoing",
      "Completed",
      "Cancelled",
    ];

    const currentIndex = statusOrder.indexOf(
      event.status
    );

    const nextStatus =
      statusOrder[
        (currentIndex + 1) % statusOrder.length
      ];

    try {
      const response = await updateEvent(
        event._id,
        {
          status: nextStatus,
        }
      );

      await fetchEvents();

      if (response?.data) {
        setSelectedEvent(response.data);
      } else {
        setSelectedEvent((previous) =>
          previous
            ? {
                ...previous,
                status: nextStatus,
              }
            : previous
        );
      }
    } catch (err) {
      console.error("Update status error:", err);

      window.alert(
        err?.message ||
          "Failed to update event status."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "--";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "--";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <FaCalendarAlt />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                  Event Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create and manage community health events.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateEvent}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <FaPlus size={13} />
            Create New Event
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Events"
            value={statistics.total}
            icon={<FaCalendarAlt />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Upcoming"
            value={statistics.upcoming}
            icon={<FaCalendarAlt />}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            label="Ongoing"
            value={statistics.ongoing}
            icon={<FaCalendarAlt />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Completed"
            value={statistics.completed}
            icon={<FaCalendarAlt />}
            iconClass="bg-slate-100 text-slate-600"
          />
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* CARD HEADER */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-600" />

                  <h2 className="text-lg font-bold text-slate-800">
                    Events
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your organization events.
                </p>
              </div>

              {/* FILTER TABS */}
              <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                      activeTab === tab
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
              {error}
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Event
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date & Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                        <p className="text-sm text-slate-500">
                          Loading events...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <FaCalendarAlt size={22} />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No events found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {activeTab === "All"
                            ? "Create your first event to get started."
                            : `There are no ${activeTab.toLowerCase()} events.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* EVENT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <FaCalendarAlt />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {event.title || "Untitled Event"}
                            </p>

                            <p className="mt-0.5 max-w-[250px] truncate text-xs text-slate-400">
                              {event.description ||
                                "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {formatDate(event.date)}
                        </p>

                        {(event.startTime ||
                          event.endTime) && (
                          <p className="mt-1 text-xs text-slate-400">
                            {event.startTime || "--"}
                            {event.endTime
                              ? ` - ${event.endTime}`
                              : ""}
                          </p>
                        )}
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">
                        <div className="flex max-w-[190px] items-start gap-2">
                          <FaMapMarkerAlt className="mt-0.5 shrink-0 text-xs text-slate-400" />

                          <span className="truncate text-sm text-slate-600">
                            {event.location || "--"}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {event.type || "--"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                            STATUS_STYLES[event.status] ||
                            "border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >
                          {event.status || "Unknown"}
                        </span>
                      </td>

                      {/* PARTICIPANTS */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-700">
                          {event.participants?.length || 0}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowViewModal(true);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          title="View event"
                        >
                          <FaEye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEvent(null);
          }}
          onParticipantAction={handleParticipantStatus}
          onDelete={handleDelete}
          onRefresh={fetchEvents}
          onEdit={handleEditEvent}
          onStatusChange={handleStatusChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <EventModal
          event={editEvent}
          onClose={() => {
            setShowModal(false);
            setEditEvent(null);
          }}
          refreshEvents={fetchEvents}
        />
      )}
    </div>
  );
};

function StatCard({
  label,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
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