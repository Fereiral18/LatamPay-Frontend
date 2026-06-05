import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type {
  FormProps,
  RegisterFormErrors,
  RegisterFormValues,
} from "../../types/formLogin_register.types";

export function Form({
  onSubmit,
  schema,
  submitLabel = "Enviar",
  children,
  disableSubmit = false,
}: FormProps) {
  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<
    Record<keyof RegisterFormValues, boolean>
  >({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //  VALIDACIÓN
  const runValidation = (next: RegisterFormValues): RegisterFormErrors => {
    const result = schema.safeParse(next);

    if (result.success) return {};

    const formErrors: RegisterFormErrors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof RegisterFormErrors;
      formErrors[field] = issue.message;
    });

    //  VALIDACIÓN EXTRA: PASSWORD MATCH
    if (
      next.password &&
      next.confirmPassword &&
      next.password !== next.confirmPassword
    ) {
      formErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return formErrors;
  };

  const handleChange =
    (field: keyof RegisterFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = {
        ...values,
        [field]: event.target.value,
      };

      setValues(next);

    setErrors(runValidation(next));
    };

  const handleBlur = (field: keyof RegisterFormValues) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setErrors(runValidation(values));
  };

  async function handleSubmit() {
    setServerError(null);

    const nextErrors = runValidation(values);

    setErrors(nextErrors);

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.values(nextErrors).some(Boolean)) return;

    // 🔥 guard extra de seguridad
    if (values.password !== values.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit(values);

      setValues({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTouched({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
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

      {/* EMAIL */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-slate-300">
          Email
        </label>

        <input
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          disabled={isSubmitting}
          className={inputClass}
        />

        {errors.email && touched.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-slate-300">
          Contraseña
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ingresá tu contraseña"
            value={values.password}
            onChange={handleChange("password")}
            onBlur={handleBlur("password")}
            disabled={isSubmitting}
            className={`${inputClass} pr-12`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && touched.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-slate-300">
          Confirmar contraseña
        </label>

        <input
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Repetí tu contraseña"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          disabled={isSubmitting}
          className={inputClass}
        />

        {errors.confirmPassword && touched.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* SERVER ERROR */}
      {serverError && (
        <p className="mt-3 text-sm text-red-400">{serverError}</p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting || disableSubmit}
        className="mt-6 w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Procesando..." : submitLabel}
      </button>
    </form>
  );
}

export default Form;