import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import {
  apiGetHistory,
  apiGetRates,
  apiGetWallet,
  apiSwap,
  apiTransfer,
} from "../services/wallet.api";
import {
  SUPPORTED_CURRENCIES,
  type ApiTransaction,
  type Currency,
  type CurrencyBalances,
  type ExchangeRateKey,
  type ExchangeRatesMap,
  type Transaction,
  type WalletContextValue,
} from "../types/wallet/wallet.types";

export type {
  Transaction,
  TransferInput,
  WalletContextValue,
} from "../types/wallet/wallet.types";

const DEFAULT_CURRENCY: Currency = "ARS";

const EMPTY_BALANCES: CurrencyBalances = SUPPORTED_CURRENCIES.reduce(
  (acc, code) => {
    acc[code] = 0;
    return acc;
  },
  {} as CurrencyBalances,
);

const mapTransaction = (t: ApiTransaction): Transaction => {
  const fromAmount = Number(t.from_amount ?? 0);
  const toAmount = Number(t.to_amount ?? 0);
  let title = "";
  let amount = 0;

  switch (t.type) {
    case "transfer":
      if (t.direction === "sent") {
        title = "Transferencia enviada";
        amount = -fromAmount;
      } else {
        title = "Transferencia recibida";
        amount = toAmount;
      }
      break;
    case "deposit":
      title = "Depósito";
      amount = toAmount;
      break;
    case "withdraw":
      title = "Retiro";
      amount = -fromAmount;
      break;
    case "swap":
      title = `Conversión ${t.from_currency ?? ""} → ${t.to_currency ?? ""}`.trim();
      amount = t.direction === "sent" ? -fromAmount : toAmount;
      break;
    default:
      title = t.type;
      amount = t.direction === "sent" ? -fromAmount : toAmount;
  }

  return {
    id: t.id,
    title,
    amount,
    createdAt: t.created_at,
  };
};

type WalletState = {
  balance: number;
  balances: CurrencyBalances;
  transactions: Transaction[];
  rates: ExchangeRatesMap;
  cbu: string | null;
  alias: string | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: WalletState = {
  balance: 0,
  balances: { ...EMPTY_BALANCES },
  transactions: [],
  rates: {},
  cbu: null,
  alias: null,
  isLoading: false,
  error: null,
};

const isCurrency = (code: string): code is Currency =>
  (SUPPORTED_CURRENCIES as string[]).includes(code);

const WalletContext = createContext<WalletContextValue | null>(null);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<WalletState>(INITIAL_STATE);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const [wallet, history, ratesResponse] = await Promise.all([
        apiGetWallet(),
        apiGetHistory(1, 50),
        apiGetRates().catch(() => [] as Awaited<ReturnType<typeof apiGetRates>>),
      ]);
      const balances: CurrencyBalances = { ...EMPTY_BALANCES };
      if (wallet && Array.isArray(wallet.balances)) {
        for (const b of wallet.balances) {
          if (isCurrency(b.currency_code)) {
            const n = Number(b.amount);
            balances[b.currency_code] = Number.isFinite(n) ? n : 0;
          }
        }
      }
      const transactions = history.transactions.map(mapTransaction);
      const rates: ExchangeRatesMap = {};
      for (const r of ratesResponse) {
        if (isCurrency(r.from_currency) && isCurrency(r.to_currency)) {
          const n = Number(r.rate);
          if (Number.isFinite(n)) {
            const key: ExchangeRateKey = `${r.from_currency}-${r.to_currency}`;
            rates[key] = n;
          }
        }
      }
      setState({
        balance: balances[DEFAULT_CURRENCY],
        balances,
        transactions,
        rates,
        cbu: wallet?.cbu ?? null,
        alias: wallet?.alias ?? null,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error al cargar la billetera.";
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setState(INITIAL_STATE);
    }
  }, [isAuthenticated, refresh]);

  const canAfford = useCallback(
    (amount: number, currency: Currency) => {
      const available = state.balances[currency] ?? 0;
      return Number.isFinite(amount) && amount > 0 && amount <= available;
    },
    [state.balances],
  );

  const transfer = useCallback<WalletContextValue["transfer"]>(
    async (input) => {
      if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { ok: false, error: "Ingresá un monto válido." };
      }
      if (!(SUPPORTED_CURRENCIES as string[]).includes(input.currency)) {
        return { ok: false, error: "Moneda no soportada." };
      }
      const available = state.balances[input.currency] ?? 0;
      if (input.amount > available) {
        return {
          ok: false,
          error: `Saldo insuficiente en ${input.currency}.`,
        };
      }
      try {
        await apiTransfer({
          to_identifier: input.destination.trim(),
          amount: input.amount,
          currency_code: input.currency,
        });
        await refresh();
        return { ok: true };
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "No pudimos completar la transferencia.";
        return { ok: false, error: message };
      }
    },
    [refresh, state.balances],
  );

  const getRate = useCallback(
    (from: Currency, to: Currency): number | null => {
      if (from === to) return 1;
      const direct = state.rates[`${from}-${to}` as ExchangeRateKey];
      if (typeof direct === "number" && Number.isFinite(direct)) return direct;
      const inverse = state.rates[`${to}-${from}` as ExchangeRateKey];
      if (typeof inverse === "number" && inverse > 0) return 1 / inverse;
      return null;
    },
    [state.rates],
  );

  const swap = useCallback<WalletContextValue["swap"]>(
    async (input) => {
      if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { ok: false, error: "Ingresá un monto válido." };
      }
      if (input.from === input.to) {
        return { ok: false, error: "Elegí monedas distintas para convertir." };
      }
      if (
        !(SUPPORTED_CURRENCIES as string[]).includes(input.from) ||
        !(SUPPORTED_CURRENCIES as string[]).includes(input.to)
      ) {
        return { ok: false, error: "Moneda no soportada." };
      }
      const available = state.balances[input.from] ?? 0;
      if (input.amount > available) {
        return {
          ok: false,
          error: `Saldo insuficiente en ${input.from}.`,
        };
      }
      try {
        const result = await apiSwap({
          from_currency: input.from,
          to_currency: input.to,
          amount: input.amount,
        });
        await refresh();
        return {
          ok: true,
          toAmount: Number(result.toAmount),
          rate: Number(result.rate),
        };
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "No pudimos completar la conversión.";
        return { ok: false, error: message };
      }
    },
    [refresh, state.balances],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      balance: state.balance,
      balances: state.balances,
      transactions: state.transactions,
      rates: state.rates,
      cbu: state.cbu,
      alias: state.alias,
      isLoading: state.isLoading,
      error: state.error,
      canAfford,
      getRate,
      transfer,
      swap,
      refresh,
    }),
    [
      state.balance,
      state.balances,
      state.transactions,
      state.rates,
      state.cbu,
      state.alias,
      state.isLoading,
      state.error,
      canAfford,
      getRate,
      transfer,
      swap,
      refresh,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet debe usarse dentro de un <WalletProvider>.");
  }
  return ctx;
}
