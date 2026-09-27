import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, validateUsername } from "@/lib/auth";
import { normalizeUsername } from "@/lib/utils";

// === SIMPLE IN-MEMORY RATE LIMITER ===
// Resets when the server restarts. For production-scale, swap for Redis/Upstash.
const signupAttempts = new Map<string, { count: number; firstAttempt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SIGNUPS_PER_IP = 3;                 // max 3 signups per hour per IP

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = signupAttempts.get(ip);
  if (!record) return false;
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    signupAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_SIGNUPS_PER_IP;
}

function recordSignupAttempt(ip: string) {
  const now = Date.now();
  const record = signupAttempts.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    signupAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

export async function POST(request: Request) {
  const ip = getClientIP(request);

  // === RATE LIMIT CHECK ===
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many accounts created from this IP. Try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing username, email, or password" },
        { status: 400 }
      );
    }

    // Username validation
    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const usernameNorm = normalizeUsername(username);
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ usernameNorm }, { email: normalizedEmail }],
      },
      select: { usernameNorm: true, email: true },
    });

    if (existing) {
      if (existing.usernameNorm === usernameNorm) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        usernameNorm,
        email: normalizedEmail,
        passwordHash,
        profile: {
          create: {}, // create empty profile row
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    // Record this signup attempt for rate limiting
    recordSignupAttempt(ip);

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}