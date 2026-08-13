import { createContext, useContext, useEffect, useState } from "react";

import { loginUser } from "../Services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  /*
    ------------------------
    Restore Session
    ------------------------
    */

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(JSON.parse(storedUser));
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
  };

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
