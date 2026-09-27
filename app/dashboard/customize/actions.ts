"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveAvatarUrl(
  type: "background" | "audio" | "avatar" | "cursor",
  url: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    if (type === "avatar") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { avatarUrl: url },
        create: { userId: session.userId, avatarUrl: url },
      });
    } else if (type === "background") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { backgroundUrl: url, backgroundType: "image" },
        create: {
          userId: session.userId,
          backgroundUrl: url,
          backgroundType: "image",
        },
      });
    } else if (type === "audio") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { audioUrl: url },
        create: { userId: session.userId, audioUrl: url },
      });
    } else if (type === "cursor") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { cursorUrl: url },
        create: { userId: session.userId, cursorUrl: url },
      });
    }
    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    return { success: true };
  } catch (err) {
    console.error("saveAvatarUrl error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function removeAvatar(): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { avatarUrl: null },
      create: { userId: session.userId },
    });
    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
    return { success: true };
  } catch (err) {
    console.error("removeAvatar error:", err);
    return { success: false, error: "Database error" };
  }
}

export type CustomizationData = {
  bio: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  location: string;
  profileOpacity: number;
  profileBlur: number;
  backgroundEffect: string;
  usernameEffect: string;
  monochromeIcons: boolean;
  animatedTitle: boolean;
  animatedTitleStyle: string;
  swapBoxColors: boolean;
  volumeControl: boolean;
};

export async function saveCustomization(
  data: CustomizationData
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: {
        bio: data.bio || null,
        accentColor: data.accentColor,
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        location: data.location || null,
        profileOpacity: data.profileOpacity,
        blur: data.profileBlur,
        backgroundType: data.backgroundEffect,
        effect: data.usernameEffect,
        monochromeIcons: data.monochromeIcons,
        animatedTitle: data.animatedTitle,
        animatedTitleStyle: data.animatedTitleStyle,
        swapBoxColors: data.swapBoxColors,
        volumeControl: data.volumeControl,
      },
      create: {
        userId: session.userId,
        bio: data.bio || null,
        accentColor: data.accentColor,
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        location: data.location || null,
        profileOpacity: data.profileOpacity,
        blur: data.profileBlur,
        backgroundType: data.backgroundEffect,
        effect: data.usernameEffect,
        monochromeIcons: data.monochromeIcons,
        animatedTitle: data.animatedTitle,
        animatedTitleStyle: data.animatedTitleStyle,
        swapBoxColors: data.swapBoxColors,
        volumeControl: data.volumeControl,
      },
    });

    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");

    return { success: true };
  } catch (err) {
    console.error("saveCustomization error:", err);
    return { success: false, error: "Database error" };
  }
}

// ============================================================
// BADGES
// ============================================================

export async function claimBadge(
  badgeId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: { badges: true },
    });

    const current = profile?.badges || [];
    if (current.includes(badgeId)) {
      return { success: false, error: "Already claimed" };
    }

    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { badges: [...current, badgeId] },
      create: { userId: session.userId, badges: [badgeId] },
    });

    revalidatePath("/dashboard/badges");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");

    return { success: true };
  } catch (err) {
    console.error("claimBadge error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function unclaimBadge(
  badgeId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: { badges: true },
    });

    const current = profile?.badges || [];
    const updated = current.filter((b) => b !== badgeId);

    await prisma.profile.update({
      where: { userId: session.userId },
      data: { badges: updated },
    });

    revalidatePath("/dashboard/badges");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");

    return { success: true };
  } catch (err) {
    console.error("unclaimBadge error:", err);
    return { success: false, error: "Database error" };
  }
}