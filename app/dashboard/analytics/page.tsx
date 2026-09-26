import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SmokeLogoWordmark } from "@/components/SmokeLogo";
import { Eye, Users, Clock, Activity } from "lucide-react";

export const metadata = { title: "Analytics" };

/* ------------------------------------------------------------------ */
/*  Data — swap these for your real queries                            */
/* ------------------------------------------------------------------ */

const views = [420, 512, 468, 610, 720, 680, 590, 705, 812, 780, 690, 845, 930, 1015];

const stats = [
  { label: "Page views", value: "12,480", delta: "+18.2%", positive: true, Icon: Eye },
  { label: "Visitors", value: "3,214", delta: "+7.4%", positive: true, Icon: Users },
  { label: "Avg. session", value: "2m 41s", delta: "+3.1%", positive: true, Icon: Clock },
  { label: "Bounce rate", value: "38.6%", delta: "-2.4%", positive: true, Icon: Activity },
];

const topPages = [
  { path: "/dashboard", views: 4120 },
  { path: "/", views: 3890 },
  { path: "/pricing", views: 1640 },
  { path: "/login", views: 980 },
  { path: "/signup", views: 720 },
];

const maxPageViews = Math.max(...topPages.map((p) => p.views));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  const r = (n: number) => Math.round(n * 100) / 100;
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${r(c1x)} ${r(c1y)}, ${r(c2x)} ${r(c2y)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ */
/*  Chart                                                              */
/* ------------------------------------------------------------------ */

function AreaChart({ data }: { data: number[] }) {
  const W = 720;
  const H = 220;
  const padX = 10;
  const padTop = 24;
  const padBottom = 24;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const stepX = (W - padX * 2) / (data.length - 1);

  const pts = data.map((v, i) => ({
    x: padX + i * stepX,
    y: padTop + (1 - (v - min) / span) * (H - padTop - padBottom),
  }));

  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Page views over the last 14 days"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((i) => {
        const y = padTop + (i * (H - padTop - padBottom)) / 3;
        return (
          <line
            key={i}
            x1={0}
            x2={W}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      <path d={area} fill="url(#areaFill)" className="fade-in" />
      <path
        d={line}
        fill="none"
        stroke="url(#lineStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-line"
      />

      <circle cx={last.x} cy={last.y} r="4" fill="#c084fc" className="fade-in" />
      <circle cx={last.x} cy={last.y} r="4" fill="#c084fc" className="pulse-dot" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)" }}
      />

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <SmokeLogoWordmark />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-semibold"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Title row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 fade-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Analytics</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              How people are using your app over the last 14 days.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 h-9">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-zinc-400">Last 14 days</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, delta, positive, Icon }, i) => (
            <div
              key={label}
              className="fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:bg-white/[0.055] hover:border-white/20"
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {label}
                </span>
                <Icon className="h-4 w-4 text-zinc-600" />
              </div>
              <div className="text-2xl font-semibold tracking-tight">{value}</div>
              <div
                className={`mt-1 text-xs font-medium ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {delta}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          className="fade-up mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          style={{ animationDelay: "380ms" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-zinc-300">Page views</h2>
            <span className="text-xs text-zinc-500">14 days</span>
          </div>
          <AreaChart data={views} />
        </div>

        {/* Top pages */}
        <div
          className="fade-up mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          style={{ animationDelay: "460ms" }}
        >
          <h2 className="text-sm font-semibold text-zinc-300 mb-5">Top pages</h2>

          <ul className="space-y-5">
            {topPages.map((page, i) => {
              const pct = Math.round((page.views / maxPageViews) * 100);
              return (
                <li key={page.path}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-mono text-zinc-300">{page.path}</span>
                    <span className="text-zinc-500 tabular-nums">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 grow-bar"
                      style={{
                        width: `${pct}%`,
                        animationDelay: `${520 + i * 70}ms`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

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

            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            .fade-in { opacity: 0; animation: fadeIn 1.2s ease .3s forwards; }

            @keyframes drawLine {
              from { stroke-dashoffset: 2200; }
              to   { stroke-dashoffset: 0; }
            }
            .draw-line {
              stroke-dasharray: 2200;
              animation: drawLine 1.8s cubic-bezier(.22,1,.36,1) forwards;
            }

            @keyframes growBar {
              from { transform: scaleX(0); }
              to   { transform: scaleX(1); }
            }
            .grow-bar {
              transform-origin: left;
              transform: scaleX(0);
              animation: growBar 1s cubic-bezier(.22,1,.36,1) forwards;
            }

            @keyframes pulseDot {
              0%   { transform: scale(1);   opacity: .55; }
              100% { transform: scale(3.4); opacity: 0; }
            }
            .pulse-dot {
              transform-box: fill-box;
              transform-origin: center;
              animation: pulseDot 2.2s ease-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .fade-up, .fade-in, .draw-line, .grow-bar {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
                stroke-dasharray: none !important;
              }
              .pulse-dot { display: none; }
            }
          `,
        }}
      />
    </main>
  );
}