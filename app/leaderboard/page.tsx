import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — smokez.lol",
  description: "The most-viewed smokez.lol profiles.",
};

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  views: number;
  accentColor: string;
  badgeCount: number;
};

async function getTopProfiles(): Promise<Row[]> {
  const profiles = await prisma.profile.findMany({
    where: { views: { gt: 0 } },
    orderBy: [{ views: "desc" }, { createdAt: "asc" }],
    take: 50,
    select: {
      id: true,
      userId: true,
      displayName: true,
      avatarUrl: true,
      accentColor: true,
      badges: true,
      views: true,
      user: { select: { username: true } },
    },
  });

  return profiles.map((p) => ({
    id: p.id,
    userId: p.userId,
    username: p.user.username,
    displayName: p.displayName,
    avatarUrl: p.avatarUrl,
    views: p.views,
    accentColor: p.accentColor || "#a855f7",
    badgeCount: p.badges?.length ?? 0,
  }));
}

/* ─── Smoke grenade SVG — tall canister + dots + ring pull + smoke puff ─── */
function SmokeGrenade({
  size = 60,
  rotation = 0,
  opacity = 0.15,
  color = "#a855f7",
}: {
  size?: number;
  rotation?: number;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)`, opacity }}
    >
      {/* ── Smoke puff (top-left) ── */}
      <g fill={color} opacity="0.85">
        <circle cx="13" cy="19" r="3.2" />
        <circle cx="19" cy="15" r="4.2" />
        <circle cx="25" cy="13" r="3.4" />
        <circle cx="17" cy="22" r="2.4" />
        <circle cx="22" cy="19" r="2.8" />
      </g>

      {/* ── Ring pull (top-right) ── */}
      <circle
        cx="44"
        cy="14"
        r="4"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />

      {/* ── Cap / top plate ── */}
      <path
        d="M30 20 L42 20 L43 25 L29 25 Z"
        fill={color}
        opacity="0.9"
      />

      {/* ── Main body (tall canister) ── */}
      <path
        d="M29 25 L43 25 L44 52 L28 52 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* ── Dots on body (two columns) ── */}
      <g fill={color} opacity="0.9">
        <circle cx="33" cy="30" r="1.1" />
        <circle cx="39" cy="30" r="1.1" />
        <circle cx="33" cy="35" r="1.1" />
        <circle cx="39" cy="35" r="1.1" />
        <circle cx="33" cy="40" r="1.1" />
        <circle cx="39" cy="40" r="1.1" />
        <circle cx="33" cy="45" r="1.1" />
        <circle cx="39" cy="45" r="1.1" />
      </g>

      {/* ── Base plate ── */}
      <path d="M26 52 L46 52 L46 56 L26 56 Z" fill={color} opacity="0.85" />
    </svg>
  );
}

export default async function LeaderboardPage() {
  const rows = await getTopProfiles();

  // Scattered grenade positions — deterministic so no hydration flash
  const grenades: {
    top: string;
    left: string;
    size: number;
    rotation: number;
    opacity: number;
  }[] = [
    { top: "6%",   left: "4%",   size: 90,  rotation: -18, opacity: 0.12 },
    { top: "14%",  left: "88%",  size: 70,  rotation: 24,  opacity: 0.10 },
    { top: "32%",  left: "2%",   size: 55,  rotation: 42,  opacity: 0.09 },
    { top: "48%",  left: "94%",  size: 80,  rotation: -32, opacity: 0.11 },
    { top: "62%",  left: "8%",   size: 110, rotation: 12,  opacity: 0.08 },
    { top: "74%",  left: "90%",  size: 60,  rotation: -48, opacity: 0.10 },
    { top: "86%",  left: "18%",  size: 75,  rotation: 30,  opacity: 0.09 },
    { top: "92%",  left: "82%",  size: 95,  rotation: -12, opacity: 0.08 },
    { top: "40%",  left: "48%",  size: 200, rotation: 8,   opacity: 0.05 },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Purple light lines background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="purpleFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="80%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleFade2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0" />
              <stop offset="30%" stopColor="#d8b4fe" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#f3e8ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0" />
            </linearGradient>
            <filter id="glowLine" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M -100 120 C 200 60, 400 180, 700 120 S 1200 60, 1600 140"
            fill="none"
            stroke="url(#purpleFade)"
            strokeWidth="0.35"
            filter="url(#glowLine)"
          />
          <path
            d="M -100 620 C 300 540, 600 720, 900 620 S 1300 540, 1600 640"
            fill="none"
            stroke="url(#purpleFade2)"
            strokeWidth="0.4"
            filter="url(#glowLine)"
          />
        </svg>
      </div>

      {/* Scattered smoke grenades */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {grenades.map((g, i) => (
          <div key={i} className="absolute" style={{ top: g.top, left: g.left }}>
            <SmokeGrenade
              size={g.size}
              rotation={g.rotation}
              opacity={g.opacity}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <SmokeLogoWordmark />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <Link href="/leaderboard" className="text-white">
              Leaderboard
            </Link>
            <a
              href="https://discord.gg/yRtBJEW3d"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Discord
            </a>
          </nav>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-24">
        {/* Banner card */}
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-6"
          style={{
            background:
              "linear-gradient(135deg, #1e1030 0%, #2a1442 50%, #14081f 100%)",
            border: "1px solid rgba(168, 85, 247, 0.25)",
            boxShadow: "0 30px 80px -40px rgba(168, 85, 247, 0.5)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 0%, rgba(168,85,247,0.35), transparent 55%), radial-gradient(circle at 90% 100%, rgba(139,92,246,0.25), transparent 50%)",
            }}
          />
          {/* Big faded grenade watermark in the corner */}
          <div className="pointer-events-none absolute right-4 top-4 md:right-8 md:top-8 opacity-25">
            <SmokeGrenade size={140} rotation={-8} opacity={1} color="#c084fc" />
          </div>

          <div className="relative">
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ textShadow: "0 0 30px rgba(168,85,247,0.6)" }}
            >
              Views Leaderboard
            </h1>
            <p className="mt-3 text-sm text-zinc-300/80">
              Top 50 profiles by total views of all time.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-200">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              All Time
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10, 10, 14, 0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_1fr_160px] items-center gap-4 px-5 py-4 border-b border-white/5 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
            <div>#</div>
            <div>Profile</div>
            <div className="text-right">Views</div>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center text-zinc-500 text-sm">
              No profiles with views yet.
            </div>
          ) : (
            rows.map((row, i) => {
              const rank = i + 1;
              return (
                <Link
                  key={row.id}
                  href={`/u/${row.username}`}
                  className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_1fr_160px] items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 transition hover:bg-white/[0.03]"
                >
                  <div
                    className="text-base md:text-lg font-bold tabular-nums"
                    style={{ color: rank <= 3 ? "#facc15" : "#71717a" }}
                  >
                    {rank}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden grid place-items-center flex-shrink-0"
                      style={{
                        border: `1px solid ${row.accentColor}55`,
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {row.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-zinc-500">
                          {row.username.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm md:text-base truncate">
                          {row.username}
                        </span>
                        {row.badgeCount > 0 && (
                          <span
                            className="inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-bold uppercase tracking-wider"
                            style={{
                              background: "rgba(168,85,247,0.15)",
                              color: "#c084fc",
                              border: "1px solid rgba(168,85,247,0.3)",
                            }}
                          >
                            {row.badgeCount}
                          </span>
                        )}
                      </div>
                      {row.displayName && (
                        <div className="text-xs text-zinc-500 truncate">
                          {row.displayName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-bold tabular-nums text-sm md:text-base">
                    {row.views.toLocaleString()}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}