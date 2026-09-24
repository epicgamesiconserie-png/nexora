import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, validateUsername } from "@/lib/auth";
import { isReserved } from "@/lib/reserved";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    )
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const err = validateUsername(username);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    if (isReserved(username))
      return NextResponse.json({ error: "That username is reserved" }, { status: 400 });

    const emailNorm = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm))
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: "Password must be 8+ characters" }, { status: 400 });

    const usernameNorm = username.toLowerCase();

    const existingUsername = await prisma.user.findUnique({ where: { usernameNorm } });
    if (existingUsername)
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );

    const existingEmail = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existingEmail)
      return NextResponse.json(
        { error: "That email is already registered." },
        { status: 409 }
      );

    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await prisma.user.create({
        data: { username, usernameNorm, email: emailNorm, passwordHash },
        select: { id: true, username: true, email: true },
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        const target = e.meta?.target?.[0];
        if (target === "email")
          return NextResponse.json(
            { error: "That email is already registered." },
            { status: 409 }
          );
        return NextResponse.json(
          { error: "That username is already taken." },
          { status: 409 }
        );
      }
      throw e;
    }

    await createSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}