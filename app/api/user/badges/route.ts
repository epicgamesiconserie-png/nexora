import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BADGES } from "@/lib/badges";
import { computeEarnedBadges, mergeUnlocked } from "@/lib/checkBadges";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  let body: { visibleBadges?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { visibleBadges } = body;
  if (!Array.isArray(visibleBadges)) {
    return NextResponse.json(
      { error: "Missing visibleBadges array" },
      { status: 400 }
    );
  }

  // Validate all IDs are real badges
  const validIds = visibleBadges.filter((id) =>
    BADGES.some((b) => b.id === id)
  );

  // Fetch the user data needed to compute / read unlocked badges
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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Compute currently-earned + merge with the persisted unlocks
  const currentlyEarned = computeEarnedBadges({
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
  const unlocked = mergeUnlocked(stored, currentlyEarned);

  // Hidden = unlocked − visible
  const newHidden = unlocked.filter((id) => !validIds.includes(id));

  // Only allow showing badges that have been unlocked
  const finalVisible = unlocked.filter((id) => validIds.includes(id));

  await prisma.profile.upsert({
    where: { userId: session.userId },
    update: {
      badges: finalVisible,
      hiddenBadges: newHidden,
      unlockedBadges: unlocked,
    },
    create: {
      userId: session.userId,
      badges: finalVisible,
      hiddenBadges: newHidden,
      unlockedBadges: unlocked,
    },
  });

  revalidatePath("/dashboard/badges");
  revalidatePath("/dashboard/mypage");
  revalidatePath("/u/[username]", "page");

  return NextResponse.json({
    badges: finalVisible,
    hiddenBadges: newHidden,
    unlockedBadges: unlocked,
  });
}