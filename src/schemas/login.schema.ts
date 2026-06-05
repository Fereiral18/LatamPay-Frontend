import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Ingresá un email válido."),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria.")
    .max(72, "La contraseña es demasiado larga."),
});
export type LoginFormData = z.infer<typeof loginSchema>;