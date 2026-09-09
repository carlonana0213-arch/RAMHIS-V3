import { createContext, useContext, useEffect, useRef, useState } from "react";

import { loginUser } from "../Services/authService";

const AuthContext = createContext();

// 15 minutes of inactivity
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controls the blocking session-expired modal
  const [sessionExpired, setSessionExpired] = useState(false);

  // Stores the inactivity timer
  const inactivityTimerRef = useRef(null);

  /*
    ------------------------
    Restore Session
    ------------------------
  */

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore stored session:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  /*
    ------------------------
    Login
    ------------------------
  */

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);

    // Make sure a previous expiration state cannot survive a new login
    setSessionExpired(false);

    return response.user;
  };

  /*
    ------------------------
    Logout
    ------------------------
  */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");

    setToken(null);
    setUser(null);
    setSessionExpired(false);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  /*
    ------------------------
    Session Expiration
    ------------------------
  */

  const expireSession = () => {
    // Do not repeatedly trigger the expiration
    if (sessionExpired) {
      return;
    }

    setSessionExpired(true);

    // Stop the inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  /*
    ------------------------
    Reset Inactivity Timer
    ------------------------
  */

  const resetInactivityTimer = () => {
    // Only track inactivity for authenticated users
    if (!token || sessionExpired) {
      return;
    }

    // Clear the previous timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Start a new 15-minute timer
    inactivityTimerRef.current = setTimeout(() => {
      expireSession();
    }, INACTIVITY_TIMEOUT);
  };

  /*
    ------------------------
    Activity Detection
    ------------------------
  */

  useEffect(() => {
    if (!token || sessionExpired) {
      return;
    }

    const handleActivity = () => {
      resetInactivityTimer();
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Start the timer when the user becomes authenticated
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [token, sessionExpired]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };

    window.addEventListener("ramhis:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "ramhis:session-expired",
        handleSessionExpired,
      );
    };
  }, []);
  /*
    ------------------------
    Helpers
    ------------------------
  */

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    loading,

    login,
    logout,

    isAuthenticated,

    // Session expiration
    sessionExpired,
    expireSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
