import { useEffect, useReducer } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import {
  initialTransferState,
  transferReducer,
} from "../../services/transfer/reducer";
import {
  validateDraft,
  validatePassword,
} from "../../services/transfer/validation";
import { formatAmount } from "../../services/transfer/format";
import { FormStep } from "./steps/FormStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import { SuccessStep } from "./steps/SuccessStep";

const parseAmount = (raw: string): number =>
  Number(raw.replace(",", "."));

export type TransferModalProps = {
  open: boolean;
  onClose: () => void;
};

export const TransferModal = ({ open, onClose }: TransferModalProps) => {
  const { user, verifyPassword } = useAuth();
  const { balance, canAfford, transfer } = useWallet();
  const [state, dispatch] = useReducer(transferReducer, initialTransferState);

  // Reset al abrir
  useEffect(() => {
    if (open) {
      dispatch({ type: "RESET" });
      toast.dismiss();
    }
  }, [open]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateDraft({
      destination: state.destination,
      amount: state.amount,
      reason: state.reason,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const amountNum = parseAmount(state.amount);
    if (!canAfford(amountNum)) {
      toast.error("Saldo insuficiente.", {
        description: `Disponible: $${formatAmount(String(balance))}.`,
      });
      return;
    }

    dispatch({ type: "GO_TO_CONFIRM" });
  };

  const onConfirmSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validatePassword(state.password);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    dispatch({ type: "VERIFY_START" });
    const verifyToastId = toast.loading("Verificando contraseña...");
    try {
      const ok = await verifyPassword(state.password);
      toast.dismiss(verifyToastId);
      if (!ok) {
        const message = "La contraseña no coincide con la de tu cuenta.";
        dispatch({ type: "VERIFY_FAIL", payload: message });
        toast.error(message);
        return;
      }

      const amountNum = parseAmount(state.amount);
      const success = transfer({
        amount: amountNum,
        destination: state.destination,
        reason: state.reason || undefined,
      });
      if (!success) {
        const message = "Saldo insuficiente.";
        dispatch({ type: "VERIFY_FAIL", payload: message });
        toast.error(message, {
          description: `Disponible: $${formatAmount(String(balance))}.`,
        });
        return;
      }

      dispatch({ type: "VERIFY_SUCCESS" });
      toast.success(
        `Enviaste $${formatAmount(state.amount)} a ${state.destination}.`,
        { description: "Transferencia confirmada." },
      );
    } catch {
      toast.dismiss(verifyToastId);
      const message = "Ocurrió un error al verificar. Intentalo de nuevo.";
      dispatch({ type: "VERIFY_FAIL", payload: message });
      toast.error(message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Enviar dinero">
      {state.step === "form" && (
        <FormStep
          destination={state.destination}
          amount={state.amount}
          reason={state.reason}
          onChange={(patch) =>
            dispatch({ type: "UPDATE_FORM", payload: patch })
          }
          onSubmit={onFormSubmit}
        />
      )}

      {state.step === "confirm" && (
        <ConfirmStep
          destination={state.destination}
          amount={state.amount}
          reason={state.reason}
          userEmail={user?.email}
          password={state.password}
          isVerifying={state.isVerifying}
          onPasswordChange={(value) =>
            dispatch({ type: "SET_PASSWORD", payload: value })
          }
          onBack={() => dispatch({ type: "BACK_TO_FORM" })}
          onConfirm={onConfirmSubmit}
        />
      )}

      {state.step === "success" && (
        <SuccessStep
          destination={state.destination}
          amount={state.amount}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default TransferModal;
