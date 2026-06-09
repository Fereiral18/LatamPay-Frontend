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
  apiGetWallet,
  apiTransfer,
} from "../services/wallet.api";
import type {
  ApiTransaction,
  Transaction,
  WalletContextValue,
} from "../types/wallet/wallet.types";

export type {
  Transaction,
  TransferInput,
  WalletContextValue,
} from "../types/wallet/wallet.types";

const DEFAULT_CURRENCY = "ARS";

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
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
};

const INITIAL_STATE: WalletState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

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
      const [wallet, history] = await Promise.all([
        apiGetWallet(),
        apiGetHistory(1, 50),
      ]);
      const ars = wallet.balances.find((b) => b.currency === DEFAULT_CURRENCY);
      const balance = ars ? Number(ars.amount) : 0;
      const transactions = history.transactions.map(mapTransaction);
      setState({
        balance: Number.isFinite(balance) ? balance : 0,
        transactions,
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
    (amount: number) =>
      Number.isFinite(amount) && amount > 0 && amount <= state.balance,
    [state.balance],
  );

  const transfer = useCallback<WalletContextValue["transfer"]>(
    async (input) => {
      if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { ok: false, error: "Ingresá un monto válido." };
      }
      if (input.amount > state.balance) {
        return { ok: false, error: "Saldo insuficiente." };
      }
      try {
        await apiTransfer({
          to_identifier: input.destination.trim(),
          amount: input.amount,
          currency_code: DEFAULT_CURRENCY,
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
    [refresh, state.balance],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      balance: state.balance,
      transactions: state.transactions,
      isLoading: state.isLoading,
      error: state.error,
      canAfford,
      transfer,
      refresh,
    }),
    [
      state.balance,
      state.transactions,
      state.isLoading,
      state.error,
      canAfford,
      transfer,
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
