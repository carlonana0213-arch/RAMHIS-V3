import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "react-hot-toast";

import App from "./App";

import "./index.css";

import { AuthProvider } from "./Context/AuthContext";
import { registerSW } from "virtual:pwa-register";
import { syncOfflineOutbox } from "./Services/offlineSync";
let updateSW;

updateSW = registerSW({
  onNeedRefresh() {
    const shouldUpdate = window.confirm(
      "A new RAMHIS version is available. Update now?",
    );

    if (shouldUpdate) {
      updateSW(true);
    }
  },

  onOfflineReady() {
    console.info("RAMHIS is ready for offline use.");
  },
});

window.addEventListener("online", () => {
  syncOfflineOutbox().catch((error) => {
    console.error("[Offline Sync] Sync failed:", error);
  });
});

if (navigator.onLine) {
  syncOfflineOutbox().catch((error) => {
    console.error("[Offline Sync] Initial sync failed:", error);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
);
