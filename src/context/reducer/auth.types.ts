import type { ApiUser } from "../../services/auth.api";

export type AuthUser = ApiUser;

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
};

export type AuthAction =
  | { type: "SESSION_RESTORED"; payload: { token: string; user: AuthUser } }
  | { type: "SESSION_FAILED" }
  | { type: "LOGIN_SUCCESS"; payload: { token: string; user: AuthUser } }
  | { type: "LOGOUT" };
