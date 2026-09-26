import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { ArrowUpRight, Globe, BookOpen, FileText, LifeBuoy, Mail } from "lucide-react";

export const metadata = { title: "Links" };

/* ------------------------------------------------------------------ */
/*  Data — swap these for your real links                              */
/* ------------------------------------------------------------------ */

const links = [
  {
    title: "Website",
    description: "The main site.",
    href: "https://smoke.app",
    Icon: Globe,
  },
  {
    title: "Documentation",
    description: "Guides and API reference.",
    href: "/docs",
    Icon: BookOpen,
  },
  {
    title: "Changelog",
    description: "What shipped, and when.",
    href: "/changelog",
    Icon: FileText,
  },
  {
    title: "Support",
    description: "Get help from the team.",
    href: "/support",
    Icon: LifeBuoy,
  },
  {
    title: "Email us",
    description: "hello@smoke.app",
    href: "mailto:hello@smoke.app",
    Icon: Mail,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isInternal(href: string) {
  return href.startsWith("/");
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function LinksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%)" }}
      />

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <SmokeLogoWordmark />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition font-semibold"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Links</h1>
          <p className="text-zinc-400 text-lg">Everything in one place.</p>
        </div>

        <ul className="space-y-3">
          {links.map(({ title, description, href, Icon }, i) => {
            const inner = (
              <>
                <span className="grid place-items-center h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors duration-300 group-hover:text-white group-hover:border-white/25">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">{description}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            );

            const className =
              "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/25 hover:-translate-y-0.5";

            return (
              <li
                key={title}
                className="fade-up"
                style={{ animationDelay: `${80 + i * 70}ms` }}
              >
                {isInternal(href) ? (
                  <Link href={href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <div className="h-16" />
      </section>

      {/* Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: none; }
            }
            .fade-up {
              opacity: 0;
              animation: fadeUp .7s cubic-bezier(.22,1,.36,1) forwards;
            }

            @media (prefers-reduced-motion: reduce) {
              .fade-up {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}