import { useState } from "react";
import type { FormProps, RegisterFormErrors, RegisterFormValues } from "../../types/formLogin_register.types";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_REGISTER_ENDPOINT = `${import.meta.env.VITE_API_URL ?? ""}/api/auth/register`;

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "El email es obligatorio.";
  if (trimmed.length > 254) return "El email es demasiado largo.";
  if (!EMAIL_REGEX.test(trimmed)) return "Ingresá un email válido.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "La contraseña es obligatoria.";
  if (value.length < 8) return "Debe tener al menos 8 caracteres.";
  if (value.length > 72) return "No puede superar los 72 caracteres.";
  if (!/[A-Z]/.test(value)) return "Debe incluir al menos una letra mayúscula.";
  if (!/[a-z]/.test(value)) return "Debe incluir al menos una letra minúscula.";
  if (!/[0-9]/.test(value)) return "Debe incluir al menos un número.";
  return undefined;
}

export function Form({
  onSuccess,
  submitLabel = "Crear cuenta",
  endpoint = DEFAULT_REGISTER_ENDPOINT,
  children,
  extraValues,
  disableSubmit = false,
}: FormProps) {
  const [values, setValues] = useState<RegisterFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof RegisterFormValues, boolean>>({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const runValidation = (next: RegisterFormValues): RegisterFormErrors => ({
    email: validateEmail(next.email),
    password: validatePassword(next.password),
  });

  const handleChange =
    (field: keyof RegisterFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (touched[field]) {
        setErrors(runValidation(next));
      }
    };

  const handleBlur = (field: keyof RegisterFormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(runValidation(values));
  };

  async function handleSubmit() {
    setServerError(null);

    const nextErrors = runValidation(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.values(nextErrors).some(Boolean)) return;

    const payload: RegisterFormValues = {
      email: values.email.trim(),
      password: values.password,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...extraValues, ...payload }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data === "object" && "message" in data && typeof (data as { message: unknown }).message === "string"
            ? (data as { message: string }).message
            : null) ?? "No pudimos crear la cuenta. Intentá de nuevo.";
        setServerError(message);
        return;
      }

      setValues({ email: "", password: "" });
      setTouched({ email: false, password: false });
      onSuccess?.({ values: payload, data });
    } catch {
      setServerError("Error de red. Verificá tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-xl transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      {children}

      <div className="mt-4">
        <label htmlFor="register-email" className="mb-1.5 block text-sm text-slate-300">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          aria-invalid={Boolean(errors.email && touched.email)}
          aria-describedby={errors.email && touched.email ? "register-email-error" : undefined}
          disabled={isSubmitting}
          required
          className={inputClass}
        />
        {errors.email && touched.email && (
          <p id="register-email-error" role="alert" className="mt-1 text-xs text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="register-password" className="mb-1.5 block text-sm text-slate-300">
          Contraseña
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={values.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          aria-invalid={Boolean(errors.password && touched.password)}
          aria-describedby={errors.password && touched.password ? "register-password-error" : undefined}
          disabled={isSubmitting}
          required
          className={inputClass}
        />
        {errors.password && touched.password && (
          <p id="register-password-error" role="alert" className="mt-1 text-xs text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      {serverError && (
        <p id="register-server-error" role="alert" className="mt-3 text-sm text-red-400">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || disableSubmit}
        className="mt-6 w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
    </form>
  );
}

export default Form;
