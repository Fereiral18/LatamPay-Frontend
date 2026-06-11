import { motion } from "framer-motion";
import { ArrowLeftRight, ShieldCheck, TrendingUp, Wallet as WalletIcon } from "lucide-react";

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Conversión Instantánea",
    description: "Convertí ARS, COP y VES en segundos.",
  },
  {
    icon: WalletIcon,
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

export const HomeFeatures = () => (
  <section className="relative z-10 container mx-auto px-6 py-20">
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((item, index) => {
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
            <p className="mt-2 text-slate-400">{item.description}</p>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default HomeFeatures;
