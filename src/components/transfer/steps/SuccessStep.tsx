import { CheckCircle2 } from "lucide-react";
import { Button } from "../../button/Button";
import { formatAmount } from "../../../services/transfer/format";
import type { Currency } from "../../../types/wallet/wallet.types";

export type SuccessStepProps = {
  destination: string;
  amount: string;
  currency: Currency;
  onClose: () => void;
};

export const SuccessStep = ({
  destination,
  amount,
  currency,
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
        ${formatAmount(amount)} {currency}
      </span>{" "}
      a <span className="font-semibold">{destination}</span>.
    </p>
    <Button onClick={onClose} fullWidth className="mt-6">
      Listo
    </Button>
  </div>
);

export default SuccessStep;
