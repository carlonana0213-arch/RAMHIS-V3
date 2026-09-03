import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";
import {
  cachePatientQueue,
  getCachedPatientQueue,
  matchesPatientSearch,
  summarizePatients,
  saveOfflinePatient,
  queueOfflineOperation,
  searchCachedPatients,
  getOwnerKey,
} from "./offlineRepository";

const API = `${API_BASE_URL}/api/patients`;

const isNetworkError = (error) => {
  return (
    error instanceof TypeError ||
    error?.message === "Failed to fetch" ||
    error?.message?.toLowerCase().includes("networkerror")
  );
};
/*
|--------------------------------------------------------------------------
| PATIENT REGISTRY
|--------------------------------------------------------------------------
*/

export const getPatients = async () => {
  const data = await apiFetch(API);

  return Array.isArray(data) ? data : data?.patients || data?.data || [];
};

export const addPatient = async (data) => {
  try {
    return await apiFetch(API, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError ||
      error?.message === "Failed to fetch" ||
      error?.message?.toLowerCase().includes("networkerror");

    if (!isNetworkError) {
      throw error;
    }

    /*
     * ---------------------------------------------------------
     * OFFLINE CREATE
     * ---------------------------------------------------------
     */

    const offlineId = `offline-${crypto.randomUUID()}`;

    const offlinePatient = {
      ...data,

      _id: offlineId,

      // Keep track of the fact that this record has not
      // reached MongoDB yet.
      _offline: true,

      _syncStatus: "pending",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    await saveOfflinePatient(offlinePatient);

    await queueOfflineOperation({
      entityType: "patient",
      entityKey: offlineId,
      method: "POST",
      url: API,
      payload: data,
    });

    console.info(
      "[Offline] Patient saved locally and queued for synchronization.",
    );

    return offlinePatient;
  }
};

export const updatePatient = async (id, data) => {
  try {
    return await apiFetch(`${API}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }

    console.info(
      "[Offline] Updating patient locally and queueing for synchronization.",
    );

    const existingPatients = await getCachedPatientQueue();

    const existingPatient = existingPatients.find((p) => p._id === id);

    if (!existingPatient) {
      throw new Error("Patient is not available in offline storage.");
    }

    const updatedPatient = {
      ...existingPatient,
      ...data,
      _id: id,
      _offline: false,
      _syncStatus: "pending",
      updatedAt: new Date().toISOString(),
    };

    await saveOfflinePatient(updatedPatient);

    await queueOfflineOperation({
      entityType: "patient",
      entityKey: id,
      method: "PUT",
      url: `${API}/${id}`,
      payload: data,
    });

    return updatedPatient;
  }
};

export const deletePatient = (id) =>
  apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

export const getPatientById = async (id) => {
  if (!id) {
    throw new Error("Patient ID is required.");
  }

  try {
    const patient = await apiFetch(`${API}/${id}`);

    if (patient?._id) {
      await cachePatientQueue([patient]);
    }

    return patient;
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }

    const patients = await getCachedPatientQueue();

    const cachedPatient = patients.find(
      (patient) => String(patient._id) === String(id),
    );

    if (!cachedPatient) {
      throw new Error("Patient is not available in offline storage.");
    }

    return cachedPatient;
  }
};

/*
|--------------------------------------------------------------------------
| PATIENT SEARCH
|--------------------------------------------------------------------------
*/

export const searchPatients = async (name = "", birthdate = "") => {
  try {
    const params = new URLSearchParams();

    if (name?.trim()) {
      params.append("name", name.trim());
    }

    if (birthdate) {
      params.append("birthdate", birthdate);
    }

    const query = params.toString();

    const data = await apiFetch(`${API}/search${query ? `?${query}` : ""}`);

    return Array.isArray(data) ? data : data?.patients || data?.data || [];
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError ||
      error?.message === "Failed to fetch" ||
      error?.message?.toLowerCase().includes("networkerror");

    if (!isNetworkError) {
      throw error;
    }

    console.info("[Offline] Searching cached patients for duplicate check.");

    return searchCachedPatients(name, birthdate);
  }
};

/*
|--------------------------------------------------------------------------
| PATIENT QUEUE
|--------------------------------------------------------------------------
|
| Supports the backend's:
|
| /queue?page=
| /queue?limit=
| /queue?search=
| /queue?department=
|
| The function also supports an `all` option if needed later.
|
*/

export const getPatientQueue = async ({
  page = 1,
  limit = 15,
  search = "",
  department = "All",
  all = false,
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    if (department && department !== "All") {
      params.set("department", department);
    }

    if (all) {
      params.set("all", "true");
    }

    const data = await apiFetch(`${API}/queue?${params.toString()}`);

    const patients = Array.isArray(data)
      ? data
      : Array.isArray(data?.patients)
        ? data.patients
        : [];

    await cachePatientQueue(patients);

    return {
      patients,
      total: Number(data?.total) || patients.length,
      totalPages: Number(data?.totalPages) || 1,
      currentPage: Number(data?.currentPage) || page,
    };
  } catch (error) {
    // If the request failed because the network is unavailable,
    // fall back to IndexedDB even if navigator.onLine is still true.
    //
    // navigator.onLine is only a hint and can remain true when
    // an actual fetch() request fails.
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    let patients = await getCachedPatientQueue();

    patients = patients.filter((patient) =>
      matchesPatientSearch(patient, search),
    );

    if (department && department !== "All") {
      patients = patients.filter(
        (patient) => patient.department === department,
      );
    }

    const start = (page - 1) * limit;
    const pagePatients = patients.slice(start, start + limit);

    return {
      patients: pagePatients,
      total: patients.length,
      totalPages: Math.max(1, Math.ceil(patients.length / limit)),
      currentPage: page,
    };
  }
};

/*
|--------------------------------------------------------------------------
| QUEUE SUMMARY OFFLINE
|--------------------------------------------------------------------------
*/
export const cachePatientQueueForOffline = async () => {
  if (!navigator.onLine) {
    return 0;
  }

  const data = await apiFetch(`${API}/queue?all=true`);

  const patients = Array.isArray(data)
    ? data
    : Array.isArray(data?.patients)
      ? data.patients
      : [];

  await cachePatientQueue(patients);

  console.info(
    `[Offline] Cached ${patients.length} patient record(s) for offline use.`,
  );

  return patients.length;
};

/*
|--------------------------------------------------------------------------
| QUEUE SUMMARY
|--------------------------------------------------------------------------
*/

export const getPatientQueueSummary = async () => {
  try {
    const data = await apiFetch(`${API}/queue-summary`);

    return {
      Pediatrics: Number(data?.Pediatrics) || 0,
      Ortho: Number(data?.Ortho) || 0,
      Opta: Number(data?.Opta) || 0,
      Dental: Number(data?.Dental) || 0,
      Cardio: Number(data?.Cardio) || 0,
      General: Number(data?.General) || 0,
    };
  } catch (error) {
    if (!isNetworkError(error) && navigator.onLine) {
      throw error;
    }

    const patients = await getCachedPatientQueue();

    return summarizePatients(patients);
  }
};

/*
|--------------------------------------------------------------------------
| QUEUE SYNC
|--------------------------------------------------------------------------
*/

export const syncOfflineQueue = async () => {
  const data = await apiFetch(`${API}/queue-sync`);

  return Array.isArray(data) ? data : data?.patients || [];
};
