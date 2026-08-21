import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";

const API = `${API_BASE_URL}/api/patients`;

/*
|--------------------------------------------------------------------------
| PATIENT REGISTRY
|--------------------------------------------------------------------------
*/

export const getPatients = async () => {
  const data = await apiFetch(API);

  return Array.isArray(data)
    ? data
    : data?.patients || data?.data || [];
};

export const addPatient = (data) =>
  apiFetch(API, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updatePatient = (id, data) =>
  apiFetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deletePatient = (id) =>
  apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

export const getPatientById = (id) =>
  apiFetch(`${API}/${id}`);

/*
|--------------------------------------------------------------------------
| PATIENT SEARCH
|--------------------------------------------------------------------------
*/

export const searchPatients = async (
  name = "",
  birthdate = ""
) => {
  const params = new URLSearchParams();

  if (name?.trim()) {
    params.append("name", name.trim());
  }

  if (birthdate) {
    params.append("birthdate", birthdate);
  }

  const query = params.toString();

  const data = await apiFetch(
    `${API}/search${query ? `?${query}` : ""}`
  );

  return Array.isArray(data)
    ? data
    : data?.patients || data?.data || [];
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
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  if (
    department &&
    department !== "All"
  ) {
    params.append(
      "department",
      department
    );
  }

  if (all) {
    params.append("all", "true");
  }

  const data = await apiFetch(
    `${API}/queue?${params.toString()}`
  );

  /*
   * Backend normally returns:
   *
   * {
   *   patients: [],
   *   total,
   *   totalPages,
   *   currentPage
   * }
   *
   * But this fallback keeps compatibility
   * with the older array response.
   */

  if (Array.isArray(data)) {
    return {
      patients: data,
      total: data.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  return {
    patients: Array.isArray(data?.patients)
      ? data.patients
      : [],

    total: Number(data?.total) || 0,

    totalPages:
      Number(data?.totalPages) || 1,

    currentPage:
      Number(data?.currentPage) || page,
  };
};

/*
|--------------------------------------------------------------------------
| QUEUE SUMMARY
|--------------------------------------------------------------------------
*/

export const getPatientQueueSummary =
  async () => {
    const data = await apiFetch(
      `${API}/queue-summary`
    );

    return {
      Pediatrics:
        Number(data?.Pediatrics) || 0,

      Ortho:
        Number(data?.Ortho) || 0,

      Opta:
        Number(data?.Opta) || 0,

      Dental:
        Number(data?.Dental) || 0,

      Cardio:
        Number(data?.Cardio) || 0,

      General:
        Number(data?.General) || 0,
    };
  };

/*
|--------------------------------------------------------------------------
| QUEUE SYNC
|--------------------------------------------------------------------------
*/

export const syncOfflineQueue =
  async () => {
    const data = await apiFetch(
      `${API}/queue-sync`
    );

    return Array.isArray(data)
      ? data
      : data?.patients || [];
  };