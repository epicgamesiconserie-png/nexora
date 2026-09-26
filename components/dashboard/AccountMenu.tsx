"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Pencil,
  Monitor,
  Link as LinkIcon,
  Settings,
  Upload,
  Type,
  Eye,
  ExternalLink,
  Copy,
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
  const [openAlias, setOpenAlias] = useState(false);
  const [openDiscord, setOpenDiscord] = useState(false);
  const [openGoogle, setOpenGoogle] = useState(false);

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
          <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
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
          <PanelButton
            Icon={LinkIcon}
            label="Manage Aliases"
            onClick={() => setOpenAlias(true)}
          />
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>

          <div className="my-2 border-t border-white/10" />

          <Link
            href="/dashboard/customize"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <Upload className="h-4 w-4" />
            Upload an Avatar
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <Type className="h-4 w-4" />
            Add a Description
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <Eye className="h-4 w-4" />
            Reach 10 Profile Views
          </Link>
        </div>
      </div>

      {/* Connections */}
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
          Connections
        </h3>
        <p className="text-xs text-zinc-500 mb-5">
          Connect your Discord or Google account with smokez.lol.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setOpenDiscord(true)}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <DiscordIcon />
            Connect Discord
          </button>
          <button
            onClick={() => setOpenGoogle(true)}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition"
          >
            <GoogleIcon />
            Connect Google
          </button>
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
      <GenericModal
        open={openAlias}
        onClose={() => setOpenAlias(false)}
        title="Manage Aliases"
        subtitle="Aliases let you redirect other links to your profile."
      >
        <p className="text-sm text-zinc-400">
          Alias management is coming soon.
        </p>
      </GenericModal>
      <GenericModal
        open={openDiscord}
        onClose={() => setOpenDiscord(false)}
        title="Connect Discord"
        subtitle="Link your Discord account to smokez.lol."
      >
        <p className="text-sm text-zinc-400 mb-4">
          Click the button below to authorize smokez.lol with your Discord account.
        </p>
        <button
          onClick={() => toast.info("Discord OAuth coming soon")}
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition"
        >
          Authorize with Discord
        </button>
      </GenericModal>
      <GenericModal
        open={openGoogle}
        onClose={() => setOpenGoogle(false)}
        title="Connect Google"
        subtitle="Link your Google account to smokez.lol."
      >
        <p className="text-sm text-zinc-400 mb-4">
          Click the button below to authorize smokez.lol with your Google account.
        </p>
        <button
          onClick={() => toast.info("Google OAuth coming soon")}
          className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition"
        >
          Authorize with Google
        </button>
      </GenericModal>
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

function GenericModal({
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
  return (
    <ModalBase open={open} onClose={onClose} title={title} subtitle={subtitle}>
      {children}
    </ModalBase>
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

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}