import type { AuthAction, AuthState } from "./auth.types";

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SESSION_RESTORED":
    case "LOGIN_SUCCESS":
      return {
        token: action.payload.token,
        user: action.payload.user,
        isLoading: false,
      };

    case "SESSION_FAILED":
    case "LOGOUT":
      return {
        token: null,
        user: null,
        isLoading: false,
      };

    default:
      return state;
  }
}
