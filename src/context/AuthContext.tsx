import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { apiLogin, apiMe } from "../services/auth.api";
import type { ApiUser } from "../services/auth.api";

const TOKEN_STORAGE_KEY = "latampay.auth.token";

export type AuthUser = ApiUser;

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    apiMe(stored)
      .then((apiUser) => {
        setToken(stored);
        setUser(apiUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: apiUser, token: apiToken } = await apiLogin(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, apiToken);
    setToken(apiToken);
    setUser(apiUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: token !== null,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }
  return ctx;
}
