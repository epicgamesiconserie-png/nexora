"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createPremiumCode,
  deletePremiumCode,
  listPremiumCodes,
  revokePremium,
} from "./actions";
import {
  LayoutDashboard, Link2, Palette, Music,
  LogOut, Crown, Home, Award, Plus, Trash2, Copy, Check,
  ExternalLink, ShieldCheck, Ticket, Ban,
} from "lucide-react";

type CodeRow = {
  id: string;
  code: string;
  duration: number;
  createdAt: string;
  usedAt: string | null;
  usedBy: { username: string } | null;
  createdBy: { username: string } | null;
};

export default function AdminPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [duration, setDuration] = useState(30);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await listPremiumCodes();
    if ("error" in res) {
      toast.error(res.error);
      setCodes([]);
    } else {
      setCodes(res.codes as any);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.username) setUsername(d.username);
        if (d.role !== "admin") {
          router.replace("/dashboard");
          toast.error("Access denied");
          return;
        }
        setAuthorized(true);
        setChecking(false);
        load();
      })
      .catch(() => router.replace("/dashboard"));
  }, [router]);

  async function handleCreate() {
    setCreating(true);
    const res = await createPremiumCode(duration);
    setCreating(false);
    if (res.success && res.code) {
      setLastCode(res.code);
      toast.success(`Code created: ${res.code}`);
      load();
    } else {
      toast.error(res.error || "Failed to create code");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this code?")) return;
    const res = await deletePremiumCode(id);
    if (res.success) {
      toast.success("Code deleted");
      load();
    } else {
      toast.error(res.error || "Failed");
    }
  }

  async function handleRevoke(id: string, targetUser: string) {
    if (!confirm(`Revoke premium from @${targetUser}?`)) return;
    setRevoking(id);
    const res = await revokePremium(id);
    setRevoking(null);
    if (res.success) {
      toast.success(`Premium revoked from @${targetUser}`);
      load();
    } else {
      toast.error(res.error || "Failed to revoke");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Copied");
    setTimeout(() => setCopied(null), 1500);
  }

  const sidebar = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customize", href: "/dashboard/customize", icon: Palette },
    { name: "Links", href: "/dashboard/links", icon: Link2 },
    { name: "Music", href: "/dashboard/music", icon: Music },
    { name: "My Page", href: username ? `/u/${username}` : "", icon: Home, external: true },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Premium", href: "/dashboard/premium", icon: Crown },
    { name: "Admin", href: "/dashboard/admin", icon: ShieldCheck },
  ];

  if (checking) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-zinc-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

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

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-purple-400" />
              Admin Panel
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Generate premium codes to give away.
            </p>
          </div>

          {/* Create */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-bold mb-4">Generate Premium Code</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={3650}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="h-11 w-32 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm outline-none focus:border-white/30"
                />
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {creating ? "Creating..." : "Generate Code"}
              </button>
            </div>

            {lastCode && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-500/40 bg-green-500/5 p-4">
                <Ticket className="h-5 w-5 text-green-400" />
                <code className="text-lg font-mono font-bold text-green-300">
                  {lastCode}
                </code>
                <button
                  onClick={() => copyCode(lastCode)}
                  className="ml-auto flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/15 hover:bg-white/5 text-xs font-semibold"
                >
                  {copied === lastCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Codes */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-lg font-bold mb-4">All Codes ({codes.length})</h2>

            {loading ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : codes.length === 0 ? (
              <p className="text-sm text-zinc-500">No codes yet. Generate one above.</p>
            ) : (
              <div className="space-y-2">
                {codes.map((c) => {
                  const used = !!c.usedBy;
                  const isRevoking = revoking === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 ${
                        used
                          ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <code className={`font-mono text-sm font-bold ${used ? "text-zinc-400" : "text-white"}`}>
                        {c.code}
                      </code>
                      <span className="text-xs text-zinc-500">{c.duration} days</span>

                      {used ? (
                        <span className="text-xs text-emerald-400 ml-auto">
                          Used by @{c.usedBy?.username}
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-400 ml-auto">Unused</span>
                      )}

                      <button
                        onClick={() => copyCode(c.code)}
                        className="h-8 w-8 rounded-lg grid place-items-center border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition"
                        title="Copy"
                      >
                        {copied === c.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>

                      {used && (
                        <button
                          onClick={() => handleRevoke(c.id, c.usedBy!.username)}
                          disabled={isRevoking}
                          className="h-8 px-3 flex items-center gap-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 text-xs font-semibold transition disabled:opacity-50"
                          title="Revoke premium"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          {isRevoking ? "..." : "Revoke"}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="h-8 w-8 rounded-lg grid place-items-center border border-red-500/30 hover:bg-red-500/10 text-red-400 transition"
                        title="Delete code"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}