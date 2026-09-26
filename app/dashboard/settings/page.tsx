import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { Construction } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/"><SmokeLogoWordmark /></Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition font-semibold">← Back to dashboard</Link>
        </div>
      </header>
      <section className="relative z-10 max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl grid place-items-center mb-8 border border-white/10 bg-white/[0.03]" style={{ boxShadow: "0 0 40px rgba(168,85,247,0.25)" }}>
          <Construction className="h-8 w-8 text-purple-300" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.9), 0 2px 0 rgba(200,200,200,0.6), 0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.35)" }}>Settings Coming Soon</h1>
        <p className="text-zinc-400 text-lg">This page is under construction.</p>
        <div className="mt-10">
          <Link href="/dashboard" className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold transition">Back to dashboard</Link>
        </div>
      </section>
    </main>
  );
}