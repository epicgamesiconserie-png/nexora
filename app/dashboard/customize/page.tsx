"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { saveAvatarUrl, saveCustomization, removeAvatar } from "./actions";
import { AnimatedTitle, type AnimatedTitleStyle } from "@/components/AnimatedTitle";
import {
  LayoutDashboard, Link2, Palette, Music, BarChart3,
  LogOut, Crown, Home, Award, X, ZoomIn, RotateCw,
  MapPin, AlignLeft, Save, Sparkles, Check, Trash2,
  ExternalLink,
} from "lucide-react";

type UploadType = "background" | "audio" | "avatar" | "cursor";

const ANIMATED_TITLES: { value: AnimatedTitleStyle; label: string; description: string }[] = [
  { value: "none",       label: "None",        description: "Plain text" },
  { value: "glow",       label: "Glow",        description: "Pulsing white glow" },
  { value: "gradient",   label: "Gradient",    description: "Purple to pink shift" },
  { value: "rainbow",    label: "Rainbow",     description: "Full color cycle" },
  { value: "typewriter", label: "Typewriter",  description: "Typing animation" },
  { value: "wave",       label: "Wave",        description: "Letters bounce" },
  { value: "shuffle",    label: "Shuffle",     description: "Wiggle shake" },
  { value: "fuzzy",      label: "Fuzzy",       description: "Blur pulse" },
  { value: "flicker",    label: "Flicker",     description: "Neon flicker" },
];

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      "image/jpeg",
      0.9
    );
  });
}

export default function CustomizePage() {
  const pathname = usePathname();

  const [username, setUsername] = useState("");
  const [uploads, setUploads] = useState<Record<UploadType, string | null>>({
    background: null, audio: null, avatar: null, cursor: null,
  });
  const [uploading, setUploading] = useState<UploadType | null>(null);
  const [removingAvatar, setRemovingAvatar] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [accentColor, setAccentColor] = useState("#a855f7");
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#0a0a0a");
  const [profileOpacity, setProfileOpacity] = useState(100);
  const [profileBlur, setProfileBlur] = useState(12);
  const [backgroundEffect, setBackgroundEffect] = useState("gradient");
  const [usernameEffect, setUsernameEffect] = useState("none");
  const [monochromeIcons, setMonochromeIcons] = useState(false);
  const [swapBoxColors, setSwapBoxColors] = useState(false);
  const [volumeControl, setVolumeControl] = useState(false);
  const [animatedTitle, setAnimatedTitle] = useState<AnimatedTitleStyle>("none");
  const [animatedTitleModalOpen, setAnimatedTitleModalOpen] = useState(false);

  const [savingCustomization, setSavingCustomization] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadType = useRef<UploadType | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
        if (data.profile) {
          setBio(data.profile.bio || "");
          setAccentColor(data.profile.accentColor || "#a855f7");
          setTextColor(data.profile.textColor || "#ffffff");
          setBackgroundColor(data.profile.backgroundColor || "#0a0a0a");
          setLocation(data.profile.location || "");
          setProfileOpacity(data.profile.profileOpacity ?? 100);
          setProfileBlur(data.profile.blur ?? 12);
          setBackgroundEffect(data.profile.backgroundType || "gradient");
          setUsernameEffect(data.profile.effect || "none");
          setMonochromeIcons(data.profile.monochromeIcons ?? false);
          setSwapBoxColors(data.profile.swapBoxColors ?? false);
          setVolumeControl(data.profile.volumeControl ?? false);
          setAnimatedTitle((data.profile.animatedTitleStyle as AnimatedTitleStyle) || "none");
        }
      })
      .catch(() => {});
  }, []);

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Customize", href: "/dashboard/customize", icon: Palette },
    { name: "Links", href: "/dashboard/links", icon: Link2 },
    { name: "Music", href: "/dashboard/music", icon: Music },
    { name: "My Page", href: username ? `/u/${username}` : "#", icon: Home, external: true },
    { name: "Badges", href: "/dashboard/badges", icon: Award },
    { name: "Premium", href: "/dashboard/premium", icon: Crown },
  ];

  const handleBoxClick = (type: UploadType) => {
    currentUploadType.current = type;
    fileInputRef.current?.click();
  };

  const onCropComplete = useCallback((_area: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const type = currentUploadType.current;
    if (!file || !type) return;

    if (type === "avatar") {
      const reader = new FileReader();
      reader.onload = () => setCropImage(reader.result as string);
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    await uploadFile(file, type);
  };

  async function uploadFile(file: Blob, type: UploadType, filename?: string) {
    setUploading(type);
    try {
      const name = filename || (file as File).name || `${type}.jpg`;
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(name)}`,
        { method: "POST", body: file }
      );
      const blob = await response.json();

      if (!blob.url) {
        toast.error(blob.error || "Upload failed");
        return;
      }

      setUploads((prev) => ({ ...prev, [type]: blob.url }));

      const result = await saveAvatarUrl(type, blob.url);
      if (result.success) {
        toast.success(`${type === "avatar" ? "Avatar" : type} updated`);
      } else {
        toast.error(result.error || "Failed to save to profile");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function saveCroppedAvatar() {
    if (!cropImage || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels, rotation);
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      await uploadFile(file, "avatar");
      setCropImage(null);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to crop image");
    }
  }

  async function handleRemoveAvatar() {
    if (!confirm("Remove your profile picture?")) return;
    setRemovingAvatar(true);
    const res = await removeAvatar();
    setRemovingAvatar(false);
    if (res.success) {
      toast.success("Avatar removed");
      setUploads((prev) => ({ ...prev, avatar: null }));
    } else {
      toast.error(res.error || "Failed to remove");
    }
  }

  async function handleSaveCustomization() {
    setSavingCustomization(true);
    const result = await saveCustomization({
      bio,
      accentColor,
      textColor,
      backgroundColor,
      location,
      profileOpacity,
      profileBlur,
      backgroundEffect,
      usernameEffect,
      monochromeIcons,
      animatedTitle: animatedTitle !== "none",
      animatedTitleStyle: animatedTitle,
      swapBoxColors,
      volumeControl,
    });
    setSavingCustomization(false);
    if (result.success) toast.success("Customization saved");
    else toast.error(result.error || "Failed to save");
  }

  const boxes = [
    { type: "background" as UploadType, label: "Background",     icon: "🖼️", hint: "Click to upload a file" },
    { type: "audio" as UploadType,      label: "Audio",          icon: "🎵", hint: "Click to open audio manager" },
    { type: "avatar" as UploadType,     label: "Profile Avatar", icon: "👤", hint: "Click to upload a file" },
    { type: "cursor" as UploadType,     label: "Custom Cursor",  icon: "🖱️", hint: "Click to upload a file" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,audio/*" />

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
        <div className="max-w-5xl mx-auto space-y-10">
          <section>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Assets Uploader</h1>
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
                      {isUploading ? "Uploading..." : isUploaded ? "✓ Uploaded" : box.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">General Customization</h2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
                    <AlignLeft className="h-3.5 w-3.5" />
                    Description
                  </label>
                  <input
                    type="text" value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="this is my description" maxLength={160}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm outline-none focus:border-white/30 placeholder:text-white/30"
                  />
                  <p className="text-[10px] text-zinc-600 mt-1">{bio.length}/160</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </label>
                  <input
                    type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="My Location" maxLength={50}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm outline-none focus:border-white/30 placeholder:text-white/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={removingAvatar}
                    className="flex items-center gap-2 h-11 px-5 rounded-xl border border-red-500/40 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/60 font-semibold text-sm transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {removingAvatar ? "Removing..." : "Remove Profile Picture"}
                  </button>
                </div>

                <Slider label="Profile Opacity" value={profileOpacity} min={0} max={100} step={1} suffix="%" onChange={setProfileOpacity} />
                <Slider label="Profile Blur" value={profileBlur} min={0} max={50} step={1} suffix="px" onChange={setProfileBlur} />

                <Select label="Background Effects" value={backgroundEffect} onChange={setBackgroundEffect}
                  options={[
                    { value: "gradient", label: "Gradient" },
                    { value: "solid", label: "Solid Color" },
                    { value: "image", label: "Image" },
                    { value: "none", label: "None" },
                  ]}
                />
                <Select label="Username Effects" value={usernameEffect} onChange={setUsernameEffect}
                  options={[
                    { value: "none", label: "None" },
                    { value: "glow", label: "Glow" },
                    { value: "gradient", label: "Gradient" },
                  ]}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Color Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorPicker label="Accent Color" value={accentColor} onChange={setAccentColor} />
                  <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
                  <ColorPicker label="Background Color" value={backgroundColor} onChange={setBackgroundColor} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Other Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Toggle label="Monochrome Icons" value={monochromeIcons} onChange={setMonochromeIcons} />
                  <Toggle label="Swap Box Colors" value={swapBoxColors} onChange={setSwapBoxColors} />
                  <Toggle label="Volume Control" value={volumeControl} onChange={setVolumeControl} />
                  <button
                    type="button"
                    onClick={() => setAnimatedTitleModalOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left"
                  >
                    <span className="text-sm font-semibold text-white">Animated Title</span>
                    <span className="text-xs text-zinc-400 capitalize">
                      {ANIMATED_TITLES.find((a) => a.value === animatedTitle)?.label || "None"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveCustomization}
                  disabled={savingCustomization}
                  className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingCustomization ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {animatedTitleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setAnimatedTitleModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Animated Title</h2>
              <button onClick={() => setAnimatedTitleModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {ANIMATED_TITLES.map((option) => {
                const selected = animatedTitle === option.value;
                return (
                  <button key={option.value} onClick={() => setAnimatedTitle(option.value)}
                    className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition ${
                      selected ? "border-purple-500 bg-purple-500/10"
                              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}>
                    {selected && <Check className="absolute top-3 right-3 h-4 w-4 text-purple-400" />}
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">{option.label}</span>
                    <div className="py-3 min-h-[48px] flex items-center w-full overflow-hidden">
                      <AnimatedTitle text="@username" style={option.value} className="text-xl font-bold text-white" />
                    </div>
                    <span className="text-xs text-zinc-500">{option.description}</span>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setAnimatedTitleModalOpen(false)}
                className="h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {cropImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Edit Avatar</h2>
              <button onClick={() => setCropImage(null)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative w-full" style={{ height: 340, background: "#000" }}>
              <Cropper image={cropImage} crop={crop} zoom={zoom} rotation={rotation}
                aspect={1} cropShape="round" showGrid objectFit="contain"
                onCropChange={setCrop} onZoomChange={setZoom}
                onRotationChange={setRotation} onCropComplete={onCropComplete} />
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-zinc-500 text-center">Drag to move. Scroll to zoom.</p>
              <Slider label="Zoom" value={zoom} min={1} max={3} step={0.01} suffix="x" onChange={setZoom} />
              <Slider label="Rotation" value={rotation} min={-180} max={180} step={1} suffix="°" onChange={setRotation} />
              <div className="flex gap-2 pt-2">
                <button onClick={() => setCropImage(null)}
                  className="flex-1 h-11 rounded-xl border border-white/10 hover:bg-white/5 transition font-semibold text-sm">
                  Cancel
                </button>
                <button onClick={saveCroppedAvatar} disabled={uploading === "avatar"}
                  className="flex-1 h-11 rounded-xl bg-white text-black hover:bg-zinc-200 transition font-semibold text-sm disabled:opacity-50">
                  {uploading === "avatar" ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
        <Palette className="h-3.5 w-3.5" />
        {label}
      </label>
      <div className="flex items-center gap-3 h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3">
        <div className="h-6 w-6 rounded-md border border-white/20 flex-shrink-0" style={{ background: value }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={7}
          className="flex-1 bg-transparent text-sm outline-none font-mono uppercase" />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent" style={{ padding: 0 }} />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, suffix = "", onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-zinc-400">{label}</label>
        <span className="text-xs text-zinc-500">{step < 1 ? value.toFixed(2) : Math.round(value)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-white" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2">
        <Sparkles className="h-3.5 w-3.5" />
        {label}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm outline-none focus:border-white/30">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left">
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${value ? "bg-purple-500" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}