import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Landmark, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

interface ReceiveModalProps {
  open: boolean;
  onClose: () => void;
  alias?: string | null;
  cbu?: string | null;
}

export const ReceiveModal = ({
  open,
  onClose,
  alias,
  cbu,
}: ReceiveModalProps) => {
  const handleCopy = async (value: string | null | undefined, label: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado correctamente`);
    } catch {
      toast.error(`No se pudo copiar el ${label}`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: window.innerWidth >= 640 ? 0.95 : 1,
              y: window.innerWidth >= 640 ? 30 : 100,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: window.innerWidth >= 640 ? 0.95 : 1,
              y: window.innerWidth >= 640 ? 30 : 100,
            }}
            transition={{ duration: 0.25 }}
            className="
  fixed z-50
  w-full
  sm:w-[92%]
  sm:max-w-lg

  bottom-0
  left-0

  sm:bottom-auto
  sm:left-1/2
  sm:top-1/2

  sm:-translate-x-1/2
  sm:-translate-y-1/2
"
          >
            <div
              className="
    max-h-[90vh]
    overflow-y-auto
    sm:max-h-none
    sm:overflow-visible

    rounded-t-[2rem]
    sm:rounded-3xl

    border border-white/10
    bg-slate-950/96
    backdrop-blur-2xl
    shadow-[0_0_50px_rgba(6,182,212,0.15)]
  "
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Recibir dinero
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Compartí tus datos para recibir transferencias.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-5 p-6">
                {/* Alias */}
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-cyan-400">
                    <Download size={18} />
                    <span className="font-medium">Alias</span>
                  </div>

                  <p className="break-all text-lg font-semibold text-white">
                    {alias || "No disponible"}
                  </p>

                  <button
                    onClick={() => handleCopy(alias, "Alias")}
                    disabled={!alias}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
                  >
                    <Copy size={16} />
                    Copiar alias
                  </button>
                </div>

                {/* CBU */}
                <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-violet-400">
                    <Landmark size={18} />
                    <span className="font-medium">CBU</span>
                  </div>

                  <p className="break-all font-mono text-lg font-semibold text-white">
                    {cbu || "No disponible"}
                  </p>

                  <button
                    onClick={() => handleCopy(cbu, "CBU")}
                    disabled={!cbu}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-50"
                  >
                    <Copy size={16} />
                    Copiar CBU
                  </button>
                </div>

                {/* Seguridad */}
                <div className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <ShieldCheck
                    className="mt-0.5 shrink-0 text-emerald-400"
                    size={20}
                  />

                  <div>
                    <p className="font-medium text-emerald-300">
                      Transferencias seguras
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Compartí únicamente estos datos para recibir dinero. Nunca
                      compartas tus contraseñas o códigos de seguridad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
