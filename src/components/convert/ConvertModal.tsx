import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  CheckCircle2,
  Coins,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Button } from "../button/Button";
import { useWallet } from "../../context/WalletContext";
import {
  SUPPORTED_CURRENCIES,
  type Currency,
} from "../../types/wallet/wallet.types";
import { CURRENCY_META, formatBalance } from "../../utils/currency";

export type ConvertModalProps = {
  open: boolean;
  onClose: () => void;
  initialFrom?: Currency;
};

type Step = "form" | "success";

type SuccessData = {
  from: Currency;
  to: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
};

const parseAmount = (raw: string): number => Number(raw.replace(",", "."));

export const ConvertModal = ({
  open,
  onClose,
  initialFrom = "ARS",
}: ConvertModalProps) => {
  const { balances, getRate, swap } = useWallet();
  const [step, setStep] = useState<Step>("form");
  const [from, setFrom] = useState<Currency>(initialFrom);
  const [to, setTo] = useState<Currency>(
    initialFrom === "ARS" ? "COP" : "ARS",
  );
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  useEffect(() => {
    if (open) {
      setStep("form");
      setFrom(initialFrom);
      setTo(initialFrom === "ARS" ? "COP" : "ARS");
      setAmount("");
      setSuccess(null);
      setIsSubmitting(false);
      toast.dismiss();
    }
  }, [open, initialFrom]);

  const numericAmount = parseAmount(amount);
  const rate = getRate(from, to);
  const available = balances[from] ?? 0;

  const converted = useMemo(() => {
    if (rate === null || !Number.isFinite(numericAmount)) return 0;
    return numericAmount * rate;
  }, [numericAmount, rate]);

  const swapDirection = () => {
    setFrom(to);
    setTo(from);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Ingresá un monto mayor a 0.");
      return;
    }
    if (from === to) {
      toast.error("Elegí monedas distintas para convertir.");
      return;
    }
    if (rate === null) {
      toast.error("No tenemos cotización disponible para ese par.");
      return;
    }
    if (numericAmount > available) {
      toast.error(`Saldo insuficiente en ${from}.`, {
        description: `Disponible: ${formatBalance(available, from)}.`,
      });
      return;
    }

    setIsSubmitting(true);
    const loadingId = toast.loading("Procesando conversión...");
    const result = await swap({ from, to, amount: numericAmount });
    toast.dismiss(loadingId);
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSuccess({
      from,
      to,
      fromAmount: numericAmount,
      toAmount: result.toAmount,
      rate: result.rate,
    });
    setStep("success");
    toast.success(
      `Convertiste ${formatBalance(numericAmount, from)} a ${formatBalance(result.toAmount, to)}.`,
    );
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Convertir monedas">
      {step === "form" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <header className="flex items-start gap-3 pr-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15">
              <ArrowLeftRight size={22} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold md:text-2xl">
                Convertir monedas
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Cotización en vivo desde el mercado.
              </p>
            </div>
          </header>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-300">
                Desde
              </label>
              <div className="relative">
                <Coins
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as Currency)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900">
                      {CURRENCY_META[c].flag} {CURRENCY_META[c].label} ({c})
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Disponible: {formatBalance(available, from)}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={swapDirection}
                aria-label="Invertir monedas"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 transition hover:rotate-180 hover:bg-cyan-500/20"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-300">
                Hacia
              </label>
              <div className="relative">
                <Coins
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as Currency)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900">
                      {CURRENCY_META[c].flag} {CURRENCY_META[c].label} ({c})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-300">
                Monto a convertir
              </label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <TrendingUp size={16} />
                <span className="text-sm">Tipo de cambio</span>
              </div>
              <p className="mt-1 text-sm font-medium">
                {rate === null ? (
                  <span className="text-amber-400">
                    Cotización no disponible para {from} → {to}.
                  </span>
                ) : (
                  <>
                    1 {from} ={" "}
                    <span className="text-cyan-400">
                      {rate.toLocaleString("es-AR", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 6,
                      })}{" "}
                      {to}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-2 text-lg font-bold">
                Recibís{" "}
                <span className="text-cyan-300">
                  {formatBalance(converted, to)}
                </span>
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              loadingText="Procesando..."
              leftIcon={ArrowLeftRight}
              className="mt-2"
            >
              Confirmar conversión
            </Button>
          </form>
        </motion.div>
      )}

      {step === "success" && success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 size={36} className="text-emerald-400" />
          </div>
          <h2 className="mt-5 text-2xl font-bold">¡Conversión exitosa!</h2>
          <p className="mt-2 text-slate-300">
            Cambiaste{" "}
            <span className="font-semibold text-emerald-400">
              {formatBalance(success.fromAmount, success.from)}
            </span>{" "}
            por{" "}
            <span className="font-semibold text-emerald-400">
              {formatBalance(success.toAmount, success.to)}
            </span>
            .
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Tasa aplicada: 1 {success.from} ={" "}
            {success.rate.toLocaleString("es-AR", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 6,
            })}{" "}
            {success.to}
          </p>
          <Button onClick={onClose} fullWidth className="mt-6">
            Listo
          </Button>
        </motion.div>
      )}
    </Modal>
  );
};

export default ConvertModal;
