import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Music2, Eye, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { AnimatedTitle, type AnimatedTitleStyle } from "@/components/AnimatedTitle";
import { BadgeIcon } from "@/components/BadgeIcon";
import { ViewCounter } from "@/components/ViewCounter";
import { MouseTrail, type MouseTrailStyle } from "@/components/MouseTrail";
import { MusicPlayer } from "@/components/MusicPlayer";
import { WelcomeGate } from "@/components/WelcomeGate";
import { BADGES } from "@/lib/badges";
import {
  FaYoutube, FaTwitch, FaTiktok, FaDiscord, FaFacebook, FaSpotify,
  FaInstagram, FaXTwitter, FaTelegram, FaPaypal, FaSteam, FaBitcoin,
} from "react-icons/fa6";
import { FaXbox } from "react-icons/fa";
import {
  SiRoblox, SiGithub, SiCashapp, SiVenmo, SiPlaystation,
  SiOnlyfans, SiKick, SiLitecoin, SiSolana, SiApplemusic,
} from "react-icons/si";

const PLATFORMS: Record<string, { name: string; color: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { usernameNorm: normalizeUsername(username) },
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
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { usernameNorm: normalizeUsername(username) },
    select: {
      id: true,
      username: true,
      isPremium: true,
      premiumUntil: true,
      profile: true,
      links: { where: { enabled: true }, orderBy: { position: "asc" } },
      socials: { orderBy: { position: "asc" } },
      music: true,
    },
  });

  if (!user) notFound();

  const profile = user.profile;
  const music = user.music;

  const accent = profile?.accentColor || "#a855f7";
  const text = profile?.textColor || "#ffffff";
  const cardBg = profile?.backgroundColor || "#0a0a0a";
  const opacity = profile?.profileOpacity ?? 100;
  const blur = profile?.blur ?? 12;
  const monochrome = profile?.monochromeIcons ?? false;
  const profileFont = profile?.font || "Inter";
  const fontClass = `font-${profileFont.toLowerCase().replace(/\s+/g, "-")}`;
  const avatarStyle = profile?.avatarStyle === "full" ? "full" : "circle";

  const glassMode = opacity <= 20;

  const hexToRgb = (hex: string) => {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  const cardBackground = glassMode ? "transparent" : `rgba(${hexToRgb(cardBg)}, ${opacity / 100})`;
  const cardBorder = glassMode ? `${accent}99` : `${accent}55`;
  const cardShadow = glassMode
    ? `0 30px 90px rgba(0,0,0,0.3), 0 0 60px -10px ${accent}44`
    : `0 30px 90px rgba(0,0,0,0.5), 0 0 50px -15px ${accent}66`;

  const isVideoBg = profile?.backgroundType === "video" && !!profile?.backgroundVideoUrl;
  const isImageBg = profile?.backgroundType === "image" && !!profile?.backgroundUrl;

  const backgroundStyle: React.CSSProperties = isImageBg
    ? {
        backgroundImage: `url(${profile!.backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    : isVideoBg
    ? {}
    : {
        background: profile?.backgroundGradient || `linear-gradient(160deg, ${cardBg}, #14141a)`,
      };

  const isPremium =
    !!user.isPremium &&
    (!user.premiumUntil || new Date(user.premiumUntil) > new Date());

  const showWelcome =
    isPremium &&
    !!profile?.welcomeEnabled &&
    !!profile?.welcomeText &&
    !!profile.welcomeText.trim();

  return (
    <main className={`relative min-h-screen ${fontClass}`} style={{ ...backgroundStyle, color: text }}>
      {showWelcome && (
        <WelcomeGate
          text={profile!.welcomeText!}
          accent={accent}
          avatarUrl={profile?.avatarUrl}
          username={user.username}
        />
      )}

      {profile?.showViewCount && <ViewCounter userId={user.id} />}

      <MouseTrail
        key={profile?.mouseTrail || "none"}
        style={(profile?.mouseTrail as MouseTrailStyle) || "none"}
        color={profile?.accentColor}
      />

      {profile?.audioUrl && <MusicPlayer src={profile.audioUrl} accent={accent} />}

      {isVideoBg && (
        <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover" style={{ zIndex: 0 }}>
          <source src={profile!.backgroundVideoUrl!} type="video/mp4" />
        </video>
      )}

      {(isImageBg || isVideoBg) && (
        <div className="pointer-events-none fixed inset-0" style={{ background: "rgba(0,0,0,0.2)", zIndex: 1 }} />
      )}

      {profile?.effect === "glow" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(600px circle at 50% 0%, ${accent}33, transparent 60%)`, zIndex: 2 }}
        />
      )}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-14" style={{ zIndex: 10 }}>
        <div
          className="w-full max-w-2xl rounded-3xl border overflow-hidden"
          style={{
            background: cardBackground,
            borderColor: cardBorder,
            backdropFilter: glassMode ? "none" : `blur(${blur}px)`,
            WebkitBackdropFilter: glassMode ? "none" : `blur(${blur}px)`,
            boxShadow: cardShadow,
            color: text,
          }}
        >
          <div className="px-8 pt-12 pb-8 flex flex-col items-center text-center">
            {profile?.avatarUrl && avatarStyle === "circle" && (
              <div className="h-28 w-28 rounded-full overflow-hidden border-2" style={{ borderColor: accent, boxShadow: `0 0 40px -10px ${accent}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}

            {profile?.avatarUrl && avatarStyle === "full" && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt=""
                className="max-h-40 w-auto max-w-full object-contain"
                style={{ filter: `drop-shadow(0 0 20px ${accent}55)` }}
              />
            )}

            <AnimatedTitle
              text={`@${user.username}`}
              style={(profile?.animatedTitleStyle as AnimatedTitleStyle) || "none"}
              className={`${profile?.avatarUrl ? "mt-6" : "mt-0"} text-3xl font-bold tracking-tight`}
              style2={{ color: text }}
            />

            {profile?.displayName && (
              <p className="mt-2 text-base" style={{ color: text, opacity: 0.7 }}>
                {profile.displayName}
              </p>
            )}

            {profile?.bio && (
              <p className="mt-3 text-base max-w-md" style={{ color: text, opacity: 0.85 }}>
                {profile.bio}
              </p>
            )}

            {profile?.location && (
              <p className="mt-3 text-sm flex items-center gap-1" style={{ color: text, opacity: 0.6 }}>
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </p>
            )}

            {profile?.badges && profile.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.badges.map((badgeId: string) => {
                  const badge = BADGES.find((b) => b.id === badgeId);
                  if (!badge) return null;
                  const badgeColor = monochrome ? text : badge.color;
                  return (
                    <div
                      key={badgeId}
                      title={badge.name}
                      className="grid place-items-center transition-transform hover:scale-110"
                      style={{ filter: `drop-shadow(0 0 5px ${badgeColor}99)` }}
                    >
                      <BadgeIcon icon={badge.icon} className="h-6 w-6" color={badgeColor} strokeWidth={2} />
                    </div>
                  );
                })}
              </div>
            )}

            {user.socials.length > 0 && (
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {user.socials.map((s) => {
                  const platform = PLATFORMS[s.platform];
                  if (!platform) return null;
                  const iconColor = monochrome ? text : platform.color;
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
                      <platform.Icon className="h-10 w-10" style={{ color: iconColor }} />
                    </a>
                  );
                })}
              </div>
            )}

            {user.links.length > 0 && (
              <div className="mt-24 w-full space-y-3">
                {user.links.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 text-base font-semibold text-center border transition-transform hover:scale-[1.01]"
                    style={{
                      borderRadius: profile?.borderRadius ?? 16,
                      borderColor: `${accent}66`,
                      background: profile?.buttonStyle === "solid" ? accent : "rgba(255,255,255,0.05)",
                      color: profile?.buttonStyle === "solid" ? "#fff" : text,
                    }}
                  >
                    {l.title}
                  </a>
                ))}
              </div>
            )}

            {music?.url && music.showPlayer && (
              <div className="mt-8 flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
                <Music2 className="h-5 w-5" style={{ color: accent }} />
                <div className="text-left">
                  <div className="text-sm font-medium">{music.title || "Now playing"}</div>
                  <div className="text-xs opacity-60">{music.artist || "Unknown"}</div>
                </div>
              </div>
            )}
          </div>

          {profile?.showViewCount && (
            <div className="px-8 pb-5 flex items-center gap-2 text-xs" style={{ color: text, opacity: 0.5 }}>
              <Eye className="h-3.5 w-3.5" />
              {profile.views.toLocaleString()} views
            </div>
          )}
        </div>
      </div>
    </main>
  );
}