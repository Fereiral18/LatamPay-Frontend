import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { ReactNode } from "react";
import { apiLogin, apiMe } from "../services/auth.api";
import { authStorage } from "../services/authStorage";
import { authReducer } from "./reducer/auth.reducer";
import { initialAuthState } from "./reducer/auth.initialState";
import {
  loginSuccess,
  logoutAction,
  sessionFailed,
  sessionRestored,
} from "./reducer/auth.actions";
import type { AuthUser } from "./reducer/auth.types";

export type { AuthUser } from "./reducer/auth.types";

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const stored = authStorage.getToken();
    if (!stored) {
      dispatch(sessionFailed());
      return;
    }

    apiMe(stored)
      .then((apiUser) => {
        dispatch(sessionRestored(stored, apiUser));
      })
      .catch(() => {
        authStorage.clearToken();
        dispatch(sessionFailed());
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: apiUser, token: apiToken } = await apiLogin(email, password);
    authStorage.setToken(apiToken);
    dispatch(loginSuccess(apiToken, apiUser));
  }, []);

  const logout = useCallback(() => {
    authStorage.clearToken();
    dispatch(logoutAction());
  }, []);

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      if (!state.user?.email) return false;
      try {
        await apiLogin(state.user.email, password);
        return true;
      } catch {
        return false;
      }
    },
    [state.user?.email],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      user: state.user,
      isAuthenticated: state.token !== null,
      isLoading: state.isLoading,
      login,
      logout,
      verifyPassword,
    }),
    [state, login, logout, verifyPassword],
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
