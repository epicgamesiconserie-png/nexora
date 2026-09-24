import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (typeof username !== "string" || typeof password !== "string")
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { usernameNorm: username.toLowerCase() },
    });

    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, username: user.username } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}