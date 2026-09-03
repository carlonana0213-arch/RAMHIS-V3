import db from "./localDB";
import { API_BASE_URL } from "./apiConfig";
import { apiFetch } from "./api";

import {
  getPendingOfflineConflicts,
  resolveOfflineConflict,
} from "./offlineRepository";

const API = `${API_BASE_URL}/api`;

/**
 * Load local pending conflicts.
 *
 * Kept for compatibility with the existing UI.
 */
export async function loadPendingConflicts() {
  return getPendingOfflineConflicts();
}

/**
 * Get all pending conflicts for a patient from the backend.
 *
 * This is now the authoritative source for multi-user
 * synchronization conflicts.
 */
export async function getPatientConflicts(patientId) {
  if (!patientId) {
    return [];
  }

  const result = await apiFetch(`${API}/sync-conflicts/patient/${patientId}`);

  return Array.isArray(result) ? result : [];
}

/**
 * Get one specific conflict from the backend.
 */
export async function getConflict(conflictId) {
  if (!conflictId) {
    return null;
  }

  return apiFetch(`${API}/sync-conflicts/${conflictId}`);
}

/**
 * Resolve a conflict by selecting one candidate.
 *
 * selectedOperationId identifies which candidate should become
 * the final version.
 */
export async function resolveConflict(
  conflictId,
  selectedOperationId,
  resolvedData,
) {
  if (!conflictId) {
    throw new Error("Conflict ID is required.");
  }

  if (!selectedOperationId) {
    throw new Error("A conflict candidate must be selected.");
  }

  const result = await apiFetch(`${API}/sync-conflicts/${conflictId}/resolve`, {
    method: "POST",

    body: JSON.stringify({
      selectedOperationId,
      resolvedData,
    }),
  });

  return result;
}

/**
 * Mark the corresponding local conflict as resolved.
 *
 * This is only local cleanup. The backend resolution above
 * is the authoritative operation.
 */
export async function markLocalConflictResolved(conflictId) {
  if (!conflictId) {
    return;
  }

  try {
    await resolveOfflineConflict(conflictId, "resolved");
  } catch (error) {
    console.warn("[Conflict UI] Failed to clean up local conflict:", error);
  }
}
