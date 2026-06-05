import type { AuthAction, AuthUser } from "./auth.types";

export const sessionRestored = (
  token: string,
  user: AuthUser,
): AuthAction => ({
  type: "SESSION_RESTORED",
  payload: { token, user },
});

export const sessionFailed = (): AuthAction => ({
  type: "SESSION_FAILED",
});

export const loginSuccess = (token: string, user: AuthUser): AuthAction => ({
  type: "LOGIN_SUCCESS",
  payload: { token, user },
});

export const logoutAction = (): AuthAction => ({
  type: "LOGOUT",
});
