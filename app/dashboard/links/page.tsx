"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  FaYoutube, FaTwitch, FaTiktok, FaDiscord, FaFacebook, FaSpotify,
  FaInstagram, FaXTwitter, FaTelegram, FaPaypal, FaSteam, FaBitcoin,
} from "react-icons/fa6";
import { FaXbox } from "react-icons/fa";
import {
  SiRoblox, SiGithub, SiCashapp, SiVenmo, SiPlaystation,
  SiOnlyfans, SiKick, SiLitecoin, SiSolana, SiApplemusic,
} from "react-icons/si";
import {
  LayoutDashboard, Link2, Palette, Music,
  LogOut, Crown, Home, Award, X, Trash2, Pencil, Eye, GripVertical,
  ExternalLink,
} from "lucide-react";

type Platform = {
  key: string;
  name: string;
  color: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  placeholder: string;
};

const PLATFORMS: Platform[] = [
  { key: "youtube",     name: "YouTube",     color: "#FF0000", Icon: FaYoutube,     placeholder: "https://youtube.com/@yourhandle" },
  { key: "twitch",      name: "Twitch",      color: "#9146FF", Icon: FaTwitch,      placeholder: "https://twitch.tv/yourname" },
  { key: "tiktok",      name: "TikTok",      color: "#FFFFFF", Icon: FaTiktok,      placeholder: "https://tiktok.com/@yourhandle" },
  { key: "discord",     name: "Discord",     color: "#5865F2", Icon: FaDiscord,     placeholder: "https://discord.gg/invite" },
  { key: "facebook",    name: "Facebook",    color: "#1877F2", Icon: FaFacebook,    placeholder: "https://facebook.com/yourname" },
  { key: "spotify",     name: "Spotify",     color: "#1DB954", Icon: FaSpotify,     placeholder: "https://open.spotify.com/user/..." },
  { key: "instagram",   name: "Instagram",   color: "#E4405F", Icon: FaInstagram,   placeholder: "https://instagram.com/yourhandle" },
  { key: "x",           name: "X (Twitter)", color: "#FFFFFF", Icon: FaXTwitter,    placeholder: "https://x.com/yourhandle" },
  { key: "telegram",    name: "Telegram",    color: "#26A5E4", Icon: FaTelegram,    placeholder: "https://t.me/yourhandle" },
  { key: "paypal",      name: "PayPal",      color: "#00457C", Icon: FaPaypal,      placeholder: "https://paypal.me/yourname" },
  { key: "roblox",      name: "Roblox",      color: "#FFFFFF", Icon: SiRoblox,      placeholder: "https://roblox.com/users/..." },
  { key: "github",      name: "GitHub",      color: "#FFFFFF", Icon: SiGithub,      placeholder: "https://github.com/yourhandle" },
  { key: "cashapp",     name: "CashApp",     color: "#00D632", Icon: SiCashapp,     placeholder: "https://cash.app/$yourtag" },
  { key: "venmo",       name: "Venmo",       color: "#3D95CE", Icon: SiVenmo,       placeholder: "https://venmo.com/u/yourname" },
  { key: "playstation", name: "PlayStation", color: "#003791", Icon: SiPlaystation, placeholder: "https://psnprofiles.com/yourname" },
  { key: "xbox",        name: "Xbox",        color: "#107C10", Icon: FaXbox,        placeholder: "https://xbox.com/play/user/yourname" },
  { key: "applemusic",  name: "Apple Music", color: "#FA243C", Icon: SiApplemusic,  placeholder: "https://music.apple.com/..." },
  { key: "onlyfans",    name: "OnlyFans",    color: "#00AFF0", Icon: SiOnlyfans,    placeholder: "https://onlyfans.com/yourname" },
  { key: "steam",       name: "Steam",       color: "#FFFFFF", Icon: FaSteam,       placeholder: "https://steamcommunity.com/id/yourname" },
  { key: "kick",        name: "Kick",        color: "#53FC18", Icon: SiKick,        placeholder: "https://kick.com/yourname" },
  { key: "bitcoin",     name: "Bitcoin",     color: "#F7931A", Icon: FaBitcoin,     placeholder: "Your BTC wallet address" },
  { key: "ltc",         name: "Litecoin",    color: "#345D9D", Icon: SiLitecoin,    placeholder: "Your LTC wallet address" },
  { key: "solana",      name: "Solana",      color: "#9945FF", Icon: SiSolana,      placeholder: "Your SOL wallet address" },
];

type Social = { id: string; platform: string; url: string; position: number };

export default function LinksPage() {
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [socials, setSocials] = useState<Social[]>([]);
  const [openPlatform, setOpenPlatform] = useState<Platform | null>(null);
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/socials")
      .then((r) => r.json())
      .then((data) => setSocials(data.socials || []))
      .catch(() => toast.error("Failed to load socials"));

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
      })
      .catch(() => {});
  }, []);

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customize", href: "/dashboard/customize", icon: Palette },
    { name: "Links", href: "/dashboard/links", icon: Link2 },
    { name: "Music", href: "/dashboard/music", icon: Music },
    { name: "My Page", href: username ? `/u/${username}` : "#", icon: Home, external: true },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Premium", href: "/dashboard/premium", icon: Crown },
  ];

  function openAddModal(platform: Platform) {
    setOpenPlatform(platform);
    setEditingSocial(null);
    setUrlValue("");
  }

  function openEditModal(social: Social) {
    const platform = PLATFORMS.find((p) => p.key === social.platform);
    if (!platform) return;
    setOpenPlatform(platform);
    setEditingSocial(social);
    setUrlValue(social.url);
  }

  function closeModal() {
    setOpenPlatform(null);
    setEditingSocial(null);
    setUrlValue("");
  }

  async function saveSocial() {
    if (!openPlatform || !urlValue.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    setSaving(true);

    if (editingSocial) {
      const r = await fetch("/api/socials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingSocial.id, url: urlValue.trim() }),
      });
      const data = await r.json();
      setSaving(false);
      if (!r.ok) return toast.error(data.error || "Failed to update");
      setSocials((prev) => prev.map((s) => (s.id === editingSocial.id ? data.social : s)));
      toast.success("Updated");
    } else {
      const r = await fetch("/api/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: openPlatform.key, url: urlValue.trim() }),
      });
      const data = await r.json();
      setSaving(false);
      if (!r.ok) return toast.error(data.error || "Failed to save");
      setSocials((prev) => [...prev, data.social]);
      toast.success(`${openPlatform.name} added`);
    }
    closeModal();
  }

  async function deleteSocial(id: string) {
    if (!confirm("Delete this link?")) return;
    const r = await fetch(`/api/socials?id=${id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("Failed to delete");
    setSocials((prev) => prev.filter((s) => s.id !== id));
    toast.success("Removed");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden md:flex w-64 flex-col p-4 border-r"
        style={{ background: "rgba(10,10,14,0.85)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
        <Link href="/" className="px-2 py-3 mb-6 flex items-center gap-2">
          <span className="text-2xl">💨</span>
          <span className="text-xl font-bold">smokez.lol</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => {
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Link2 className="h-6 w-6 text-zinc-400" />
              Link your social media profiles.
            </h1>
            <p className="text-sm text-zinc-500 mt-2">Pick a social media to add to your profile.</p>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 mb-8">
            {PLATFORMS.map((p) => {
              const added = socials.some((s) => s.platform === p.key);
              return (
                <button key={p.key} onClick={() => openAddModal(p)}
                  className={`aspect-square rounded-xl border transition flex items-center justify-center group relative ${
                    added ? "border-green-500/40 bg-green-500/5"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25"
                  }`}
                  title={p.name}>
                  <p.Icon className="h-8 w-8 group-hover:scale-110 transition" style={{ color: p.color }} />
                  {added && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-400" />}
                </button>
              );
            })}
          </div>

          {socials.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
                Your Links ({socials.length})
              </h2>
              <div className="flex flex-col gap-3">
                {socials.map((s) => {
                  const platform = PLATFORMS.find((p) => p.key === s.platform);
                  if (!platform) return null;
                  return (
                    <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                          <span className="text-sm font-semibold truncate">{platform.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => openEditModal(s)} className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-white/5" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <Link href={s.url} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-white/5" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button onClick={() => deleteSocial(s.id)} className="p-2 text-zinc-500 hover:text-red-400 transition rounded-lg hover:bg-red-500/10" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-lg grid place-items-center" style={{ background: `${platform.color}15` }}>
                          <platform.Icon className="h-5 w-5" style={{ color: platform.color }} />
                        </div>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition truncate">
                          {s.url.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {socials.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-zinc-500">No links added yet. Click an icon above to add your first one.</p>
            </div>
          )}
        </div>
      </main>

      {openPlatform && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <openPlatform.Icon className="h-6 w-6" style={{ color: openPlatform.color }} />
                <h2 className="text-lg font-bold">{editingSocial ? "Edit" : "Add"} {openPlatform.name}</h2>
              </div>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">URL</label>
                <input value={urlValue} onChange={(e) => setUrlValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveSocial()}
                  placeholder={openPlatform.placeholder} autoFocus
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus:border-white/30 placeholder:text-white/35" />
              </div>
              <button onClick={saveSocial} disabled={saving}
                className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition disabled:opacity-50">
                {saving ? "Saving..." : editingSocial ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}