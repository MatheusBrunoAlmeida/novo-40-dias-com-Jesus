import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  phone: z.string().optional(),
  city: z.string().min(1, {
    message: "Cidade é obrigatória",
  }),
  state: z.string().min(1, {
    message: "Estado é obrigatório",
  }),
  region: z.string().optional(),
  country: z.string().min(1, {
    message: "País é obrigatório",
  }),
  structure: z.string().min(1, {
    message: "Estrutura é obrigatória",
  }),
  otherStructure: z.string().optional(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email é obrigatório",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres",
  }),
});
