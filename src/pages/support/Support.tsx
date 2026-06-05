import { motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";

export const Support = () => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12 text-white">
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
          className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold md:text-5xl">
            Centro de{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Soporte
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Estamos para ayudarte. Nuestro sistema de soporte combina
            atención automatizada mediante inteligencia artificial y
            asistencia especializada para resolver tus consultas de
            forma rápida y segura.
          </p>
        </motion.div>

        {/* Chatbot principal */}
        <motion.article
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 rounded-3xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.12)]"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10">
              <Bot size={40} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Chatbot Inteligente LatamPay AI
              </h2>

              <p className="mt-2 text-slate-400">
                Nuestro asistente virtual impulsado por inteligencia
                artificial está disponible las 24 horas para ayudarte
                con consultas sobre tu cuenta, transferencias,
                conversiones de moneda, seguridad y uso de la
                plataforma.
              </p>

              <button className="mt-5 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]">
                Iniciar conversación
              </button>
            </div>
          </div>
        </motion.article>

        {/* Características */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <MessageCircle
              className="mb-4 text-cyan-400"
              size={28}
            />

            <h3 className="font-semibold">
              Respuestas Instantáneas
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Resolvé dudas frecuentes sin esperar la intervención de
              un operador.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <Clock
              className="mb-4 text-cyan-400"
              size={28}
            />

            <h3 className="font-semibold">
              Disponibilidad 24/7
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              El chatbot está disponible todos los días, en cualquier
              momento y desde cualquier dispositivo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <ShieldCheck
              className="mb-4 text-cyan-400"
              size={28}
            />

            <h3 className="font-semibold">
              Soporte Seguro
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Tus consultas son gestionadas siguiendo estándares de
              seguridad y privacidad para proteger tu información.
            </p>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold">
            Preguntas frecuentes
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="font-semibold text-cyan-400">
                ¿Cómo recupero mi contraseña?
              </h3>
              <p className="mt-1 text-slate-400">
                Podés utilizar la opción "Olvidé mi contraseña" en la
                pantalla de inicio de sesión.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-400">
                ¿Cómo convierto monedas?
              </h3>
              <p className="mt-1 text-slate-400">
                Desde tu Dashboard podrás acceder a la sección de
                conversiones y elegir las monedas disponibles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-cyan-400">
                ¿Qué hago si detecto actividad sospechosa?
              </h3>
              <p className="mt-1 text-slate-400">
                Contactá inmediatamente con soporte para proteger tu
                cuenta y revisar los movimientos realizados.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default Support;