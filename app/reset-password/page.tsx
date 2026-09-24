"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Missing reset token");
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const r = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) {
      setError(j.error || "Reset failed");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111118]/60 backdrop-blur p-8">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <p className="text-sm text-white/50 mt-1">
        Choose a new password for your account.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">New password</label>
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
          disabled={loading || !token}
          className="w-full h-12 rounded-xl bg-[#7c5cff] hover:bg-[#a08bff] font-medium transition disabled:opacity-50"
        >
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="text-sm text-white/50 text-center mt-6">
        <Link href="/login" className="text-[#a08bff] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={<div className="text-center text-white/50">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}