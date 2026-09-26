import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import {
  LayoutDashboard, Link2, Palette, Share2, Music, BarChart3,
  LogOut, Crown, Image as ImageIcon, Home, Eye,
} from "lucide-react";
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

export default async function MyPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      profile: true,
      socials: { orderBy: { position: "asc" } },
    },
  });
  if (!user) redirect("/login");

  const profile = user.profile;
  const socials = user.socials;

  const backgroundStyle: React.CSSProperties =
    profile?.backgroundType === "image" && profile?.backgroundUrl
      ? {
          backgroundImage: `url(${profile.backgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }
      : {
          background:
            profile?.backgroundGradient ||
            "linear-gradient(160deg, #0a0a0a, #14141a)",
        };

  return (
    <main
      className="relative min-h-screen text-white overflow-hidden"
      style={backgroundStyle}
    >
      {profile?.backgroundType === "image" && profile?.backgroundUrl && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
        />
      )}

      <div className="relative z-10 flex min-h-screen">
        <aside
          className="hidden md:flex w-64 flex-col p-4 border-r"
          style={{
            background: "rgba(10, 10, 14, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <Link href="/" className="px-2 py-3 mb-6">
            <SmokeLogoWordmark />
          </Link>
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem href="/dashboard" Icon={LayoutDashboard} label="Overview" />
            <SidebarItem href="/dashboard/analytics" Icon={BarChart3} label="Analytics" />
            <SidebarItem href="/dashboard/customize" Icon={Palette} label="Customize" />
            <SidebarItem href="/dashboard/links" Icon={Link2} label="Links" />
            <SidebarItem href="/dashboard/socials" Icon={Share2} label="Socials" />
            <SidebarItem href="/dashboard/music" Icon={Music} label="Music" />
            <SidebarItem href="/dashboard/mypage" Icon={Home} label="My Page" active />
            <SidebarItem href="/dashboard/premium" Icon={Crown} label="Premium" />
            <SidebarItem href="/dashboard/image-host" Icon={ImageIcon} label="Image Host" />
          </nav>
          <form action="/api/logout" method="post" className="mt-4">
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 transition"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </aside>

        <div className="flex-1 min-w-0">
          <header
            className="sticky top-0 z-20 px-6 py-4 border-b"
            style={{
              background: "rgba(10, 10, 14, 0.5)",
              borderColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">My Page</h1>
              <Link
                href={`/u/${user.username}`}
                className="text-xs px-3 h-8 inline-flex items-center rounded-lg border border-white/15 hover:bg-white/5 transition font-semibold"
              >
                Open in new tab ↗
              </Link>
            </div>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
            <div
              className="relative w-full max-w-sm rounded-2xl border border-white/15 overflow-hidden"
              style={{
                background: "rgba(15, 15, 20, 0.55)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full overflow-hidden border border-white/20">
                  {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center bg-white/5 text-2xl font-bold text-zinc-500">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight">
                  @{user.username}
                </h2>

                {profile?.displayName && (
                  <p className="mt-1 text-sm text-zinc-400">
                    {profile.displayName}
                  </p>
                )}

                {socials.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-4">
                    {socials.map((s) => {
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
              </div>

              <div className="border-t border-white/10 px-6 py-3 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Eye className="h-3.5 w-3.5" />
                <span>{profile?.views ?? 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({
  href,
  Icon,
  label,
  active,
}: {
  href: string;
  Icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-white/[0.07] text-white border border-white/15"
          : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}