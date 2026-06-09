import type { FormEvent } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { Input } from "../../input/Input";
import { Button } from "../../button/Button";
import { Card } from "../../ui/Card";
import { formatAmount } from "../../../services/transfer/format";
import {
  transferReasons,
  type TransferReason,
} from "../../../types/transfer/transfer.types";
import type { Currency } from "../../../types/wallet/wallet.types";

export type ConfirmStepProps = {
  destination: string;
  amount: string;
  currency: Currency;
  reason: TransferReason;
  userEmail?: string;
  password: string;
  isVerifying: boolean;
  onPasswordChange: (value: string) => void;
  onBack: () => void;
  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
};

export const ConfirmStep = ({
  destination,
  amount,
  currency,
  reason,
  userEmail,
  password,
  isVerifying,
  onPasswordChange,
  onBack,
  onConfirm,
}: ConfirmStepProps) => {
  const reasonLabel =
    transferReasons.find((r) => r.value === reason)?.label ?? "—";

  return (
    <>
      <header className="flex items-start gap-3 pr-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15">
          <AlertTriangle size={22} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            ¿Está seguro de hacer esta transferencia?
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Revisá los datos y autorizá con tu contraseña.
          </p>
        </div>
      </header>

      <Card padding="sm" className="mt-5">
        <p className="text-xs text-slate-400">Monto</p>
        <p className="mt-0.5 text-3xl font-bold text-cyan-400">
          ${formatAmount(amount)}{" "}
          <span className="text-xl text-cyan-300">{currency}</span>
        </p>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Destinatario</span>
            <span className="break-all text-right font-medium">
              {destination}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Moneda</span>
            <span className="text-right font-medium">{currency}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Motivo</span>
            <span className="text-right">{reasonLabel}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Desde</span>
            <span className="break-all text-right">{userEmail ?? "—"}</span>
          </div>
        </div>
      </Card>

      <form onSubmit={onConfirm} className="mt-5">
        <Input
          label="Contraseña de la cuenta"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="••••••••"
          autoFocus
          leftIcon={Lock}
          togglePassword
        />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isVerifying}
            loadingText="Verificando..."
            fullWidth
          >
            Confirmar
          </Button>
        </div>
      </form>
    </>
  );
};

export default ConfirmStep;
