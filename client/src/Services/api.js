export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    // Preserve normal network errors such as:
    // "Failed to fetch"
    throw error;
  }

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(
      data?.msg ||
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`,
    );

    // IMPORTANT:
    // Preserve the HTTP status so offlineSync.js
    // can detect 409 conflicts.
    error.status = res.status;

    // Preserve the complete backend response.
    // This contains conflictId, candidates,
    // serverData, etc. when the server returns 409.
    error.data = data;

    error.response = {
      status: res.status,
      data,
    };

    throw error;
  }

  return data;
};
