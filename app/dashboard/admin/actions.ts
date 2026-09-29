"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return { error: "Not logged in" as const };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, username: true },
  });

  if (!user) return { error: "Not authorized" as const };
  if (user.role !== "admin") {
    return { error: "Not authorized" as const };
  }

  return { user };
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `SMKZ-${seg(4)}-${seg(4)}`;
}

export async function createPremiumCode(
  durationDays: number
): Promise<{ success: boolean; code?: string; error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const existing = await prisma.premiumCode.findUnique({ where: { code } });
      if (!existing) break;
      code = generateCode();
    }

    const created = await prisma.premiumCode.create({
      data: {
        code,
        duration: durationDays,
        createdById: auth.user.id,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, code: created.code };
  } catch (err) {
    console.error("createPremiumCode error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function deletePremiumCode(
  codeId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    await prisma.premiumCode.delete({ where: { id: codeId } });
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err) {
    console.error("deletePremiumCode error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function revokePremium(
  codeId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    const code = await prisma.premiumCode.findUnique({
      where: { id: codeId },
      select: { id: true, usedById: true },
    });

    if (!code) return { success: false, error: "Code not found" };
    if (!code.usedById) return { success: false, error: "Code was never used" };

    await prisma.$transaction([
      prisma.user.update({
        where: { id: code.usedById },
        data: {
          isPremium: false,
          premiumUntil: null,
        },
      }),
      prisma.premiumCode.update({
        where: { id: code.id },
        data: {
          usedById: null,
          usedAt: null,
          expiresAt: null,
        },
      }),
    ]);

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err) {
    console.error("revokePremium error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function listPremiumCodes() {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const codes = await prisma.premiumCode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      usedBy: { select: { username: true } },
      createdBy: { select: { username: true } },
    },
  });
  return { codes };
}