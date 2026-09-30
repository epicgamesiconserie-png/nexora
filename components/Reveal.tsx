"use client";
import { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay before the animation starts, in ms. Default 0. */
  delay?: number;
  /** Animation duration, in ms. Default 1200. */
  duration?: number;
  /** Vertical offset in px the element slides up from. Default 16. */
  y?: number;
  /** Starting scale (0–1). 1 = no zoom. Default 0.96. */
  scale?: number;
  /** Optional className passed to the wrapper. */
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  duration = 1200,
  y = 16,
  scale = 0.96,
  className,
}: RevealProps) {
  const style: CSSProperties = {
    animation: `nexoraReveal ${duration}ms cubic-bezier(.16, 1, .3, 1) ${delay}ms both`,
    ["--reveal-y" as any]: `${y}px`,
    ["--reveal-scale" as any]: `${scale}`,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}