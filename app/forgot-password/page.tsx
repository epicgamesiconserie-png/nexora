"use client";
import Link from "next/link";
import { useState } from "react";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(j.error || "Something went wrong");
      return;
    }
    setDone(true);
    if (j.devUrl) setDevUrl(j.devUrl);
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

      {/* Card */}
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
          {!done ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-sm text-zinc-400 mt-2">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Email
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-white/30 transition">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                    />
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
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="text-sm text-white/50 text-center mt-6">
                <Link href="/login" className="text-white hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                  Check Your Email
                </h1>
                <p className="text-sm text-zinc-400 mt-2">
                  If an account exists for{" "}
                  <span className="text-white">{email}</span>, we&apos;ve sent a
                  reset link. It expires in 30 minutes.
                </p>
              </div>

              {devUrl && (
                <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs">
                  <p className="text-emerald-300 font-semibold mb-2">
                    DEV MODE — no email service configured yet
                  </p>
                  <p className="text-white/60 mb-2">
                    Click this link to reset your password:
                  </p>
                  <a
                    href={devUrl}
                    className="text-white break-all underline hover:opacity-80"
                  >
                    {devUrl}
                  </a>
                </div>
              )}

              <p className="text-sm text-white/50 text-center mt-6">
                <Link href="/login" className="text-white hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}