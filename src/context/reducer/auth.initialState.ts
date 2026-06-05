import type { AuthState } from "./auth.types";

export const initialAuthState: AuthState = {
  token: null,
  user: null,
  isLoading: true,
};
