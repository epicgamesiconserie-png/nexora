import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (typeof token !== "string" || typeof password !== "string")
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json(
        { error: "Password must be 8+ characters" },
        { status: 400 }
      );

    const reset = await prisma.passwordReset.findUnique({ where: { token } });
    if (!reset)
      return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
    if (reset.usedAt)
      return NextResponse.json({ error: "Reset link already used" }, { status: 400 });
    if (reset.expiresAt < new Date())
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ reset: true });
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}