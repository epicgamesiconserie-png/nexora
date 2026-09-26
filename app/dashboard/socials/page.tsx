"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import {
  AtSign,
  Camera,
  Video,
  Music,
  Tv,
  Code,
  Briefcase,
  MessageCircle,
  Send,
  Mail,
  Globe,
  Rss,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Platform presets                                                   */
/* ------------------------------------------------------------------ */

type Platform = {
  key: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  placeholder: string;
};

const PLATFORMS: Platform[] = [
  { key: "twitter", label: "Twitter / X", Icon: AtSign, placeholder: "@yourhandle" },
  { key: "instagram", label: "Instagram", Icon: Camera, placeholder: "@yourhandle" },
  { key: "youtube", label: "YouTube", Icon: Video, placeholder: "@yourchannel" },
  { key: "tiktok", label: "TikTok", Icon: Music, placeholder: "@yourhandle" },
  { key: "twitch", label: "Twitch", Icon: Tv, placeholder: "yourchannel" },
  { key: "github", label: "GitHub", Icon: Code, placeholder: "yourusername" },
  { key: "linkedin", label: "LinkedIn", Icon: Briefcase, placeholder: "yourname" },
  { key: "discord", label: "Discord", Icon: MessageCircle, placeholder: "invite code" },
  { key: "telegram", label: "Telegram", Icon: Send, placeholder: "@yourhandle" },
  { key: "email", label: "Email", Icon: Mail, placeholder: "you@email.com" },
  { key: "website", label: "Website", Icon: Globe, placeholder: "https://..." },
  { key: "blog", label: "Blog / RSS", Icon: Rss, placeholder: "https://..." },
];

const getPlatform = (key: string): Platform =>
  PLATFORMS.find((p) => p.key === key) ?? PLATFORMS[0];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Item = {
  id: string;
  platform: string;
  handle: string;
  visible: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 10);

/* ------------------------------------------------------------------ */
/*  Editor                                                             */
/* ------------------------------------------------------------------ */

export default function SocialsEditor() {
  // Seed data — swap for a DB fetch when you're ready.
  const [items, setItems] = useState<Item[]>([
    { id: uid(), platform: "twitter", handle: "@smoke", visible: true },
    { id: uid(), platform: "instagram", handle: "@smoke", visible: true },
    { id: uid(), platform: "youtube", handle: "@smoke", visible: true },
  ]);

  const [platform, setPlatform] = useState<string>("twitter");
  const [handle, setHandle] = useState("");
  const [saved, setSaved] = useState(false);

  const current = getPlatform(platform);

  const add = () => {
    const value = handle.trim();
    if (!value) return;
    setItems((prev) => [
      ...prev,
      { id: uid(), platform, handle: value, visible: true },
    ]);
    setHandle("");
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)),
    );

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------ Add form */}
      <div
        className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        style={{ animationDelay: "80ms" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] gap-3">
          {/* Platform select */}
          <div className="relative">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              aria-label="Platform"
              className="w-full h-11 appearance-none rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-8 text-sm text-white outline-none transition-colors duration-300 hover:bg-white/[0.06] focus:border-white/30 cursor-pointer"
            >
              {PLATFORMS.map((p) => (
                <option key={p.key} value={p.key} className="bg-zinc-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>

            <current.Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />

            <svg
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Handle input */}
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={current.placeholder}
            className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors duration-300 hover:bg-white/[0.06] focus:border-white/30"
          />

          {/* Add */}
          <button
            type="button"
            onClick={add}
            disabled={!handle.trim()}
            className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-sm font-semibold transition-all duration-300 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ List */}
      <div
        className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        style={{ animationDelay: "150ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-300">
            Your socials
            <span className="ml-2 text-xs font-normal text-zinc-500">
              {items.length}
            </span>
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-zinc-500">
              No socials yet — add one above.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => {
              const p = getPlatform(item.platform);
              return (
                <li
                  key={item.id}
                  className="fade-up group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20"
                  style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                >
                  <span className="grid place-items-center h-9 w-9 shrink-0 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
                    <p.Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-white">
                      {p.label}
                    </span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">
                      {item.handle}
                    </span>
                  </span>

                  <span
                    className={`hidden sm:inline text-[10px] uppercase tracking-wider font-medium transition-colors ${
                      item.visible ? "text-emerald-400" : "text-zinc-600"
                    }`}
                  >
                    {item.visible ? "Visible" : "Hidden"}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-label={item.visible ? "Hide" : "Show"}
                    className="grid place-items-center h-8 w-8 rounded-lg text-zinc-500 transition-colors duration-200 hover:text-white hover:bg-white/[0.06]"
                  >
                    {item.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label="Remove"
                    className="grid place-items-center h-8 w-8 rounded-lg text-zinc-500 transition-colors duration-200 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------ Save */}
      <div
        className="fade-up flex justify-end"
        style={{ animationDelay: "280ms" }}
      >
        <button
          type="button"
          onClick={save}
          className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-sm font-semibold transition-all duration-300 hover:bg-zinc-200"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </div>
  );
}