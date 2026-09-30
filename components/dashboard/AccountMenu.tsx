"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Pencil,
  Monitor,
  Upload,
  Type,
  ExternalLink,
  Copy,
  Award,
  Palette,
  Crown,
  Link2,
} from "lucide-react";

export function AccountMenu({
  initialUsername,
  initialDisplayName,
}: {
  initialUsername: string;
  initialDisplayName: string;
}) {
  const [openUsername, setOpenUsername] = useState(false);
  const [openDisplayName, setOpenDisplayName] = useState(false);

  const profileUrl = `/u/${initialUsername}`;

  function copyProfileUrl() {
    const full =
      typeof window !== "undefined"
        ? `${window.location.origin}${profileUrl}`
        : profileUrl;
    navigator.clipboard
      .writeText(full)
      .then(() => toast.success("Profile link copied!"))
      .catch(() => toast.error("Failed to copy"));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Preview card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(15,15,20,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <h3
          className="text-base font-bold mb-1"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}
        >
          Your public page
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          See how your profile looks to visitors.
        </p>

        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">
          <Link2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">smokez.lol{profileUrl}</span>
        </div>

        <div className="flex gap-2">
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <ExternalLink className="h-4 w-4" />
            Preview
          </Link>
          <button
            type="button"
            onClick={copyProfileUrl}
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] hover:border-white/20 transition"
            title="Copy link"
          >
            <Copy className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Manage your account */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(15,15,20,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <h3
          className="text-base font-bold mb-1"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}
        >
          Manage your account
        </h3>
        <p className="text-xs text-zinc-500 mb-5">
          Change your email, username and more.
        </p>

        <div className="flex flex-col gap-2">
          <PanelButton
            Icon={Pencil}
            label="Change Username"
            onClick={() => setOpenUsername(true)}
          />
          <PanelButton
            Icon={Monitor}
            label="Change Display Name"
            onClick={() => setOpenDisplayName(true)}
          />
          <PanelLink
            href="/dashboard/badges"
            Icon={Award}
            label="Badges"
          />
          <PanelLink
            href="/dashboard/customize"
            Icon={Palette}
            label="Customize"
          />

          <div className="my-2 border-t border-white/10" />

          <PanelLink
            href="/dashboard/customize"
            Icon={Upload}
            label="Upload an Avatar"
          />
          <PanelLink
            href="/dashboard/premium"
            Icon={Crown}
            label="Premium"
          />
          <PanelLink
            href="/dashboard/links"
            Icon={Type}
            label="Links"
          />
        </div>
      </div>

      {/* Modals */}
      <ChangeUsernameModal
        open={openUsername}
        onClose={() => setOpenUsername(false)}
        currentUsername={initialUsername}
      />
      <ChangeDisplayNameModal
        open={openDisplayName}
        onClose={() => setOpenDisplayName(false)}
        initialDisplayName={initialDisplayName}
      />
    </div>
  );
}

/* ============================================================
   Change Username Modal
   ============================================================ */
function ChangeUsernameModal({
  open,
  onClose,
  currentUsername,
}: {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function checkAvailability(v: string) {
    const trimmed = v.trim();

    if (trimmed.length === 0) {
      setAvailable(null);
      setReason(null);
      return;
    }

    if (trimmed.toLowerCase() === currentUsername.toLowerCase()) {
      setAvailable(true);
      setReason("This is your current username");
      return;
    }

    setChecking(true);
    try {
      const r = await fetch(
        `/api/check-username?u=${encodeURIComponent(trimmed)}`
      );
      const j = await r.json();

      const payload = j?.data ?? j;
      const isAvail = payload?.available === true;

      setAvailable(isAvail);
      setReason(
        isAvail ? null : payload?.reason || "That username is already taken."
      );
    } catch {
      setAvailable(null);
      setReason(null);
    }
    setChecking(false);
  }

  async function save() {
    setError("");
    const trimmed = username.trim();

    if (trimmed.length === 0) {
      setError("Username can't be empty");
      return;
    }
    if (available === false) {
      setError(reason || "That username is already taken");
      return;
    }

    setSaving(true);
    const r = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: trimmed }),
    });
    const j = await r.json();
    setSaving(false);

    if (!r.ok) {
      setError(j.error || "Failed to update username");
      return;
    }
    toast.success("Username updated");
    onClose();
    router.refresh();
  }

  const isSameAsCurrent =
    username.trim().toLowerCase() === currentUsername.toLowerCase();

  return (
    <ModalBase open={open} onClose={onClose} title="Change Username">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              checkAvailability(e.target.value);
            }}
            placeholder="yourname"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/30 placeholder:text-white/35"
          />
          <p
            className={`mt-1.5 text-xs ${
              checking
                ? "text-zinc-500"
                : available === true
                ? "text-emerald-400"
                : available === false
                ? "text-red-400"
                : "text-zinc-500"
            }`}
          >
            {checking
              ? "Checking…"
              : available === true
              ? isSameAsCurrent
                ? "This is your current username"
                : "✓ Username available"
              : available === false
              ? `✕ ${reason || "That username is already taken."}`
              : "Type any username"}
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving || available === false}
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Change Username"}
        </button>
      </div>
    </ModalBase>
  );
}

/* ============================================================
   Change Display Name Modal
   ============================================================ */
function ChangeDisplayNameModal({
  open,
  onClose,
  initialDisplayName,
}: {
  open: boolean;
  onClose: () => void;
  initialDisplayName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialDisplayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setError("");
    if (!name.trim()) {
      setError("Display name can't be empty");
      return;
    }
    setSaving(true);
    const r = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name.trim() }),
    });
    const j = await r.json();
    setSaving(false);
    if (!r.ok) {
      setError(j.error || "Failed to update display name");
      return;
    }
    toast.success("Display name updated");
    onClose();
    router.refresh();
  }

  return (
    <ModalBase open={open} onClose={onClose} title="Change Display Name">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/30 placeholder:text-white/35"
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            You can set this to anything — even if someone else is using it.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Change Display Name"}
        </button>
      </div>
    </ModalBase>
  );
}

/* === Helpers === */

function PanelButton({
  Icon,
  label,
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition text-left"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function PanelLink({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function ModalBase({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "rgba(15,15,20,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition text-lg leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}