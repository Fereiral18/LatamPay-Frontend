import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Users,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import { loginSchema } from "../../schemas/login.schema";

type LoginFormData = {
  email: string;
  password: string;
};

const quotes = [
  { pair: "ARS / COP", value: "$3,08" },
  { pair: "VES / ARS", value: "$26,00" },
  { pair: "VES / COP", value: "$80,00" },
];

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      navigate(paths.dashboard, { replace: true });
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Error inesperado al iniciar sesión",
      });
    }
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

      <div className="relative z-10 mt-5 container mx-auto grid min-h-screen items-center gap-10 px-8 pb-16 lg:grid-cols-2">
        {/* LEFT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 flex justify-center lg:order-1"
        >
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Inicia sesión</h2>
            <p className="mt-1 text-sm text-slate-400">
              Ingresá con tu email y contraseña.
            </p>

            {/* EMAIL */}
            <div className="mt-6">
              <label className="text-sm text-slate-300">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mt-4">
              <label className="text-sm text-slate-300">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black disabled:opacity-50"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
            {errors.root && (
              <p className="mt-3 text-sm text-red-400 text-center">
                {errors.root.message}
              </p>
            )}
            <p className="mt-6 text-center text-sm text-slate-400">
              ¿No tenés cuenta?{" "}
              <Link to={paths.register} className="text-cyan-400">
                Registrate gratis
              </Link>
            </p>
          </div>
        </motion.div>

        {/* RIGHT INFO */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="order-1 lg:order-2"
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
            desde una sola plataforma.
          </p>

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
