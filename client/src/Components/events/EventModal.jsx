import { useState } from "react";
import { createEvent } from "../../Services/eventService";
import Modal from "../ui/modal";

const initialFormData = {
  title: "",
  description: "",
  location: "",
  latitude: "",
  longitude: "",
  googleMapsUrl: "",
  date: "",
  startTime: "",
  endTime: "",
  type: "Medical Mission",
  status: "Upcoming",
  imageUrl: "",
};

const EventModal = ({ onClose, refreshEvents }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,
        latitude:
          formData.latitude !== ""
            ? Number(formData.latitude)
            : null,
        longitude:
          formData.longitude !== ""
            ? Number(formData.longitude)
            : null,
      };

      console.log("CREATE EVENT PAYLOAD:", payload);

      await createEvent(payload);

      await refreshEvents?.();

      onClose?.();
    } catch (err) {
      console.error(
        "Create event error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to create event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDetectCoordinates = async () => {
    const input = formData.location.trim();

    if (!input) {
      setError(
        "Please enter a place name or Google Maps link first."
      );
      return;
    }

    setError("");
    setDetecting(true);

    try {
      let lat = null;
      let lon = null;
      let placeName = "";

      const coordinateMatch =
        input.match(
          /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        ) ||
        input.match(
          /q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        ) ||
        input.match(
          /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        );

      if (coordinateMatch) {
        lat = coordinateMatch[1];
        lon = coordinateMatch[2];

        const reverseResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        if (!reverseResponse.ok) {
          throw new Error("Reverse geocoding failed.");
        }

        const reverseData =
          await reverseResponse.json();

        placeName =
          reverseData?.display_name ||
          formData.location;
      } else {
        const query = encodeURIComponent(input);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
        );

        if (!response.ok) {
          throw new Error("Location search failed.");
        }

        const data = await response.json();

        if (!data?.length) {
          setError("Location not found.");
          return;
        }

        lat = data[0].lat;
        lon = data[0].lon;

        placeName =
          data[0].display_name || input;
      }

      setFormData((prev) => ({
        ...prev,
        location: placeName,
        latitude: lat,
        longitude: lon,
        googleMapsUrl: input.includes("google.com/maps")
          ? input
          : prev.googleMapsUrl,
      }));
    } catch (err) {
      console.error(
        "Coordinate detection error:",
        err
      );

      setError(
        "Failed to detect coordinates. Please try again."
      );
    } finally {
      setDetecting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-400";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Create New Event"
      subtitle="Add a new medical mission or organization event."
      size="lg"
      closeOnOverlay={!saving}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-event-form"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Event"}
          </button>
        </div>
      }
    >
      <form
        id="create-event-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
              !
            </div>

            <p className="text-sm leading-6 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* EVENT DETAILS */}
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Event Details
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Provide the basic information for this event.
          </p>
        </div>

        {/* TITLE */}
        <div>
          <label
            htmlFor="event-title"
            className={labelClass}
          >
            Event Title
          </label>

          <input
            id="event-title"
            name="title"
            type="text"
            placeholder="e.g. Medical Mission - Barangay San Jose"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            disabled={saving}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label
            htmlFor="event-description"
            className={labelClass}
          >
            Description
          </label>

          <textarea
            id="event-description"
            name="description"
            rows={4}
            placeholder="Describe the purpose and activities of the event..."
            value={formData.description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            disabled={saving}
          />
        </div>

        {/* LOCATION */}
        <div>
          <label
            htmlFor="event-location"
            className={labelClass}
          >
            Location
          </label>

          <input
            id="event-location"
            name="location"
            type="text"
            placeholder="Enter place name or Google Maps link"
            value={formData.location}
            onChange={handleChange}
            className={inputClass}
            disabled={saving || detecting}
            required
          />

          <button
            type="button"
            onClick={handleDetectCoordinates}
            disabled={detecting || saving}
            className="mt-2 inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {detecting
              ? "Detecting location..."
              : "Detect Coordinates"}
          </button>
        </div>

        {/* COORDINATES */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="event-latitude"
              className={labelClass}
            >
              Latitude
            </label>

            <input
              id="event-latitude"
              type="number"
              step="any"
              name="latitude"
              placeholder="e.g. 14.5995"
              value={formData.latitude}
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="event-longitude"
              className={labelClass}
            >
              Longitude
            </label>

            <input
              id="event-longitude"
              type="number"
              step="any"
              name="longitude"
              placeholder="e.g. 120.9842"
              value={formData.longitude}
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            />
          </div>
        </div>

        {/* GOOGLE MAPS URL */}
        <div>
          <label
            htmlFor="event-google-maps"
            className={labelClass}
          >
            Google Maps URL
            <span className="ml-2 font-normal text-slate-400">
              Optional
            </span>
          </label>

          <input
            id="event-google-maps"
            name="googleMapsUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            value={formData.googleMapsUrl}
            onChange={handleChange}
            className={inputClass}
            disabled={saving}
          />
        </div>

        {/* DATE & TIME */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-800">
            Schedule
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="event-date"
                className={labelClass}
              >
                Date
              </label>

              <input
                id="event-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
                disabled={saving}
                required
              />
            </div>

            <div>
              <label
                htmlFor="event-start-time"
                className={labelClass}
              >
                Start Time
              </label>

              <input
                id="event-start-time"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div>
              <label
                htmlFor="event-end-time"
                className={labelClass}
              >
                End Time
              </label>

              <input
                id="event-end-time"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={inputClass}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* TYPE & STATUS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="event-type"
              className={labelClass}
            >
              Event Type
            </label>

            <select
              id="event-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            >
              <option value="Medical Mission">
                Medical Mission
              </option>

              <option value="Training">
                Training
              </option>

              <option value="Seminar">
                Seminar
              </option>

              <option value="Community Outreach">
                Community Outreach
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="event-status"
              className={labelClass}
            >
              Status
            </label>

            <select
              id="event-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            >
              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <label
            htmlFor="event-image"
            className={labelClass}
          >
            Image URL
            <span className="ml-2 font-normal text-slate-400">
              Optional
            </span>
          </label>

          <input
            id="event-image"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/event-image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
            className={inputClass}
            disabled={saving}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;