"use client";

import { useEffect, useState } from "react";

export function WelcomeGate({
  text,
  accent = "#a855f7",
}: {
  text: string;
  accent?: string;
}) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  function dismiss() {
    if (fading) return;
    setFading(true);
    // Unmute music on the same click
    window.dispatchEvent(new CustomEvent("welcome-dismissed"));
    setTimeout(() => setVisible(false), 600);
  }

  if (!visible) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Enter profile"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dismiss();
        }
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-6 cursor-pointer transition-opacity duration-[600ms] ease-out"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity: fading ? 0 : 1,
      }}
    >
      <div
        className="max-w-lg w-full text-center"
        style={{
          transform: fading ? "scale(0.96)" : "scale(1)",
          transition: "transform 600ms cubic-bezier(.2,.8,.25,1)",
        }}
      >
        <p
          className="text-2xl md:text-3xl font-bold leading-snug whitespace-pre-wrap break-words"
          style={{
            color: "#ffffff",
            textShadow: `0 0 24px ${accent}66`,
          }}
        >
          {text}
        </p>
        <p
          className="mt-8 text-xs uppercase tracking-[0.25em] font-semibold"
          style={{ color: "#ffffff", opacity: 0.45 }}
        >
          Click anywhere to enter
        </p>
      </div>
    </div>
  );
}