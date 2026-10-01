"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PlayOpts = { volume?: number; loop?: boolean };

type AudioCtx = {
  play: (src: string, opts?: PlayOpts) => void;
  pause: () => void;
  setVolume: (v: number) => void;
  currentSrc: string | null;
  isPlaying: boolean;
};

const Ctx = createContext<AudioCtx | null>(null);

export function GlobalAudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = new Audio();
    el.loop = true;
    el.volume = 0.6;
    el.preload = "auto";

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    ref.current = el;

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.pause();
      el.src = "";
      ref.current = null;
    };
  }, []);

  const play = (src: string, opts?: PlayOpts) => {
    const el = ref.current;
    if (!el || !src) return;

    if (opts?.volume !== undefined) {
      el.volume = Math.max(0, Math.min(1, opts.volume));
    }
    if (opts?.loop !== undefined) el.loop = opts.loop;

    // Only swap the src if it actually changed — otherwise we just resume.
    if (el.src !== src && !el.src.endsWith(src)) {
      el.src = src;
      setCurrentSrc(src);
    }

    el.play().catch((err) => {
      // Browser blocked it — usually because there was no user gesture.
      // Silent catch is fine; the next click will unlock it.
      console.log("[GlobalAudio] play blocked:", err?.name || err);
    });
  };

  const pause = () => {
    ref.current?.pause();
  };

  const setVolume = (v: number) => {
    if (ref.current) ref.current.volume = Math.max(0, Math.min(1, v));
  };

  return (
    <Ctx.Provider
      value={{ play, pause, setVolume, currentSrc, isPlaying }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useGlobalAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useGlobalAudio must be used inside <GlobalAudioProvider>"
    );
  }
  return ctx;
}