"use client";

import { useRef, useState } from "react";

export function TiltCard({
  children,
  className = "",
  style = {},
  maxTilt = 12,
  scale = 1.02,
  perspective = 1000,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, visible: false });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const nx = (x - centerX) / centerX;
    const ny = (y - centerY) / centerY;

    const rotateY = nx * maxTilt;
    const rotateX = -ny * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    );
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, visible: true });
  };

  const handleLeave = () => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    );
    setGlare((g) => ({ ...g, visible: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        ...style,
        transform,
        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        position: "relative",
      }}
    >
      {children}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          opacity: glare.visible ? 0.18 : 0,
          transition: "opacity 250ms ease",
          background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.6), transparent 45%)`,
          zIndex: 5,
        }}
      />
    </div>
  );
}