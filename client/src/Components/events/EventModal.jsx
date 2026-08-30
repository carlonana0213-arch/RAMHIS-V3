import { useEffect, useState } from "react";

import {
  createEvent,
  updateEvent,
} from "../../Services/eventService";

import Modal from "../ui/modal";

const EMPTY_FORM = {
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

const EventModal = ({
  event,
  onClose,
  refreshEvents,
}) => {
  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  const [detecting, setDetecting] =
    useState(false);

  const [error, setError] =
    useState("");

  const isEditing = Boolean(event?._id);

  /* =====================================================
      LOAD EVENT DATA FOR EDIT MODE
  ===================================================== */

  useEffect(() => {
    setError("");

    if (!event) {
      setFormData({
        ...EMPTY_FORM,
      });

      return;
    }

    setFormData({
      title: event.title || "",
      description:
        event.description || "",
      location: event.location || "",

      latitude:
        event.latitude !== null &&
        event.latitude !== undefined
          ? event.latitude
          : "",

      longitude:
        event.longitude !== null &&
        event.longitude !== undefined
          ? event.longitude
          : "",

      googleMapsUrl:
        event.googleMapsUrl || "",

      date: event.date
        ? String(event.date).slice(0, 10)
        : "",

      startTime:
        event.startTime || "",

      endTime:
        event.endTime || "",

      type:
        event.type ||
        "Medical Mission",

      status:
        event.status ||
        "Upcoming",

      imageUrl:
        event.imageUrl || "",
    });
  }, [event]);

  /* =====================================================
      HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =====================================================
      SAVE EVENT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,

        latitude:
          formData.latitude !== "" &&
          formData.latitude !== null
            ? Number(formData.latitude)
            : null,

        longitude:
          formData.longitude !== "" &&
          formData.longitude !== null
            ? Number(formData.longitude)
            : null,
      };

      if (isEditing) {
        await updateEvent(
          event._id,
          payload
        );
      } else {
        await createEvent(payload);
      }

      /*
        Refresh the event list first.

        If refresh fails, we do not want
        to close the modal immediately.
      */
      if (typeof refreshEvents === "function") {
        await refreshEvents();
      }

      /*
        Close only after the API request
        and refresh are successful.
      */
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      console.error(
        isEditing
          ? "Failed to update event:"
          : "Failed to create event:",
        err
      );

      setError(
        err?.message ||
          `Failed to ${
            isEditing
              ? "update"
              : "create"
          } the event. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
      DETECT LOCATION COORDINATES
  ===================================================== */

  const handleDetectCoordinates =
    async () => {
      const input =
        formData.location.trim();

      if (!input) {
        setError(
          "Please enter a place name, coordinates, or Google Maps link first."
        );

        return;
      }

      setError("");
      setDetecting(true);

      try {
        let lat = null;
        let lon = null;
        let placeName = input;

        /*
          Try to extract coordinates from:
          Google Maps URL containing @lat,lon

          Example:
          .../@14.5995,120.9842
        */

        const atMatch = input.match(
          /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
        );

        /*
          Google Maps q parameter
        */

        const qMatch = input.match(
          /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i
        );

        /*
          Direct coordinates:
          14.5995, 120.9842
        */

        const directMatch = input.match(
          /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
        );

        const coordinateMatch =
          atMatch ||
          qMatch ||
          directMatch;

        if (coordinateMatch) {
          lat = coordinateMatch[1];
          lon = coordinateMatch[2];

          /*
            Get a readable location name.
          */

          try {
            const response =
              await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
              );

            if (response.ok) {
              const data =
                await response.json();

              placeName =
                data?.display_name ||
                input;
            }
          } catch (reverseError) {
            console.warn(
              "Reverse geocoding failed:",
              reverseError
            );
          }
        } else {
          /*
            Search using the location text.
          */

          const query =
            encodeURIComponent(input);

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
            );

          if (!response.ok) {
            throw new Error(
              "Location search failed."
            );
          }

          const data =
            await response.json();

          if (!Array.isArray(data) ||
              data.length === 0) {
            throw new Error(
              "Location not found."
            );
          }

          lat = data[0].lat;
          lon = data[0].lon;

          placeName =
            data[0].display_name ||
            input;
        }

        setFormData((previous) => ({
          ...previous,

          location:
            placeName || input,

          latitude: lat,

          longitude: lon,

          /*
            Keep the original Maps URL
            if the user entered one.
          */
          googleMapsUrl:
            /google\.[^/]+\/maps/i.test(
              input
            )
              ? input
              : previous.googleMapsUrl,
        }));
      } catch (err) {
        console.error(
          "Failed to detect coordinates:",
          err
        );

        setError(
          err?.message ||
            "Failed to detect the location coordinates."
        );
      } finally {
        setDetecting(false);
      }
    };

  /* =====================================================
      STYLES
  ===================================================== */

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700";

  /* =====================================================
      RENDER
  ===================================================== */

  return (
    <Modal
      open={true}
      onClose={
        saving
          ? undefined
          : onClose
      }
      title={
        isEditing
          ? "Edit Event"
          : "Create New Event"
      }
      subtitle={
        isEditing
          ? "Update the event information and schedule."
          : "Add a new medical mission or organization event."
      }
      size="lg"
      closeOnOverlay={!saving}
      footer={
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
            form="event-form"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Event"
                : "Save Event"}
          </button>
        </div>
      }
    >
      <form
        id="event-form"
        onSubmit={handleSubmit}
        className="space-y-6 pb-2"
      >
        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        {/* =================================================
            EVENT DETAILS
        ================================================= */}

        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Event Details
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Provide the basic information for this event.
            </p>
          </div>

          <div className="space-y-4">
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
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Medical Mission - Barangay San Jose"
                disabled={saving}
                required
              />
            </div>

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
                value={
                  formData.description
                }
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Describe the purpose and activities of the event..."
                disabled={saving}
              />
            </div>
          </div>
        </section>

        {/* =================================================
            LOCATION
        ================================================= */}

        <section className="border-t border-slate-100 pt-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Location
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Enter a location name, coordinates,
              or a Google Maps link.
            </p>
          </div>

          <div className="space-y-4">
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
                value={
                  formData.location
                }
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter place name, coordinates, or Google Maps link"
                disabled={
                  saving || detecting
                }
                required
              />

              <button
                type="button"
                onClick={
                  handleDetectCoordinates
                }
                disabled={
                  detecting || saving
                }
                className="mt-2 inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {detecting
                  ? "Detecting Location..."
                  : "Detect Coordinates"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="event-latitude"
                label="Latitude"
                name="latitude"
                type="number"
                step="any"
                value={
                  formData.latitude
                }
                onChange={handleChange}
                className={inputClass}
                disabled={saving}
                placeholder="e.g. 14.5995"
              />

              <Field
                id="event-longitude"
                label="Longitude"
                name="longitude"
                type="number"
                step="any"
                value={
                  formData.longitude
                }
                onChange={handleChange}
                className={inputClass}
                disabled={saving}
                placeholder="e.g. 120.9842"
              />
            </div>

            <Field
              id="event-google-maps"
              label="Google Maps URL"
              name="googleMapsUrl"
              type="url"
              value={
                formData.googleMapsUrl
              }
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
              placeholder="https://maps.google.com/..."
              optional
            />
          </div>
        </section>

        {/* =================================================
            SCHEDULE
        ================================================= */}

        <section className="border-t border-slate-100 pt-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Schedule
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Set the event date and optional
              service hours.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field
              id="event-date"
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
              required
            />

            <Field
              id="event-start-time"
              label="Start Time"
              name="startTime"
              type="time"
              value={
                formData.startTime
              }
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            />

            <Field
              id="event-end-time"
              label="End Time"
              name="endTime"
              type="time"
              value={
                formData.endTime
              }
              onChange={handleChange}
              className={inputClass}
              disabled={saving}
            />
          </div>
        </section>

        {/* =================================================
            TYPE AND STATUS
        ================================================= */}

        <section className="border-t border-slate-100 pt-5">
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
                value={
                  formData.status
                }
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
        </section>

        {/* =================================================
            IMAGE
        ================================================= */}

        <section className="border-t border-slate-100 pt-5">
          <Field
            id="event-image"
            label="Image URL"
            name="imageUrl"
            type="url"
            value={
              formData.imageUrl
            }
            onChange={handleChange}
            className={inputClass}
            disabled={saving}
            placeholder="https://example.com/event-image.jpg"
            optional
          />
        </section>
      </form>
    </Modal>
  );
};

/* =========================================================
    REUSABLE FIELD
========================================================= */

function Field({
  id,
  label,
  optional = false,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}

        {optional && (
          <span className="ml-2 font-normal text-slate-400">
            Optional
          </span>
        )}
      </label>

      <input
        id={id}
        {...props}
      />
    </div>
  );
}

export default EventModal;
