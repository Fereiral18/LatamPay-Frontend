import type {
  TransferAction,
  TransferState,
} from "../../types/transfer/transfer.types";

export const initialTransferState: TransferState = {
  step: "form",
  destination: "",
  amount: "",
  currency: "ARS",
  reason: "",
  password: "",
  showPassword: false,
  isVerifying: false,
  error: null,
};

export function transferReducer(
  state: TransferState,
  action: TransferAction,
): TransferState {
  switch (action.type) {
    case "RESET":
      return initialTransferState;

    case "UPDATE_FORM":
      return { ...state, ...action.payload, error: null };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "GO_TO_CONFIRM":
      return {
        ...state,
        step: "confirm",
        password: "",
        showPassword: false,
        error: null,
      };

    case "BACK_TO_FORM":
      return { ...state, step: "form", error: null };

    case "SET_PASSWORD":
      return { ...state, password: action.payload, error: null };

    case "TOGGLE_PASSWORD_VISIBILITY":
      return { ...state, showPassword: !state.showPassword };

    case "VERIFY_START":
      return { ...state, isVerifying: true, error: null };

    case "VERIFY_FAIL":
      return { ...state, isVerifying: false, error: action.payload };

    case "VERIFY_SUCCESS":
      return { ...state, isVerifying: false, step: "success", error: null };

    default:
      return state;
  }
}
