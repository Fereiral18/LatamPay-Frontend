export const SYMBOLS = {
  ARS: "$",
  COP: "$",
  VES: "Bs.",
} as const;

export const formatNumber = (value: number, fractionDigits = 2): string =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatRate = (value: number | null | undefined, symbol = ""): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const digits = value >= 100 ? 2 : 4;
  return `${symbol}${formatNumber(value, digits)}`;
};

export const formatChange = (
  curr: number | null,
  prev: number | null,
): { label: string; positive: boolean } => {
  if (!curr || !prev || prev === 0) return { label: "0.00%", positive: true };
  const pct = ((curr - prev) / prev) * 100;
  return {
    label: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
    positive: pct >= 0,
  };
};
