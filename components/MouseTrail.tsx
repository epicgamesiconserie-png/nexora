"use client";

import { useEffect, useRef } from "react";

export type MouseTrailStyle =
  | "none"
  | "snow"
  | "sparkle"
  | "cursor"
  | "stars"
  | "hearts"
  | "bubbles"
  | "lightning"
  | "fire"
  | "music"
  | "rainbow"
  | "confetti";

export function MouseTrail({
  style,
  color,
}: {
  style: MouseTrailStyle;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, px: -100, py: -100, active: false });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    if (style === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    window.addEventListener("mousemove", onMove);

    const accent = color || "#a855f7";

    const spawn = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 18) return;
      lastSpawnRef.current = now;

      const rand = (min: number, max: number) => min + Math.random() * (max - min);

      let p: any = {
        x,
        y,
        life: 0,
        maxLife: 60,
        rotation: Math.random() * Math.PI * 2,
        vr: rand(-0.15, 0.15),
      };

      switch (style) {
        case "snow":
          p = {
            ...p,
            vx: rand(-0.6, 0.6),
            vy: rand(0.8, 1.8), // falls down
            size: rand(3, 7),
            color: "#ffffff",
            maxLife: 90,
            shape: "circle",
            glow: true,
          };
          break;

        case "sparkle":
          p = {
            ...p,
            vx: rand(-2, 2),
            vy: rand(-2, 2),
            size: rand(2, 5),
            color: Math.random() > 0.5 ? "#fde047" : "#fbbf24",
            maxLife: 30,
            shape: "star",
            glow: true,
          };
          break;

        case "cursor":
          p = {
            ...p,
            vx: 0,
            vy: 0,
            size: rand(14, 18),
            color: accent,
            maxLife: 55,
            shape: "cursor",
            glow: false,
          };
          break;

        case "stars":
          p = {
            ...p,
            vx: rand(-1, 1),
            vy: rand(-1, 0.5),
            size: rand(6, 12),
            color: Math.random() > 0.5 ? "#facc15" : "#fde047",
            maxLife: 50,
            shape: "star",
            glow: true,
          };
          break;

        case "hearts":
          p = {
            ...p,
            vx: rand(-0.8, 0.8),
            vy: rand(-1.5, -0.5), // rises up
            size: rand(8, 14),
            color: `hsl(${330 + rand(-20, 20)}, 90%, 65%)`,
            maxLife: 70,
            shape: "heart",
            glow: true,
          };
          break;

        case "bubbles":
          p = {
            ...p,
            vx: rand(-0.4, 0.4),
            vy: rand(-1.2, -0.4), // rises
            size: rand(6, 16),
            color: "rgba(147, 197, 253, 0.7)",
            maxLife: 100,
            shape: "bubble",
            glow: false,
          };
          break;

        case "lightning":
          p = {
            ...p,
            vx: rand(-3, 3),
            vy: rand(-3, 3),
            size: rand(8, 14),
            color: Math.random() > 0.5 ? "#facc15" : "#60a5fa",
            maxLife: 25,
            shape: "bolt",
            glow: true,
          };
          break;

        case "fire":
          p = {
            ...p,
            vx: rand(-0.6, 0.6),
            vy: rand(-1.8, -0.6), // rises
            size: rand(8, 16),
            color: `hsl(${rand(0, 40)}, 100%, ${rand(50, 65)}%)`, // orange/yellow
            maxLife: 60,
            shape: "flame",
            glow: true,
          };
          break;

        case "music":
          p = {
            ...p,
            vx: rand(-0.8, 0.8),
            vy: rand(-1.2, -0.4),
            size: rand(12, 20),
            color: Math.random() > 0.5 ? "#c084fc" : "#a855f7",
            maxLife: 70,
            shape: "note",
            glow: true,
          };
          break;

        case "rainbow":
          p = {
            ...p,
            vx: rand(-1, 1),
            vy: rand(-1, 1),
            size: rand(4, 8),
            color: `hsl(${Math.random() * 360}, 90%, 60%)`,
            maxLife: 45,
            shape: "circle",
            glow: true,
          };
          break;

        case "confetti":
          p = {
            ...p,
            vx: rand(-2.5, 2.5),
            vy: rand(-2, 1),
            size: rand(5, 10),
            color: `hsl(${Math.random() * 360}, 90%, 60%)`,
            maxLife: 60,
            shape: "rect",
            glow: false,
          };
          break;
      }

      particlesRef.current.push(p);
    };

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      const spikes = 5;
      const outer = size;
      const inner = size / 2.5;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size / 4);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 3);
      ctx.bezierCurveTo(-size / 2, size / 1.5, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, size / 1.5, size / 2, size / 3);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
      ctx.closePath();
    };

    const drawBolt = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.4, 0);
      ctx.lineTo(-size * 0.1, 0);
      ctx.lineTo(-size * 0.3, size);
      ctx.lineTo(size * 0.4, -size * 0.2);
      ctx.lineTo(0, -size * 0.2);
      ctx.lineTo(size * 0.3, -size);
      ctx.closePath();
    };

    const drawFlame = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size);
      ctx.bezierCurveTo(-size, size * 0.3, -size * 0.4, -size * 0.5, 0, -size);
      ctx.bezierCurveTo(size * 0.4, -size * 0.5, size, size * 0.3, 0, size);
      ctx.closePath();
    };

    const drawNote = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.arc(-size * 0.3, size * 0.5, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.3, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(-size * 0.15, -size * 0.9, size * 0.15, size * 1.4);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(size * 0.65, -size, size * 0.15, size * 1.3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.15, -size * 0.9);
      ctx.lineTo(size * 0.8, -size);
      ctx.lineTo(size * 0.8, -size * 0.7);
      ctx.lineTo(-size * 0.15, -size * 0.6);
      ctx.closePath();
      ctx.fill();
    };

    const drawCursor = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, -size * 0.7);
      ctx.lineTo(size * 0.6, size * 0.1);
      ctx.lineTo(size * 0.1, size * 0.15);
      ctx.lineTo(size * 0.35, size * 0.7);
      ctx.lineTo(size * 0.1, size * 0.8);
      ctx.lineTo(-size * 0.15, size * 0.25);
      ctx.lineTo(-size * 0.5, size * 0.55);
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn from mouse if it moved
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - mouseRef.current.px;
        const dy = mouseRef.current.y - mouseRef.current.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 3) {
          spawn(mouseRef.current.x, mouseRef.current.y);
          mouseRef.current.px = mouseRef.current.x;
          mouseRef.current.py = mouseRef.current.y;
        }
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        // Snow drifts left/right as it falls
        if (style === "snow") {
          p.vx += Math.sin(p.life * 0.1) * 0.05;
          p.vx *= 0.98;
        }
        // Fire shrinks as it rises
        if (style === "fire") {
          p.size *= 0.98;
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const opacity = 1 - progress;
        const scale = style === "fire" ? p.size / (p.size + 2) : 1 - progress * 0.4;
        const size = p.size * scale;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        switch (p.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "bubble":
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = opacity * 0.4;
            ctx.fill();
            break;

          case "star":
            drawStar(ctx, size / 2);
            ctx.fill();
            break;

          case "heart":
            drawHeart(ctx, size / 2);
            ctx.fill();
            break;

          case "bolt":
            drawBolt(ctx, size / 2);
            ctx.fill();
            break;

          case "flame":
            drawFlame(ctx, size / 2);
            ctx.fill();
            break;

          case "note":
            drawNote(ctx, size / 2);
            break;

          case "cursor":
            drawCursor(ctx, size / 2);
            ctx.fill();
            break;

          case "rect":
            ctx.fillRect(-size / 2, -size / 4, size, size / 2);
            break;
        }

        ctx.restore();
      }

      if (particles.length > 400) {
        particles.splice(0, particles.length - 400);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      particlesRef.current = [];
    };
  }, [style, color]);

  if (style === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 9999 }}
    />
  );
}

/* ============================================================
   INLINE PREVIEW — for the modal
   ============================================================ */
export function MouseTrailPreview({
  style,
  color,
}: {
  style: MouseTrailStyle;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const rafRef = useRef<number>(0);
  const fakeMouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, t: 0 });

  useEffect(() => {
    if (style === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const accent = color || "#a855f7";

    // Simulate a mouse moving in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    fakeMouseRef.current.x = centerX;
    fakeMouseRef.current.y = centerY;
    fakeMouseRef.current.px = centerX;
    fakeMouseRef.current.py = centerY;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (x: number, y: number) => {
      let p: any = {
        x,
        y,
        life: 0,
        maxLife: 60,
        rotation: Math.random() * Math.PI * 2,
        vr: rand(-0.15, 0.15),
      };

      switch (style) {
        case "snow":       p = { ...p, vx: rand(-0.6, 0.6), vy: rand(0.8, 1.8), size: rand(3, 7), color: "#ffffff", maxLife: 90, shape: "circle", glow: true }; break;
        case "sparkle":    p = { ...p, vx: rand(-2, 2), vy: rand(-2, 2), size: rand(2, 5), color: Math.random() > 0.5 ? "#fde047" : "#fbbf24", maxLife: 30, shape: "star", glow: true }; break;
        case "cursor":     p = { ...p, vx: 0, vy: 0, size: rand(14, 18), color: accent, maxLife: 55, shape: "cursor", glow: false }; break;
        case "stars":      p = { ...p, vx: rand(-1, 1), vy: rand(-1, 0.5), size: rand(6, 12), color: Math.random() > 0.5 ? "#facc15" : "#fde047", maxLife: 50, shape: "star", glow: true }; break;
        case "hearts":     p = { ...p, vx: rand(-0.8, 0.8), vy: rand(-1.5, -0.5), size: rand(8, 14), color: `hsl(${330 + rand(-20, 20)}, 90%, 65%)`, maxLife: 70, shape: "heart", glow: true }; break;
        case "bubbles":    p = { ...p, vx: rand(-0.4, 0.4), vy: rand(-1.2, -0.4), size: rand(6, 16), color: "rgba(147, 197, 253, 0.7)", maxLife: 100, shape: "bubble", glow: false }; break;
        case "lightning":  p = { ...p, vx: rand(-3, 3), vy: rand(-3, 3), size: rand(8, 14), color: Math.random() > 0.5 ? "#facc15" : "#60a5fa", maxLife: 25, shape: "bolt", glow: true }; break;
        case "fire":       p = { ...p, vx: rand(-0.6, 0.6), vy: rand(-1.8, -0.6), size: rand(8, 16), color: `hsl(${rand(0, 40)}, 100%, ${rand(50, 65)}%)`, maxLife: 60, shape: "flame", glow: true }; break;
        case "music":      p = { ...p, vx: rand(-0.8, 0.8), vy: rand(-1.2, -0.4), size: rand(12, 20), color: Math.random() > 0.5 ? "#c084fc" : "#a855f7", maxLife: 70, shape: "note", glow: true }; break;
        case "rainbow":    p = { ...p, vx: rand(-1, 1), vy: rand(-1, 1), size: rand(4, 8), color: `hsl(${Math.random() * 360}, 90%, 60%)`, maxLife: 45, shape: "circle", glow: true }; break;
        case "confetti":   p = { ...p, vx: rand(-2.5, 2.5), vy: rand(-2, 1), size: rand(5, 10), color: `hsl(${Math.random() * 360}, 90%, 60%)`, maxLife: 60, shape: "rect", glow: false }; break;
      }
      particlesRef.current.push(p);
    };

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      const spikes = 5; const outer = size; const inner = size / 2.5;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size / 4);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 3);
      ctx.bezierCurveTo(-size / 2, size / 1.5, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, size / 1.5, size / 2, size / 3);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
      ctx.closePath();
    };

    const drawBolt = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size); ctx.lineTo(-size * 0.4, 0); ctx.lineTo(-size * 0.1, 0);
      ctx.lineTo(-size * 0.3, size); ctx.lineTo(size * 0.4, -size * 0.2);
      ctx.lineTo(0, -size * 0.2); ctx.lineTo(size * 0.3, -size);
      ctx.closePath();
    };

    const drawFlame = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size);
      ctx.bezierCurveTo(-size, size * 0.3, -size * 0.4, -size * 0.5, 0, -size);
      ctx.bezierCurveTo(size * 0.4, -size * 0.5, size, size * 0.3, 0, size);
      ctx.closePath();
    };

    const drawNote = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath(); ctx.arc(-size * 0.3, size * 0.5, size * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(size * 0.5, size * 0.3, size * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.rect(-size * 0.15, -size * 0.9, size * 0.15, size * 1.4); ctx.fill();
      ctx.beginPath(); ctx.rect(size * 0.65, -size, size * 0.15, size * 1.3); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.15, -size * 0.9); ctx.lineTo(size * 0.8, -size);
      ctx.lineTo(size * 0.8, -size * 0.7); ctx.lineTo(-size * 0.15, -size * 0.6);
      ctx.closePath(); ctx.fill();
    };

    const drawCursor = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, -size * 0.7); ctx.lineTo(size * 0.6, size * 0.1);
      ctx.lineTo(size * 0.1, size * 0.15); ctx.lineTo(size * 0.35, size * 0.7);
      ctx.lineTo(size * 0.1, size * 0.8); ctx.lineTo(-size * 0.15, size * 0.25);
      ctx.lineTo(-size * 0.5, size * 0.55);
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulate a circular mouse motion
      fakeMouseRef.current.t += 0.05;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      const nx = centerX + Math.cos(fakeMouseRef.current.t) * radius;
      const ny = centerY + Math.sin(fakeMouseRef.current.t) * radius;

      const dx = nx - fakeMouseRef.current.px;
      const dy = ny - fakeMouseRef.current.py;
      if (Math.sqrt(dx * dx + dy * dy) > 3) {
        spawn(nx, ny);
        fakeMouseRef.current.px = nx;
        fakeMouseRef.current.py = ny;
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        if (style === "snow") {
          p.vx += Math.sin(p.life * 0.1) * 0.05;
          p.vx *= 0.98;
        }
        if (style === "fire") p.size *= 0.98;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const opacity = 1 - progress;
        const scale = style === "fire" ? p.size / (p.size + 2) : 1 - progress * 0.4;
        const size = p.size * scale;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        switch (p.shape) {
          case "circle": ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill(); break;
          case "bubble": ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = opacity * 0.4; ctx.fill(); break;
          case "star": drawStar(ctx, size / 2); ctx.fill(); break;
          case "heart": drawHeart(ctx, size / 2); ctx.fill(); break;
          case "bolt": drawBolt(ctx, size / 2); ctx.fill(); break;
          case "flame": drawFlame(ctx, size / 2); ctx.fill(); break;
          case "note": drawNote(ctx, size / 2); break;
          case "cursor": drawCursor(ctx, size / 2); ctx.fill(); break;
          case "rect": ctx.fillRect(-size / 2, -size / 4, size, size / 2); break;
        }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [style, color]);

  if (style === "none") {
    return (
      <div className="w-full h-full grid place-items-center text-xs text-zinc-600">
        No trail
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}