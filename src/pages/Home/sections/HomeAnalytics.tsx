import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import { useLiveRates } from "../../../hooks/useLiveRates";
import { formatChange, formatNumber } from "../utils/format";

const KPIS = [
  { icon: TrendingUp, title: "Volumen Operado", value: "$2.4M ARS", growth: "+18.2%" },
  { icon: Users,      title: "Usuarios Activos", value: "52.1K",     growth: "+3.200" },
  { icon: BarChart3,  title: "Conversiones",    value: "98.7%",     growth: "+4.1%"  },
  { icon: Activity,   title: "Transacciones",   value: "1.2M",      growth: "+12.8%" },
];

const DISTRIBUTION = [
  { currency: "ARS", percent: "60%", width: "60%", color: "bg-cyan-400"    },
  { currency: "COP", percent: "25%", width: "25%", color: "bg-emerald-400" },
  { currency: "VES", percent: "15%", width: "15%", color: "bg-yellow-400"  },
];

const useChartBars = (history: { ars_cop: number | null }[]) =>
  useMemo(() => {
    const buffer = history
      .map((h) => h.ars_cop)
      .filter((v): v is number => v !== null && Number.isFinite(v));
    if (buffer.length === 0) {
      return { bars: [35, 50, 45, 70, 60, 85, 100], empty: true };
    }
    const min = Math.min(...buffer);
    const max = Math.max(...buffer);
    const span = max - min || max || 1;
    const bars = buffer.map((v) => 30 + ((v - min) / span) * 70);
    while (bars.length < 7) bars.unshift(bars[0] ?? 50);
    return { bars: bars.slice(-7), empty: false };
  }, [history]);

export const HomeAnalytics = () => {
  const { rates, history, lastUpdated, isLoading } = useLiveRates();

  const arsCop = rates.ARS?.COP ?? null;
  const arsVes = rates.ARS?.VES ?? null;
  const arsCopFirst = history[0]?.ars_cop ?? null;
  const headlineChange = formatChange(arsCop, arsCopFirst);
  const chartData = useChartBars(history);

  const lastUpdatedLabel = lastUpdated
    ? `Actualizado ${new Date(lastUpdated).toLocaleTimeString("es-AR")}`
    : isLoading
      ? "Cargando cotizaciones…"
      : "Sin datos";

  const marketRows = [
    {
      currency: "COP" as const,
      label: "Peso Colombiano",
      price: arsCop,
      prev: history[0]?.ars_cop ?? null,
      symbol: "$",
    },
    {
      currency: "VES" as const,
      label: "Bolívar Venezolano",
      price: arsVes,
      prev: history[0]?.ars_ves ?? null,
      symbol: "Bs.",
    },
  ];

  return (
    <section className="relative z-10 container mx-auto px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          Analíticas Inteligentes
        </span>
        <h2 className="mt-6 text-4xl font-bold md:text-5xl">Datos en tiempo real</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Monitoreá el crecimiento de la plataforma, la actividad de los usuarios y el
          comportamiento de las monedas desde un único panel.
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Icon className="text-cyan-400" size={26} />
                </div>
                <span className="text-emerald-400">{item.growth}</span>
              </div>
              <h3 className="mt-5 text-sm text-slate-400">{item.title}</h3>
              <p className="mt-2 text-4xl font-bold">{item.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Gráfico + Distribución */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Evolución ARS → COP</h3>
              <p className="text-xs text-slate-500">{lastUpdatedLabel}</p>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm ${
                headlineChange.positive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {headlineChange.label}
            </span>
          </div>

          <div className="mt-10 flex h-72 items-end justify-between gap-3">
            {chartData.bars.map((height, index) => (
              <motion.div
                key={index}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex-1 rounded-t-2xl bg-gradient-to-t ${
                  chartData.empty
                    ? "from-slate-700 via-slate-600 to-slate-500"
                    : "from-cyan-500 via-blue-500 to-violet-500"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-between text-sm text-slate-500">
            <span>-3h</span>
            <span>-2.5h</span>
            <span>-2h</span>
            <span>-1.5h</span>
            <span>-1h</span>
            <span>-30m</span>
            <span>Ahora</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <h3 className="text-2xl font-semibold">Distribución</h3>
          <div className="mt-8 space-y-6">
            {DISTRIBUTION.map((item) => (
              <div key={item.currency}>
                <div className="mb-2 flex justify-between">
                  <span>{item.currency}</span>
                  <span>{item.percent}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: item.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className={`h-3 rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mercado de Divisas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Mercado de Divisas</h3>
          <span className="text-sm text-slate-400">{lastUpdatedLabel}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-4">Moneda</th>
                <th className="pb-4">Precio (por 1 ARS)</th>
                <th className="pb-4">Variación</th>
                <th className="pb-4">Par</th>
                <th className="pb-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row) => {
                const change = formatChange(row.price, row.prev);
                return (
                  <tr
                    key={row.currency}
                    className="border-b border-white/5 transition hover:bg-white/5"
                  >
                    <td className="py-5 font-medium">
                      <div className="flex flex-col">
                        <span>{row.currency}</span>
                        <span className="text-xs text-slate-500">{row.label}</span>
                      </div>
                    </td>
                    <td>
                      <motion.span
                        key={row.price ?? "loading"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {row.price !== null
                          ? `${row.symbol}${formatNumber(row.price, row.price >= 100 ? 2 : 4)}`
                          : "—"}
                      </motion.span>
                    </td>
                    <td className={change.positive ? "text-emerald-400" : "text-red-400"}>
                      {change.label}
                    </td>
                    <td>ARS / {row.currency}</td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          change.positive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {change.positive ? "Alza" : "Baja"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeAnalytics;
