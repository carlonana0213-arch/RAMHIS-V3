import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/sync-conflicts`;

/**
 * Get all pending conflicts for a patient.
 */
export const getPatientConflicts = async (patientId) => {
  return apiFetch(`${API_URL}/patient/${patientId}`);
};

/**
 * Get one specific conflict.
 */
export const getConflict = async (conflictId) => {
  return apiFetch(`${API_URL}/${conflictId}`);
};

/**
 * Resolve a conflict.
 *
 * We will use this in the next stage.
 */
export const resolveConflict = async (
  conflictId,
  selectedOperationId,
  resolvedData,
) => {
  return apiFetch(`${API_URL}/${conflictId}/resolve`, {
    method: "POST",
    body: JSON.stringify({
      selectedOperationId,
      resolvedData,
    }),
  });
};
