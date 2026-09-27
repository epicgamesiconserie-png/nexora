import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: {
      bio: true,
      accentColor: true,
      textColor: true,
      backgroundColor: true,
      location: true,
      profileOpacity: true,
      blur: true,
      backgroundType: true,
      effect: true,
      monochromeIcons: true,
      animatedTitle: true,
      swapBoxColors: true,
      volumeControl: true,
    },
  });

  return NextResponse.json({ profile });
}