import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  History,
  Send,
  TrendingDown,
  TrendingUp,
  Wallet as WalletIcon,
} from "lucide-react";
import { useLiveRates } from "../../../hooks/useLiveRates";
import { LiveRatesGrid } from "../../../components/exchange/LiveRatesGrid";
import { SYMBOLS, formatChange, formatNumber } from "../utils/format";

const DEMO_ARS_BALANCE = 2_500_000;

export const HomeHero = () => {
  const { rates, history } = useLiveRates();

  const arsCop = rates.ARS?.COP ?? null;
  const arsVes = rates.ARS?.VES ?? null;

  const copBalance = arsCop ? DEMO_ARS_BALANCE * arsCop : null;
  const vesBalance = arsVes ? DEMO_ARS_BALANCE * arsVes : null;
  const arsCopFirst = history[0]?.ars_cop ?? null;
  const headlineChange = formatChange(arsCop, arsCopFirst);

  const balanceRows = [
    {
      currency: "ARS" as const,
      value: `${SYMBOLS.ARS}${formatNumber(DEMO_ARS_BALANCE, 0)}`,
      color: "text-cyan-400",
    },
    {
      currency: "COP" as const,
      value: copBalance ? `${SYMBOLS.COP}${formatNumber(copBalance, 0)}` : "—",
      color: "text-emerald-400",
    },
    {
      currency: "VES" as const,
      value: vesBalance ? `${SYMBOLS.VES} ${formatNumber(vesBalance, 0)}` : "—",
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="relative z-10 container mx-auto px-6 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
            <WalletIcon size={16} />
            Wallet Multimoneda
          </div>

          <h1 className="mt-6 text-5xl font-bold md:text-7xl">
            Tu dinero
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              sin fronteras
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Gestioná pesos argentinos, colombianos y bolívares venezolanos desde una sola
            plataforma. Convertí monedas, enviá dinero y controlá tus finanzas en tiempo real.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105"
            >
              Crear Cuenta
            </Link>
            <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
              Ver Cotizaciones
            </button>
          </div>

          {/* Cotizaciones en vivo (reutilizables) */}
          <LiveRatesGrid className="mt-10" />

          <div className="mt-12 flex flex-wrap gap-10">
            <div>
              <h3 className="text-3xl font-bold">50K+</h3>
              <p className="text-slate-400">Usuarios</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">1M+</h3>
              <p className="text-slate-400">Transacciones</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">99.9%</h3>
              <p className="text-slate-400">Disponibilidad</p>
            </div>
          </div>
        </motion.div>

        {/* Card de Balance demo */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <WalletIcon size={18} />
                Balance Total (ARS)
              </div>
              <span
                className={`flex items-center gap-1 ${
                  headlineChange.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {headlineChange.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {headlineChange.label}
              </span>
            </div>

            <motion.h2
              key={DEMO_ARS_BALANCE}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-5xl font-bold"
            >
              {`${SYMBOLS.ARS}${formatNumber(DEMO_ARS_BALANCE, 0)}`}
            </motion.h2>

            <p className="mt-2 text-slate-400">Disponible para operar</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: Send, label: "Enviar" },
                { icon: ArrowDownToLine, label: "Recibir" },
                { icon: ArrowLeftRight, label: "Convertir" },
                { icon: History, label: "Historial" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-500/40"
                  >
                    <Icon size={16} />
                    {action.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-3">
              {balanceRows.map((item) => (
                <div
                  key={item.currency}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <span>{item.currency}</span>
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={item.color}
                  >
                    {item.value}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
