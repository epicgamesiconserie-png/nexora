import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { rateLimit, getIp } from "@/lib/rateLimit";

const BOT_UA_KEYWORDS = [
  "bot", "crawler", "spider", "scraper", "curl", "wget", "python",
  "axios", "node-fetch", "facebookexternalhit", "twitterbot", "slackbot",
  "discordbot", "telegrambot", "whatsapp", "linkedinbot", "embedly",
  "quora link preview", "pinterest", "vkshare", "w3c_validator",
  "redditbot", "applebot", "googlebot", "bingbot", "yandexbot",
  "duckduckbot", "baiduspider",
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return BOT_UA_KEYWORDS.some((keyword) => ua.includes(keyword));
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request);

    // --- Rate limit: 10/min, 200/day per IP ---
    const minAllowed = rateLimit(`view:min:${ip}`, 10, 60_000);
    const dayAllowed = minAllowed
      ? rateLimit(`view:day:${ip}`, 200, 60 * 60 * 24 * 1000)
      : true;

    if (!minAllowed || !dayAllowed) {
      // Best-effort log so you can spot abuse in Prisma Studio later.
      // Silently ignore if the DB write fails — we don't want a broken
      // rate limit to break the endpoint.
      try {
        const body = await request.clone().json().catch(() => null);
        const logUserId = body?.userId;
        if (typeof logUserId === "string" && logUserId.length <= 64) {
          await prisma.analytics.create({
            data: { userId: logUserId, type: "rate_limited" },
          });
        }
      } catch {
        // ignore
      }

      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    // --- Parse + validate body ---
    const body = await request.json().catch(() => null);
    const userId = body?.userId;

    if (!userId || typeof userId !== "string" || userId.length > 64) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    if (isBot(userAgent)) {
      return NextResponse.json({ success: false, error: "Bot detected" });
    }

    // --- Cookie dedupe ---
    const cookieStore = await cookies();
    const viewCookieKey = `viewed_${userId}`;
    const alreadyViewed = cookieStore.get(viewCookieKey);

    if (alreadyViewed) {
      return NextResponse.json({ success: true, alreadyViewed: true });
    }

    // --- Increment view ---
    await prisma.profile.upsert({
      where: { userId },
      update: { views: { increment: 1 } },
      create: { userId, views: 1 },
    });

    cookieStore.set(viewCookieKey, "1", {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("View count error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}