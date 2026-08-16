import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

import Modal from "../ui/modal";

const STATUS_STYLES = {
  Upcoming:
    "bg-blue-50 text-blue-700 border-blue-200",
  Ongoing:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed:
    "bg-slate-100 text-slate-600 border-slate-200",
  Cancelled:
    "bg-red-50 text-red-700 border-red-200",
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
      <div className="space-y-6">

        {/* EVENT HERO */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {event.imageUrl ? (
            <div className="h-44 w-full overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title || "Event"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.style.display =
                    "none";
                }}
              />
            </div>
          ) : null}

          <div className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {event.type ||
                    "Community Event"}
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {event.title ||
                    "Untitled Event"}
                </h3>
              </div>

              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
                  STATUS_STYLES[event.status] ||
                  "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {event.status ||
                  "Unknown"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {event.description ||
                "No description provided."}
            </p>
          </div>
        </div>

        {/* EVENT INFORMATION */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>

        {/* MAP LINK */}
        {event.googleMapsUrl && (
          <a
            href={event.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt />
              Open location in Google Maps
            </span>

            <FaExternalLinkAlt size={12} />
          </a>
        )}

        {/* COORDINATES */}
        {(event.latitude != null ||
          event.longitude != null) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Coordinates
            </p>

            <p className="mt-1 text-sm font-medium text-slate-600">
              {event.latitude ?? "--"},{" "}
              {event.longitude ?? "--"}
            </p>
          </div>
        )}

        {/* PARTICIPANTS */}
        <section className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Participants
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                People registered for this event.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {participants.length}
            </span>
          </div>

          {participants.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <FaUsers className="mx-auto text-slate-300" />

              <p className="mt-2 text-sm text-slate-500">
                No participants yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 max-h-52 space-y-2 overflow-y-auto">
              {participants.map(
                (participant, index) => {
                  const participantUser =
                    participant.user ||
                    participant.userId ||
                    participant;

                  const name =
                    participantUser?.name ||
                    participantUser?.fullName ||
                    participantUser?.username ||
                    `Participant ${index + 1}`;

                  const status =
                    participant.status ||
                    "Pending";

                  return (
                    <div
                      key={
                        participant._id ||
                        participant.userId?._id ||
                        index
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {status}
                          </p>
                        </div>
                      </div>

                      {participant.userId &&
                        typeof participant.userId ===
                          "string" && (
                          <button
                            type="button"
                            onClick={() =>
                              onParticipantAction?.(
                                event._id,
                                participant.userId,
                                "Approved"
                              )
                            }
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Approve
                          </button>
                        )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() =>
              onEdit?.(event)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FaEdit />
            Edit Event
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange?.(event)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FaSyncAlt />
            Change Status
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(event._id)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <FaTrash />
            Delete Event
          </button>
        </div>
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