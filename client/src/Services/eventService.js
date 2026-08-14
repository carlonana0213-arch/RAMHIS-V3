import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";

const EVENTS_URL = `${API_BASE_URL}/api/events`;

// Get all events
export const getAllEvents = async () => {
  return await apiFetch(EVENTS_URL);
};

// Get a single event
export const getEventById = async (id) => {
  return await apiFetch(`${EVENTS_URL}/${id}`);
};

// Create event
export const createEvent = async (eventData) => {
  return await apiFetch(EVENTS_URL, {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

// Update event
export const updateEvent = async (id, eventData) => {
  return await apiFetch(`${EVENTS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
};

// Delete event
export const deleteEvent = async (id) => {
  return await apiFetch(`${EVENTS_URL}/${id}`, {
    method: "DELETE",
  });
};

// Update participant status
export const updateParticipantStatus = async (
  eventId,
  userId,
  status
) => {
  return await apiFetch(
    `${EVENTS_URL}/${eventId}/participants/${userId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
};

// Join event
export const joinEvent = async (id) => {
  return await apiFetch(`${EVENTS_URL}/${id}/join`, {
    method: "POST",
  });
};

// Leave event
export const leaveEvent = async (id) => {
  return await apiFetch(`${EVENTS_URL}/${id}/leave`, {
    method: "POST",
  });
};