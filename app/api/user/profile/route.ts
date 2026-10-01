import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isPremium: true,
      premiumUntil: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // flat shape — matches what every dashboard page expects
  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium,
    premiumUntil: user.premiumUntil,
    createdAt: user.createdAt,
  });
}