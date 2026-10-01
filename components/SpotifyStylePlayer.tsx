"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause, Play, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Check, X,
} from "lucide-react";

type Track = {
  url: string;
  title?: string;
  artist?: string;
  coverUrl?: string;
};

export function SpotifyStylePlayer({
  tracks,
  fallbackSrc,
  fallbackTitle,
  fallbackArtist,
  fallbackCover,
  accent,
  volume = 60,
  loop = true,
}: {
  tracks: Track[];
  fallbackSrc?: string | null;
  fallbackTitle?: string | null;
  fallbackArtist?: string | null;
  fallbackCover?: string | null;
  accent: string;
  volume?: number;
  loop?: boolean;
}) {
  const playlist: Track[] =
    tracks && tracks.length > 0
      ? tracks
      : fallbackSrc
      ? [
          {
            url: fallbackSrc,
            title: fallbackTitle ?? undefined,
            artist: fallbackArtist ?? undefined,
            coverUrl: fallbackCover ?? undefined,
          },
        ]
      : [];

  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const track = playlist[index];

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return;

    el.volume = volume / 100;
    el.loop = loop && playlist.length <= 1;
    el.muted = muted;

    // ---- sync loop: updates bar every frame using rAF while playing ----
    const tick = () => {
      if (el && barRef.current && duration > 0) {
        const pct = (el.currentTime / el.duration) * 100;
        barRef.current.style.width = `${pct.toFixed(2)}%`;
        setCurrent(el.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMeta = () => {
      setDuration(el.duration || 0);
    };

    const onPlay = () => {
      setPlaying(true);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    };

    const onPause = () => {
      setPlaying(false);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onEnded = () => {
      if (playlist.length > 1) setIndex((i) => (i + 1) % playlist.length);
    };

    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    // if the element is already playing (rare), start the loop
    if (!el.paused) {
      onPlay();
    } else {
      // try autoplay
      el.play().catch(() => {
        const unlock = () => {
          el.play().catch(() => {});
          window.removeEventListener("click", unlock);
          window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("click", unlock, { once: true });
        window.addEventListener("touchstart", unlock, { once: true });
      });
    }

    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [index, track?.url, volume, loop, muted, playlist.length, duration]);

  if (!track) return null;

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setCurrent(ratio * duration);
    if (barRef.current) barRef.current.style.width = `${ratio * 100}%`;
  };

  const skip = (seconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seconds));
  };

  const nextTrack = () => {
    if (playlist.length > 1) setIndex((i) => (i + 1) % playlist.length);
    else skip(10);
  };

  const prevTrack = () => {
    if (playlist.length > 1) setIndex((i) => (i - 1 + playlist.length) % playlist.length);
    else skip(-10);
  };

  const toggleMute = () => setMuted((m) => !m);

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // initial fill in case duration is already known
  const initialPct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} src={track.url} preload="metadata" />

      <div className="mt-6 w-full max-w-3xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-6">
            {/* Album art — click for track picker */}
            <button
              onClick={() => playlist.length > 1 && setPickerOpen(true)}
              className={`h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 relative ${
                playlist.length > 1 ? "cursor-pointer hover:scale-105 transition-transform" : "cursor-default"
              }`}
              style={{ background: `${accent}22` }}
            >
              {track.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center">
                  <div className="h-5 w-5 rounded-full bg-white/40" />
                </div>
              )}
              {playing && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${accent}44, transparent 70%)`,
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              )}
            </button>

            {/* Info + progress */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-lg font-bold text-white truncate">
                {track.title || "Now Playing"}
              </div>
              <div className="text-sm text-zinc-400 truncate mt-1">
                {track.artist || "Unknown Artist"}
              </div>

              {/* progress bar — animated by rAF via barRef */}
              <div
                className="mt-4 h-1.5 w-full rounded-full bg-white/10 cursor-pointer overflow-hidden"
                onClick={seek}
              >
                <div
                  ref={barRef}
                  className="h-full rounded-full"
                  style={{
                    width: `${initialPct}%`,
                    background: "#ffffff",
                    // tiny linear transition helps smooth any rAF jitter
                    transition: "width 80ms linear",
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-zinc-500 mt-1.5 font-mono tabular-nums">
                <span>{fmt(current)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls — all white icons, no circles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={prevTrack}
                className="h-10 w-10 grid place-items-center text-white hover:scale-110 transition-transform"
                title={playlist.length > 1 ? "Previous track" : "Back 10s"}
              >
                <SkipBack className="h-5 w-5" fill="white" />
              </button>

              <button
                onClick={togglePlay}
                className="h-12 w-12 grid place-items-center text-white hover:scale-110 transition-transform"
                title={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="h-7 w-7" fill="white" />
                ) : (
                  <Play className="h-7 w-7 ml-0.5" fill="white" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="h-10 w-10 grid place-items-center text-white hover:scale-110 transition-transform"
                title={playlist.length > 1 ? "Next track" : "Forward 10s"}
              >
                <SkipForward className="h-5 w-5" fill="white" />
              </button>

              <button
                onClick={toggleMute}
                className="h-10 w-10 grid place-items-center text-white hover:scale-110 transition-transform ml-1"
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {playlist.length > 1 && (
                <button
                  onClick={() => setPickerOpen(true)}
                  className="h-10 w-10 grid place-items-center text-white hover:scale-110 transition-transform ml-1"
                  title="Choose track"
                >
                  <ListMusic className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setPickerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Choose a track</h2>
              <button onClick={() => setPickerOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {playlist.map((t, i) => {
                const selected = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setIndex(i);
                      setPickerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition text-left ${
                      selected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: `${accent}22` }}>
                      {t.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.coverUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center">
                          <div className="h-2 w-2 rounded-full bg-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {t.title || "Untitled"}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        {t.artist || "Unknown Artist"}
                      </div>
                    </div>
                    {selected && <Check className="h-4 w-4 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </>
  );
}