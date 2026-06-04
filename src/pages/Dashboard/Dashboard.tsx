import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12">

      {/* Fondo animado */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl">

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">
            Bienvenido a{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              LatamPay
            </span>
          </h1>
          <p className="mt-2 text-slate-400">
            Hola, {user?.email ?? "usuario"}.
          </p>
        </motion.div>

        {/* Tarjeta Tu cuenta */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-2xl border border-cyan-500/20 bg-white/5 p-6 shadow-[0_0_40px_rgba(6,182,212,0.08)] backdrop-blur-xl"
        >
          <h2 className="text-lg font-semibold text-white">Tu cuenta</h2>

          <dl className="mt-4 divide-y divide-white/5">
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-slate-400">Email</dt>
              <dd className="text-sm font-medium text-white">
                {user?.email ?? "—"}
              </dd>
            </div>
          </dl>
        </motion.article>

      </div>
    </section>
  );
};

export default Dashboard;
