const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type ApiUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

export type LoginResponse = {
  user: ApiUser;
  token: string;
};

type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
  user?: ApiUser;
};

async function parseJsonOrThrow<T>(response: Response, fallback: string): Promise<ApiEnvelope<T>> {
  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok) {
    throw new Error(data?.message ?? fallback);
  }
  if (!data) {
    throw new Error(fallback);
  }
  return data;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await parseJsonOrThrow<LoginResponse>(res, "No pudimos iniciar sesión.");
  if (!json.data) throw new Error("Respuesta inválida del servidor.");
  return json.data;
}

export async function apiRegister(name: string, email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  await parseJsonOrThrow(res, "No pudimos crear la cuenta.");
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await parseJsonOrThrow<unknown>(res, "Sesión inválida.");
  if (!json.user) throw new Error("Respuesta inválida del servidor.");
  return json.user;
}
