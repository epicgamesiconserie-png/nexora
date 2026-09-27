import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { AccountMenu } from "@/components/dashboard/AccountMenu";
import {
  LayoutDashboard, Link2, Palette, Music, BarChart3,
  LogOut, Eye, Crown, ChevronRight, User, Link as LinkIcon,
  Home, Award, Upload, Type, MessageSquare, Globe, Check,
  ExternalLink,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      email: true,
      createdAt: true,
      profile: true,
      socials: true,
      links: true,
      music: true,
    },
  });
  if (!user) redirect("/login");

  const profile = user.profile;

  const tasks = [
    { label: "Upload an Avatar", done: !!profile?.avatarUrl, href: "/dashboard/customize", Icon: Upload },
    { label: "Add a Description", done: !!profile?.bio && profile.bio.length > 0, href: "/dashboard/customize", Icon: Type },
    { label: "Add Socials", done: user.socials.length > 0, href: "/dashboard/links", Icon: MessageSquare },
    { label: "Add Custom Links", done: user.links.length > 0, href: "/dashboard/links", Icon: Globe },
    { label: "Claim a Badge", done: (profile?.badges?.length ?? 0) > 0, href: "/dashboard/badges", Icon: Award },
  ];

  const completedCount = tasks.filter((t) => t.done).length;
  const percentage = completedCount * 20;

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
          <path d="M -100 620 C 300 540, 600 720, 900 620 S 1300 540, 1600 640" fill="none" stroke="url(#purpleFade)" strokeWidth="0.4" filter="url(#glowLine)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden md:flex w-64 flex-col p-4 border-r"
          style={{ background: "rgba(10, 10, 14, 0.85)", borderColor: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <Link href="/" className="px-2 py-3 mb-6"><SmokeLogoWordmark /></Link>
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem href="/dashboard" Icon={LayoutDashboard} label="Overview" active />
            <SidebarItem href="/dashboard/analytics" Icon={BarChart3} label="Analytics" />
            <SidebarItem href="/dashboard/customize" Icon={Palette} label="Customize" />
            <SidebarItem href="/dashboard/links" Icon={Link2} label="Links" />
            <SidebarItem href="/dashboard/music" Icon={Music} label="Music" />
            <SidebarItem href={`/u/${user.username}`} Icon={Home} label="My Page" external />
            <SidebarItem href="/dashboard/badges" Icon={Award} label="Badges" />
            <SidebarItem href="/dashboard/premium" Icon={Crown} label="Premium" />
          </nav>
          <form action="/api/logout" method="post" className="mt-4">
            <button type="submit" className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 transition">
              <LogOut className="h-4 w-4" />Log out
            </button>
          </form>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 px-6 py-4 border-b"
            style={{ background: "rgba(10, 10, 14, 0.7)", borderColor: "rgba(255, 255, 255, 0.06)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
              <span className="text-sm text-zinc-400 hidden sm:block font-medium">@{user.username}</span>
            </div>
          </header>

          <div className="p-6 md:p-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <div className="min-w-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard Icon={User} label="Username" value={`@${user.username}`} action="Change available" />
                  <StatCard Icon={LinkIcon} label="Alias" value="0 aliases used" action="Manage" />
                  <StatCard Icon={Eye} label="Profile Views" value={`${profile?.views ?? 0}`} action="Total views" />
                  <StatCard Icon={Palette} label="Completion" value={`${percentage}%`} action={percentage === 100 ? "Complete!" : "Keep going"} />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Profile Completion</h3>
                    <span className="text-sm text-zinc-500 font-semibold">{percentage}% completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-6">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #a855f7 0%, #c084fc 100%)", boxShadow: "0 0 20px rgba(168,85,247,0.6)" }} />
                  </div>

                  {percentage < 100 ? (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3 mb-6">
                      <span className="text-amber-400 text-xl">⚠</span>
                      <div>
                        <div className="text-base font-bold">Your profile isn't complete yet!</div>
                        <div className="text-sm text-zinc-400 mt-1">Complete the steps below to make your profile more discoverable.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-start gap-3 mb-6">
                      <span className="text-emerald-400 text-xl">✓</span>
                      <div>
                        <div className="text-base font-bold text-emerald-300">Profile complete!</div>
                        <div className="text-sm text-zinc-400 mt-1">Your profile is fully set up.</div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {tasks.map((t) => (
                      <ChecklistRow key={t.label} Icon={t.Icon} label={t.label} href={t.href} done={t.done} />
                    ))}
                  </div>
                </div>
              </div>

              <aside className="w-full lg:w-[360px] lg:ml-auto lg:mr-0 lg:mt-0">
                <div className="lg:sticky lg:top-24">
                  <AccountMenu initialUsername={user.username} initialDisplayName={user.username} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({ href, Icon, label, active, external }: { href: string; Icon: React.ElementType; label: string; active?: boolean; external?: boolean }) {
  const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
    active ? "bg-white/[0.07] text-white border border-white/15" : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
  }`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
        <ExternalLink className="h-3 w-3 opacity-50" />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function StatCard({ Icon, label, value, action }: { Icon: React.ElementType; label: string; value: string; action?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 hover:border-white/20 transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">{label}</span>
        <Icon className="h-5 w-5 text-zinc-500" />
      </div>
      <div className="text-xl font-bold truncate">{value}</div>
      {action && <div className="text-sm text-zinc-500 mt-2 truncate">{action}</div>}
    </div>
  );
}

function ChecklistRow({ Icon, label, href, done }: { Icon: React.ElementType; label: string; href: string; done?: boolean }) {
  return (
    <Link href={href} className={`w-full flex items-center gap-4 rounded-xl border p-5 text-left transition ${done ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"}`}>
      <div className={`h-8 w-8 rounded-full grid place-items-center flex-shrink-0 ${done ? "bg-emerald-500/20" : "bg-white/5"}`}>
        {done ? <Check className="h-4 w-4 text-emerald-400" /> : <Icon className="h-4 w-4 text-zinc-400" />}
      </div>
      <span className={`text-base font-bold flex-1 ${done ? "text-emerald-300 line-through" : "text-white"}`}>
        {label}
      </span>
      <ChevronRight className="h-5 w-5 text-zinc-600" />
    </Link>
  );
}