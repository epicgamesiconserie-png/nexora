"use client";

import { useEffect, useRef, useState } from "react";

export function MusicPlayer({
  src,
  accent,
  volume = 60,
  loop = true,
}: {
  src: string;
  accent: string;
  volume?: number;
  loop?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume / 100;
    el.loop = loop;

    // try to play. If browser blocks it, we'll retry on first click.
    const tryPlay = () => {
      el.play().catch(() => {
        // blocked — attach a one-time unlocker
        const unlock = () => {
          el.play().catch(() => {});
          window.removeEventListener("click", unlock);
          window.removeEventListener("touchstart", unlock);
          window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("click", unlock, { once: true });
        window.addEventListener("touchstart", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
      });
    };

    tryPlay();

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [src, volume, loop]);

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      {/* your visual player UI here — the little pill, controls, etc. */}
    </>
  );
}