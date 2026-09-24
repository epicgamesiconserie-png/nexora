import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (typeof email !== "string" || !email.includes("@"))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });

    if (!user) return NextResponse.json({ sent: true });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    console.log("\n=== PASSWORD RESET LINK ===");
    console.log(`For: ${user.email}`);
    console.log(`Link: ${resetUrl}`);
    console.log("===========================\n");

    return NextResponse.json({
      sent: true,
      devUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}