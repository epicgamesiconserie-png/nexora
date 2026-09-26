"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type UploadType = "background" | "audio" | "avatar" | "cursor";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard" },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Customize", href: "/dashboard/customize" },
  { name: "Links", href: "/dashboard/links" },
  { name: "Socials", href: "/dashboard/socials" },
  { name: "Music", href: "/dashboard/music" },
  { name: "My Page", href: "/dashboard/mypage" },
  { name: "Premium", href: "/dashboard/premium" },
  { name: "Image Host", href: "/dashboard/image-host" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function CustomizePage() {
  const pathname = usePathname();
  const [uploads, setUploads] = useState<Record<UploadType, string | null>>({
    background: null,
    audio: null,
    avatar: null,
    cursor: null,
  });
  const [uploading, setUploading] = useState<UploadType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadType = useRef<UploadType | null>(null);

  const handleBoxClick = (type: UploadType) => {
    currentUploadType.current = type;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const type = currentUploadType.current;
    if (!file || !type) return;

    setUploading(type);

    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        }
      );

      const blob = await response.json();

      if (blob.url) {
        setUploads((prev) => ({ ...prev, [type]: blob.url }));

        // Save URL to database so it persists on My Page
        try {
          const saveResponse = await fetch("/api/user/update-background", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              backgroundUrl: blob.url,
              backgroundType: type === "background" ? "image" : type,
            }),
          });

          const saveData = await saveResponse.json();
          if (!saveResponse.ok) {
            console.error("Failed to save:", saveData);
            alert("Uploaded, but failed to save to profile: " + saveData.error);
          } else {
            console.log(`Saved ${type} to profile`);
          }
        } catch (err) {
          console.error("Save error:", err);
        }
      } else {
        alert("Upload failed: " + (blob.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check the console.");
    } finally {
      setUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const boxes = [
    {
      type: "background" as UploadType,
      label: "Background",
      icon: "🖼️",
      hint: "Click to upload a file",
    },
    {
      type: "audio" as UploadType,
      label: "Audio",
      icon: "🎵",
      hint: "Click to open audio manager",
    },
    {
      type: "avatar" as UploadType,
      label: "Profile Avatar",
      icon: "👤",
      hint: "Click to upload a file",
    },
    {
      type: "cursor" as UploadType,
      label: "Custom Cursor",
      icon: "🖱️",
      hint: "Click to upload a file",
    },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*"
      />

      {/* SIDEBAR */}
      <aside className="w-56 border-r border-white/10 p-4 hidden md:block">
        <Link href="/" className="flex items-center gap-2 px-2 py-4 mb-4">
          <span className="text-2xl">💨</span>
          <span className="text-xl font-bold">smokez.lol</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm transition ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Assets Uploader
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boxes.map((box) => {
              const isUploaded = uploads[box.type];
              const isUploading = uploading === box.type;

              return (
                <button
                  key={box.type}
                  onClick={() => handleBoxClick(box.type)}
                  disabled={isUploading}
                  className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border transition text-center ${
                    isUploaded
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                  } ${isUploading ? "opacity-50 cursor-wait" : ""}`}
                >
                  <span className="text-3xl">{box.icon}</span>
                  <span className="font-semibold">{box.label}</span>
                  <span className="text-xs text-zinc-500">
                    {isUploading
                      ? "Uploading..."
                      : isUploaded
                      ? "✓ Uploaded — click to replace"
                      : box.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {(Object.keys(uploads) as UploadType[]).some((k) => uploads[k]) && (
            <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                Uploaded Assets
              </h3>
              <ul className="space-y-2 text-xs text-zinc-500">
                {(Object.keys(uploads) as UploadType[]).map(
                  (key) =>
                    uploads[key] && (
                      <li key={key}>
                        <span className="text-zinc-300 capitalize">
                          {key}:
                        </span>{" "}
                        <a
                          href={uploads[key]!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline break-all"
                        >
                          {uploads[key]}
                        </a>
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          <p className="mt-8 text-xs text-zinc-600 text-center">
            Asset uploads will be wired up next — this page is the starting
            point.
          </p>
        </div>
      </main>
    </div>
  );
}