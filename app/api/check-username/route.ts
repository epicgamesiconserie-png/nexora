import { prisma } from "@/lib/prisma";
import { validateUsername } from "@/lib/auth";
import { isReserved } from "@/lib/reserved";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = (searchParams.get("u") || "").trim();

    // Empty input
    if (username.length === 0) {
      return NextResponse.json({
        success: true,
        data: { available: false, reason: "Enter a username" },
      });
    }

    // Format check
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

    // The ONLY database check that decides "taken"
    const existing = await prisma.user.findUnique({
      where: { usernameNorm: username.toLowerCase() },
      select: { id: true },
    });

    if (existing) {
      console.log("check-username: TAKEN →", username);
      return NextResponse.json({
        success: true,
        data: { available: false, reason: "That username is already taken." },
      });
    }

    console.log("check-username: AVAILABLE →", username);
    return NextResponse.json({
      success: true,
      data: { available: true, reason: null },
    });
  } catch (e) {
    console.error("check-username error:", e);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}