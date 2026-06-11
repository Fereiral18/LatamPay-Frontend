import { useCallback, useEffect, useRef, useState } from "react";
import { apiGetRates } from "../services/wallet.api";
import type { Currency } from "../types/wallet/wallet.types";

const POLL_INTERVAL_MS = 30 * 60 * 1000;
const HISTORY_SIZE = 7;

export type LiveRatesMap = Partial<Record<Currency, Partial<Record<Currency, number>>>>;

export type RateSnapshot = {
  at: number;
  ars_cop: number | null;
  ars_ves: number | null;
};

export type LiveRatesState = {
  rates: LiveRatesMap;
  history: RateSnapshot[];
  lastUpdated: number | null;
  isLoading: boolean;
  error: string | null;
};

const buildMap = (
  rows: { from_currency: string; to_currency: string; rate: number | string }[],
): LiveRatesMap => {
  const map: LiveRatesMap = {};
  rows.forEach((row) => {
    const from = row.from_currency as Currency;
    const to = row.to_currency as Currency;
    const value = typeof row.rate === "string" ? parseFloat(row.rate) : row.rate;
    if (!Number.isFinite(value)) return;
    if (!map[from]) map[from] = {};
    map[from]![to] = value;
  });
  return map;
};

export const useLiveRates = (intervalMs: number = POLL_INTERVAL_MS): LiveRatesState => {
  const [state, setState] = useState<LiveRatesState>({
    rates: {},
    history: [],
    lastUpdated: null,
    isLoading: true,
    error: null,
  });
  const mounted = useRef(true);

  const fetchOnce = useCallback(async () => {
    try {
      const rows = await apiGetRates();
      if (!mounted.current) return;
      const map = buildMap(rows);
      const arsCop = map.ARS?.COP ?? null;
      const arsVes = map.ARS?.VES ?? null;
      const snapshot: RateSnapshot = {
        at: Date.now(),
        ars_cop: arsCop,
        ars_ves: arsVes,
      };
      setState((prev) => {
        const history = [...prev.history, snapshot].slice(-HISTORY_SIZE);
        return {
          rates: map,
          history,
          lastUpdated: snapshot.at,
          isLoading: false,
          error: null,
        };
      });
    } catch (err) {
      if (!mounted.current) return;
      const message = err instanceof Error ? err.message : "Error al cargar cotizaciones.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchOnce();
    const id = window.setInterval(fetchOnce, intervalMs);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, [fetchOnce, intervalMs]);

  return state;
};

export default useLiveRates;
