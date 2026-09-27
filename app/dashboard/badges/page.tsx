"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { claimBadge, unclaimBadge } from "@/app/dashboard/customize/actions";
import { BADGES } from "@/lib/badges";
import { BadgeIcon } from "@/components/BadgeIcon";
import {
  LayoutDashboard, Link2, Palette, Music, BarChart3,
  LogOut, Crown, Home, Award, Check, Plus,
} from "lucide-react";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Customize", href: "/dashboard/customize", icon: Palette },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Music", href: "/dashboard/music", icon: Music },
  { name: "My Page", href: "/dashboard/mypage", icon: Home },
  { name: "Badges", href: "/dashboard/badges", icon: Award },
  { name: "Premium", href: "/dashboard/premium", icon: Crown },
];

export default function BadgesPage() {
  const pathname = usePathname();
  const [claimed, setClaimed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.badges) setClaimed(data.profile.badges);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function toggle(badgeId: string) {
    setWorking(badgeId);
    const isClaimed = claimed.includes(badgeId);

    const res = isClaimed
      ? await unclaimBadge(badgeId)
      : await claimBadge(badgeId);

    if (res.success) {
      setClaimed((prev) =>
        isClaimed ? prev.filter((b) => b !== badgeId) : [...prev, badgeId]
      );
      toast.success(isClaimed ? "Badge removed" : "Badge claimed");
    } else {
      toast.error(res.error || "Failed");
    }
    setWorking(null);
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside
        className="hidden md:flex w-64 flex-col p-4 border-r"
        style={{
          background: "rgba(10,10,14,0.85)",
          borderColor: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" className="px-2 py-3 mb-6 flex items-center gap-2">
          <span className="text-2xl">💨</span>
          <span className="text-xl font-bold">smokez.lol</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-white/[0.07] text-white border border-white/15"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
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

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              All Badges
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Click any badge to toggle it on your profile.
            </p>
          </div>

          {loading ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BADGES.map((badge) => {
                const isClaimed = claimed.includes(badge.id);
                const isWorking = working === badge.id;
                return (
                  <div
                    key={badge.id}
                    className={`group relative flex items-center gap-4 rounded-xl border p-4 transition ${
                      isClaimed
                        ? "border-purple-500/50 bg-purple-500/[0.07]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Icon circle — bigger with glow */}
                    <div
                      className="flex-shrink-0 h-14 w-14 rounded-full grid place-items-center transition-transform group-hover:scale-105"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${badge.color}33, ${badge.color}11)`,
                        border: `1.5px solid ${badge.color}88`,
                        boxShadow: `0 0 18px -6px ${badge.color}, inset 0 0 14px -8px ${badge.color}`,
                      }}
                    >
                      <BadgeIcon
                        icon={badge.icon}
                        className="h-7 w-7"
                        color={badge.color}
                        strokeWidth={2.2}
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {badge.name}
                        </span>
                        {isClaimed && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400">
                            Claimed
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                        {badge.description}
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => toggle(badge.id)}
                      disabled={isWorking}
                      className={`flex-shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition ${
                        isClaimed
                          ? "bg-transparent border border-white/15 text-white hover:border-red-400/50 hover:text-red-300"
                          : "bg-white text-black hover:bg-zinc-200"
                      } ${isWorking ? "opacity-50 cursor-wait" : ""}`}
                    >
                      {isWorking ? (
                        "..."
                      ) : isClaimed ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Claim
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}