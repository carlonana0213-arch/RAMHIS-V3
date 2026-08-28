import { useEffect, useState } from "react";
import OfflineUnavailable from "./OfflineUnavailable";
import { API_BASE_URL } from "../../Services/apiConfig";

export default function OnlineOnly({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    let cancelled = false;

    const checkConnection = async () => {
      // Browser already knows there is no network.
      if (!navigator.onLine) {
        if (!cancelled) {
          setIsOffline(true);
        }
        return;
      }

      try {
        // Check the actual RAMHIS backend rather than relying only
        // on navigator.onLine.
        //
        // We intentionally use the API server so the service worker
        // cannot satisfy this request from its cached app shell.
        await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          cache: "no-store",
        });

        if (!cancelled) {
          setIsOffline(false);
        }
      } catch {
        if (!cancelled) {
          setIsOffline(true);
        }
      }
    };

    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check the actual backend when the component mounts.
    checkConnection();

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOffline ? <OfflineUnavailable /> : children;
}
