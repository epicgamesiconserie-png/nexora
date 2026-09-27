import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      profile: {
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
          animatedTitleStyle: true,
          swapBoxColors: true,
          volumeControl: true,
          badges: true,
        },
      },
    },
  });

  return NextResponse.json({
    username: user?.username,
    profile: user?.profile,
  });
}