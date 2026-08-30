import { useState } from "react";

import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import Modal from "../ui/modal";

const STATUS_STYLES = {
  Upcoming:
    "border-blue-200 bg-blue-50 text-blue-700",

  Ongoing:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  Completed:
    "border-slate-200 bg-slate-100 text-slate-600",

  Cancelled:
    "border-red-200 bg-red-50 text-red-700",
};

const PARTICIPANT_STATUS_STYLES = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700",

  Approved:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  Rejected:
    "border-red-200 bg-red-50 text-red-700",
};

const EventViewModal = ({
  event,
  onClose,
  onParticipantAction,
  onDelete,
  onRefresh,
  onEdit,
  onStatusChange,
}) => {
  const [actionLoading, setActionLoading] =
    useState(null);

  if (!event) return null;

  const participants =
    Array.isArray(event.participants)
      ? event.participants
      : [];

  const formatDate = (date) => {
    if (!date) return "--";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "--";
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatParticipantStatus = (
    status
  ) => {
    if (!status) return "Pending";

    const normalized = String(status)
      .trim()
      .toLowerCase();

    if (normalized === "approved") {
      return "Approved";
    }

    if (normalized === "rejected") {
      return "Rejected";
    }

    return "Pending";
  };

  const getParticipantId = (
    participant
  ) => {
    if (
      participant?.userId &&
      typeof participant.userId === "string"
    ) {
      return participant.userId;
    }

    if (
      participant?.userId?._id
    ) {
      return String(
        participant.userId._id
      );
    }

    if (
      participant?.user?._id
    ) {
      return String(
        participant.user._id
      );
    }

    if (
      participant?.user?._id
    ) {
      return String(
        participant.user._id
      );
    }

    return null;
  };

  const getParticipantName = (
    participant,
    index
  ) => {
    const participantUser =
      participant?.user ||
      participant?.userId ||
      participant;

    return (
      participantUser?.name ||
      participantUser?.fullName ||
      participantUser?.username ||
      `Participant ${index + 1}`
    );
  };

  const handleParticipantAction = async (
    participant,
    status,
    actionKey
  ) => {
    const userId =
      getParticipantId(participant);

    if (
      !userId ||
      !event?._id ||
      !onParticipantAction
    ) {
      return;
    }

    try {
      setActionLoading(actionKey);

      await onParticipantAction(
        event._id,
        userId,
        status
      );

      await onRefresh?.();
    } catch (error) {
      console.error(
        "Failed to update participant:",
        error
      );

      window.alert(
        error?.message ||
          "Failed to update participant status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = () => {
    onEdit?.(event);
  };

  const handleStatusChange = () => {
    onStatusChange?.(event);
  };

  const handleDelete = () => {
    onDelete?.(event._id);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={event.title || "Event Details"}
      subtitle={
        event.location ||
        "Event information"
      }
      size="lg"
    >
      {/* 
        The Modal component should handle the overlay and
        positioning. This wrapper ensures the CONTENT scrolls
        inside the modal instead of overflowing outside it.
      */}

      <div className="max-h-[calc(100vh-220px)] space-y-6 overflow-y-auto pr-1">

        {/* ============================================
            EVENT HERO
        ============================================ */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

          {event.imageUrl ? (
            <div className="h-44 w-full overflow-hidden">
              <img
                src={event.imageUrl}
                alt={
                  event.title ||
                  "Event"
                }
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.style.display =
                    "none";
                }}
              />
            </div>
          ) : null}

          <div className="p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {event.type ||
                    "Community Event"}
                </p>

                <h3 className="mt-1 break-words text-xl font-bold text-slate-800">
                  {event.title ||
                    "Untitled Event"}
                </h3>

              </div>

              <span
                className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${
                  STATUS_STYLES[
                    event.status
                  ] ||
                  "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {event.status ||
                  "Unknown"}
              </span>

            </div>

            <p className="mt-3 break-words text-sm leading-6 text-slate-500">
              {event.description ||
                "No description provided."}
            </p>

          </div>

        </section>

        {/* ============================================
            EVENT INFORMATION
        ============================================ */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <InfoCard
            icon={<FaCalendarAlt />}
            label="Date"
            value={formatDate(event.date)}
          />

          <InfoCard
            icon={<FaClock />}
            label="Time"
            value={
              event.startTime ||
              event.endTime
                ? `${event.startTime || "--"}${
                    event.endTime
                      ? ` - ${event.endTime}`
                      : ""
                  }`
                : "--"
            }
          />

          <InfoCard
            icon={<FaMapMarkerAlt />}
            label="Location"
            value={
              event.location || "--"
            }
          />

          <InfoCard
            icon={<FaUsers />}
            label="Participants"
            value={`${participants.length} joined`}
          />

        </section>

        {/* ============================================
            GOOGLE MAPS
        ============================================ */}

        {event.googleMapsUrl && (

          <a
            href={event.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >

            <span className="flex min-w-0 items-center gap-2">

              <FaMapMarkerAlt className="shrink-0" />

              <span className="truncate">
                Open location in Google Maps
              </span>

            </span>

            <FaExternalLinkAlt
              size={12}
              className="shrink-0"
            />

          </a>

        )}

        {/* ============================================
            COORDINATES
        ============================================ */}

        {(event.latitude != null ||
          event.longitude != null) && (

          <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Coordinates
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              {event.latitude ?? "--"},{" "}
              {event.longitude ?? "--"}
            </p>

          </section>

        )}

        {/* ============================================
            PARTICIPANTS
        ============================================ */}

        <section className="border-t border-slate-200 pt-5">

          <div className="flex items-start justify-between gap-4">

            <div>

              <h3 className="text-sm font-bold text-slate-800">
                Participants
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                People registered for this event.
              </p>

            </div>

            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {participants.length}
            </span>

          </div>

          {participants.length === 0 ? (

            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">

              <FaUsers className="mx-auto text-xl text-slate-300" />

              <p className="mt-2 text-sm text-slate-500">
                No participants yet.
              </p>

            </div>

          ) : (

            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">

              {participants.map(
                (
                  participant,
                  index
                ) => {
                  const name =
                    getParticipantName(
                      participant,
                      index
                    );

                  const participantId =
                    getParticipantId(
                      participant
                    );

                  const status =
                    formatParticipantStatus(
                      participant.status
                    );

                  const approveKey =
                    `approve-${participantId || index}`;

                  const rejectKey =
                    `reject-${participantId || index}`;

                  const isLoading =
                    actionLoading ===
                      approveKey ||
                    actionLoading ===
                      rejectKey;

                  return (

                    <div
                      key={
                        participant._id ||
                        participantId ||
                        index
                      }
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {name}
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                              PARTICIPANT_STATUS_STYLES[
                                status
                              ] ||
                              "border-slate-200 bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status}
                          </span>

                        </div>

                      </div>

                      {status ===
                        "Pending" &&
                        participantId && (

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              disabled={
                                isLoading
                              }
                              onClick={() =>
                                handleParticipantAction(
                                  participant,
                                  "Approved",
                                  approveKey
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FaCheck
                                size={11}
                              />

                              {actionLoading ===
                              approveKey
                                ? "Approving..."
                                : "Approve"}

                            </button>

                            <button
                              type="button"
                              disabled={
                                isLoading
                              }
                              onClick={() =>
                                handleParticipantAction(
                                  participant,
                                  "Rejected",
                                  rejectKey
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FaTimes
                                size={11}
                              />

                              {actionLoading ===
                              rejectKey
                                ? "Rejecting..."
                                : "Reject"}

                            </button>

                          </div>

                        )}

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>

        {/* ============================================
            ACTIONS
        ============================================ */}

        <section className="sticky bottom-0 border-t border-slate-200 bg-white pt-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FaEdit />
              Edit Event
            </button>

            <button
              type="button"
              onClick={
                handleStatusChange
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FaSyncAlt />
              Change Status
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FaTrash />
              Delete Event
            </button>

          </div>

        </section>

      </div>
    </Modal>
  );
};

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-700">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default EventViewModal;