import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Music2, Eye } from "lucide-react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import {
  FaYoutube, FaTwitch, FaTiktok, FaDiscord, FaFacebook, FaSpotify,
  FaInstagram, FaXTwitter, FaTelegram, FaPaypal, FaSteam, FaBitcoin,
} from "react-icons/fa6";
import { FaXbox } from "react-icons/fa";
import {
  SiRoblox, SiGithub, SiCashapp, SiVenmo, SiPlaystation,
  SiOnlyfans, SiKick, SiLitecoin, SiSolana, SiApplemusic,
} from "react-icons/si";

const PLATFORMS: Record<
  string,
  {
    name: string;
    color: string;
    Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }
> = {
  youtube:     { name: "YouTube",     color: "#FF0000", Icon: FaYoutube },
  twitch:      { name: "Twitch",      color: "#9146FF", Icon: FaTwitch },
  tiktok:      { name: "TikTok",      color: "#FFFFFF", Icon: FaTiktok },
  discord:     { name: "Discord",     color: "#5865F2", Icon: FaDiscord },
  facebook:    { name: "Facebook",    color: "#1877F2", Icon: FaFacebook },
  spotify:     { name: "Spotify",     color: "#1DB954", Icon: FaSpotify },
  instagram:   { name: "Instagram",   color: "#E4405F", Icon: FaInstagram },
  x:           { name: "X",           color: "#FFFFFF", Icon: FaXTwitter },
  telegram:    { name: "Telegram",    color: "#26A5E4", Icon: FaTelegram },
  paypal:      { name: "PayPal",      color: "#00457C", Icon: FaPaypal },
  roblox:      { name: "Roblox",      color: "#FFFFFF", Icon: SiRoblox },
  github:      { name: "GitHub",      color: "#FFFFFF", Icon: SiGithub },
  cashapp:     { name: "CashApp",     color: "#00D632", Icon: SiCashapp },
  venmo:       { name: "Venmo",       color: "#3D95CE", Icon: SiVenmo },
  playstation: { name: "PlayStation", color: "#003791", Icon: SiPlaystation },
  xbox:        { name: "Xbox",        color: "#107C10", Icon: FaXbox },
  applemusic:  { name: "Apple Music", color: "#FA243C", Icon: SiApplemusic },
  onlyfans:    { name: "OnlyFans",    color: "#00AFF0", Icon: SiOnlyfans },
  steam:       { name: "Steam",       color: "#FFFFFF", Icon: FaSteam },
  kick:        { name: "Kick",        color: "#53FC18", Icon: SiKick },
  bitcoin:     { name: "Bitcoin",     color: "#F7931A", Icon: FaBitcoin },
  ltc:         { name: "Litecoin",    color: "#345D9D", Icon: SiLitecoin },
  solana:      { name: "Solana",      color: "#9945FF", Icon: SiSolana },
};

// --- BOT DETECTION ---
// Common bots/crawlers that shouldn't count as a "view"
const BOT_UA_KEYWORDS = [
  "bot",
  "crawler",
  "spider",
  "scraper",
  "curl",
  "wget",
  "python",
  "axios",
  "node-fetch",
  "facebookexternalhit",
  "twitterbot",
  "slackbot",
  "discordbot",
  "telegrambot",
  "whatsapp",
  "linkedinbot",
  "embedly",
  "quora link preview",
  "pinterest",
  "vkshare",
  "w3c_validator",
  "redditbot",
  "applebot",
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "baiduspider",
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // No UA = suspicious, skip
  const ua = userAgent.toLowerCase();
  return BOT_UA_KEYWORDS.some((keyword) => ua.includes(keyword));
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { usernameNorm: normalizeUsername(params.username) },
    select: {
      username: true,
      profile: { select: { displayName: true, bio: true, avatarUrl: true } },
    },
  });
  if (!user) return { title: "Not found — smokez.lol" };
  const name = user.profile?.displayName || user.username;
  return {
    title: `${name} (@${user.username}) — smokez.lol`,
    description: user.profile?.bio || `${name}'s smokez.lol profile`,
  };
}

export default async function PublicProfile({
  params,
}: {
  params: { username: string };
}) {
  const user = await prisma.user.findUnique({
    where: { usernameNorm: normalizeUsername(params.username) },
    select: {
      id: true,
      username: true,
      profile: true,
      links: { where: { enabled: true }, orderBy: { position: "asc" } },
      socials: { orderBy: { position: "asc" } },
      music: true,
    },
  });

  if (!user) notFound();

  // --- VIEW COUNTER (with bot protection) ---
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    const viewCookieKey = `viewed_${user.id}`;
    const alreadyViewed = cookieStore.get(viewCookieKey);

    // Only count if:
    // 1. Not a bot
    // 2. Haven't viewed in last 24 hours
    // 3. Profile has view counting enabled
    const shouldCount =
      !isBot(userAgent) &&
      !alreadyViewed &&
      (user.profile?.showViewCount ?? true);

    if (shouldCount) {
      // Increment view count in database (view increment only — no separate analytics row for now)
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: { views: { increment: 1 } },
        create: { userId: user.id, views: 1 },
      });

      // Set cookie so we don't count this visitor again for 24 hours
      cookieStore.set(viewCookieKey, "1", {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
  } catch (err) {
    // Silently ignore — don't break the page if counting fails
    console.error("View count error:", err);
  }

  // Re-fetch profile so we display the incremented count
  const freshProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  const profile = freshProfile || user.profile;
  const music = user.music;

  const radius = profile?.borderRadius ?? 16;
  const accent = profile?.accentColor ?? "#a855f7";
  const bgGradient =
    profile?.backgroundGradient ??
    "linear-gradient(160deg, #0a0a14 0%, #000 100%)";

  const pageBackground: React.CSSProperties =
    profile?.backgroundType === "image" && profile?.backgroundUrl
      ? {
          backgroundImage: `url(${profile.backgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }
      : { background: bgGradient };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        ...pageBackground,
        color: profile?.textColor ?? "#ffffff",
        fontFamily: profile?.font ?? "Inter, system-ui, sans-serif",
      }}
    >
      {profile?.backgroundType === "image" && profile?.backgroundUrl && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />
      )}

      {profile?.effect === "glow" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${accent}33, transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center px-6 py-14">
        <div
          className="h-24 w-24 rounded-full overflow-hidden border-2"
          style={{
            borderColor: accent,
            boxShadow: `0 0 40px -8px ${accent}`,
          }}
        >
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="h-full w-full grid place-items-center text-2xl font-bold"
              style={{ background: `${accent}22` }}
            >
              {user.username[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="mt-4 text-xl font-bold">
          {profile?.displayName || user.username}
        </h1>
        <p className="text-sm opacity-60">@{user.username}</p>

        {profile?.badges && profile.badges.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {profile.badges.map((b: string) => (
              <span
                key={b}
                className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/5"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {profile?.bio && (
          <p className="mt-3 text-sm text-center opacity-80 max-w-xs">
            {profile.bio}
          </p>
        )}

        {user.socials.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {user.socials.map((s) => {
              const platform = PLATFORMS[s.platform];
              if (!platform) return null;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.name}
                  className="grid place-items-center transition-transform hover:scale-110"
                  style={{
                    filter: `drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(255,255,255,0.45))`,
                  }}
                >
                  <platform.Icon
                    className="h-9 w-9"
                    style={{ color: platform.color }}
                  />
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-7 w-full space-y-3">
          {user.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 text-sm font-medium text-center border transition-transform hover:scale-[1.02]"
              style={{
                borderRadius: radius,
                borderColor: `${accent}55`,
                background:
                  profile?.buttonStyle === "solid"
                    ? accent
                    : "rgba(255,255,255,0.05)",
                color:
                  profile?.buttonStyle === "solid"
                    ? "#fff"
                    : profile?.textColor ?? "#fff",
              }}
            >
              {l.title}
            </a>
          ))}
        </div>

        {music?.url && music.showPlayer && (
          <div className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md">
            <Music2 className="h-4 w-4" style={{ color: accent }} />
            <div className="text-left">
              <div className="text-xs font-medium">
                {music.title || "Now playing"}
              </div>
              <div className="text-[10px] opacity-60">
                {music.artist || "Unknown"}
              </div>
            </div>
          </div>
        )}

        {profile?.showViewCount && (
          <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] opacity-60">
            <Eye className="h-3 w-3" /> {profile.views.toLocaleString()} views
          </div>
        )}
      </div>
    </main>
  );
}