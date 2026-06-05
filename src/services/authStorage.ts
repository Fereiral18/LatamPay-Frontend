const TOKEN_STORAGE_KEY = "latampay.auth.token";

export type AuthStorage = {
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const authStorage: AuthStorage = {
  getToken: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};
