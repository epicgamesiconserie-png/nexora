"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";

/* ─── Smoke grenade SVG — white version for the login page ─── */
function SmokeGrenade({
  size = 60,
  rotation = 0,
  opacity = 0.15,
  color = "#ffffff",
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
      {/* Smoke puff */}
      <g fill={color} opacity="0.85">
        <circle cx="13" cy="19" r="3.2" />
        <circle cx="19" cy="15" r="4.2" />
        <circle cx="25" cy="13" r="3.4" />
        <circle cx="17" cy="22" r="2.4" />
        <circle cx="22" cy="19" r="2.8" />
      </g>

      {/* Ring pull */}
      <circle
        cx="44"
        cy="14"
        r="4"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
      />

      {/* Cap plate */}
      <path d="M30 20 L42 20 L43 25 L29 25 Z" fill={color} opacity="0.9" />

      {/* Body */}
      <path
        d="M29 25 L43 25 L44 52 L28 52 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Dots */}
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

      {/* Base plate */}
      <path d="M26 52 L46 52 L46 56 L26 56 Z" fill={color} opacity="0.85" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(j.error || "Login failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  /* Scattered white grenades — deterministic layout */
  const grenades: {
    top: string;
    left: string;
    size: number;
    rotation: number;
    opacity: number;
  }[] = [
    { top: "6%",   left: "4%",   size: 70,  rotation: -22, opacity: 0.08 },
    { top: "10%",  left: "88%",  size: 55,  rotation: 28,  opacity: 0.07 },
    { top: "26%",  left: "2%",   size: 90,  rotation: 15,  opacity: 0.06 },
    { top: "34%",  left: "94%",  size: 65,  rotation: -40, opacity: 0.08 },
    { top: "52%",  left: "5%",   size: 80,  rotation: 35,  opacity: 0.06 },
    { top: "66%",  left: "92%",  size: 100, rotation: -10, opacity: 0.07 },
    { top: "82%",  left: "3%",   size: 60,  rotation: 48,  opacity: 0.08 },
    { top: "90%",  left: "86%",  size: 75,  rotation: -30, opacity: 0.06 },
  ];

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Small scattered white grenades — texture layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
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

      {/* smokez.lol grenade + wordmark top-left */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <SmokeLogoWordmark />
        </Link>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(15, 15, 20, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-zinc-400 mt-2">
              Log in to your smokez.lol account.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Username or Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-white/30 transition">
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="yourname"
                  autoComplete="username"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-white/30 transition">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-white/50 text-center mt-6">
            New here?{" "}
            <Link href="/register" className="text-white hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}