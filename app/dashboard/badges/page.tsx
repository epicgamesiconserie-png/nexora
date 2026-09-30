"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { claimBadge, unclaimBadge, syncUnlockedBadges } from "@/app/dashboard/customize/actions";
import { BADGES } from "@/lib/badges";
import { BadgeIcon } from "@/components/BadgeIcon";
import {
  LayoutDashboard, Link2, Palette, Music, BarChart3,
  LogOut, Crown, Home, Award, Check, Lock, Save,
  ExternalLink, ShieldCheck,
} from "lucide-react";

export default function BadgesPage() {
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [working, setWorking] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  async function load() {
    setLoading(true);
    try {
      await syncUnlockedBadges();

      const r = await fetch("/api/user/profile");
      const d = await r.json();
      if (d.username) setUsername(d.username);
      if (d.role === "admin") setIsAdmin(true);

      setClaimed(d.profile?.badges || []);
      setUnlocked(d.profile?.unlockedBadges || []);
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleClaimed(badgeId: string) {
    if (!unlocked.includes(badgeId)) {
      toast.error("You haven't unlocked this badge yet");
      return;
    }

    setClaimed((prev) =>
      prev.includes(badgeId)
        ? prev.filter((b) => b !== badgeId)
        : [...prev, badgeId]
    );
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const r = await fetch("/api/user/profile");
      const d = await r.json();
      const current: string[] = d.profile?.badges || [];

      const additions = claimed.filter((b) => !current.includes(b));
      const removals = current.filter((b: string) => !claimed.includes(b));

      for (const id of additions) {
        await claimBadge(id);
      }
      for (const id of removals) {
        await unclaimBadge(id);
      }

      toast.success("Badges updated");
      setDirty(false);
    } catch {
      toast.error("Failed to save badges");
    }
    setSaving(false);
  }

  const sidebar = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customize", href: "/dashboard/customize", icon: Palette },
    { name: "Links", href: "/dashboard/links", icon: Link2 },
    { name: "Music", href: "/dashboard/music", icon: Music },
    { name: "My Page", href: username ? `/u/${username}` : "", icon: Home, external: true },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Premium", href: "/dashboard/premium", icon: Crown },
    ...(isAdmin
      ? [{ name: "Admin", href: "/dashboard/admin", icon: ShieldCheck, external: false }]
      : []),
  ];

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
          {sidebar.map((link) => {
            const active = pathname === link.href;
            const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              active
                ? "bg-white/[0.07] text-white border border-white/15"
                : "text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
            }`;
            if (link.external) {
              return (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                  <link.icon className="h-4 w-4" />
                  <span className="flex-1">{link.name}</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              );
            }
            return (
              <Link key={link.href} href={link.href} className={className}>
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <form action="/api/logout" method="post" className="mt-4">
          <button type="submit" className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 transition">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">All Badges</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Complete requirements to unlock badges. Toggle which badges show on your card.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                style={{ width: `${(unlocked.length / BADGES.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 font-semibold whitespace-nowrap">
              {unlocked.length} / {BADGES.length} unlocked
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BADGES.map((badge) => {
                const isUnlocked = unlocked.includes(badge.id);
                const isClaimed = claimed.includes(badge.id);
                const isWorking = working === badge.id;

                return (
                  <button
                    key={badge.id}
                    onClick={() => toggleClaimed(badge.id)}
                    disabled={!isUnlocked || isWorking}
                    className={`relative flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      isClaimed && isUnlocked
                        ? "border-purple-500/50 bg-purple-500/[0.06]"
                        : isUnlocked
                        ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                        : "border-white/5 bg-white/[0.01] opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className="flex-shrink-0 h-12 w-12 rounded-full grid place-items-center"
                      style={{
                        background: isUnlocked ? `${badge.color}15` : "rgba(255,255,255,0.03)",
                        border: isUnlocked
                          ? `1px solid ${badge.color}40`
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {isUnlocked ? (
                        <BadgeIcon
                          icon={badge.icon}
                          className="h-6 w-6"
                          color={badge.color}
                          strokeWidth={2.2}
                        />
                      ) : (
                        <Lock className="h-5 w-5 text-zinc-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isUnlocked ? "text-white" : "text-zinc-500"}`}>
                          {badge.name}
                        </span>
                        {isUnlocked && isClaimed && (
                          <Check className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" strokeWidth={3} />
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${isUnlocked ? "text-zinc-500" : "text-zinc-600"}`}>
                        {badge.description}
                      </div>
                      {!isUnlocked && (
                        <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-600 mt-2">
                          🔒 Locked
                        </div>
                      )}
                    </div>

                    {isUnlocked && (
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded-md border-2 grid place-items-center transition ${
                          isClaimed
                            ? "bg-purple-500 border-purple-500"
                            : "border-white/20"
                        }`}
                      >
                        {isClaimed && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}