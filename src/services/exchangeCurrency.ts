export type CurrencyCode = "ARS" | "COP" | "VES";

export type Currency = {
  code: CurrencyCode;
  label: string;
  flag: string;
  symbol: string;
};

export const currencies: Currency[] = [
  { code: "ARS", label: "Peso Argentino", flag: "🇦🇷", symbol: "$" },
  { code: "COP", label: "Peso Colombiano", flag: "🇨🇴", symbol: "$" },
  { code: "VES", label: "Bolívar Venezolano", flag: "🇻🇪", symbol: "Bs." },
];

// Tasas simuladas expresadas en unidades por 1 USD (referencia interna)
export const ratesPerUsd: Record<CurrencyCode, number> = {
  ARS: 1300,
  COP: 4000,
  VES: 50,
};

export const convert = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number => {
  if (Number.isNaN(amount)) return 0;
  const usd = amount / ratesPerUsd[from];
  return usd * ratesPerUsd[to];
};

export const formatAmount = (value: number): string =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const getCurrency = (code: CurrencyCode): Currency =>
  currencies.find((c) => c.code === code)!;
