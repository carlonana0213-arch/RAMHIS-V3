import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";

const EVENTS_URL = `${API_BASE_URL}/api/events`;

/**
 * Normalize the backend response.
 *
 * Some endpoints may return:
 * { ok: true, data: ... }
 *
 * This helper returns the actual data when available.
 */
const unwrapResponse = (response) => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return response.data;
  }

  return response;
};

/**
 * GET ALL EVENTS
 *
 * Backend:
 * GET /api/events
 */
export const getAllEvents = async () => {
  const response = await apiFetch(EVENTS_URL);

  return unwrapResponse(response);
};

/**
 * GET CURRENT MISSION
 *
 * Backend:
 * GET /api/events/current-mission
 */
export const getCurrentMission = async () => {
  const response = await apiFetch(
    `${EVENTS_URL}/current-mission`
  );

  return unwrapResponse(response);
};

/**
 * GET SINGLE EVENT
 *
 * Backend:
 * GET /api/events/:id
 */
export const getEventById = async (id) => {
  if (!id) {
    throw new Error("Event ID is required.");
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${id}`
  );

  return unwrapResponse(response);
};

/**
 * CREATE EVENT
 *
 * Backend:
 * POST /api/events
 */
export const createEvent = async (eventData) => {
  const response = await apiFetch(EVENTS_URL, {
    method: "POST",
    body: JSON.stringify(eventData),
  });

  return unwrapResponse(response);
};

/**
 * UPDATE EVENT
 *
 * Backend:
 * PUT /api/events/:id
 */
export const updateEvent = async (
  eventId,
  eventData
) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(eventData),
    }
  );

  return unwrapResponse(response);
};

/**
 * DELETE EVENT
 *
 * Backend:
 * DELETE /api/events/:id
 */
export const deleteEvent = async (eventId) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${eventId}`,
    {
      method: "DELETE",
    }
  );

  return unwrapResponse(response);
};

/**
 * JOIN EVENT
 *
 * Backend:
 * POST /api/events/:id/join
 */
export const joinEvent = async (eventId) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${eventId}/join`,
    {
      method: "POST",
    }
  );

  return unwrapResponse(response);
};

/**
 * LEAVE EVENT
 *
 * Backend:
 * POST /api/events/:id/leave
 */
export const leaveEvent = async (eventId) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${eventId}/leave`,
    {
      method: "POST",
    }
  );

  return unwrapResponse(response);
};

/**
 * UPDATE PARTICIPANT STATUS
 *
 * Backend:
 * PATCH
 * /api/events/:eventId/participants/:userId/status
 */
export const updateParticipantStatus = async (
  eventId,
  userId,
  status
) => {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!status) {
    throw new Error(
      "Participant status is required."
    );
  }

  const response = await apiFetch(
    `${EVENTS_URL}/${eventId}/participants/${userId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  return unwrapResponse(response);
};