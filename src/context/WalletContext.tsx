import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { ReactNode } from "react";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  reason?: string;
  createdAt: string;
};

export type TransferInput = {
  amount: number;
  destination: string;
  reason?: string;
};

export type WalletContextValue = {
  balance: number;
  transactions: Transaction[];
  canAfford: (amount: number) => boolean;
  transfer: (input: TransferInput) => boolean;
};

type WalletState = {
  balance: number;
  transactions: Transaction[];
};

type WalletAction =
  | { type: "TRANSFER"; payload: TransferInput }
  | { type: "HYDRATE"; payload: WalletState };

const STORAGE_KEY = "latampay:wallet";
const INITIAL_BALANCE = 12450;

const DEFAULT_STATE: WalletState = {
  balance: INITIAL_BALANCE,
  transactions: [],
};

const isWalletState = (value: unknown): value is WalletState => {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<WalletState>;
  return typeof v.balance === "number" && Array.isArray(v.transactions);
};

const loadInitial = (): WalletState => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed: unknown = JSON.parse(raw);
    return isWalletState(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
};

const newId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const walletReducer = (
  state: WalletState,
  action: WalletAction,
): WalletState => {
  switch (action.type) {
    case "TRANSFER": {
      const { amount, destination, reason } = action.payload;
      if (!Number.isFinite(amount) || amount <= 0 || amount > state.balance) {
        return state;
      }
      const tx: Transaction = {
        id: newId(),
        title: `Transferencia a ${destination}`,
        amount: -amount,
        reason,
        createdAt: new Date().toISOString(),
      };
      return {
        balance: state.balance - amount,
        transactions: [tx, ...state.transactions],
      };
    }
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
};

const WalletContext = createContext<WalletContextValue | null>(null);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [state, dispatch] = useReducer(walletReducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [state]);

  const canAfford = useCallback(
    (amount: number) =>
      Number.isFinite(amount) && amount > 0 && amount <= state.balance,
    [state.balance],
  );

  const transfer = useCallback(
    (input: TransferInput) => {
      if (!canAfford(input.amount)) return false;
      dispatch({ type: "TRANSFER", payload: input });
      return true;
    },
    [canAfford],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      balance: state.balance,
      transactions: state.transactions,
      canAfford,
      transfer,
    }),
    [state.balance, state.transactions, canAfford, transfer],
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
