import type { TransferFormFields } from "../../types/transfer/transfer.types";
import { SUPPORTED_CURRENCIES } from "../../types/wallet/wallet.types";

export type ValidationResult = { ok: true } | { ok: false; error: string };

export const validateDraft = (
  form: TransferFormFields,
): ValidationResult => {
  if (!form.destination.trim()) {
    return { ok: false, error: "Ingresá un CBU o alias válido." };
  }
  const n = Number(form.amount.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, error: "Ingresá un monto mayor a 0." };
  }
  if (!form.currency || !SUPPORTED_CURRENCIES.includes(form.currency)) {
    return { ok: false, error: "Seleccioná una moneda." };
  }
  if (!form.reason) {
    return { ok: false, error: "Seleccioná un motivo." };
  }
  return { ok: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) {
    return { ok: false, error: "Ingresá tu contraseña para autorizar." };
  }
  return { ok: true };
};
