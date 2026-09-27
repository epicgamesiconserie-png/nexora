"use client";

import React from "react";

export type AnimatedTitleStyle =
  | "none" | "glow" | "gradient" | "rainbow"
  | "typewriter" | "wave" | "shuffle" | "fuzzy" | "flicker";

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
    return <span className={`effect-typewriter ${className}`} style={style2}>{text}</span>;
  }
  return <span className={`effect-${style} ${className}`} style={style2}>{text}</span>;
}