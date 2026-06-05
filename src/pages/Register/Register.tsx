import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  ArrowLeftRight,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { paths } from "../../routes/paths";
import { apiRegister } from "../../services/auth.api";
import { registerSchema } from "../../schemas/register.schema";

const perks = [
  { icon: ShieldCheck, label: "Seguridad bancaria" },
  { icon: ArrowLeftRight, label: "Conversión instantánea" },
  { icon: Wallet, label: "Multi-moneda" },
  { icon: Zap, label: "Transferencias al instante" },
];

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    await apiRegister(data.name, data.email, data.password);

    navigate(paths.login, { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 17, repeat: Infinity }}
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto grid min-h-screen items-center gap-10 px-8 pb-16 lg:grid-cols-2">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
            <Wallet size={16} />
            Wallet Multimoneda
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
            Registrate
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              en segundos
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-slate-300">
            Creá tu cuenta gratuita y empezá a gestionar pesos argentinos,
            dólares y reales desde una sola plataforma.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl"
              >
                <Icon size={16} className="text-cyan-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT - FORM */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold">Crear cuenta</h2>
            <p className="mt-1 text-sm text-slate-400">
              Completá los datos para comenzar.
            </p>

            {/* NAME */}
            <div className="mt-6">
              <label className="mb-1.5 block text-sm text-slate-300">
                Nombre
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Tu nombre completo"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-300">
                Password
              </label>
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
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-300">
                Confirmar password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-cyan-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear cuenta"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              ¿Ya tenés cuenta?{" "}
              <Link to={paths.login} className="text-cyan-400">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Register;