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
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // target = where the mouse wants the card to be
  // current = where the card actually is right now
  // we lerp current -> target every frame = smooth motion
  const target = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, glare: 0 });
  const current = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, glare: 0 });

  useEffect(() => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    // skip on touch devices entirely
    if (window.matchMedia("(hover: none)").matches) return;

    let rect: DOMRect | null = null;
    let running = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const t = target.current;
      const c = current.current;

      // easing factor — smaller = floatier, larger = snappier
      const ease = 0.14;
      const easeGlare = 0.18;

      c.rx = lerp(c.rx, t.rx, ease);
      c.ry = lerp(c.ry, t.ry, ease);
      c.s  = lerp(c.s,  t.s,  ease);
      c.gx = lerp(c.gx, t.gx, easeGlare);
      c.gy = lerp(c.gy, t.gy, easeGlare);
      c.glare = lerp(c.glare, t.glare, 0.12);

      // stop the loop when we're close enough to resting state
      const resting =
        Math.abs(c.rx - t.rx) < 0.01 &&
        Math.abs(c.ry - t.ry) < 0.01 &&
        Math.abs(c.s - t.s) < 0.001 &&
        Math.abs(c.glare - t.glare) < 0.005;

      el.style.transform = `perspective(${perspective}px) rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) scale(${c.s.toFixed(4)})`;

      glare.style.opacity = c.glare.toFixed(3);
      if (c.glare > 0.01) {
        glare.style.background =
          `radial-gradient(520px circle at ${c.gx.toFixed(2)}% ${c.gy.toFixed(2)}%, ` +
          `rgba(255,255,255,0.55), ` +
          `rgba(255,255,255,0.15) 35%, ` +
          `transparent 60%)`;
      }

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
      rect = el.getBoundingClientRect();
      target.current.s = scale;
      target.current.glare = 0.16;
      startLoop();
    };

    const handleMove = (e: MouseEvent) => {
      if (!rect) rect = el.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // -1..1 from center, clamped so fast mouse-out doesn't overshoot
      const nx = Math.max(-1, Math.min(1, (x - rect.width / 2) / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, (y - rect.height / 2) / (rect.height / 2)));

      target.current.ry =  nx * maxTilt;
      target.current.rx = -ny * maxTilt;

      // glare follows the real cursor position, in %
      target.current.gx = (x / rect.width) * 100;
      target.current.gy = (y / rect.height) * 100;
      target.current.glare = 0.16;

      startLoop();
    };

    const handleLeave = () => {
      rect = null;
      target.current.rx = 0;
      target.current.ry = 0;
      target.current.s = 1;
      target.current.glare = 0;
      // keep the loop running — lerp will smoothly return everything to rest
      startLoop();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [maxTilt, scale, perspective]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        willChange: "transform",
        backfaceVisibility: "hidden",
        position: "relative",
        // no CSS transition — the rAF loop handles smoothing
      }}
    >
      {children}

      <div
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: 0,
          zIndex: 5,
          mixBlendMode: "soft-light",
          // no transition — opacity is lerped per frame
        }}
      />
    </div>
  );
}