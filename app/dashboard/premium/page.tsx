"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { redeemPremiumCode } from "./actions";
import {
  LayoutDashboard, Link2, Palette, Music, BarChart3,
  LogOut, Crown, Home, Award, ExternalLink, Ticket, Check,
  ShieldCheck, Clock, Gem, Gift, CreditCard, Loader2,
} from "lucide-react";

function PremiumPageInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [buying, setBuying] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadProfile() {
    try {
      const r = await fetch("/api/user/profile");
      const d = await r.json();
      if (d.username) setUsername(d.username);
      if (d.isPremium) setIsPremium(true);
      if (d.premiumUntil) setPremiumUntil(new Date(d.premiumUntil).toLocaleDateString());
      if (d.role === "admin") setIsAdmin(true);
    } catch {}
  }

  useEffect(() => {
    loadProfile();
    if (searchParams.get("success") === "true") {
      toast.success("Payment received! Activating premium...");
      setTimeout(() => loadProfile(), 2000);
      setTimeout(() => loadProfile(), 5000);
    }
    if (searchParams.get("cancelled") === "true") {
      toast.info("Checkout cancelled");
    }
  }, [searchParams]);

  const sidebar = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
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

  async function handleRedeem() {
    if (!code.trim()) {
      toast.error("Enter a code");
      return;
    }
    setRedeeming(true);
    const res = await redeemPremiumCode(code);
    setRedeeming(false);
    if (res.success) {
      toast.success(res.message);
      setCode("");
      await loadProfile();
    } else {
      toast.error(res.message);
    }
  }

  async function handleBuy() {
    setBuying(true);
    try {
      const r = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await r.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
        setBuying(false);
      }
    } catch {
      toast.error("Failed to start checkout");
      setBuying(false);
    }
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

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-4">
              <Crown className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                Plans
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Upgrade your profile
            </h1>
            <p className="text-sm text-zinc-500 mt-3 max-w-md mx-auto">
              {isPremium
                ? `You're on Premium until ${premiumUntil}`
                : "Buy Premium below or redeem a code."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* FREE CARD */}
            <div
              className="relative rounded-3xl border p-8 flex flex-col"
              style={{
                background: "rgba(18,18,24,0.6)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white">Free</h2>
                <p className="text-sm text-zinc-500 mt-1">For beginners starting out.</p>
                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-5xl font-bold tracking-tight">€0</span>
                  <span className="text-sm text-zinc-500 mb-2">/lifetime</span>
                </div>
              </div>

              <div className="h-px w-full mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />

              <ul className="space-y-4 flex-1 mb-8">
                <FeatureRow label="Basic Customization" />
                <FeatureRow label="Profile Analytics" />
                <FeatureRow label="Basic Effects" />
                <FeatureRow label="Add Your Socials" />
              </ul>

              <div
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm"
                style={{
                  background: isPremium ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                  color: isPremium ? "rgb(134,239,172)" : "rgba(255,255,255,0.5)",
                  border: isPremium
                    ? "1px solid rgba(34,197,94,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {isPremium ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} />
                    Included with Premium
                  </>
                ) : (
                  "Your Current Plan"
                )}
              </div>
            </div>

            {/* PREMIUM CARD */}
            <div className="relative">
              <div
                className="absolute -inset-[2px] rounded-3xl opacity-80 pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 140deg at 50% 50%, #fbbf24, #f59e0b, #fcd34d, #f59e0b, #fbbf24)",
                  filter: "blur(14px)",
                }}
              />
              <div
                className="absolute -inset-[1px] rounded-3xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.6), rgba(245,158,11,0.2), rgba(251,191,36,0.6))",
                }}
              />

              <div
                className="relative rounded-3xl p-8 flex flex-col h-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(30,20,10,0.95), rgba(15,10,5,0.98))",
                }}
              >
                <div
                  className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    color: "#1a1206",
                    boxShadow: "0 4px 14px -4px rgba(251,191,36,0.6)",
                  }}
                >
                  ★ Most Popular
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <Gem className="h-5 w-5 text-yellow-400" />
                    <h2 className="text-xl font-bold text-yellow-100">Premium</h2>
                  </div>
                  <p className="text-sm text-yellow-200/60 mt-1">Unlock everything. Pay once.</p>
                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="text-5xl font-bold tracking-tight text-yellow-50">7.99€</span>
                    <span className="text-sm text-yellow-200/50 mb-2">/lifetime</span>
                  </div>
                </div>

                <div className="h-px w-full mb-6" style={{ background: "rgba(251,191,36,0.15)" }} />

                <ul className="space-y-4 flex-1 mb-8">
                  <FeatureRow label="Exclusive Badge" gold />
                  <FeatureRow label="Profile Layouts" gold />
                  <FeatureRow label="Custom Fonts" gold />
                  <FeatureRow label="Typewriter Animation" gold />
                  <FeatureRow label="Special Profile Effects" gold />
                  <FeatureRow label="Advanced Customization" gold />
                  <FeatureRow label="Command Panel" gold />
                </ul>

                {isPremium ? (
                  <div
                    className="relative w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 text-sm overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      color: "#1a1206",
                      border: "1px solid rgba(251,191,36,0.8)",
                      boxShadow: "0 8px 30px -8px rgba(251,191,36,0.7), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3.5} />
                    Active Premium
                  </div>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="relative w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 text-sm overflow-hidden transition disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      color: "#1a1206",
                      border: "1px solid rgba(251,191,36,0.8)",
                      boxShadow: "0 8px 30px -8px rgba(251,191,36,0.7), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    {buying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Buy Premium — 7.99€
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Redeem code box */}
          <div
            className="rounded-3xl border p-8"
            style={{
              background: "rgba(18,18,24,0.5)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-9 w-9 rounded-xl grid place-items-center"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.3)",
                }}
              >
                <Ticket className="h-4 w-4 text-purple-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Have a code?</h2>
                <p className="text-xs text-zinc-500">Redeem it here for free premium.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="SMKZ-XXXX-XXXX"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-mono tracking-[0.15em] outline-none focus:border-white/30 placeholder:text-white/25 placeholder:tracking-wider"
              />
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="h-12 px-7 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold transition disabled:opacity-50 whitespace-nowrap"
              >
                {redeeming ? "..." : "Redeem"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureRow({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <li className="flex items-center gap-3 group">
      <span
        className="h-5 w-5 rounded-full grid place-items-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
        style={{
          background: gold ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.04)",
          border: gold
            ? "1px solid rgba(251,191,36,0.35)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: gold ? "0 0 10px -2px rgba(251,191,36,0.4)" : "none",
        }}
      >
        <Check
          className={`h-3 w-3 ${gold ? "text-yellow-300" : "text-zinc-500"}`}
          strokeWidth={3.5}
        />
      </span>
      <span
        className={`text-sm transition-colors ${
          gold
            ? "text-yellow-50/90 font-medium group-hover:text-yellow-100"
            : "text-zinc-400 group-hover:text-zinc-200"
        }`}
      >
        {label}
      </span>
    </li>
  );
}

export default function PremiumPage() {
  return (
    <Suspense fallback={null}>
      <PremiumPageInner />
    </Suspense>
  );
}