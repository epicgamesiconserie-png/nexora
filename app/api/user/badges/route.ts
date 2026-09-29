import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BADGES } from "@/lib/badges";
import { computeEarnedBadges } from "@/lib/checkBadges";

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
    return NextResponse.json({ error: "Missing visibleBadges array" }, { status: 400 });
  }

  // Validate all IDs are real badges
  const validIds = visibleBadges.filter((id) =>
    BADGES.some((b) => b.id === id)
  );

  // Compute what the user actually earned
  const earned = await computeEarnedBadges(session.userId);

  // Hidden = earned − visible
  const newHidden = earned.filter((id) => !validIds.includes(id));

  // Only allow showing badges that were earned
  const finalVisible = earned.filter((id) => validIds.includes(id));

  await prisma.profile.upsert({
    where: { userId: session.userId },
    update: { badges: finalVisible, hiddenBadges: newHidden },
    create: {
      userId: session.userId,
      badges: finalVisible,
      hiddenBadges: newHidden,
    },
  });

  revalidatePath("/dashboard/badges");
  revalidatePath("/dashboard/mypage");
  revalidatePath("/u/[username]", "page");

  return NextResponse.json({
    badges: finalVisible,
    hiddenBadges: newHidden,
  });
}