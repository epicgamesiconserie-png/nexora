"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">(
    "idle"
  );
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (username.length < 1) {
      setStatus("idle");
      setMsg("");
      return;
    }
    setStatus("checking");
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/check-username?u=${encodeURIComponent(username)}`
        );
        const j = await r.json();

        // Accept both response shapes: { data: {...} } OR {...}
        const payload = j?.data ?? j;
        const isAvail = payload?.available === true;

        if (isAvail) {
          setStatus("available");
          setMsg("Username available");
        } else {
          setStatus("taken");
          setMsg(payload?.reason || "That username is already taken.");
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
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
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

      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold tracking-tight text-white text-2xl">
            smokez
            <span className="text-zinc-500">.</span>
            lol
          </span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-16">
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
            <h1 className="text-3xl font-bold tracking-tight">
              Claim Your Name
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Pick a unique username. It&apos;s yours forever.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Username
              </label>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-white/[0.03] px-3 transition ${
                  status === "taken"
                    ? "border-red-500/60"
                    : "border-white/10 focus-within:border-white/30"
                }`}
              >
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  autoComplete="off"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
                {username.length >= 1 && status !== "idle" && (
                  <span className="text-xs">
                    {status === "checking" && (
                      <span className="text-white/40">…</span>
                    )}
                    {status === "available" && (
                      <span className="text-emerald-400">✓</span>
                    )}
                    {status === "taken" && (
                      <span className="text-red-400">✕</span>
                    )}
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
                {username.length >= 1 && msg
                  ? (status === "available" ? "✓ " : "✕ ") + msg
                  : "1–20 characters · letters, numbers, _ and -"}
              </p>
            </div>

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
                  autoComplete="email"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
            </div>

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
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Confirm password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-white/30 transition">
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
              className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-white/50 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}