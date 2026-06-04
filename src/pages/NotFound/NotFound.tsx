import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon, Compass, ArrowLeft } from "lucide-react";
import { paths } from "../../routes/paths";

export const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 text-white">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-cyan-500/20 bg-white/5 p-10 text-center backdrop-blur-xl shadow-[0_0_60px_rgba(6,182,212,0.15)]"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
          <Compass size={32} className="text-cyan-400" />
        </div>

        <h1 className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-7xl font-bold text-transparent md:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
          Página no encontrada
        </h2>

        <p className="mt-3 text-slate-300">
          La página que buscás no existe o fue movida. Volvé al inicio para
          seguir operando.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={paths.home}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            <HomeIcon size={18} />
            Volver al inicio
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-slate-200 backdrop-blur-xl transition hover:border-cyan-500/40"
          >
            <ArrowLeft size={18} />
            Atrás
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;
