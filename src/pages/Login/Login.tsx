import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Wallet, TrendingUp, Users } from "lucide-react";
import { Form } from "../../components/forms/Form";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import type { FormSuccessPayload } from "../../types/formLogin_register.types";

const LOGIN_ENDPOINT = `${import.meta.env.VITE_API_URL ?? ""}/api/auth/login`;

const quotes = [
  { pair: "USD / ARS", value: "$1.250" },
  { pair: "BRL / ARS", value: "$220" },
  { pair: "USD / BRL", value: "R$5.60" },
];

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async ({ values }: FormSuccessPayload) => {
    await login(values.email, values.password);
    navigate(paths.dashboard, { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 17, repeat: Infinity }}
          className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      {/* Layout dividido */}
      <div className="relative z-10 container mx-auto grid min-h-screen items-center gap-10 px-8 pt-1 pb-16 lg:grid-cols-2">

        {/* Panel izquierdo — formulario */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Inicia sesión</h2>
            <p className="mt-1 text-sm text-slate-400">
              Ingresá con tu email y contraseña.
            </p>

            <Form
              onSuccess={handleSuccess}
              submitLabel="Ingresar"
              endpoint={LOGIN_ENDPOINT}
            />

            <p className="mt-6 text-center text-sm text-slate-400">
              ¿No tenés cuenta?{" "}
              <Link
                to={paths.register}
                className="text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                Registrate gratis
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Panel derecho — info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
            <Wallet size={16} />
            Wallet Multimoneda
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Bienvenido
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              de vuelta
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-slate-300">
            Accedé a tu wallet y gestioná pesos argentinos, dólares y reales
            desde una sola plataforma, en tiempo real.
          </p>

          {/* Cotizaciones */}
          <div className="mt-8 flex flex-wrap gap-4">
            {quotes.map((item) => (
              <div
                key={item.pair}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <p className="text-xs text-slate-400">{item.pair}</p>
                <p className="mt-1 text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Estadísticas */}
          <div className="mt-12 flex flex-wrap gap-10">
            <div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-cyan-400" />
                <h3 className="text-3xl font-bold">50K+</h3>
              </div>
              <p className="mt-1 text-slate-400">Usuarios activos</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                <h3 className="text-3xl font-bold">1M+</h3>
              </div>
              <p className="mt-1 text-slate-400">Transacciones</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-400" />
                <h3 className="text-3xl font-bold">99.9%</h3>
              </div>
              <p className="mt-1 text-slate-400">Disponibilidad</p>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
};
