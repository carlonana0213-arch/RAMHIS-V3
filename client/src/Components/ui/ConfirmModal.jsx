import Modal from "./modal";

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  title = "Confirm Action",
}) {
  return (
    <Modal
      open={Boolean(message)}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Confirm
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          !
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {message}
        </p>
      </div>
    </Modal>
  );
}