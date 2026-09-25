import { prisma } from "@/lib/prisma";
import { validateUsername } from "@/lib/auth";
import { isReserved } from "@/lib/reserved";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("u") || "").trim();

  // Empty input
  if (username.length === 0) {
    return NextResponse.json({
      success: true,
      data: { available: false, reason: "Enter a username" },
    });
  }

  // Format check — no minimum length, just format
  const err = validateUsername(username);
  if (err) {
    return NextResponse.json({
      success: true,
      data: { available: false, reason: err },
    });
  }

  // Reserved words
  if (isReserved(username)) {
    return NextResponse.json({
      success: true,
      data: { available: false, reason: "This username is reserved" },
    });
  }

  // Actual database lookup — the ONLY thing that decides "taken"
  const existing = await prisma.user.findUnique({
    where: { usernameNorm: username.toLowerCase() },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({
      success: true,
      data: { available: false, reason: "That username is already taken." },
    });
  }

  return NextResponse.json({
    success: true,
    data: { available: true, reason: null },
  });
}