import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Currency } from "../../types/wallet/wallet.types";
import { formatRate, formatChange } from "../../pages/Home/utils/format";

export type LiveRateCardProps = {
  from: Currency;
  to: Currency;
  rate: number | null;
  previous?: number | null;
  symbol?: string;
  /** Estilo visual: compacto para el Hero, completo para grids */
  variant?: "compact" | "detailed";
  className?: string;
};

const CURRENCY_FLAG: Record<Currency, string> = {
  ARS: "🇦🇷",
  COP: "🇨🇴",
  VES: "🇻🇪",
};

export const LiveRateCard = ({
  from,
  to,
  rate,
  previous = null,
  symbol = "",
  variant = "compact",
  className = "",
}: LiveRateCardProps) => {
  const change = formatChange(rate, previous ?? null);
  const showChange = previous !== null && rate !== null;

  if (variant === "compact") {
    return (
      <motion.div
        layout
        className={`rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl ${className}`}
      >
        <p className="text-xs text-slate-400">
          1 {from} → {to}
        </p>
        <motion.p
          key={rate ?? "loading"}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xl font-bold"
        >
          {formatRate(rate, symbol)}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="text-base">{CURRENCY_FLAG[from]}</span>
          <span className="text-slate-500">→</span>
          <span className="text-base">{CURRENCY_FLAG[to]}</span>
          <span className="ml-1 font-medium text-slate-300">
            {from} / {to}
          </span>
        </div>
        {showChange && (
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
              change.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {change.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change.label}
          </span>
        )}
      </div>

      <motion.p
        key={rate ?? "loading"}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-3xl font-bold"
      >
        {formatRate(rate, symbol)}
      </motion.p>

      <p className="mt-1 text-xs text-slate-500">por 1 {from}</p>
    </motion.div>
  );
};

export default LiveRateCard;
