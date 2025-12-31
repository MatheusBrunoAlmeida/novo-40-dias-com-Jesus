"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const { email, password, name, phone, city, state, region, country, structure, otherStructure } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email já está em uso!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      state,
      region,
      role: "USER",
      country,
      structure,
      otherStructure,
    },
  });

  return { success: "Conta criada com sucesso!" };
};
