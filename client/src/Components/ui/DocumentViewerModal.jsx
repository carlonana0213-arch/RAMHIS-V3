function DocumentViewerModal({ url, type, title, onClose }) {
  if (!url) return null;

  const getFileNameFromUrl = (fileUrl) => {
    try {
      const cleanUrl = fileUrl.split("?")[0];
      const fileName = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);

      return fileName || "document";
    } catch {
      return "document";
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getFileNameFromUrl(url);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
      window.open(url, "_blank", "noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ${
          type === "pdf" ? "max-w-5xl" : "max-w-3xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <span className="truncate text-lg font-semibold text-gray-900">
            {title || "Document Viewer"}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close document viewer"
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="min-h-0 flex-1 overflow-auto bg-gray-50 p-4">
          {type === "image" && (
            <img
              src={url}
              alt={title || "Document"}
              className="mx-auto max-h-[65vh] max-w-full rounded-lg object-contain shadow-sm"
            />
          )}

          {type === "pdf" && (
            <iframe
              src={url}
              title={title || "PDF Document"}
              className="h-[65vh] w-full rounded-lg border-0 bg-white"
            />
          )}

          {type !== "image" && type !== "pdf" && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-gray-600">
                This file type cannot be previewed here.
              </p>

              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                🔗 Open file
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            🔗 Open in new tab
          </a>

          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            ⬇ Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentViewerModal;