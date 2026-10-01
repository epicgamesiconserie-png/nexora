"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import {
  saveAvatarUrl,
  saveCustomization,
  saveAvatarStyle,
  removeAvatar,
  removeBackgroundImage,
  removeBackgroundVideo,
  removeAudio,
} from "./actions";
import { AnimatedTitle, type AnimatedTitleStyle } from "@/components/AnimatedTitle";
import { MouseTrail, MouseTrailPreview, type MouseTrailStyle } from "@/components/MouseTrail";
import {
  LayoutDashboard, Link2, Palette, Music,
  LogOut, Crown, Home, Award, X,
  MapPin, AlignLeft, Save, Sparkles, Check, Trash2,
  ExternalLink, MousePointer2, Snowflake, Star, Heart,
  Droplet, Zap, Flame, Music2, Film, User,
  Type, Droplets, Loader2, ShieldCheck, Image as ImageIcon, Lock,
  DoorOpen,
} from "lucide-react";

type UploadType = "background" | "backgroundVideo" | "audio" | "avatar";
type AvatarStyle = "circle" | "full";

const ANIMATED_TITLES: { value: AnimatedTitleStyle; label: string; description: string; premium?: boolean }[] = [
  { value: "none",       label: "None",        description: "Plain text" },
  { value: "glow",       label: "Glow",        description: "Pulsing white glow" },
  { value: "gradient",   label: "Gradient",    description: "Purple to pink shift" },
  { value: "rainbow",    label: "Rainbow",     description: "Full color cycle" },
  { value: "typewriter", label: "Typewriter",  description: "Typing animation", premium: true },
  { value: "wave",       label: "Wave",        description: "Letters bounce" },
  { value: "shuffle",    label: "Shuffle",     description: "Wiggle shake" },
  { value: "fuzzy",      label: "Fuzzy",       description: "Blur pulse" },
  { value: "flicker",    label: "Flicker",     description: "Neon flicker" },
];

const MOUSE_TRAILS: { value: MouseTrailStyle; label: string; description: string; Icon: React.ElementType; premium?: boolean }[] = [
  { value: "none",      label: "None",         description: "No trail",              Icon: X },
  { value: "snow",      label: "Snow",         description: "White particles fall",  Icon: Snowflake, premium: true },
  { value: "sparkle",   label: "Sparkle",      description: "Golden flashes",        Icon: Sparkles },
  { value: "cursor",    label: "Cursor Ghost", description: "Fading cursors",        Icon: MousePointer2 },
  { value: "stars",     label: "Stars",        description: "Yellow stars",          Icon: Star, premium: true },
  { value: "hearts",    label: "Hearts",       description: "Rising hearts",         Icon: Heart },
  { value: "bubbles",   label: "Bubbles",      description: "Blue bubbles",          Icon: Droplet },
  { value: "lightning", label: "Lightning",    description: "Electric bolts",        Icon: Zap },
  { value: "fire",      label: "Fire",         description: "Rising flames",         Icon: Flame },
  { value: "music",     label: "Music",        description: "Music notes",           Icon: Music2, premium: true },
  { value: "rainbow",   label: "Rainbow",      description: "Rainbow particles",     Icon: Sparkles },
  { value: "confetti",  label: "Confetti",     description: "Colorful confetti",     Icon: Sparkles },
];

const FONTS = [
  { value: "Inter",      class: "font-inter",      label: "Inter",             sample: "Aa" },
  { value: "Poppins",    class: "font-poppins",    label: "Poppins",           sample: "Aa" },
  { value: "Montserrat", class: "font-montserrat", label: "Montserrat",        sample: "Aa" },
  { value: "Playfair",   class: "font-playfair",   label: "Playfair Display",  sample: "Aa" },
  { value: "Roboto",     class: "font-roboto",     label: "Roboto",            sample: "Aa" },
  { value: "Lora",       class: "font-lora",       label: "Lora",              sample: "Aa" },
  { value: "Space",      class: "font-space",      label: "Space Grotesk",     sample: "Aa" },
  { value: "DM",         class: "font-dm",         label: "DM Sans",           sample: "Aa" },
  { value: "Nunito",     class: "font-nunito",     label: "Nunito",            sample: "Aa" },
  { value: "Bebas",      class: "font-bebas",      label: "Bebas Neue",        sample: "AA" },
  { value: "Cinzel",     class: "font-cinzel",     label: "Cinzel",            sample: "Aa" },
  { value: "Orbitron",   class: "font-orbitron",   label: "Orbitron",          sample: "Aa" },
  { value: "Bungee",     class: "font-bungee",     label: "Bungee",            sample: "Aa" },
  { value: "Fraktur",    class: "font-fraktur",    label: "Fraktur",           sample: "Aa" },
];

function isTransparencyCapable(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type === "image/png" || type === "image/webp" || type === "image/gif") return true;
  if (name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif")) return true;
  return false;
}

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
    const img = new window.Image();
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
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [uploads, setUploads] = useState<Record<UploadType, string | null>>({
    background: null, backgroundVideo: null, audio: null, avatar: null,
  });
  const [uploading, setUploading] = useState<UploadType | null>(null);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [removingVideo, setRemovingVideo] = useState(false);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [removingAudio, setRemovingAudio] = useState(false);

  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>("circle");
  const [savingAvatarStyle, setSavingAvatarStyle] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [bio, setBio] = useState("");
  const [profileFont, setProfileFont] = useState("Inter");
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
  const [mouseTrail, setMouseTrail] = useState<MouseTrailStyle>("none");
  const [mouseTrailModalOpen, setMouseTrailModalOpen] = useState(false);
  const [fontModalOpen, setFontModalOpen] = useState(false);

  // Welcome Screen
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  const [savingCustomization, setSavingCustomization] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadType = useRef<UploadType | null>(null);

  const glassCard = profileOpacity <= 20;

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
        if (data.role === "admin") setIsAdmin(true);
        if (data.isPremium) setIsPremium(true);
        if (data.profile) {
          setBio(data.profile.bio || "");
          setProfileFont(data.profile.font || "Inter");
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
          setMouseTrail((data.profile.mouseTrail as MouseTrailStyle) || "none");
          setWelcomeEnabled(data.profile.welcomeEnabled ?? false);
          setWelcomeText(data.profile.welcomeText || "");
          setAvatarStyle(data.profile.avatarStyle === "full" ? "full" : "circle");

          setUploads({
            background: data.profile.backgroundUrl || null,
            backgroundVideo: data.profile.backgroundVideoUrl || null,
            audio: data.profile.audioUrl || null,
            avatar: data.profile.avatarUrl || null,
          });
        }
      })
      .catch(() => {});
  }, []);

  const getSidebarLinks = () => [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, external: false },
    { name: "Customize", href: "/dashboard/customize", icon: Palette, external: false },
    { name: "Links", href: "/dashboard/links", icon: Link2, external: false },
    { name: "Music", href: "/dashboard/music", icon: Music, external: false },
    { name: "My Page", href: username ? `/u/${username}` : "", icon: Home, external: true },
    { name: "Badges", href: "/dashboard/badges", icon: Award, external: false },
    { name: "Premium", href: "/dashboard/premium", icon: Crown, external: false },
    ...(isAdmin
      ? [{ name: "Admin", href: "/dashboard/admin", icon: ShieldCheck, external: false }]
      : []),
  ];

  const handleBoxClick = (type: UploadType) => {
    if (type === "backgroundVideo" && !isPremium) {
      toast.error("Background video is a Premium feature");
      router.push("/dashboard/premium");
      return;
    }
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
      if (isTransparencyCapable(file) || avatarStyle === "full") {
        await uploadFile(file, "avatar");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

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
        toast.success(
          type === "avatar"
            ? "Avatar updated"
            : type === "backgroundVideo"
            ? "Background video updated"
            : type === "background"
            ? "Background image updated"
            : `${type} updated`
        );

        if (type === "background") setBackgroundEffect("image");
        else if (type === "backgroundVideo") setBackgroundEffect("video");
      } else {
        toast.error(result.error || "Failed to save to profile");
        setUploads((prev) => ({ ...prev, [type]: null }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function saveCroppedAvatar() {
    if (!cropImage) {
      toast.error("No image selected");
      return;
    }

    let area = croppedAreaPixels;
    if (!area) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = cropImage;
      });

      const size = Math.min(img.width, img.height);
      area = {
        x: (img.width - size) / 2,
        y: (img.height - size) / 2,
        width: size,
        height: size,
      };
    }

    try {
      const croppedBlob = await getCroppedImg(cropImage, area, rotation);
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      await uploadFile(file, "avatar");
      setCropImage(null);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    } catch (err) {
      console.error("Crop/save failed:", err);
      toast.error("Failed to save avatar: " + (err as Error).message);
    }
  }

  async function handleRemoveAvatar() {
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

  async function handleRemoveVideo() {
    setRemovingVideo(true);
    const res = await removeBackgroundVideo();
    setRemovingVideo(false);
    if (res.success) {
      toast.success("Background video removed");
      setUploads((prev) => ({ ...prev, backgroundVideo: null }));
      setBackgroundEffect("gradient");
    } else {
      toast.error(res.error || "Failed to remove");
    }
  }

  async function handleRemoveBackgroundImage() {
    setRemovingBackground(true);
    const res = await removeBackgroundImage();
    setRemovingBackground(false);
    if (res.success) {
      toast.success("Background image removed");
      setUploads((prev) => ({ ...prev, background: null }));
      setBackgroundEffect("gradient");
    } else {
      toast.error(res.error || "Failed to remove");
    }
  }

  async function handleRemoveAudio() {
    setRemovingAudio(true);
    const res = await removeAudio();
    setRemovingAudio(false);
    if (res.success) {
      toast.success("Audio removed");
      setUploads((prev) => ({ ...prev, audio: null }));
    } else {
      toast.error(res.error || "Failed to remove");
    }
  }

  async function handleAvatarStyleChange(next: AvatarStyle) {
    if (next === avatarStyle) return;
    setSavingAvatarStyle(true);
    const prev = avatarStyle;
    setAvatarStyle(next);
    const res = await saveAvatarStyle(next);
    setSavingAvatarStyle(false);
    if (!res.success) {
      toast.error(res.error || "Failed to save avatar style");
      setAvatarStyle(prev);
    } else {
      toast.success(`Avatar style: ${next === "full" ? "Full image" : "Circle"}`);
    }
  }

  async function handleSaveCustomization() {
    setSavingCustomization(true);
    const result = await saveCustomization({
      bio,
      font: profileFont,
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
      mouseTrail,
      welcomeEnabled,
      welcomeText,
    });
    setSavingCustomization(false);
    if (result.success) toast.success("Customization saved");
    else toast.error(result.error || "Failed to save");
  }

  function toggleGlassCard() {
    if (glassCard) setProfileOpacity(100);
    else setProfileOpacity(5);
  }

  const boxes: { type: UploadType; label: string; Icon: React.ElementType; hint: string; premium?: boolean }[] = [
    { type: "background",      label: "Background", Icon: ImageIcon, hint: "Image" },
    { type: "backgroundVideo", label: "BG Video",   Icon: Film,      hint: "MP4", premium: true },
    { type: "audio",           label: "Audio",      Icon: Music,     hint: "MP3" },
    { type: "avatar",          label: "Avatar",     Icon: User,      hint: "Image" },
  ];

  const currentTrail = MOUSE_TRAILS.find((t) => t.value === mouseTrail);
  const currentFont = FONTS.find((f) => f.value === profileFont) || FONTS[0];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/mp4,video/webm,audio/*"
      />

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
          {getSidebarLinks().map((link) => {
            const active = pathname === link.href;
            if (link.external && !link.href.startsWith("/u/")) {
              return (
                <div key={link.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-500 border border-transparent cursor-wait">
                  <link.icon className="h-4 w-4" />
                  <span className="flex-1">{link.name}</span>
                  <span className="text-[10px]">loading...</span>
                </div>
              );
            }
            const className = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
              active ? "bg-white/[0.07] text-white border border-white/15"
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Assets</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {boxes.map((box) => {
                const isUploaded = uploads[box.type];
                const isUploading = uploading === box.type;
                const locked = box.premium && !isPremium;
                return (
                  <button
                    key={box.type}
                    onClick={() => handleBoxClick(box.type)}
                    disabled={isUploading}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg border transition text-center relative ${
                      locked
                        ? "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10"
                        : isUploaded
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    } ${isUploading ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {locked && (
                      <span className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/20 border border-yellow-500/40">
                        <Lock className="h-2.5 w-2.5 text-yellow-400" />
                        <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider">Premium</span>
                      </span>
                    )}
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                    ) : (
                      <box.Icon
                        className={`h-5 w-5 ${locked ? "text-yellow-400/70" : isUploaded ? "text-green-400" : "text-zinc-400"}`}
                        strokeWidth={1.5}
                      />
                    )}
                    <span className={`text-[11px] font-semibold leading-tight ${locked ? "text-yellow-100/80" : ""}`}>{box.label}</span>
                    <span className="text-[9px] text-zinc-500">
                      {isUploading ? "..." : locked ? "Premium only" : isUploaded ? "✓ Done" : box.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRemoveBackgroundImage}
                disabled={removingBackground || !uploads.background}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {removingBackground ? "..." : "Remove BG Image"}
              </button>

              <button
                type="button"
                onClick={handleRemoveVideo}
                disabled={removingVideo || !uploads.backgroundVideo}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {removingVideo ? "..." : "Remove BG Video"}
              </button>

              <button
                type="button"
                onClick={handleRemoveAudio}
                disabled={removingAudio || !uploads.audio}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {removingAudio ? "..." : "Remove Audio"}
              </button>

              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={removingAvatar || !uploads.avatar}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {removingAvatar ? "..." : "Remove Avatar"}
              </button>
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
                    onClick={toggleGlassCard}
                    className="flex items-center justify-between w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-white">See-through Card</span>
                    </div>
                    <span className={`relative h-6 w-11 rounded-full transition ${glassCard ? "bg-purple-500" : "bg-white/10"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${glassCard ? "left-[22px]" : "left-0.5"}`} />
                    </span>
                  </button>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Makes the card transparent so your background shows through.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-white">Avatar Style</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAvatarStyleChange("circle")}
                        disabled={savingAvatarStyle}
                        className={`h-9 px-4 rounded-lg text-xs font-semibold border transition ${
                          avatarStyle === "circle"
                            ? "border-purple-500 bg-purple-500/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                        } disabled:opacity-50`}
                      >
                        Circle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAvatarStyleChange("full")}
                        disabled={savingAvatarStyle}
                        className={`h-9 px-4 rounded-lg text-xs font-semibold border transition ${
                          avatarStyle === "full"
                            ? "border-purple-500 bg-purple-500/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                        } disabled:opacity-50`}
                      >
                        Full Image
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Use <strong>Full Image</strong> for transparent PNGs and GIFs — your image won&apos;t be cropped.
                  </p>
                </div>

                <Slider label="Profile Opacity" value={profileOpacity} min={0} max={100} step={1} suffix="%" onChange={setProfileOpacity} />
                <Slider label="Profile Blur" value={profileBlur} min={0} max={50} step={1} suffix="px" onChange={setProfileBlur} />

                <Select label="Background Effects" value={backgroundEffect} onChange={setBackgroundEffect}
                  options={[
                    { value: "gradient", label: "Gradient" },
                    { value: "solid", label: "Solid Color" },
                    { value: "image", label: "Image" },
                    { value: "video", label: "Video" },
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
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-white">Animated Title</span>
                    </div>
                    <span className="text-xs text-zinc-400 capitalize">
                      {ANIMATED_TITLES.find((a) => a.value === animatedTitle)?.label || "None"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMouseTrailModalOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MousePointer2 className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-white">Mouse Trail</span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {currentTrail?.label || "None"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isPremium) {
                        toast.error("Welcome Screen is a Premium feature");
                        router.push("/dashboard/premium");
                        return;
                      }
                      setWelcomeModalOpen(true);
                    }}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition text-left md:col-span-2 ${
                      isPremium
                        ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        : "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <DoorOpen
                        className={`h-4 w-4 ${
                          isPremium ? "text-zinc-400" : "text-yellow-400/70"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          isPremium ? "text-white" : "text-yellow-100/80"
                        }`}
                      >
                        Welcome Screen
                      </span>
                      {!isPremium && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/20 border border-yellow-500/40">
                          <Lock className="h-2.5 w-2.5 text-yellow-400" />
                          <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider">
                            Premium
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {welcomeEnabled && welcomeText
                        ? welcomeText.slice(0, 24) +
                          (welcomeText.length > 24 ? "…" : "")
                        : "None"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFontModalOpen(true)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left md:col-span-2"
                  >
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-semibold text-white">Font</span>
                    </div>
                    <span className="text-xs text-zinc-400">{currentFont.label}</span>
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
                const locked = option.premium && !isPremium;
                return (
                  <button key={option.value} onClick={() => {
                    if (locked) {
                      toast.error("Typewriter is a Premium feature");
                      router.push("/dashboard/premium");
                      return;
                    }
                    setAnimatedTitle(option.value);
                  }}
                    className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition ${
                      locked
                        ? "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10"
                        : selected
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}>
                    {selected && !locked && <Check className="absolute top-3 right-3 h-4 w-4 text-purple-400" />}
                    {locked && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/20 border border-yellow-500/40">
                        <Lock className="h-2.5 w-2.5 text-yellow-400" />
                        <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider">Premium</span>
                      </span>
                    )}
                    <span className={`text-xs uppercase tracking-wider font-semibold ${locked ? "text-yellow-200/70" : "text-zinc-500"}`}>{option.label}</span>
                    <div className="py-3 min-h-[48px] flex items-center w-full overflow-hidden">
                      {locked ? (
                        <span className="text-xl font-bold text-white/40">@username</span>
                      ) : (
                        <AnimatedTitle text="@username" style={option.value} className="text-xl font-bold text-white" />
                      )}
                    </div>
                    <span className={`text-xs ${locked ? "text-yellow-200/50" : "text-zinc-500"}`}>
                      {locked ? "Unlock with Premium" : option.description}
                    </span>
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

      {mouseTrailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setMouseTrailModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Mouse Trail</h2>
              <button onClick={() => setMouseTrailModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto">
              {MOUSE_TRAILS.map((option) => {
                const selected = mouseTrail === option.value;
                const locked = option.premium && !isPremium;
                const Icon = option.Icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (locked) {
                        toast.error(`${option.label} is a Premium feature`);
                        router.push("/dashboard/premium");
                        return;
                      }
                      setMouseTrail(option.value);
                    }}
                    className={`relative flex flex-col rounded-xl border overflow-hidden text-center transition ${
                      locked
                        ? "border-yellow-500/30 bg-yellow-500/[0.04] hover:bg-yellow-500/[0.09]"
                        : selected
                        ? "border-purple-500 bg-purple-500/[0.07]"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    {selected && !locked && <Check className="absolute top-2 right-2 h-4 w-4 text-purple-400 z-10" />}
                    {locked && (
                      <span className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/20 border border-yellow-500/40">
                        <Lock className="h-2.5 w-2.5 text-yellow-400" />
                        <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-wider">Premium</span>
                      </span>
                    )}
                    <div className={`relative w-full h-32 bg-black/40 overflow-hidden ${locked ? "opacity-40" : ""}`}>
                      <MouseTrailPreview style={option.value} color={accentColor} />
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Icon className={`h-3.5 w-3.5 ${locked ? "text-yellow-400/70" : "text-zinc-400"}`} />
                        <span className={`text-xs font-semibold ${locked ? "text-yellow-100/80" : "text-white"}`}>{option.label}</span>
                      </div>
                      <div className={`text-[10px] mt-0.5 ${locked ? "text-yellow-200/50" : "text-zinc-500"}`}>
                        {locked ? "Unlock with Premium" : option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <p className="text-xs text-zinc-500">Each preview shows the trail animating live.</p>
              <button onClick={() => setMouseTrailModalOpen(false)}
                className="h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {welcomeModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setWelcomeModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Welcome Screen</h2>
              <button
                onClick={() => setWelcomeModalOpen(false)}
                className="text-zinc-500 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={() => setWelcomeEnabled(!welcomeEnabled)}
                className="flex items-center justify-between w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition text-left"
              >
                <span className="text-sm font-semibold text-white">
                  Enable Welcome Screen
                </span>
                <span
                  className={`relative h-6 w-11 rounded-full transition ${
                    welcomeEnabled ? "bg-purple-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      welcomeEnabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Message
                </label>
                <textarea
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  placeholder="Welcome to my page. Click to continue."
                  maxLength={160}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-white/30 placeholder:text-white/30 resize-none"
                />
                <p className="text-[10px] text-zinc-600 mt-1">
                  {welcomeText.length}/160
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/40 p-4 text-center">
                <p
                  className="text-lg font-bold"
                  style={{ textShadow: `0 0 20px ${accentColor}66` }}
                >
                  {welcomeText || "Your welcome message"}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">
                  Click anywhere to enter
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setWelcomeModalOpen(false)}
                className="h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {fontModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setFontModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Font</h2>
              <button onClick={() => setFontModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {FONTS.map((font) => {
                const selected = profileFont === font.value;
                return (
                  <button
                    key={font.value}
                    onClick={() => setProfileFont(font.value)}
                    className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition ${
                      selected ? "border-purple-500 bg-purple-500/10"
                              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    {selected && <Check className="absolute top-3 right-3 h-4 w-4 text-purple-400" />}
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">{font.label}</span>
                    <div className={`py-3 min-h-[60px] flex items-center w-full overflow-hidden ${font.class}`}>
                      <span className="text-2xl font-bold text-white">@username</span>
                    </div>
                    <div className={`text-sm text-zinc-400 ${font.class}`}>
                      The quick brown fox jumps over
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setFontModalOpen(false)}
                className="h-11 px-5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <MouseTrail key={mouseTrail} style={mouseTrail} color={accentColor} />

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
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                objectFit="contain"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    background: "#000",
                    willChange: "transform",
                  },
                }}
              />
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