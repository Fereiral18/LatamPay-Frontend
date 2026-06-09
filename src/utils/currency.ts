import type { Currency } from "../types/wallet/wallet.types";

export type CurrencyMeta = {
  code: Currency;
  label: string;
  flag: string;
  symbol: string;
  accentClass: string;
};

export const CURRENCY_META: Record<Currency, CurrencyMeta> = {
  ARS: {
    code: "ARS",
    label: "Peso argentino",
    flag: "🇦🇷",
    symbol: "$",
    accentClass: "text-cyan-400",
  },
  COP: {
    code: "COP",
    label: "Peso colombiano",
    flag: "🇨🇴",
    symbol: "$",
    accentClass: "text-emerald-400",
  },
  VES: {
    code: "VES",
    label: "Bolívar venezolano",
    flag: "🇻🇪",
    symbol: "Bs.",
    accentClass: "text-yellow-400",
  },
};

export const formatBalance = (value: number, currency: Currency): string => {
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
  return `${CURRENCY_META[currency].symbol} ${formatted}`;
};
