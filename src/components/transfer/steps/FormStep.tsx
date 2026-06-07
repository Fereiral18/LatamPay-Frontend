import type { FormEvent } from "react";
import { DollarSign, FileText, Send, User } from "lucide-react";
import {
  transferReasons,
  type TransferFormFields,
  type TransferReason,
} from "../../../types/transfer/transfer.types";

export type FormStepProps = {
  destination: string;
  amount: string;
  reason: TransferReason;
  onChange: (patch: Partial<TransferFormFields>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const FormStep = ({
  destination,
  amount,
  reason,
  onChange,
  onSubmit,
}: FormStepProps) => (
  <>
    <header>
      <h2 className="text-xl font-bold md:text-2xl">Enviar dinero</h2>
      <p className="mt-1 text-sm text-slate-400">
        Completá los datos del destinatario.
      </p>
    </header>

    <form onSubmit={onSubmit} className="mt-5">
      <div>
        <label className="mb-1.5 block text-sm text-slate-300">
          CBU o alias
        </label>
        <div className="relative">
          <User
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={destination}
            onChange={(e) => onChange({ destination: e.target.value })}
            placeholder="Ingresá el CBU o alias del destinatario"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-slate-300">
          Monto a transferir
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
            onChange={(e) => onChange({ amount: e.target.value })}
            placeholder="0.00"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-slate-300">Motivo</label>
        <div className="relative">
          <FileText
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={reason}
            onChange={(e) =>
              onChange({ reason: e.target.value as TransferReason })
            }
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
          >
            <option value="" className="bg-slate-900">
              Seleccioná un motivo
            </option>
            {transferReasons.map((r) => (
              <option key={r.value} value={r.value} className="bg-slate-900">
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
      >
        <Send size={18} />
        Enviar
      </button>
    </form>
  </>
);

export default FormStep;
