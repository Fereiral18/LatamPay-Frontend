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
  BarChart3,
  Users,
  Activity,
} from "lucide-react";



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
              <Link to="/register" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105">
                Crear Cuenta
              </Link>

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

      {/* ANALYTICS DASHBOARD */}
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

    <h2 className="mt-6 text-4xl font-bold md:text-5xl">
      Datos en tiempo real
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
      Monitoreá el crecimiento de la plataforma, la actividad de los
      usuarios y el comportamiento de las monedas desde un único panel.
    </p>
  </motion.div>

  {/* KPIs */}
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {[
      {
        icon: TrendingUp,
        title: "Volumen Operado",
        value: "$2.4M",
        growth: "+18.2%",
      },
      {
        icon: Users,
        title: "Usuarios Activos",
        value: "52.1K",
        growth: "+3.200",
      },
      {
        icon: BarChart3,
        title: "Conversiones",
        value: "98.7%",
        growth: "+4.1%",
      },
      {
        icon: Activity,
        title: "Transacciones",
        value: "1.2M",
        growth: "+12.8%",
      },
    ].map((item, index) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Icon className="text-cyan-400" size={26} />
            </div>

            <span className="text-emerald-400">
              {item.growth}
            </span>
          </div>

          <h3 className="mt-5 text-sm text-slate-400">
            {item.title}
          </h3>

          <p className="mt-2 text-4xl font-bold">
            {item.value}
          </p>
        </motion.div>
      );
    })}
  </div>

  {/* DASHBOARD */}
  <div className="mt-8 grid gap-6 lg:grid-cols-3">
    {/* Gráfico */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">
          Evolución Semanal
        </h3>

        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          +24.6%
        </span>
      </div>

      <div className="mt-10 flex h-72 items-end justify-between gap-3">
        {[35, 50, 45, 70, 60, 85, 100].map(
          (height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              whileInView={{
                height: `${height}%`,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500 via-blue-500 to-violet-500"
            />
          )
        )}
      </div>

      <div className="mt-5 flex justify-between text-sm text-slate-500">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>
    </motion.div>

    {/* Distribución */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h3 className="text-2xl font-semibold">
        Distribución
      </h3>

      <div className="mt-8 space-y-6">
        {[
          {
            currency: "USD",
            percent: "65%",
            width: "65%",
            color: "bg-emerald-400",
          },
          {
            currency: "ARS",
            percent: "25%",
            width: "25%",
            color: "bg-cyan-400",
          },
          {
            currency: "BRL",
            percent: "10%",
            width: "10%",
            color: "bg-yellow-400",
          },
        ].map((item) => (
          <div key={item.currency}>
            <div className="mb-2 flex justify-between">
              <span>{item.currency}</span>
              <span>{item.percent}</span>
            </div>

            <div className="h-3 rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: item.width,
                }}
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

  {/* TABLA */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
  >
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-2xl font-semibold">
        Mercado de Divisas
      </h3>

      <span className="text-sm text-slate-400">
        Actualizado hace 2 min
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left text-slate-400">
            <th className="pb-4">Moneda</th>
            <th className="pb-4">Precio</th>
            <th className="pb-4">24h</th>
            <th className="pb-4">Volumen</th>
            <th className="pb-4">Estado</th>
          </tr>
        </thead>

        <tbody>
          {[
            {
              currency: "USD",
              price: "$1.250",
              change: "+2.4%",
              volume: "$950K",
              positive: true,
            },
            {
              currency: "BRL",
              price: "$220",
              change: "+1.2%",
              volume: "$420K",
              positive: true,
            },
            {
              currency: "COP",
              price: "$0.32",
              change: "-0.8%",
              volume: "$180K",
              positive: false,
            },
          ].map((row) => (
            <tr
              key={row.currency}
              className="border-b border-white/5 transition hover:bg-white/5"
            >
              <td className="py-5 font-medium">
                {row.currency}
              </td>

              <td>{row.price}</td>

              <td
                className={
                  row.positive
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              >
                {row.change}
              </td>

              <td>{row.volume}</td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    row.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {row.positive ? "Alza" : "Baja"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
</section>
      {/* FOOTER */}
<footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
  <div className="container mx-auto px-6 py-14">
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      {/* Marca */}
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          LatamPay
        </h3>

        <p className="mt-4 text-sm text-slate-400 leading-relaxed">
          Wallet multimoneda para gestionar, convertir y transferir dinero
          entre distintos países de Latinoamérica de forma rápida y segura.
        </p>
      </div>

      {/* Navegación */}
      <div>
        <h4 className="mb-4 font-semibold text-white">
          Navegación
        </h4>

        <ul className="space-y-3 text-slate-400">
          
          <li>
            <Link
              to="/login"
              className="hover:text-cyan-400 transition"
            >
              Iniciar Sesión
            </Link>
          </li>

          <li>
            <Link
              to="/register"
              className="hover:text-cyan-400 transition"
            >
              Registrarse
            </Link>
          </li>
        </ul>
      </div>

      {/* Soporte */}
      <div>
        <h4 className="mb-4 font-semibold text-white">
          Soporte
        </h4>

        <ul className="space-y-3 text-slate-400">
          <li className="hover:text-cyan-400 transition cursor-pointer">
            Centro de Ayuda
          </li>

          <li className="hover:text-cyan-400 transition cursor-pointer">
            Términos y Condiciones
          </li>

          <li className="hover:text-cyan-400 transition cursor-pointer">
            Política de Privacidad
          </li>
        </ul>
      </div>

      {/* Contacto */}
      <div>
        <h4 className="mb-4 font-semibold text-white">
          Contacto
        </h4>

        <p className="text-slate-400">
          soporte@latampay.com
        </p>

        <div className="mt-5 flex gap-3">
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            X
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            IG
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            IN
          </a>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
      <p>
        © {new Date().getFullYear()} LatamPay. Todos los derechos reservados.
      </p>

     
    </div>
  </div>
</footer>
    </main>
  );
};