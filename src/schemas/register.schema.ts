import { z } from "zod";

const allowedTlds = [
  "com",
  "net",
  "org",
  "io",
  "dev",
  "com.ar",
  "ar",
  "app",
];

const disposableDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
];

const emailRegex =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

export const registerSchema = z.object({
  name: z
   .string()
  .trim()
  .min(2, "El nombre es muy corto")
  .max(50, "El nombre es muy largo")
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: "El nombre solo puede contener letras",
  })
  .refine((value) => !/\s{2,}/.test(value), {
    message: "No puede tener espacios dobles",
  })
  .refine((value) => value === value.trim(), {
    message: "El nombre no puede empezar o terminar con espacio",
  }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "El email es demasiado largo.")
    .email("Ingresá un email válido.")
    .refine((email) => emailRegex.test(email), {
      message: "Formato de email inválido.",
    })
    .refine((email) => {
      const [, domain] = email.split("@");
      if (!domain) return false;

      if (domain.includes("..")) return false;
      if (!/^[a-z0-9.-]+$/.test(domain)) return false;

      const parts = domain.split(".");
      if (parts.length < 2) return false;

      const tld = parts[parts.length - 1];
      return allowedTlds.includes(tld);
    }, "Dominio inválido o no permitido.")
    .refine((email) => {
      const domain = email.split("@")[1];
      if (!domain) return false;

      return !disposableDomains.includes(domain);
    }, "No se permiten emails temporales.")
    .refine((email) => {
      const [local] = email.split("@");

      if (!local || local.length < 3) return false;
      if (local.includes("..")) return false;
      if (local.startsWith(".") || local.endsWith(".")) return false;

      return true;
    }, "Email inválido."),

 password: z
  .string()
  .min(6, "Mínimo 6 caracteres")
  .max(100, "Máximo 100 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial")
  .refine((value) => !/\s/.test(value), {
    message: "La contraseña no puede contener espacios",
  }),
  confirmPassword: z.string().min(1, "Confirmá la contraseña"),
})
.refine((data) => data.password === data.confirmPassword, {
message: "Las contraseñas no coinciden",
path: ["confirmPassword"],
});