import Modal from "../ui/modal";

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

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={event.title || "Event Details"}
      subtitle={event.location || "Event information"}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Date
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {event.date
                ? new Date(event.date).toLocaleDateString()
                : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Status
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {event.status || "--"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Type
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {event.type || "--"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Participants
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {event.participants?.length || 0}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Description
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => onEdit?.(event)}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit Event
          </button>

          <button
            type="button"
            onClick={() => onStatusChange?.(event)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Change Status
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(event._id)}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            Delete Event
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventViewModal;