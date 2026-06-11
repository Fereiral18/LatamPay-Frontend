export type Currency = "ARS" | "COP" | "VES";

export const SUPPORTED_CURRENCIES: Currency[] = ["ARS", "COP", "VES"];

export type CurrencyBalances = Record<Currency, number>;

export type ApiBalance = {
  currency_code: string;
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

export type ApiExchangeRate = {
  from_currency: string;
  to_currency: string;
  rate: number | string;
  updated_at: string;
};

export type ExchangeRateKey = `${Currency}-${Currency}`;
export type ExchangeRatesMap = Partial<Record<ExchangeRateKey, number>>;

export type SwapPayload = {
  from_currency: Currency;
  to_currency: Currency;
  amount: number;
};

export type SwapResult = {
  transactionId: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
};

export type SwapInput = {
  from: Currency;
  to: Currency;
  amount: number;
};

export type SwapOutcome =
  | { ok: true; toAmount: number; rate: number }
  | { ok: false; error: string };

export type DepositPayload = {
  amount: number;
  currency_code: Currency;
};

export type DepositResult = {
  transactionId: string;
  amount: number;
  currency: string;
};

export type TransactionKind =
  | "transfer_sent"
  | "transfer_received"
  | "deposit"
  | "withdraw"
  | "swap"
  | "other";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  kind: TransactionKind;
  reason?: string;
  createdAt: string;
};

export type TransferInput = {
  amount: number;
  destination: string;
  currency: Currency;
  reason?: string;
};

export type WalletContextValue = {
  balance: number;
  balances: CurrencyBalances;
  transactions: Transaction[];
  rates: ExchangeRatesMap;
  cbu: string | null;
  alias: string | null;
  isLoading: boolean;
  error: string | null;
  canAfford: (amount: number, currency: Currency) => boolean;
  getRate: (from: Currency, to: Currency) => number | null;
  transfer: (
    input: TransferInput,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  swap: (input: SwapInput) => Promise<SwapOutcome>;
  refresh: () => Promise<void>;
};
