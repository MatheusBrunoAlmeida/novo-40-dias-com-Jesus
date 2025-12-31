"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const toggleReading = async (dayNumber: number) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    const existingProgress = await db.readingProgress.findUnique({
      where: {
        userId_dayNumber: {
          userId: session.user.id,
          dayNumber,
        },
      },
    });

    if (existingProgress) {
      // Toggle
      await db.readingProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          isCompleted: !existingProgress.isCompleted,
          completedAt: !existingProgress.isCompleted ? new Date() : null,
        },
      });
    } else {
      // Create
      await db.readingProgress.create({
        data: {
          userId: session.user.id,
          dayNumber,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: "Progresso atualizado" };
  } catch (error) {
    return { error: "Erro ao atualizar progresso" };
  }
};
