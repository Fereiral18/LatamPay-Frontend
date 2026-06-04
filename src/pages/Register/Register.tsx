import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Wallet, ArrowLeftRight, TrendingUp, Users, Zap } from "lucide-react";
import { Form } from "../../components/forms/Form";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import type { FormSuccessPayload } from "../../types/formLogin_register.types";

function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El nombre es obligatorio.";
  if (trimmed.length < 2) return "Debe tener al menos 2 caracteres.";
  if (trimmed.length > 100) return "El nombre es demasiado largo.";
  return undefined;
}

const perks = [
  { icon: ShieldCheck, label: "Seguridad bancaria" },
  { icon: ArrowLeftRight, label: "Conversión instantánea" },
  { icon: Wallet, label: "Multi-moneda" },
  { icon: Zap, label: "Transferencias al instante" },
];

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const nameError = validateName(name);

  const handleSuccess = async ({ values }: FormSuccessPayload) => {
    await login(values.email, values.password);
    navigate(paths.dashboard, { replace: true });
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

      {/* Layout dividido */}
      <div className="relative z-10 container mx-auto grid min-h-screen items-center gap-10 px-8 pt-1 pb-16 lg:grid-cols-2">

        {/* Panel izquierdo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
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

          {/* Perks */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl"
              >
                <Icon size={16} className="text-cyan-400 shrink-0" />
                {label}
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

        {/* Panel derecho — formulario */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)] backdrop-blur-xl">
            <h2 className="text-2xl font-bold">Crear cuenta</h2>
            <p className="mt-1 text-sm text-slate-400">
              Completá los datos para comenzar.
            </p>

            <Form
              onSuccess={handleSuccess}
              submitLabel="Registrarme"
              extraValues={{ name: name.trim() }}
              disableSubmit={Boolean(nameError)}
            >
              {/* Campo nombre */}
              <div className="mt-6">
                <label
                  htmlFor="register-name"
                  className="mb-1.5 block text-sm text-slate-300"
                >
                  Nombre
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  aria-invalid={Boolean(nameError && nameTouched)}
                  aria-describedby={nameError && nameTouched ? "register-name-error" : undefined}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-xl transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                />
                {nameError && nameTouched && (
                  <p id="register-name-error" role="alert" className="mt-1 text-xs text-red-400">
                    {nameError}
                  </p>
                )}
              </div>
            </Form>

            <p className="mt-6 text-center text-sm text-slate-400">
              ¿Ya tenés cuenta?{" "}
              <Link
                to={paths.login}
                className="text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Register;
