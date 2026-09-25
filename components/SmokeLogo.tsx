// components/SmokeLogo.tsx
export function SmokeLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 0 8px rgba(255,255,255,0.85)) drop-shadow(0 0 20px rgba(255,255,255,0.45))",
      }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e4e4e7" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4d4d8" />
          <stop offset="100%" stopColor="#71717a" />
        </linearGradient>
        <radialGradient id="smoke1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="smoke2">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="smoke3">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="20" cy="22" r="14" fill="url(#smoke3)" />
      <circle cx="13" cy="14" r="11" fill="url(#smoke2)" />
      <circle cx="8" cy="18" r="9" fill="url(#smoke2)" />
      <circle cx="18" cy="12" r="8" fill="url(#smoke1)" />
      <circle cx="10" cy="8" r="7" fill="url(#smoke1)" />
      <circle cx="22" cy="6" r="5.5" fill="url(#smoke1)" />
      <circle cx="5" cy="14" r="5" fill="url(#smoke2)" />
      <circle cx="15" cy="3" r="4" fill="url(#smoke1)" />

      <rect x="26" y="26" width="18" height="32" rx="2.5" fill="url(#bodyGrad)" />
      <rect x="27" y="28" width="1.8" height="28" rx="0.9" fill="#ffffff" opacity="0.85" />
      <rect x="42" y="28" width="1.3" height="28" rx="0.6" fill="#000000" opacity="0.3" />

      <path d="M27 26 L29 22 L41 22 L43 26 Z" fill="url(#capGrad)" />
      <rect x="29" y="19" width="12" height="3.5" rx="1" fill="#e4e4e7" />
      <rect x="29" y="19" width="12" height="1" rx="0.5" fill="#ffffff" opacity="0.9" />
      <rect x="33" y="16" width="4" height="3.5" rx="1" fill="#d4d4d8" />

      <circle cx="31" cy="33" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="39" cy="33" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="31" cy="38.5" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="39" cy="38.5" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="31" cy="44" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="39" cy="44" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="31" cy="49.5" r="0.85" fill="#18181b" opacity="0.9" />
      <circle cx="39" cy="49.5" r="0.85" fill="#18181b" opacity="0.9" />

      <rect x="25" y="58" width="20" height="3" rx="1.5" fill="url(#baseGrad)" />
      <rect x="25" y="58" width="20" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />

      <circle cx="49" cy="17" r="5" stroke="#ffffff" strokeWidth="1.8" fill="none" />
      <path d="M44.5 17 L42 20" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="49" cy="15" r="0.8" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export function SmokeLogoWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SmokeLogo className="h-10 w-10 md:h-12 md:w-12" />
      <span
        className="inline-flex items-baseline text-white"
        style={{
          fontFamily:
            "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 500,
          fontSize: "1.5rem",
          letterSpacing: "-0.055em",
          lineHeight: 1,
          textShadow: "0 0 12px rgba(255,255,255,0.15)",
        }}
      >
        smokez
        <span
          className="inline-block text-zinc-500"
          style={{
            fontSize: "2.25rem",
            lineHeight: 1,
            marginLeft: "1px",
            marginRight: "1px",
            transform: "translateY(2px)",
          }}
        >
          .
        </span>
        lol
      </span>
    </div>
  );
}