"use client";

import React, { useEffect, useState } from "react";

export type AnimatedTitleStyle =
  | "none" | "glow" | "gradient" | "rainbow"
  | "typewriter" | "wave" | "shuffle" | "fuzzy" | "flicker"
  | "glitch" | "neon" | "shimmer";

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 70);
      } else {
        t = setTimeout(() => setPhase("pausing"), 1500);
      }
    } else if (phase === "pausing") {
      t = setTimeout(() => setPhase("deleting"), 400);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), 35);
      } else {
        t = setTimeout(() => setPhase("typing"), 300);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, text]);

  return (
    <span className="inline-flex items-center">
      <span>{displayed}</span>
      <span
        className="inline-block w-[2px] h-[1em] ml-[2px] bg-current align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}

export function AnimatedTitle({
  text, style, className = "", style2 = {},
}: {
  text: string;
  style: AnimatedTitleStyle;
  className?: string;
  style2?: React.CSSProperties;
}) {
  if (style === "none") {
    return <span className={className} style={style2}>{text}</span>;
  }
  if (style === "wave") {
    return (
      <span className={`effect-wave ${className}`} style={style2}>
        {text.split("").map((char, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  }
  if (style === "typewriter") {
    return (
      <span className={className} style={style2}>
        <TypewriterText text={text} />
      </span>
    );
  }
  if (style === "glitch") {
    return (
      <span className={`effect-glitch ${className}`} style={style2} data-text={text}>
        {text}
      </span>
    );
  }
  if (style === "shimmer") {
    return (
      <span
        className={`effect-shimmer ${className}`}
        style={style2}
      >
        {text}
      </span>
    );
  }
  return <span className={`effect-${style} ${className}`} style={style2}>{text}</span>;
}