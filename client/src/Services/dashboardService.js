import { API_BASE_URL } from "./apiConfig";
import { apiFetch } from "./api";

const API = `${API_BASE_URL}/api/dashboard`;

export const getDashboardSummary = () =>
  apiFetch(`${API}/summary`);

export const getPatientTrends = () =>
  apiFetch(`${API}/patient-trends`);

export const getDiagnosisDistribution = () =>
  apiFetch(`${API}/diagnosis-distribution`);

export const getTopMedicines = () =>
  apiFetch(`${API}/top-medicines`);