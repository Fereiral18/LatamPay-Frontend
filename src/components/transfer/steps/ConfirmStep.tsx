import type { FormEvent } from "react";
import { AlertTriangle, Eye, EyeOff, Lock } from "lucide-react";
import { formatAmount } from "../../../services/transfer/format";
import {
  transferReasons,
  type TransferReason,
} from "../../../types/transfer/transfer.types";

export type ConfirmStepProps = {
  destination: string;
  amount: string;
  reason: TransferReason;
  userEmail?: string;
  password: string;
  showPassword: boolean;
  isVerifying: boolean;
  error: string | null;
  onPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onBack: () => void;
  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
};

export const ConfirmStep = ({
  destination,
  amount,
  reason,
  userEmail,
  password,
  showPassword,
  isVerifying,
  error,
  onPasswordChange,
  onToggleShowPassword,
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

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-slate-400">Monto</p>
        <p className="mt-0.5 text-3xl font-bold text-cyan-400">
          ${formatAmount(amount)}
        </p>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400">Destinatario</span>
            <span className="break-all text-right font-medium">
              {destination}
            </span>
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
      </div>

      <form onSubmit={onConfirm} className="mt-5">
        <label className="mb-1.5 block text-sm text-slate-300">
          Contraseña
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 pr-12 text-white outline-none transition focus:border-cyan-500/40"
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-cyan-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isVerifying}
            className="rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isVerifying ? "Verificando..." : "Confirmar"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ConfirmStep;
