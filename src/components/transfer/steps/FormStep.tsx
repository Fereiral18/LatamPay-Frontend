import type { FormEvent } from "react";
import { Coins, DollarSign, FileText, Send, User } from "lucide-react";
import { Input } from "../../input/Input";
import { Button } from "../../button/Button";
import {
  transferCurrencies,
  transferReasons,
  type TransferFormFields,
  type TransferReason,
} from "../../../types/transfer/transfer.types";
import type { Currency } from "../../../types/wallet/wallet.types";

export type FormStepProps = {
  destination: string;
  amount: string;
  currency: Currency;
  reason: TransferReason;
  onChange: (patch: Partial<TransferFormFields>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const FormStep = ({
  destination,
  amount,
  currency,
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

    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <Input
        label="CBU o alias"
        value={destination}
        onChange={(e) => onChange({ destination: e.target.value })}
        placeholder="Ingresá el CBU o alias del destinatario"
        leftIcon={User}
      />

      <Input
        label="Monto a transferir"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => onChange({ amount: e.target.value })}
        placeholder="0.00"
        leftIcon={DollarSign}
      />

      <div>
        <label className="mb-1.5 block text-sm text-slate-300">Moneda</label>
        <div className="relative">
          <Coins
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={currency}
            onChange={(e) =>
              onChange({ currency: e.target.value as Currency })
            }
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pl-10 text-white outline-none transition focus:border-cyan-500/40"
          >
            {transferCurrencies.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
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

      <Button type="submit" leftIcon={Send} fullWidth className="mt-2">
        Enviar
      </Button>
    </form>
  </>
);

export default FormStep;
