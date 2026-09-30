"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/* ─── Auth helper ──────────────────────────────────────────── */
async function requireAdmin() {
  const session = await getSession();
  if (!session) return { ok: false as const, error: "Not logged in" };
  const me = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, username: true },
  });
  if (!me || me.role !== "admin") {
    return { ok: false as const, error: "Admin only" };
  }
  return { ok: true as const, me };
}

/* ─── Premium codes ────────────────────────────────────────── */

export async function listPremiumCodes(): Promise<
  | { codes: Array<{
      id: string;
      code: string;
      duration: number;
      createdAt: string;
      usedAt: string | null;
      usedBy: { username: string } | null;
      createdBy: { username: string } | null;
    }> }
  | { error: string }
> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const codes = await prisma.premiumCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      usedBy: { select: { username: true } },
      createdBy: { select: { username: true } },
    },
  });

  return {
    codes: codes.map((c) => ({
      id: c.id,
      code: c.code,
      duration: c.duration,
      createdAt: c.createdAt.toISOString(),
      usedAt: c.usedAt ? c.usedAt.toISOString() : null,
      usedBy: c.usedBy ? { username: c.usedBy.username } : null,
      createdBy: c.createdBy ? { username: c.createdBy.username } : null,
    })),
  };
}

export async function createPremiumCode(duration: number): Promise<{
  success: boolean;
  code?: string;
  error?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const days = Math.max(1, Math.min(3650, Math.floor(duration || 30)));

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chunk = (n: number) =>
    Array.from({ length: n })
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
      .join("");
  const code = `SMKZ-${chunk(4)}-${chunk(4)}`;

  try {
    await prisma.premiumCode.create({
      data: {
        code,
        duration: days,
        createdById: auth.me.id,
      },
    });
    revalidatePath("/dashboard/admin");
    return { success: true, code };
  } catch (err) {
    console.error("createPremiumCode failed:", err);
    return { success: false, error: "Failed to create code" };
  }
}

export async function deletePremiumCode(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    await prisma.premiumCode.delete({ where: { id } });
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err) {
    console.error("deletePremiumCode failed:", err);
    return { success: false, error: "Failed to delete code" };
  }
}

export async function revokePremium(codeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const code = await prisma.premiumCode.findUnique({
      where: { id: codeId },
      select: { usedById: true },
    });
    if (!code || !code.usedById) {
      return { success: false, error: "No user on this code" };
    }

    await prisma.user.update({
      where: { id: code.usedById },
      data: { isPremium: false, premiumUntil: null },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err) {
    console.error("revokePremium failed:", err);
    return { success: false, error: "Failed to revoke premium" };
  }
}

/* ─── Badges ───────────────────────────────────────────────── */

export async function grantBadgeToUser(
  username: string,
  badgeId: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const user = await prisma.user.findUnique({
      where: { usernameNorm: username.trim().toLowerCase() },
      select: {
        id: true,
        profile: {
          select: { id: true, badges: true, unlockedBadges: true },
        },
      },
    });
    if (!user) return { success: false, error: "No user with that username" };
    if (!user.profile) return { success: false, error: "User has no profile" };

    const currentBadges = user.profile.badges ?? [];
    const currentUnlocked = user.profile.unlockedBadges ?? [];

    if (currentBadges.includes(badgeId) && currentUnlocked.includes(badgeId)) {
      return { success: false, error: "User already has this badge" };
    }

    // Write to BOTH lists:
    // - `badges` is what shows on the public profile
    // - `unlockedBadges` is what the /dashboard/badges page reads to
    //   determine whether the badge is "earned"
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        badges: currentBadges.includes(badgeId)
          ? currentBadges
          : [...currentBadges, badgeId],
        unlockedBadges: currentUnlocked.includes(badgeId)
          ? currentUnlocked
          : [...currentUnlocked, badgeId],
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/badges");
    revalidatePath("/u/" + user.id);
    return { success: true };
  } catch (err) {
    console.error("grantBadgeToUser failed:", err);
    return { success: false, error: "Failed to grant badge" };
  }
}

/* ─── Delete user ──────────────────────────────────────────── */

export async function deleteUserAccount(username: string): Promise<{
  success: boolean;
  error?: string;
  deletedUsername?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const target = await prisma.user.findUnique({
    where: { usernameNorm: username.trim().toLowerCase() },
    select: { id: true, username: true },
  });
  if (!target) {
    return { success: false, error: "No user with that username" };
  }

  if (target.id === auth.me.id) {
    return { success: false, error: "You cannot delete your own account" };
  }

  try {
    await prisma.analytics.deleteMany({ where: { userId: target.id } });
    await prisma.user.delete({ where: { id: target.id } });

    revalidatePath("/dashboard/admin");
    revalidatePath("/leaderboard");

    return { success: true, deletedUsername: target.username };
  } catch (err) {
    console.error("deleteUserAccount failed:", err);
    return { success: false, error: "Database error while deleting user" };
  }
}