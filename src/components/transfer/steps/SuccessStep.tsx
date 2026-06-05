import { CheckCircle2 } from "lucide-react";
import { formatAmount } from "../../../services/transfer/format";

export type SuccessStepProps = {
  destination: string;
  amount: string;
  onClose: () => void;
};

export const SuccessStep = ({
  destination,
  amount,
  onClose,
}: SuccessStepProps) => (
  <div className="text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
      <CheckCircle2 size={36} className="text-emerald-400" />
    </div>
    <h2 className="mt-5 text-2xl font-bold">¡Transferencia enviada!</h2>
    <p className="mt-2 text-slate-300">
      Enviaste{" "}
      <span className="font-semibold text-emerald-400">
        ${formatAmount(amount)}
      </span>{" "}
      a <span className="font-semibold">{destination}</span>.
    </p>
    <button
      type="button"
      onClick={onClose}
      className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
    >
      Listo
    </button>
  </div>
);

export default SuccessStep;
