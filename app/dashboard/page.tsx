import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { AccountMenu } from "@/components/dashboard/AccountMenu";
import {
  LayoutDashboard,
  Link2,
  Palette,
  Share2,
  Music,
  BarChart3,
  LogOut,
  Sparkles,
  Upload,
  Type,
  MessageSquare,
  Globe,
  Eye,
  Image as ImageIcon,
  Crown,
  ChevronRight,
  User,
  Link as LinkIcon,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true, email: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Purple light lines */}
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
            stroke="url(#purpleFade)"
            strokeWidth="0.4"
            filter="url(#glowLine)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* === LEFT SIDEBAR === */}
        <aside
          className="hidden md:flex w-64 flex-col p-4 border-r"
          style={{
            background: "rgba(10, 10, 14, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <Link href="/" className="px-2 py-3 mb-6">
            <SmokeLogoWordmark />
          </Link>

          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem href="/dashboard" Icon={LayoutDashboard} label="Overview" active />
            <SidebarItem href="/dashboard/analytics" Icon={BarChart3} label="Analytics" />
            <SidebarItem href="/dashboard/customize" Icon={Palette} label="Customize" />
            <SidebarItem href="/dashboard/links" Icon={Link2} label="Links" />
            <SidebarItem href="/dashboard/socials" Icon={Share2} label="Socials" />
            <SidebarItem href="/dashboard/music" Icon={Music} label="Music" />
            <SidebarItem href="/dashboard/premium" Icon={Crown} label="Premium" />
            <SidebarItem href="/dashboard/image-host" Icon={ImageIcon} label="Image Host" />
            <SidebarItem href="/dashboard/templates" Icon={Sparkles} label="Templates" />
          </nav>

          <form action="/api/logout" method="post" className="mt-4">
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 transition"
              style={{ textShadow: "0 0 12px rgba(255,255,255,0.2)" }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </aside>

        {/* === MAIN CONTENT === */}
        <div className="flex-1 min-w-0">
          <header
            className="sticky top-0 z-20 px-6 py-4 border-b"
            style={{
              background: "rgba(10, 10, 14, 0.7)",
              borderColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between">
              <h1
                className="text-lg font-bold tracking-tight"
                style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
              >
                Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 hidden sm:block font-medium">
                  @{user.username}
                </span>
                <Link
                  href={`/u/${user.username}`}
                  className="text-xs px-3 h-8 inline-flex items-center rounded-lg border border-white/15 hover:bg-white/5 transition font-semibold"
                >
                  View public page
                </Link>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
              {/* === LEFT: main content === */}
              <div className="min-w-0">
                <div className="mb-10">
                  <h2
                    className="text-3xl md:text-4xl font-bold tracking-tight"
                    style={{
                      textShadow:
                        "0 1px 0 rgba(255,255,255,0.9), 0 2px 0 rgba(200,200,200,0.6), 0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.35)",
                    }}
                  >
                    Welcome, @{user.username}
                  </h2>
                  <p className="text-zinc-400 mt-3 text-sm">
                    Your account was created on {user.createdAt.toDateString()}.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  <StatCard Icon={User} label="Username" value={`@${user.username}`} action="Change available" />
                  <StatCard Icon={LinkIcon} label="Alias" value="0 aliases used" action="Manage" />
                  <StatCard Icon={Eye} label="Profile Views" value="0" action="+0 this week" />
                  <StatCard Icon={Palette} label="Completion" value="0%" action="Complete it" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold" style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}>
                      Profile Completion
                    </h3>
                    <span className="text-xs text-zinc-500 font-semibold">0% completed</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-6">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "0%",
                        background: "linear-gradient(90deg, #a855f7 0%, #c084fc 100%)",
                        boxShadow: "0 0 20px rgba(168,85,247,0.6)",
                      }}
                    />
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3 mb-6">
                    <span className="text-amber-400 text-lg">⚠</span>
                    <div>
                      <div className="text-sm font-bold">Your profile isn't complete yet!</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Complete your profile to make it more discoverable and appealing.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <ChecklistRow Icon={Upload} label="Upload an Avatar" href="/dashboard/customize" />
                    <ChecklistRow Icon={Type} label="Add a Description" href="/dashboard/profile" />
                    <ChecklistRow Icon={MessageSquare} label="Link Discord Account" href="/dashboard/socials" />
                    <ChecklistRow Icon={Globe} label="Add Socials" href="/dashboard/socials" />
                    <ChecklistRow Icon={Eye} label="Reach 10 Profile Views" href="/dashboard/analytics" />
                  </div>
                </div>
              </div>

              {/* === RIGHT PANEL — using AccountMenu component (modals work!) === */}
              <aside className="w-full lg:w-[360px] lg:ml-12 lg:mt-32">
                <div className="lg:sticky lg:top-32">
                  <AccountMenu
                    initialUsername={user.username}
                    initialDisplayName={user.username}
                  />
                </div>
              </aside>
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
      style={{
        textShadow: active ? "0 0 12px rgba(255,255,255,0.5)" : "0 0 8px rgba(255,255,255,0.15)",
      }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function StatCard({
  Icon,
  label,
  value,
  action,
}: {
  Icon: React.ElementType;
  label: string;
  value: string;
  action?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4 hover:border-white/20 transition"
      style={{
        boxShadow: "0 0 30px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
          {label}
        </span>
        <Icon className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="text-base font-bold truncate" style={{ textShadow: "0 0 12px rgba(255,255,255,0.2)" }}>
        {value}
      </div>
      {action && <div className="text-xs text-zinc-500 mt-1 truncate">{action}</div>}
    </div>
  );
}

function ChecklistRow({
  Icon,
  label,
  href,
  done,
}: {
  Icon: React.ElementType;
  label: string;
  href: string;
  done?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        done
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
      }`}
    >
      <Icon className="h-4 w-4 text-zinc-400" />
      <span
        className={`text-sm font-bold flex-1 ${done ? "text-emerald-300" : "text-white"}`}
        style={{ textShadow: "0 0 12px rgba(255,255,255,0.15)" }}
      >
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-zinc-600" />
    </Link>
  );
}