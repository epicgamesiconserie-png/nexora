"use client";

import { useEffect, useRef, useState } from "react";

export function WelcomeGate({
  text,
  accent,
  audioUrl,
  volume = 60,
  loop = true,
}: {
  text: string;
  accent: string;
  audioUrl?: string | null;
  volume?: number;
  loop?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.loop = loop;
        audioRef.current.volume = Math.max(0, Math.min(1, volume / 100));
      }
      audioRef.current.play().catch((err) => {
        console.log("[WelcomeGate] audio blocked:", err);
      });
    }
    setLeaving(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible && !leaving) return null;

  return (
    <div
      className="fixed inset-0 grid place-items-center px-6 transition-opacity duration-300"
      style={{
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: leaving ? 0 : 1,
        cursor: "pointer",
      }}
      onClick={dismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dismiss();
      }}
    >
      <p
        className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-center max-w-lg transition-all duration-500"
        style={{
          color: "#ffffff",
          textShadow: `0 0 24px ${accent}99, 0 0 48px ${accent}44`,
          transform: leaving ? "scale(0.96)" : "scale(1)",
          opacity: leaving ? 0 : 1,
        }}
      >
        {text}
      </p>
    </div>
  );
}