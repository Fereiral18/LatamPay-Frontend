export type RegisterFormValues = {
  email: string;
  password: string;
};

export type RegisterFormErrors = {
  email?: string;
  password?: string;
};

export type FormSuccessPayload = {
  values: RegisterFormValues;
  data: unknown;
};

export type FormProps = {
  onSuccess?: (payload: FormSuccessPayload) => void;
  submitLabel?: string;
  /** Endpoint al que se hace POST. Si no se pasa, usa /api/auth/register. */
  endpoint?: string;
  /** Nodo extra a renderizar arriba de email/password (ej. input "nombre"). */
  children?: React.ReactNode;
  /** Campos adicionales que se mergean al payload del POST (ej. { name: "Juan"}). */
  extraValues?: Record<string, string>;
  /** Si true, el botón de submit queda deshabilitado (útil cuando los extras son inválidos). */
  disableSubmit?: boolean;
};
