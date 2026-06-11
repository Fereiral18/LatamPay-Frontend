import { useLiveRates } from "../../hooks/useLiveRates";
import { LiveRateCard } from "./LiveRateCard";
import type { Currency } from "../../types/wallet/wallet.types";

type Pair = { from: Currency; to: Currency; symbol: string };

const DEFAULT_PAIRS: Pair[] = [
  { from: "ARS", to: "COP", symbol: "$" },
  { from: "ARS", to: "VES", symbol: "Bs. " },
  { from: "COP", to: "VES", symbol: "Bs. " },
];

export type LiveRatesGridProps = {
  pairs?: Pair[];
  variant?: "compact" | "detailed";
  className?: string;
  showFooter?: boolean;
};

export const LiveRatesGrid = ({
  pairs = DEFAULT_PAIRS,
  variant = "compact",
  className = "",
  showFooter = true,
}: LiveRatesGridProps) => {
  const { rates, history, lastUpdated, isLoading } = useLiveRates();

  const getRate = (from: Currency, to: Currency): number | null =>
    rates[from]?.[to] ?? null;

  const getPrev = (from: Currency, to: Currency): number | null => {
    const first = history[0];
    if (!first) return null;
    if (from === "ARS" && to === "COP") return first.ars_cop;
    if (from === "ARS" && to === "VES") return first.ars_ves;
    return null;
  };

  const lastUpdatedLabel = lastUpdated
    ? `Actualizado ${new Date(lastUpdated).toLocaleTimeString("es-AR")}`
    : isLoading
      ? "Cargando cotizaciones…"
      : "Sin datos";

  const gridClasses =
    variant === "detailed"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "flex flex-wrap gap-4";

  return (
    <div className={className}>
      <div className={gridClasses}>
        {pairs.map((pair) => (
          <LiveRateCard
            key={`${pair.from}-${pair.to}`}
            from={pair.from}
            to={pair.to}
            rate={getRate(pair.from, pair.to)}
            previous={getPrev(pair.from, pair.to)}
            symbol={pair.symbol}
            variant={variant}
          />
        ))}
      </div>
      {showFooter && <p className="mt-3 text-xs text-slate-500">{lastUpdatedLabel}</p>}
    </div>
  );
};

export default LiveRatesGrid;
