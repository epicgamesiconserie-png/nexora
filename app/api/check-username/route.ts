import { prisma } from "@/lib/prisma";
import { validateUsername } from "@/lib/auth";
import { isReserved } from "@/lib/reserved";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("u") || "";

  const err = validateUsername(username);
  if (err) return NextResponse.json({ available: false, reason: err });
  if (isReserved(username))
    return NextResponse.json({ available: false, reason: "Reserved" });

  const exists = await prisma.user.findUnique({
    where: { usernameNorm: username.toLowerCase() },
  });
  return NextResponse.json({
    available: !exists,
    reason: exists ? "That username is already taken." : null,
  });
}