import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";

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
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    // Skip bots
    if (isBot(userAgent)) {
      return NextResponse.json({ success: false, error: "Bot detected" });
    }

    const cookieStore = await cookies();
    const viewCookieKey = `viewed_${userId}`;
    const alreadyViewed = cookieStore.get(viewCookieKey);

    if (alreadyViewed) {
      return NextResponse.json({ success: true, alreadyViewed: true });
    }

    // Increment view
    await prisma.profile.upsert({
      where: { userId },
      update: { views: { increment: 1 } },
      create: { userId, views: 1 },
    });

    // Set cookie (allowed here because we're in a Route Handler)
    cookieStore.set(viewCookieKey, "1", {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("View count error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}