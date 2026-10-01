"use client";

import { useEffect, useState } from "react";

export function WelcomeGate({
  text,
  accent,
  avatarUrl,
  username,
}: {
  text: string;
  accent: string;
  avatarUrl?: string | null;
  username?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible && !leaving) return null;

  return (
    <div
      className="fixed inset-0 grid place-items-center px-6 transition-opacity duration-300"
      style={{
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: leaving ? 0 : 1,
      }}
      onClick={dismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dismiss();
      }}
    >
      <div
        className="flex flex-col items-center text-center max-w-md w-full transition-all duration-500"
        style={{
          transform: leaving ? "scale(0.96)" : "scale(1)",
          opacity: leaving ? 0 : 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-24 w-24 rounded-full object-cover mb-6"
            style={{
              border: `2px solid ${accent}`,
              boxShadow: `0 0 40px -8px ${accent}`,
            }}
          />
        )}

        <p
          className="text-2xl md:text-3xl font-bold tracking-tight mb-2"
          style={{
            color: "#fff",
            textShadow: `0 0 20px ${accent}88, 0 0 40px ${accent}44`,
          }}
        >
          {text}
        </p>

        {username && (
          <p className="text-sm mb-8" style={{ color: accent, opacity: 0.7 }}>
            @{username}
          </p>
        )}

        <button
          onClick={dismiss}
          className="mt-6 h-11 px-8 rounded-xl font-bold transition-transform hover:scale-105"
          style={{
            background: accent,
            color: "#fff",
            boxShadow: `0 8px 24px -8px ${accent}`,
          }}
        >
          Enter
        </button>

        <p className="mt-6 text-xs text-white/40">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}