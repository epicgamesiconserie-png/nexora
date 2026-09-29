import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { backgroundUrl: null, backgroundType: "gradient" },
      create: { userId: session.userId },
    });

    revalidatePath("/dashboard/customize");
    revalidatePath("/dashboard/mypage");
    revalidatePath("/u/[username]", "page");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("removeBackground error:", err);
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
}