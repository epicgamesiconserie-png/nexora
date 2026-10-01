"use client";

import { useRef, useEffect } from "react";

export function TiltCard({
  children,
  className = "",
  style = {},
  maxTilt = 12,
  scale = 1.02,
  perspective = 1200,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const target = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, glare: 0 });
  const current = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, glare: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!wrap || !inner || !glare) return;

    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    let rect: DOMRect | null = null;
    let running = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const t = target.current;
      const c = current.current;
      const ease = 0.14;
      const easeGlare = 0.18;

      c.rx = lerp(c.rx, t.rx, ease);
      c.ry = lerp(c.ry, t.ry, ease);
      c.s  = lerp(c.s,  t.s,  ease);
      c.gx = lerp(c.gx, t.gx, easeGlare);
      c.gy = lerp(c.gy, t.gy, easeGlare);
      c.glare = lerp(c.glare, t.glare, 0.12);

      inner.style.transform = `perspective(${perspective}px) rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) scale(${c.s.toFixed(4)})`;

      glare.style.opacity = c.glare.toFixed(3);
      if (c.glare > 0.01) {
        glare.style.background =
          `radial-gradient(520px circle at ${c.gx.toFixed(2)}% ${c.gy.toFixed(2)}%, ` +
          `rgba(255,255,255,0.35), transparent 60%)`;
      }

      const resting =
        Math.abs(c.rx - t.rx) < 0.01 &&
        Math.abs(c.ry - t.ry) < 0.01 &&
        Math.abs(c.s - t.s) < 0.001 &&
        Math.abs(c.glare - t.glare) < 0.005;

      if (resting) {
        running = false;
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleEnter = () => {
      rect = wrap.getBoundingClientRect();
      target.current.s = scale;
      target.current.glare = 0.14;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      if (!rect) rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = Math.max(-1, Math.min(1, (x - rect.width / 2) / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, (y - rect.height / 2) / (rect.height / 2)));

      target.current.ry = nx * maxTilt;
      target.current.rx = -ny * maxTilt;
      target.current.gx = (x / rect.width) * 100;
      target.current.gy = (y / rect.height) * 100;
      target.current.glare = 0.14;

      startLoop();
    };

    const handleLeave = () => {
      rect = null;
      target.current.rx = 0;
      target.current.ry = 0;
      target.current.s = 1;
      target.current.glare = 0;
      startLoop();
    };

    wrap.addEventListener("mouseenter", handleEnter);
    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("mouseleave", handleLeave);

    return () => {
      wrap.removeEventListener("mouseenter", handleEnter);
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [maxTilt, scale, perspective]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ ...style, position: "relative" }}
    >
      <div
        ref={innerRef}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          backfaceVisibility: "hidden",
          position: "relative",
        }}
      >
        {children}

        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            zIndex: 5,
            mixBlendMode: "soft-light",
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
}