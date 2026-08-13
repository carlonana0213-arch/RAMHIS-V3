import { apiFetch } from "./api";

import { API_BASE_URL } from "./apiConfig";

const API = `${API_BASE_URL}/api/patients`;

export const getPatients = async () => {
  try {
    return await apiFetch(API);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

export const addPatient = (data) =>
  apiFetch(API, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const searchPatients = async (name) => {
  return apiFetch(
    `${API}/search?name=${encodeURIComponent(name)}`
  );
};

export const updatePatient = (id, data) =>
  apiFetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deletePatient = (id) =>
  apiFetch(`${API}/${id}`, {
    method: "DELETE",
  });

export const getPatientQueue = () =>
  apiFetch(`${API}/queue`);

export const getPatientById = (id) =>
  apiFetch(`${API}/${id}`);