import type { ZodType } from "zod";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type RegisterFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type FormSuccessPayload = {
  values: RegisterFormValues;
  data: unknown;
};


export type FormProps = {
  schema: ZodType<any>;
  submitLabel?: string;
  onSubmit: (
    values: RegisterFormValues
  ) => Promise<void>;
  children?: React.ReactNode;
  disableSubmit?: boolean;
};

