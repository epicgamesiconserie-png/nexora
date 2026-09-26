import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import {
  LayoutDashboard,
  Link2,
  Palette,
  Share2,
  Music,
  BarChart3,
  LogOut,
  Crown,
  Image as ImageIcon,
  Home,
  Eye,
  Settings,
} from "lucide-react";

export default async function MyPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      email: true,
      profile: true,
    },
  });
  if (!user) redirect("/login");

  const profile = user.profile;

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="purpleFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="80%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
            </linearGradient>
            <filter id="glowLine" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M -100 120 C 200 60, 400 180, 700 120 S 1200 60, 1600 140" fill="none" stroke="url(#purpleFade)" strokeWidth="0.35" filter="url(#glowLine)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:flex w-64 flex-col p-4 border-r" style={{ background: "rgba(10, 10, 14, 0.85)", borderColor: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <Link href="/" className="px-2 py-3 mb-6"><SmokeLogoWordmark /></Link>
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
            <button type="submit" className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 transition" style={{ textShadow: "0 0 12px rgba(255,255,255,0.2)" }}>
              <LogOut className="h-4 w-4" />Log out
            </button>
          </form>
        </aside>

        {/* MAIN — My Page view */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 px-6 py-4 border-b" style={{ background: "rgba(10, 10, 14, 0.7)", borderColor: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-tight" style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>My Page</h1>
              <div className="flex items-center gap-3">
                <Link href={`/u/${user.username}`} className="text-xs px-3 h-8 inline-flex items-center rounded-lg border border-white/15 hover:bg-white/5 transition font-semibold">Open in new tab ↗</Link>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-12 max-w-lg mx-auto">
            {/* Profile card — looks like the public profile */}
            <div
              className="rounded-3xl border border-white/10 p-8 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(20,20,28,0.9) 0%, rgba(10,10,14,0.95) 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* View counter (top left) */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-zinc-500">
                <Eye className="h-3.5 w-3.5" />
                <span>{profile?.views ?? 0}</span>
              </div>

              {/* Avatar */}
              <div className="mx-auto h-24 w-24 rounded-full overflow-hidden border-2"
                style={{ borderColor: "#a855f7" }}>
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-white/5 text-2xl font-bold text-zinc-500">
                    {user.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Username */}
              <h2 className="mt-4 text-xl font-bold" style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
                @{user.username}
              </h2>

              {/* Display name if set */}
              {profile?.displayName && (
                <p className="text-sm text-zinc-400 mt-1">{profile.displayName}</p>
              )}

              {/* Bio */}
              {profile?.bio && (
                <p className="text-sm text-zinc-400 mt-3">{profile.bio}</p>
              )}

              {/* Placeholder links */}
              <div className="mt-8 space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-full py-3.5 rounded-xl border text-sm font-medium text-zinc-500"
                    style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                  >
                    Link {i}
                  </div>
                ))}
              </div>

              {/* Empty state */}
              {(!profile || !profile.bio) && (
                <p className="mt-6 text-xs text-zinc-500">
                  Add a bio and links from the{" "}
                  <Link href="/dashboard/customize" className="text-zinc-300 hover:text-white underline">
                    Customize
                  </Link>{" "}
                  page.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <Link
                href="/dashboard/customize"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition text-sm font-semibold"
              >
                <Settings className="h-4 w-4" />
                Edit appearance
              </Link>
              <Link
                href="/dashboard/links"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition text-sm font-semibold"
              >
                <Link2 className="h-4 w-4" />
                Edit links
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({ href, Icon, label, active }: { href: string; Icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-white/[0.07] text-white border border-white/15" : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"}`} style={{ textShadow: active ? "0 0 12px rgba(255,255,255,0.5)" : "0 0 8px rgba(255,255,255,0.15)" }}>
      <Icon className="h-4 w-4" />{label}
    </Link>
  );
}