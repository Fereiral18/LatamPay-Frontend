import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  History,
  Info,
  Mail,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { TransactionHistory } from "../../components/transactions/TransactionHistory";

type Section = "profile" | "history" | "about";

const VALID_SECTIONS: Section[] = ["profile", "history", "about"];

const parseSection = (value: string | null): Section | null =>
  value && (VALID_SECTIONS as string[]).includes(value) ? (value as Section) : null;

const sidebarLinks: {
  id: Section;
  label: string;
  icon: typeof User;
}[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "history", label: "Historial", icon: History },
  { id: "about", label: "Acerca de LatamPay", icon: Info },
];

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

export const More = () => {
  const { user } = useAuth();
  const { transactions } = useWallet();
  const [searchParams, setSearchParams] = useSearchParams();

  // null = vista de menú (solo mobile). En desktop siempre hay sección activa.
  // Prioridad inicial: ?section=... > default desktop ("profile") > null en mobile.
  const [section, setSection] = useState<Section | null>(() => {
    const fromUrl = parseSection(searchParams.get("section"));
    if (fromUrl) return fromUrl;
    return isDesktop() ? "profile" : null;
  });

  // Si el viewport cambia a desktop y no hay sección, seleccionamos la primera.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mql.matches && section === null) setSection("profile");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [section]);

  // Si la URL cambia mientras estamos en la página, sincronizamos.
  useEffect(() => {
    const fromUrl = parseSection(searchParams.get("section"));
    if (fromUrl && fromUrl !== section) setSection(fromUrl);
  }, [searchParams, section]);

  const handleSelectSection = (next: Section) => {
    setSection(next);
    if (searchParams.get("section") !== next) {
      const params = new URLSearchParams(searchParams);
      params.set("section", next);
      setSearchParams(params, { replace: true });
    }
  };

  const activeLink = sidebarLinks.find((l) => l.id === section);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-4 py-8 text-white md:px-6 md:py-12">
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
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header: en mobile se oculta cuando estamos dentro de una sección */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={section !== null ? "hidden md:block" : ""}
        >
          <h1 className="text-3xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Más
            </span>{" "}
            opciones
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
            Accedé a tu perfil, revisá el historial de tus movimientos y
            conocé más sobre LatamPay.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-[260px_1fr]">
          {/* Sidebar — mobile: visible solo cuando section es null. Desktop: siempre visible */}
          <aside
            className={`h-fit rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl md:p-4 ${
              section !== null ? "hidden md:block" : "block"
            }`}
          >
            <nav>
              <ul className="space-y-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = section === link.id;

                  return (
                    <li key={link.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSection(link.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-4 text-left transition-all md:py-3 ${
                          isActive
                            ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                            : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="text-sm font-medium">
                            {link.label}
                          </span>
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-slate-500 md:hidden"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Contenido — mobile: visible solo cuando section !== null. Desktop: siempre visible */}
          <div
            className={`rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-8 ${
              section === null ? "hidden md:block" : "block"
            }`}
          >
            {/* Back button (solo mobile) */}
            {section !== null && (
              <button
                type="button"
                onClick={() => setSection(null)}
                className="mb-5 flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-400 md:hidden"
              >
                <ArrowLeft size={18} />
                Volver al menú
              </button>
            )}

            {section === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 md:h-16 md:w-16">
                    <User size={28} className="text-cyan-400 md:h-8 md:w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold md:text-2xl">
                      {user?.name ?? "Usuario"}
                    </h2>
                    <p className="text-xs text-slate-400 md:text-sm">
                      Información de tu perfil
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={16} />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="mt-2 break-all font-medium">
                      {user?.email ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield size={16} />
                      <span className="text-sm">Rol</span>
                    </div>
                    <p className="mt-2 font-medium capitalize">
                      {user?.role ?? "user"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {section === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 md:h-16 md:w-16">
                    <History
                      size={28}
                      className="text-cyan-400 md:h-8 md:w-8"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold md:text-2xl">Historial</h2>
                    <p className="text-xs text-slate-400 md:text-sm">
                      Últimos movimientos de tu cuenta
                    </p>
                  </div>
                </div>

                <div className="mt-6 md:mt-8">
                  <TransactionHistory transactions={transactions} />
                </div>
              </motion.div>
            )}

            {section === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 md:h-16 md:w-16">
                    <Wallet
                      size={28}
                      className="text-cyan-400 md:h-8 md:w-8"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold md:text-2xl">
                      Acerca de LatamPay
                    </h2>
                    <p className="text-xs text-slate-400 md:text-sm">
                      Nuestra misión y propuesta de valor
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-slate-300 md:mt-8 md:text-base">
                  <p>
                    LatamPay es una plataforma financiera pensada para América
                    Latina. Permite mover, convertir y administrar tu dinero
                    en distintas monedas de la región de forma simple, rápida
                    y segura.
                  </p>
                  <p>
                    Nuestro objetivo es eliminar las barreras del intercambio
                    entre países, ofreciendo conversiones transparentes entre
                    pesos argentinos, pesos colombianos y bolívares
                    venezolanos, con cotizaciones claras y sin sorpresas.
                  </p>
                  <p>
                    Combinamos tecnología moderna, soporte impulsado por IA y
                    estándares de seguridad para que confiar en nosotros sea
                    natural.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                    <p className="text-3xl font-bold text-cyan-400">3</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Monedas soportadas
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                    <p className="text-3xl font-bold text-cyan-400">24/7</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Disponibilidad
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                    <p className="text-3xl font-bold text-cyan-400">100%</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Cotizaciones simuladas
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Título del header en mobile cuando estamos en una sección */}
            {section !== null && activeLink && (
              <p className="sr-only">{activeLink.label}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default More;
