"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-white/50 mt-1">Log in with your username or email.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Username or Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="yourname or you@example.com"
                  autoComplete="username"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
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
                  className="text-xs text-white/50 hover:text-[#a08bff]"
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
              className="w-full h-12 rounded-xl bg-[#7c5cff] hover:bg-[#a08bff] font-medium transition disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-white/50 text-center mt-6">
            New here?{" "}
            <Link href="/register" className="text-[#a08bff] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}