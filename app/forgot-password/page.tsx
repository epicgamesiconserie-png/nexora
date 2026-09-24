"use client";
import { useState } from "react";
import Link from "next/link";

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
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#7c5cff]/20 blur-[140px]" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#a08bff] grid place-items-center font-bold">
            N
          </div>
          <span className="font-semibold tracking-tight">NEXORA</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#111118]/60 backdrop-blur p-8">
          {!done ? (
            <>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-sm text-white/50 mt-1">
                Enter your email and we&apos;ll send a reset link.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
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
                  className="w-full h-12 rounded-xl bg-[#7c5cff] hover:bg-[#a08bff] font-medium transition disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="text-sm text-white/50 text-center mt-6">
                <Link href="/login" className="text-[#a08bff] hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-white/50 mt-2">
                If an account exists for <span className="text-white">{email}</span>, we&apos;ve
                sent a reset link. It expires in 30 minutes.
              </p>

              {devUrl && (
                <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs">
                  <p className="text-emerald-300 font-semibold mb-2">
                    DEV MODE — no email service configured yet
                  </p>
                  <p className="text-white/60 mb-2">Click this link to reset your password:</p>
                  <a
                    href={devUrl}
                    className="text-[#a08bff] break-all underline hover:text-white"
                  >
                    {devUrl}
                  </a>
                </div>
              )}

              <p className="text-sm text-white/50 text-center mt-6">
                <Link href="/login" className="text-[#a08bff] hover:underline">
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