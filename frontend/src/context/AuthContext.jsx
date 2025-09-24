import { useEffect, useState } from "react";
import { AuthCtx } from "./ContextObj.js";
import * as api from "../api/api.js";

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.getMe();
        setAuth(!!me.authenticated);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  async function login(username, password) {
    await api.login(username, password);
    setAuth(true);
  }

  async function logout() {
    await api.logout();
    setAuth(false);
  }

  return (
    <AuthCtx.Provider value={{ isAuthenticated, checking, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
