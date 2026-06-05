export const formatAmount = (value: string): string => {
  const n = Number(value.replace(",", "."));
  if (!Number.isFinite(n)) return value;
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};
