import db from "./localDB";
import { API_BASE_URL } from "./apiConfig";
import { apiFetch } from "./api";

import {
  getOwnerKey,
  getPendingOfflineConflicts,
  saveOfflinePatient,
} from "./offlineRepository";

const API = `${API_BASE_URL}/api`;

export async function loadPendingConflicts() {
  return getPendingOfflineConflicts();
}
