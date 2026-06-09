import { authStorage } from "./authStorage";
import type {
  ApiExchangeRate,
  ApiHistory,
  ApiWallet,
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
  if (!res.ok) throw new Error(json?.message ?? fallback);
  if (!json || json.data === undefined) throw new Error(fallback);
  return json.data;
}

export const apiGetWallet = (): Promise<ApiWallet> =>
  authedFetch<ApiWallet>(
    "/api/wallets/me",
    { method: "GET" },
    "No pudimos cargar tu billetera.",
  );

export const apiTransfer = (
  payload: TransferPayload,
): Promise<TransferResult> =>
  authedFetch<TransferResult>(
    "/api/wallets/transfer",
    { method: "POST", body: JSON.stringify(payload) },
    "No pudimos completar la transferencia.",
  );

export const apiGetHistory = (page = 1, limit = 50): Promise<ApiHistory> =>
  authedFetch<ApiHistory>(
    `/api/wallets/history?page=${page}&limit=${limit}`,
    { method: "GET" },
    "No pudimos cargar el historial.",
  );

export const apiGetRates = (): Promise<ApiExchangeRate[]> =>
  authedFetch<ApiExchangeRate[]>(
    "/api/exchange/rates",
    { method: "GET" },
    "No pudimos cargar las cotizaciones.",
  );

export const apiSwap = (payload: SwapPayload): Promise<SwapResult> =>
  authedFetch<SwapResult>(
    "/api/wallets/swap",
    { method: "POST", body: JSON.stringify(payload) },
    "No pudimos completar la conversión.",
  );
