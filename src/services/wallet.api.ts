import { authStorage } from "./authStorage";
import type {
  ApiExchangeRate,
  ApiHistory,
  ApiWallet,
  DepositPayload,
  DepositResult,
  SwapPayload,
  SwapResult,
  TransferPayload,
  TransferResult,
} from "../types/wallet/wallet.types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
};

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function authedFetch<T>(
  path: string,
  init: RequestInit,
  fallback: string,
): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok) throw new ApiError(res.status, json?.message ?? fallback);
  if (!json || json.data === undefined) {
    throw new ApiError(res.status, json?.message ?? fallback);
  }
  return json.data;
}

export const apiGetWallet = async (): Promise<ApiWallet | null> => {
  try {
    return await authedFetch<ApiWallet>(
      "/api/wallets/me",
      { method: "GET" },
      "No pudimos cargar tu billetera.",
    );
  } catch (e) {
    // Cuenta sin wallet en DB: el backend responde 404 ("Billetera no encontrada")
    // o 200 con `data` ausente. Tratamos ambos casos como wallet vacía.
    if (e instanceof ApiError && (e.status === 404 || e.status === 200)) {
      return null;
    }
    throw e;
  }
};

export const apiTransfer = (
  payload: TransferPayload,
): Promise<TransferResult> =>
  authedFetch<TransferResult>(
    "/api/transactions/transfer",
    { method: "POST", body: JSON.stringify(payload) },
    "No pudimos completar la transferencia.",
  );


export const apiGetHistory = async (
  page = 1,
  limit = 50,
): Promise<ApiHistory> => {
  try {
    return await authedFetch<ApiHistory>(
      `/api/transactions/history?page=${page}&limit=${limit}`,
      { method: "GET" },
      "No pudimos cargar el historial.",
    );
  } catch (e) {
    // Cuenta sin wallet en DB: el backend responde 404.
    // Devolvemos historial vacío para no romper el dashboard.
    if (e instanceof ApiError && e.status === 404) {
      return {
        transactions: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          limit,
        },
      };
    }
    throw e;
  }
};


export const apiGetRates = (): Promise<ApiExchangeRate[]> =>
  authedFetch<ApiExchangeRate[]>(
    "/api/exchange/rates",
    { method: "GET" },
    "No pudimos cargar las cotizaciones.",
  );

export const apiSwap = (payload: SwapPayload): Promise<SwapResult> =>
  authedFetch<SwapResult>(
    "/api/exchange/swap",
    { method: "POST", body: JSON.stringify(payload) },
    "No pudimos completar la conversión.",
  );

export const apiDeposit = (payload: DepositPayload): Promise<DepositResult> =>
  authedFetch<DepositResult>(
    "/api/transactions/deposit",
    { method: "POST", body: JSON.stringify(payload) },
    "No pudimos acreditar el saldo.",
  );
