import { useEffect, useState } from "react";
import { syncOfflineTransactions } from "../../Services/syncService";
import db from "../../Services/localDB";

function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  const loadPending = async () => {
    const count = await db.syncQueue.count();
    setPendingSync(count);
  };

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);

      await syncOfflineTransactions();
      await loadPending();
    };

    const handleOffline = () => {
      setIsOnline(false);
      loadPending();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    loadPending();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`rounded-full px-3.5 py-2 text-sm font-semibold text-white ${
        isOnline ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {isOnline
        ? `🟢 Online ${pendingSync ? `(${pendingSync} syncing)` : ""}`
        : `🔴 Offline ${pendingSync ? `(${pendingSync} pending)` : ""}`}
    </div>
  );
}

export default ConnectionStatus;