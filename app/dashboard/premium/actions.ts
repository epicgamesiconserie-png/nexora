"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function redeemPremiumCode(
  rawCode: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  if (!session) return { success: false, message: "Not logged in" };

  const code = rawCode.trim().toUpperCase();
  if (!code) return { success: false, message: "Enter a code" };

  try {
    const found = await prisma.premiumCode.findUnique({
      where: { code },
    });

    if (!found) {
      return { success: false, message: "Invalid code" };
    }
    if (found.usedById) {
      return { success: false, message: "This code has already been used" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { premiumUntil: true },
    });
    const now = new Date();
    const base = user?.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now;
    const newExpiry = new Date(base);
    newExpiry.setDate(newExpiry.getDate() + found.duration);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.userId },
        data: {
          isPremium: true,
          premiumUntil: newExpiry,
        },
      }),
      prisma.premiumCode.update({
        where: { id: found.id },
        data: {
          usedById: session.userId,
          usedAt: now,
          expiresAt: newExpiry,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/premium");
    return { success: true, message: `Premium activated for ${found.duration} days!` };
  } catch (err) {
    console.error("redeemPremiumCode error:", err);
    return { success: false, message: "Something went wrong" };
  }
}