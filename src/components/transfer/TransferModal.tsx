import { useEffect, useReducer } from "react";
import type { FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";
import {
  initialTransferState,
  transferReducer,
} from "../../services/transfer/reducer";
import {
  validateDraft,
  validatePassword,
} from "../../services/transfer/validation";
import { FormStep } from "./steps/FormStep";
import { ConfirmStep } from "./steps/ConfirmStep";
import { SuccessStep } from "./steps/SuccessStep";

export type TransferModalProps = {
  open: boolean;
  onClose: () => void;
};

export const TransferModal = ({ open, onClose }: TransferModalProps) => {
  const { user, verifyPassword } = useAuth();
  const [state, dispatch] = useReducer(transferReducer, initialTransferState);

  // Reset al abrir
  useEffect(() => {
    if (open) dispatch({ type: "RESET" });
  }, [open]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateDraft({
      destination: state.destination,
      amount: state.amount,
      reason: state.reason,
    });
    if (!result.ok) {
      dispatch({ type: "SET_ERROR", payload: result.error });
      return;
    }
    dispatch({ type: "GO_TO_CONFIRM" });
  };

  const onConfirmSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validatePassword(state.password);
    if (!result.ok) {
      dispatch({ type: "SET_ERROR", payload: result.error });
      return;
    }

    dispatch({ type: "VERIFY_START" });
    const ok = await verifyPassword(state.password);
    if (!ok) {
      dispatch({
        type: "VERIFY_FAIL",
        payload: "La contraseña no coincide con la de tu cuenta.",
      });
      return;
    }
    dispatch({ type: "VERIFY_SUCCESS" });
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Enviar dinero">
      {state.step === "form" && (
        <FormStep
          destination={state.destination}
          amount={state.amount}
          reason={state.reason}
          error={state.error}
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
          showPassword={state.showPassword}
          isVerifying={state.isVerifying}
          error={state.error}
          onPasswordChange={(value) =>
            dispatch({ type: "SET_PASSWORD", payload: value })
          }
          onToggleShowPassword={() =>
            dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })
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
