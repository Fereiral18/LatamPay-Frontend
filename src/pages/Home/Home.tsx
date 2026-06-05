import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Send,
  ArrowDownToLine,
  History,
} from "lucide-react";
import { paths } from "../../routes/paths";

const features = [
  {
    icon: ArrowLeftRight,
    title: "Conversión Instantánea",
    description: "Convertí ARS, USD y BRL en segundos.",
  },
  {
    icon: Wallet,
    title: "Transferencias",
    description: "Mové dinero de forma rápida y segura.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description: "Protección avanzada para tus fondos.",
  },
  {
    icon: TrendingUp,
    title: "Analíticas",
    description: "Monitoreá tu actividad financiera.",
  },
];

const transactions = [
  {
    title: "Compra USD",
    amount: "+500 USD",
  },
  {
    title: "Transferencia",
    amount: "-200 USD",
  },
  {
    title: "Recibido",
    amount: "+150 USD",
  },
];

export const Home = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      {/* HERO */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
              <Wallet size={16} />
              Wallet Multimoneda
            </div>

            <h1 className="mt-6 text-5xl font-bold md:text-7xl">
              Tu dinero
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                sin fronteras
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Gestioná pesos argentinos, colombianos y bolivares venezolanos desde una sola
              plataforma. Convertí monedas, enviá dinero y controlá tus
              finanzas en tiempo real.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105">
                Crear Cuenta
              </button>

              <button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
                Ver Cotizaciones
              </button>
            </div>

            {/* Cotizaciones */}
            <div className="mt-10 flex flex-wrap gap-4">
              {[
                { pair: "USD / ARS", value: "$1.250" },
                { pair: "BRL / ARS", value: "$220" },
                { pair: "USD / BRL", value: "R$5.60" },
              ].map((item) => (
                <div
                  key={item.pair}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <p className="text-xs text-slate-400">{item.pair}</p>
                  <p className="mt-1 text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
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

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={18} />
                  Balance Total
                </div>

                <span className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp size={16} />
                  +12.4%
                </span>
              </div>

              <h2 className="mt-4 text-5xl font-bold">$12,450</h2>

              <p className="mt-2 text-slate-400">
                Disponible para operar
              </p>

              {/* Acciones */}
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

              {/* Monedas */}
              <div className="mt-8 space-y-3">
                {[
                  {
                    currency: "USD",
                    value: "$8,000",
                    color: "text-emerald-400",
                  },
                  {
                    currency: "ARS",
                    value: "$2.500.000",
                    color: "text-cyan-400",
                  },
                  {
                    currency: "BRL",
                    value: "R$12.000",
                    color: "text-yellow-400",
                  },
                ].map((item) => (
                  <div
                    key={item.currency}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <span>{item.currency}</span>
                    <span className={item.color}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Icon size={28} className="text-cyan-400" />
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>

                <p className="mt-2 text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MOVIMIENTOS */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <h2 className="mb-8 text-4xl font-bold">
          Últimos movimientos
        </h2>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.title}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <span>{tx.title}</span>

              <span className="font-semibold text-cyan-400">
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-12 text-center backdrop-blur-xl shadow-[0_0_60px_rgba(6,182,212,0.12)]">
          <h2 className="text-4xl font-bold">
            Comenzá a operar hoy
          </h2>

          <p className="mt-4 text-slate-300">
            Creá una cuenta gratuita y gestioná múltiples monedas.
          </p>

          <Link
            to={paths.register}
            className="mt-8 inline-block rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:scale-105"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>
    </main>
  );
};