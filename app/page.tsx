"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const phoneRef = useRef<HTMLDivElement>(null);
  const [phoneTransform, setPhoneTransform] = useState("");

  const words = ["Secure", "Reliable", "Free", "Safe"];
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setWordVisible(true);
      }, 300);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 15;
    const rotateX = ((cy - y) / cy) * 15;
    setTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    );
  }

  function handleMouseLeave() {
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)");
  }

  function handlePhoneMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = phoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 15;
    const rotateX = ((cy - y) / cy) * 15;
    setPhoneTransform(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
    );
  }

  function handlePhoneLeave() {
    setPhoneTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)");
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Purple light lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="purpleFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0" />
              <stop offset="20%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="80%" stopColor="#e9d5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleFade2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0" />
              <stop offset="30%" stopColor="#d8b4fe" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#f3e8ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleFade3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
              <stop offset="40%" stopColor="#e9d5ff" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#d8b4fe" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>

            <filter id="glowLine" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowLine2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M -100 120 C 200 60, 400 180, 700 120 S 1200 60, 1600 140"
            fill="none"
            stroke="url(#purpleFade)"
            strokeWidth="0.35"
            filter="url(#glowLine)"
          />
          <path
            d="M -100 380 C 250 260, 500 500, 800 360 S 1300 260, 1600 400"
            fill="none"
            stroke="url(#purpleFade2)"
            strokeWidth="0.3"
            filter="url(#glowLine)"
          />
          <path
            d="M -100 620 C 300 540, 600 720, 900 620 S 1300 540, 1600 640"
            fill="none"
            stroke="url(#purpleFade3)"
            strokeWidth="0.4"
            filter="url(#glowLine)"
          />
          <path
            d="M 800 -50 C 1000 150, 1200 250, 1500 200"
            fill="none"
            stroke="url(#purpleFade2)"
            strokeWidth="0.25"
            filter="url(#glowLine2)"
          />
        </svg>
      </div>

      {/* NAV */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
        <div
          className="rounded-2xl px-4 md:px-6 py-3"
          style={{
            background: "rgba(15, 15, 20, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="grid grid-cols-3 items-center">
            <div className="flex justify-start">
              <Link href="/">
                <SmokeLogoWordmark />
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-8 text-base font-semibold text-white">
              <Link href="/pricing" className="hover:text-zinc-300 transition">
                Pricing
              </Link>
              <Link href="/leaderboard" className="hover:text-zinc-300 transition">
                Leaderboard
              </Link>
              <a
                href="https://discord.gg/your-invite-code"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition"
              >
                Discord
              </a>
            </nav>

            <div className="flex items-center justify-end gap-2">
              <Link
                href="/login"
                className="px-3 md:px-4 h-10 inline-flex items-center rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-3 md:px-4 h-10 inline-flex items-center rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Your secure bio link, one click away.
        </div>

        <div className="relative mt-6">
          <div
            className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,255,255,0.55), transparent 70%)",
            }}
          />
          <h1
            className="relative text-2xl sm:text-3xl md:text-5xl font-normal tracking-tight leading-tight"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              textShadow: `
                0 1px 0 rgba(255,255,255,0.9),
                0 2px 0 rgba(200,200,200,0.7),
                0 3px 0 rgba(150,150,150,0.5),
                0 4px 8px rgba(0,0,0,0.5),
                0 0 20px rgba(255,255,255,0.5),
                0 0 40px rgba(255,255,255,0.3)
              `,
            }}
          >
            Create A{" "}
            <span
              className="inline-block relative font-normal"
              style={{
                color: "#ffffff",
                fontWeight: 400,
                verticalAlign: "baseline",
                transition: "opacity 300ms ease-out",
                opacity: wordVisible ? 1 : 0,
                willChange: "opacity",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                textShadow: "0 0 20px rgba(255,255,255,0.5)",
              }}
            >
              {words[wordIndex]}
            </span>{" "}
            Page For All Your Links
          </h1>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition"
          >
            Build your page now →
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium border border-white/20 bg-white/5 hover:bg-white/10 transition text-white"
          >
            Log in
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-500">Free forever · No credit card required</p>
      </section>

      {/* Devices section */}
      <section className="relative z-10 px-6 md:px-12 pt-16 pb-24 md:pb-32 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative w-full md:w-[520px] text-left flex-shrink-0 md:ml-24 lg:ml-32">
          <div
            className="pointer-events-none absolute -inset-8 blur-3xl opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 40% 40%, rgba(255,255,255,0.6), transparent 70%)",
            }}
          />
          <p
            className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] whitespace-nowrap"
            style={{
              color: "#ffffff",
              textShadow: `
                0 1px 0 rgba(255,255,255,0.95),
                0 2px 0 rgba(220,220,220,0.8),
                0 3px 0 rgba(180,180,180,0.6),
                0 4px 0 rgba(140,140,140,0.4),
                0 5px 12px rgba(0,0,0,0.6),
                0 0 24px rgba(255,255,255,0.55),
                0 0 48px rgba(255,255,255,0.35)
              `,
            }}
          >
            Available For All Devices
          </p>

          <p
            className="relative mt-6 text-sm md:text-base leading-relaxed"
            style={{
              color: "#d4d4d8",
              textShadow:
                "0 0 12px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2)",
            }}
          >
            Whether you're on a phone, tablet, or desktop — smokez.lol looks stunning everywhere. One link, always in reach.
          </p>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center justify-end flex-shrink-0 gap-4 sm:gap-0">
          <div
            className="pointer-events-none absolute blur-3xl"
            style={{
              width: "100%",
              height: "100%",
              right: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 45%, transparent 75%)",
            }}
          />

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform,
              transition: "transform 0.15s ease-out",
              transformStyle: "preserve-3d",
              willChange: "transform",
              position: "relative",
              zIndex: 1,
            }}
            className="flex-shrink-0"
          >
            <img
              src="/mockup.png"
              alt="smokez.lol laptop preview"
              className="w-[280px] sm:w-[500px] md:w-[700px] h-auto block"
            />
          </div>

          <div
            ref={phoneRef}
            onMouseMove={handlePhoneMove}
            onMouseLeave={handlePhoneLeave}
            style={{
              transform: phoneTransform,
              transition: "transform 0.15s ease-out",
              transformStyle: "preserve-3d",
              willChange: "transform",
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
            }}
            className="flex-shrink-0 -ml-0 sm:-ml-[60px]"
          >
            <img
              src="/phone.png.png"
              alt="smokez.lol phone preview"
              className="w-[140px] sm:w-[220px] md:w-[300px] h-auto block -mr-6 md:-mr-[50px]"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            Simple Steps
          </div>
        </div>

        <h2
          className="text-center text-4xl md:text-6xl font-bold tracking-tight mb-4"
          style={{
            color: "#ffffff",
            textShadow: `
              0 1px 0 rgba(255,255,255,0.9),
              0 2px 0 rgba(200,200,200,0.6),
              0 4px 8px rgba(0,0,0,0.5),
              0 0 24px rgba(255,255,255,0.5),
              0 0 48px rgba(255,255,255,0.25)
            `,
          }}
        >
          How It Works
        </h2>

        <p className="text-center text-zinc-400 max-w-md mx-auto mb-20">
          Get your link in just a few simple steps.
        </p>

        {/* Steps + arrows */}
        <div className="relative flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-12 md:gap-4">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center w-full md:w-1/3">
            <div
              className="w-16 h-16 rounded-full grid place-items-center mb-6"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #3a3a44 0%, #14141a 70%)",
                border: "1.5px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 0 30px rgba(255,255,255,0.35), inset 0 0 15px rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sign Up</h3>
            <p className="text-sm text-zinc-400 max-w-[220px] leading-relaxed">
              Create your free account in seconds.
            </p>
          </div>

          {/* Arrow between 1 and 2 (desktop only) */}
          <div className="hidden md:flex items-center justify-center self-start pt-8 shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(255,255,255,0.7)) drop-shadow(0 0 14px rgba(255,255,255,0.35))",
              }}
            >
              <path
                d="M5 12H19M13 5l7 7-7 7"
                fill="none"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center w-full md:w-1/3">
            <div
              className="w-16 h-16 rounded-full grid place-items-center mb-6"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #3a3a44 0%, #14141a 70%)",
                border: "1.5px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 0 30px rgba(255,255,255,0.35), inset 0 0 15px rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Add Your Links</h3>
            <p className="text-sm text-zinc-400 max-w-[220px] leading-relaxed">
              Choose your favourite links and customise your page.
            </p>
          </div>

          {/* Arrow between 2 and 3 (desktop only) */}
          <div className="hidden md:flex items-center justify-center self-start pt-8 shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(255,255,255,0.7)) drop-shadow(0 0 14px rgba(255,255,255,0.35))",
              }}
            >
              <path
                d="M5 12H19M13 5l7 7-7 7"
                fill="none"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center w-full md:w-1/3">
            <div
              className="w-16 h-16 rounded-full grid place-items-center mb-6"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #3a3a44 0%, #14141a 70%)",
                border: "1.5px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 0 30px rgba(255,255,255,0.35), inset 0 0 15px rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Share</h3>
            <p className="text-sm text-zinc-400 max-w-[220px] leading-relaxed">
              Get your unique link and start sharing!
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-48 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-white/25 hover:bg-white/[0.05] transition">
            <div className="w-12 h-12 rounded-full grid place-items-center mb-6 border border-white/15 bg-white/[0.03]">
              <svg
                className="w-5 h-5 text-zinc-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Safe &amp; Secure</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your page is protected with industry-grade encryption — always.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-white/25 hover:bg-white/[0.05] transition">
            <div className="w-12 h-12 rounded-full grid place-items-center mb-6 border border-white/15 bg-white/[0.03]">
              <svg
                className="w-5 h-5 text-zinc-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your page loads in a blink. Optimized for speed so visitors never wait.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-white/25 hover:bg-white/[0.05] transition">
            <div className="w-12 h-12 rounded-full grid place-items-center mb-6 border border-white/15 bg-white/[0.03]">
              <svg
                className="w-5 h-5 text-zinc-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Custom Links</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Add any link you want — socials, websites, or your own custom URLs.
            </p>
          </div>
        </div>
      </section>

      {/* Extra scrollable space */}
      <div className="h-[40vh]" />

      {/* Grid background wrapper */}
      <div
        className="relative w-full"
        style={{
          backgroundColor: "#000000",
          backgroundImage: `
            linear-gradient(rgba(80, 80, 80, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(80, 80, 80, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      >
        <section className="relative z-10 px-6 pt-24 pb-40 text-center">
          <h2
            className="text-3xl md:text-6xl font-bold tracking-tight"
            style={{
              color: "#ffffff",
              textShadow: `
                0 1px 0 rgba(255,255,255,0.9),
                0 2px 0 rgba(200,200,200,0.6),
                0 4px 8px rgba(0,0,0,0.5),
                0 0 24px rgba(255,255,255,0.5),
                0 0 48px rgba(255,255,255,0.25)
              `,
            }}
          >
            Users Worldwide
          </h2>

          <p className="mt-6 text-zinc-400 max-w-md mx-auto">
            People from every corner of the world use smokez.lol to share what matters most.
          </p>
        </section>

        <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} smokez.lol
        </footer>
      </div>
    </main>
  );
}