"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import {
  Crown,
  Gem,
  Check,
  CreditCard,
  Ticket,
  Star,
} from "lucide-react";

const FREE_FEATURES = [
  "Basic Customization",
  "Profile Analytics",
  "Basic Effects",
  "Add Your Socials",
];

const PREMIUM_FEATURES = [
  "Exclusive Badge",
  "Profile Layouts",
  "Custom Fonts",
  "Typewriter Animation",
  "Special Profile Effects",
  "Advanced Customization",
  "Command Panel",
];

export default function PricingPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setLoggedIn(!!j.success))
      .catch(() => setLoggedIn(false))
      .finally(() => setChecked(true));
  }, []);

  function handleBuy() {
    if (loggedIn) {
      router.push("/dashboard/premium");
    } else {
      router.push("/register");
    }
  }

  function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    if (loggedIn) {
      router.push(`/dashboard/premium?code=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/register?code=${encodeURIComponent(trimmed)}`);
    }
  }

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

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <SmokeLogoWordmark />
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition font-semibold"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-4 py-1.5 text-xs font-semibold text-yellow-200/90 uppercase tracking-wider">
            <Crown className="h-3.5 w-3.5" />
            Plans
          </div>
          <h1
            className="mt-6 text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              textShadow:
                "0 1px 0 rgba(255,255,255,0.9), 0 2px 0 rgba(200,200,200,0.5), 0 0 30px rgba(255,255,255,0.35)",
            }}
          >
            Upgrade your profile
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Buy Premium below or redeem a code.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* FREE CARD */}
          <div
            className="relative rounded-2xl p-7 flex flex-col"
            style={{
              background: "rgba(15, 15, 20, 0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div>
              <h2 className="text-xl font-bold">Free</h2>
              <p className="text-xs text-zinc-500 mt-1">
                For beginners starting out.
              </p>

              <div className="mt-6 mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-xs text-zinc-500">/lifetime</span>
              </div>

              <div className="border-t border-white/5 pt-6">
                <ul className="space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="h-5 w-5 rounded-full grid place-items-center bg-white/5 border border-white/10 flex-shrink-0">
                        <Check className="h-3 w-3 text-zinc-400" />
                      </span>
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1" />

            <button
              disabled
              className="mt-8 w-full h-12 rounded-xl border border-white/10 bg-white/[0.02] text-sm font-semibold text-zinc-400 cursor-not-allowed"
            >
              Your Current Plan
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div
            className="relative rounded-2xl p-7 flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(30,20,5,0.9) 0%, rgba(40,26,8,0.9) 100%)",
              border: "1px solid rgba(234, 179, 8, 0.45)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 30px 80px -40px rgba(234, 179, 8, 0.7), 0 0 60px -20px rgba(234, 179, 8, 0.35) inset",
            }}
          >
            {/* Most Popular badge */}
            <div className="absolute -top-3 right-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                <Star className="h-3 w-3 fill-black" />
                Most Popular
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-yellow-300">
                  Premium
                </h2>
              </div>
              <p className="text-xs text-yellow-200/70 mt-1">
                Unlock everything. Pay once.
              </p>

              <div className="mt-6 mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-yellow-50">
                  5.80€
                </span>
                <span className="text-xs text-yellow-200/60">/lifetime</span>
              </div>

              <div className="border-t border-yellow-500/20 pt-6">
                <ul className="space-y-3">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="h-5 w-5 rounded-full grid place-items-center bg-yellow-500/15 border border-yellow-500/30 flex-shrink-0">
                        <Check className="h-3 w-3 text-yellow-400" />
                      </span>
                      <span className="text-yellow-50/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1" />

            <button
              onClick={handleBuy}
              className="mt-8 w-full h-12 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm transition flex items-center justify-center gap-2"
              style={{
                boxShadow: "0 0 30px rgba(234, 179, 8, 0.4)",
              }}
            >
              <CreditCard className="h-4 w-4" />
              Buy Premium — 5.80€
            </button>
          </div>
        </div>

        {/* Redeem card */}
        <div className="max-w-4xl mx-auto mt-8">
          <div
            className="rounded-2xl p-6 md:p-7"
            style={{
              background: "rgba(15, 15, 20, 0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl grid place-items-center flex-shrink-0 border border-purple-500/30 bg-purple-500/10">
                <Ticket className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h3 className="font-bold text-base">Have a code?</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Redeem it here for free premium.
                </p>
              </div>
            </div>

            <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SMKZ-XXXX-XXXX"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-mono outline-none focus:border-purple-500/50 placeholder:text-white/25"
                disabled={!checked}
              />
              <button
                type="submit"
                disabled={!checked || !code.trim()}
                className="h-12 px-6 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Redeem
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}