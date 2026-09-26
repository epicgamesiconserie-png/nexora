import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/utils";
import { notFound } from "next/navigation";
import { SmokeLogo } from "@/components/SmokeLogo";
import { Music2, Eye } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { usernameNorm: normalizeUsername(params.username) },
    select: { username: true, profile: { select: { displayName: true, bio: true, avatarUrl: true } } },
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

  // Record a view (best-effort)
  try {
    await prisma.$transaction([
      prisma.analytics.create({ data: { userId: user.id, type: "view" } }),
      prisma.profile.update({
        where: { userId: user.id },
        data: { views: { increment: 1 } },
      }),
    ]);
  } catch {}

  const profile = user.profile;
  const music = user.music;

  const radius = profile?.borderRadius ?? 16;
  const accent = profile?.accentColor ?? "#a855f7";
  const bgGradient =
    profile?.backgroundGradient ??
    "linear-gradient(160deg, #0a0a14 0%, #000 100%)";

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: bgGradient,
        color: profile?.textColor ?? "#ffffff",
        fontFamily: profile?.font ?? "Inter, system-ui, sans-serif",
      }}
    >
      {/* Glow effect */}
      {profile?.effect === "glow" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${accent}33, transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center px-6 py-14">
        {/* Avatar */}
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
            <div className="h-full w-full grid place-items-center text-2xl font-bold" style={{ background: `${accent}22` }}>
              {user.username[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="mt-4 text-xl font-bold">
          {profile?.displayName || user.username}
        </h1>
        <p className="text-sm opacity-60">@{user.username}</p>

        {/* Badges */}
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

        {/* Bio */}
        {profile?.bio && (
          <p className="mt-3 text-sm text-center opacity-80 max-w-xs">
            {profile.bio}
          </p>
        )}

        {/* Socials */}
        {user.socials.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {user.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full grid place-items-center transition-transform hover:scale-110"
                style={{ background: `${accent}22`, color: "#fff" }}
              >
                <span className="text-[10px] font-bold uppercase">
                  {s.platform.slice(0, 2)}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-7 w-full space-y-3">
          {user.links.map((l, i) => (
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
                  profile?.buttonStyle === "solid" ? accent : "rgba(255,255,255,0.05)",
                color: profile?.buttonStyle === "solid" ? "#fff" : profile?.textColor ?? "#fff",
              }}
            >
              {l.title}
            </a>
          ))}
        </div>

        {/* Music */}
        {music?.url && music.showPlayer && (
          <div className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md">
            <Music2 className="h-4 w-4" style={{ color: accent }} />
            <div className="text-left">
              <div className="text-xs font-medium">{music.title || "Now playing"}</div>
              <div className="text-[10px] opacity-60">{music.artist || "Unknown"}</div>
            </div>
          </div>
        )}

        {/* View count */}
        {profile?.showViewCount && (
          <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] opacity-60">
            <Eye className="h-3 w-3" /> {profile.views.toLocaleString()} views
          </div>
        )}
      </div>
    </main>
  );
}