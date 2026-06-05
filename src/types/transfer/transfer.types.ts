export type TransferReason =
  | ""
  | "familia"
  | "servicios"
  | "trabajo"
  | "compras"
  | "ahorro"
  | "otro";

export const transferReasons: {
  value: Exclude<TransferReason, "">;
  label: string;
}[] = [
  { value: "familia", label: "Familia" },
  { value: "servicios", label: "Pago de servicios" },
  { value: "trabajo", label: "Trabajo / honorarios" },
  { value: "compras", label: "Compras" },
  { value: "ahorro", label: "Ahorro / inversión" },
  { value: "otro", label: "Otro" },
];

export type TransferFormFields = {
  destination: string;
  amount: string;
  reason: TransferReason;
};

export type TransferStep = "form" | "confirm" | "success";

export type TransferState = TransferFormFields & {
  step: TransferStep;
  password: string;
  showPassword: boolean;
  isVerifying: boolean;
  error: string | null;
};

export type TransferAction =
  | { type: "RESET" }
  | { type: "UPDATE_FORM"; payload: Partial<TransferFormFields> }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "GO_TO_CONFIRM" }
  | { type: "BACK_TO_FORM" }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "TOGGLE_PASSWORD_VISIBILITY" }
  | { type: "VERIFY_START" }
  | { type: "VERIFY_FAIL"; payload: string }
  | { type: "VERIFY_SUCCESS" };
