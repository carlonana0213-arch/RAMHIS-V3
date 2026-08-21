import Modal from "./modal";

export default function AlertModal({
  message,
  onClose,
  title = "Notice",
}) {
  return (
    <Modal
      open={Boolean(message)}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          OK
        </button>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          !
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {message}
        </p>
      </div>
    </Modal>
  );
}