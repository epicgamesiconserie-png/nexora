"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { computeEarnedBadges, mergeUnlocked } from "@/lib/checkBadges";

export async function saveAvatarUrl(
  type: "background" | "backgroundVideo" | "audio" | "avatar",
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
    } else if (type === "backgroundVideo") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { backgroundVideoUrl: url, backgroundType: "video" },
        create: {
          userId: session.userId,
          backgroundVideoUrl: url,
          backgroundType: "video",
        },
      });
    } else if (type === "audio") {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { audioUrl: url },
        create: { userId: session.userId, audioUrl: url },
      });
    }

    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
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

export async function removeBackgroundImage(): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };
  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { backgroundUrl: null, backgroundType: "gradient" },
      create: { userId: session.userId },
    });
    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
    return { success: true };
  } catch (err) {
    console.error("removeBackgroundImage error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function removeBackgroundVideo(): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };
  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { backgroundVideoUrl: null, backgroundType: "gradient" },
      create: { userId: session.userId },
    });
    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
    return { success: true };
  } catch (err) {
    console.error("removeBackgroundVideo error:", err);
    return { success: false, error: "Database error" };
  }
}

export async function removeAudio(): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };
  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { audioUrl: null },
      create: { userId: session.userId },
    });
    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
    return { success: true };
  } catch (err) {
    console.error("removeAudio error:", err);
    return { success: false, error: "Database error" };
  }
}

export type CustomizationData = {
  bio: string;
  font: string;
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
  mouseTrail: string;
  welcomeEnabled: boolean;
  welcomeText: string;
};

export async function saveCustomization(
  data: CustomizationData
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    // Welcome screen is premium-only. Strip it if the user isn't premium.
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isPremium: true },
    });
    const isPremium = user?.isPremium === true;

    const welcomeEnabled = isPremium ? !!data.welcomeEnabled : false;
    const welcomeText = isPremium ? (data.welcomeText || null) : null;

    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: {
        bio: data.bio || null,
        font: data.font,
        accentColor: data.accentColor,
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        location: data.location || null,
        profileOpacity: data.profileOpacity,
        blur: data.profileBlur,
        effect: data.usernameEffect,
        monochromeIcons: data.monochromeIcons,
        animatedTitle: data.animatedTitle,
        animatedTitleStyle: data.animatedTitleStyle,
        swapBoxColors: data.swapBoxColors,
        volumeControl: data.volumeControl,
        mouseTrail: data.mouseTrail,
        welcomeEnabled,
        welcomeText,
      },
      create: {
        userId: session.userId,
        bio: data.bio || null,
        font: data.font,
        accentColor: data.accentColor,
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        location: data.location || null,
        profileOpacity: data.profileOpacity,
        blur: data.profileBlur,
        effect: data.usernameEffect,
        monochromeIcons: data.monochromeIcons,
        animatedTitle: data.animatedTitle,
        animatedTitleStyle: data.animatedTitleStyle,
        swapBoxColors: data.swapBoxColors,
        volumeControl: data.volumeControl,
        mouseTrail: data.mouseTrail,
        welcomeEnabled,
        welcomeText,
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

// ============================================================
// BADGE UNLOCK SYNC
// ============================================================

export async function syncUnlockedBadges(): Promise<{
  success: boolean;
  unlocked?: string[];
  error?: string;
}> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        createdAt: true,
        role: true,
        isPremium: true,
        profile: {
          select: {
            avatarUrl: true,
            bio: true,
            backgroundUrl: true,
            audioUrl: true,
            views: true,
            unlockedBadges: true,
          },
        },
        _count: { select: { socials: true, links: true } },
      },
    });

    if (!user) return { success: false, error: "User not found" };

    const earned = computeEarnedBadges({
      avatarUrl: user.profile?.avatarUrl,
      bio: user.profile?.bio,
      backgroundUrl: user.profile?.backgroundUrl,
      audioUrl: user.profile?.audioUrl,
      views: user.profile?.views,
      createdAt: user.createdAt,
      socialsCount: user._count.socials,
      linksCount: user._count.links,
      isAdmin: user.role === "admin",
      isPremium: user.isPremium,
    });

    const stored = user.profile?.unlockedBadges ?? [];
    const merged = mergeUnlocked(stored, earned);

    const changed =
      merged.length !== stored.length ||
      merged.some((id, i) => stored[i] !== id);

    if (changed) {
      await prisma.profile.upsert({
        where: { userId: session.userId },
        update: { unlockedBadges: merged },
        create: { userId: session.userId, unlockedBadges: merged },
      });
      revalidatePath("/dashboard/badges");
      revalidatePath("/dashboard/mypage");
      revalidatePath("/u/[username]", "page");
    }

    return { success: true, unlocked: merged };
  } catch (err) {
    console.error("syncUnlockedBadges error:", err);
    return { success: false, error: "Database error" };
  }
}

// ============================================================
// AVATAR STYLE
// ============================================================

export async function saveAvatarStyle(
  style: "circle" | "full"
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not logged in" };

  if (style !== "circle" && style !== "full") {
    return { success: false, error: "Invalid style" };
  }

  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { avatarStyle: style },
      create: { userId: session.userId, avatarStyle: style },
    });

    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");
    return { success: true };
  } catch (err) {
    console.error("saveAvatarStyle error:", err);
    return { success: false, error: "Database error" };
  }
}