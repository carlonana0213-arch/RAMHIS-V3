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
    /*
      ------------------------------------------------
      SESSION EXPIRATION
      ------------------------------------------------

      If the backend explicitly tells us that the
      JWT has expired, notify AuthContext.

      We use a browser event because api.js is not
      a React component and cannot use useAuth().
    */

    if (res.status === 401 && data?.code === "TOKEN_EXPIRED") {
      window.dispatchEvent(new CustomEvent("ramhis:session-expired"));
    }

    const error = new Error(
      data?.msg ||
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`,
    );

    // Preserve the HTTP status so offlineSync.js
    // can detect 409 conflicts.
    error.status = res.status;

    // Preserve the complete backend response.
    error.data = data;

    error.response = {
      status: res.status,
      data,
    };

    throw error;
  }

  return data;
};
