export type ApiBalance = {
  currency: string;
  amount: number | string;
};

export type ApiWallet = {
  id: string;
  cbu: string;
  alias: string;
  balances: ApiBalance[];
};

export type ApiTransactionType =
  | "deposit"
  | "withdraw"
  | "transfer"
  | "swap"
  | string;

export type ApiTransactionDirection = "sent" | "received" | null;

export type ApiTransaction = {
  id: string;
  type: ApiTransactionType;
  status: string;
  from_currency: string | null;
  to_currency: string | null;
  from_amount: number | string | null;
  to_amount: number | string | null;
  exchange_rate: number | string | null;
  created_at: string;
  direction: ApiTransactionDirection;
};

export type ApiHistoryPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export type ApiHistory = {
  transactions: ApiTransaction[];
  pagination: ApiHistoryPagination;
};

export type TransferPayload = {
  to_identifier: string;
  amount: number;
  currency_code: string;
};

export type TransferResult = {
  transactionId: string;
  to: string;
  amount: number;
};

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
  isLoading: boolean;
  error: string | null;
  canAfford: (amount: number) => boolean;
  transfer: (
    input: TransferInput,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  refresh: () => Promise<void>;
};
