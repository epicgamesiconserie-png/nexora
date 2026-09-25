import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { Upload, Music, Image as ImageIcon, MousePointer2, ChevronRight } from "lucide-react";

export default async function CustomizePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <header className="relative z-10 px-6 py-4 border-b" style={{ background: "rgba(10,10,14,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
        <Link href="/dashboard">
          <SmokeLogoWordmark />
        </Link>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8" style={{ textShadow: "0 0 30px rgba(255,255,255,0.35)" }}>
          Assets Uploader
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UploadTile Icon={ImageIcon} label="Background" desc="Click to upload a file" />
          <UploadTile Icon={Music} label="Audio" desc="Click to open audio manager" />
          <UploadTile Icon={Upload} label="Profile Avatar" desc="Click to upload a file" />
          <UploadTile Icon={MousePointer2} label="Custom Cursor" desc="Click to upload a file" />
        </div>

        <div className="mt-12 text-zinc-500 text-sm">
          (Asset uploads will be wired up next — this page is the starting point.)
        </div>
      </section>
    </main>
  );
}

function UploadTile({
  Icon,
  label,
  desc,
}: {
  Icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <button className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 text-center hover:border-white/20 hover:bg-white/[0.05] transition">
      <div className="flex justify-center mb-4">
        <Icon className="h-8 w-8 text-zinc-400" />
      </div>
      <div className="text-sm font-bold mb-1" style={{ textShadow: "0 0 12px rgba(255,255,255,0.15)" }}>
        {label}
      </div>
      <div className="text-xs text-zinc-500">{desc}</div>
    </button>
  );
}