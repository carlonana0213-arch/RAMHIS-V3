import { apiFetch } from "./api";
import { API_BASE_URL } from "./apiConfig";
import db from "./localDB";

const API_URL = `${API_BASE_URL}/pharmacy`;

const getOwnerKey = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return user?._id || user?.id || "anonymous";
};

export const getMedicines = async () => {
  const ownerKey = getOwnerKey();

  try {
    const response = await apiFetch(API_URL);

    const medicines = Array.isArray(response)
      ? response
      : response?.medicines || [];

    // Cache the latest medicine list while online.
    await db.transaction("rw", db.medicines, async () => {
      // Remove the previous cache for this user.
      await db.medicines.where("ownerKey").equals(ownerKey).delete();

      for (const medicine of medicines) {
        if (!medicine?._id) {
          continue;
        }

        await db.medicines.put({
          ...medicine,

          ownerKey,

          serverId: medicine._id,

          cachedAt: new Date().toISOString(),
        });
      }
    });

    console.info(`[Offline] Cached ${medicines.length} medicine(s).`);

    return medicines;
  } catch (error) {
    // If we're online and this wasn't a network failure,
    // allow the actual API error to propagate.
    if (
      navigator.onLine &&
      !(
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError") ||
        error?.name === "TypeError"
      )
    ) {
      throw error;
    }

    console.info("[Offline] Loading medicines from IndexedDB.");

    return db.medicines.where("ownerKey").equals(ownerKey).toArray();
  }
};

export const addMedicine = async (data) => {
  return apiFetch(`${API_URL}/add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteMedicine = async (id) => {
  return apiFetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
  });
};

export const updateMedicine = async (id, data) => {
  return apiFetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
