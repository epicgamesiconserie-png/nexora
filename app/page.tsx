import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-[#7c5cff]/20 blur-[140px]" />

      <header className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#a08bff] grid place-items-center font-bold">
            N
          </div>
          <span className="font-semibold tracking-tight">NEXORA</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 h-9 inline-flex items-center rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 h-9 inline-flex items-center rounded-lg text-sm font-medium bg-[#7c5cff] hover:bg-[#a08bff] transition"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1c1c26] bg-white/[0.03] px-4 py-1.5 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Claim your unique link
        </div>

        <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          One link.{" "}
          <span className="bg-gradient-to-br from-white via-[#a08bff] to-[#7c5cff] bg-clip-text text-transparent">
            Your whole world.
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl mx-auto">
          Grab your username on NEXORA and share everything you are — with one beautiful link.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium bg-[#7c5cff] hover:bg-[#a08bff] transition"
          >
            Create your profile
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium border border-[#1c1c26] bg-white/[0.02] hover:bg-white/[0.05] transition"
          >
            Log in
          </Link>
        </div>

        <p className="mt-4 text-xs text-white/40">Free forever · No credit card required</p>
      </section>

      <section className="relative z-10 max-w-md mx-auto px-6 pb-32">
        <div className="rounded-3xl border border-[#1c1c26] bg-[#111118]/60 backdrop-blur p-8 text-center shadow-2xl">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#a08bff]" />
          <h3 className="mt-4 font-semibold">Your Name</h3>
          <p className="text-xs text-white/50">@yourname</p>
          <p className="mt-3 text-sm text-white/70">Welcome to my world ✨</p>

          <div className="mt-6 space-y-2.5">
            {["YouTube", "GitHub", "Instagram", "Website"].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm text-white/90 hover:bg-white/[0.08] transition"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#1c1c26] py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} NEXORA
      </footer>
    </main>
  );
}