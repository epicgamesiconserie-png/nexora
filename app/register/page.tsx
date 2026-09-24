"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username.length < 3) {
      setStatus("idle");
      setMsg("");
      return;
    }
    setStatus("checking");
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/check-username?u=${encodeURIComponent(username)}`);
        const j = await r.json();
        if (j.available) {
          setStatus("available");
          setMsg("Username available");
        } else {
          setStatus("taken");
          setMsg(j.reason || "Taken");
        }
      } catch {
        setStatus("idle");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [username]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const r = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(j.error || "Registration failed");
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
          <h1 className="text-2xl font-bold">Claim your name</h1>
          <p className="text-sm text-white/50 mt-1">Pick a unique username. It&apos;s yours forever.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Username</label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-white/[0.02] px-3 ${
                  status === "taken" ? "border-red-500/60" : "border-[#1c1c26]"
                } focus-within:border-[#7c5cff]/60`}
              >
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  autoComplete="off"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
                {username.length >= 3 && status !== "idle" && (
                  <span className="text-xs">
                    {status === "checking" && <span className="text-white/40">…</span>}
                    {status === "available" && <span className="text-emerald-400">✓</span>}
                    {status === "taken" && <span className="text-red-400">✕</span>}
                  </span>
                )}
              </div>
              <p
                className={`mt-1.5 text-xs ${
                  status === "available"
                    ? "text-emerald-400"
                    : status === "taken"
                    ? "text-red-400"
                    : "text-white/40"
                }`}
              >
                {username.length >= 3 && msg
                  ? (status === "available" ? "✓ " : "✕ ") + msg
                  : "3–20 characters · letters, numbers, _ and -"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
              <p className="mt-1.5 text-xs text-white/40">Used for password recovery</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
              <p className="mt-1.5 text-xs text-white/40">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Confirm password</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#1c1c26] bg-white/[0.02] px-3 focus-within:border-[#7c5cff]/60">
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
              disabled={loading || status === "taken"}
              className="w-full h-12 rounded-xl bg-[#7c5cff] hover:bg-[#a08bff] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-white/50 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#a08bff] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}