"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";

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

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
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

              {/* Forgot password link — right under the password field */}
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