import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Accept identifier OR username OR email — whatever the frontend sends
    const identifier = (
      body?.identifier ||
      body?.username ||
      body?.email ||
      ""
    ).toString().trim();

    const password = body?.password;

    if (!identifier || typeof password !== "string") {
      console.log("Login failed: bad input", { identifier, hasPassword: !!password });
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const id = identifier.toLowerCase();

    // Find by username OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ usernameNorm: id }, { email: id }],
      },
    });

    if (!user) {
      console.log("Login failed: user not found for", id);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      console.log("Login failed: wrong password for", id);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}