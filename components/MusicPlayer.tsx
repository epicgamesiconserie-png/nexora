"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Volume1, Play, Pause } from "lucide-react";

export function MusicPlayer({
  src,
  accent = "#a855f7",
}: {
  src: string;
  accent?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;
    audio.muted = true;

    // Try to start muted so the player shows "playing" immediately.
    audio.play().then(() => {
      setPlaying(true);
      setMuted(true);
    }).catch(() => {});

    // Unmute on the FIRST user interaction of any kind.
    // Listening to more events means the audio actually unmutes as
    // soon as the visitor does anything, instead of only on click.
    const unmute = () => {
      if (started) return;
      setStarted(true);
      audio.muted = false;
      audio.volume = volume > 0 ? volume : 0.5;
      setMuted(false);
      audio.play().catch(() => {});
      setPlaying(true);
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("click", unmute);
      window.removeEventListener("keydown", unmute);
      window.removeEventListener("touchstart", unmute);
      window.removeEventListener("pointerdown", unmute);
      window.removeEventListener("scroll", unmute);
      window.removeEventListener("mousemove", unmute);
      window.removeEventListener("wheel", unmute);
    };

    window.addEventListener("click", unmute);
    window.addEventListener("keydown", unmute);
    window.addEventListener("touchstart", unmute);
    window.addEventListener("pointerdown", unmute);
    window.addEventListener("scroll", unmute, { passive: true });
    window.addEventListener("mousemove", unmute, { passive: true });
    window.addEventListener("wheel", unmute, { passive: true });

    return removeListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, started]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      // If unmuted plays are blocked, at least attempt and don't crash
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  function changeVolume(v: number) {
    const audio = audioRef.current;
    if (!audio) return;
    setVolume(v);
    audio.volume = v;
    if (v === 0) {
      audio.muted = true;
      setMuted(true);
    } else {
      audio.muted = false;
      setMuted(false);
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      setMuted(false);
      if (volume === 0) {
        setVolume(0.5);
        audio.volume = 0.5;
      }
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed top-4 right-4 z-[60] flex items-center rounded-2xl border shadow-2xl"
        style={{
          background: "rgba(20,20,26,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: `${accent}33`,
          padding: "8px",
          gap: "4px",
        }}
      >
        <button
          onClick={togglePlay}
          className="h-10 w-10 rounded-xl grid place-items-center transition hover:bg-white/5 shrink-0"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="h-5 w-5 text-white" fill="white" />
          ) : (
            <Play className="h-5 w-5 text-white" fill="white" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="h-10 w-10 rounded-xl grid place-items-center transition hover:bg-white/5 shrink-0"
          title={muted ? "Unmute" : "Mute"}
        >
          <VolumeIcon className="h-5 w-5 text-white" />
        </button>

        <div
          className="grid transition-[grid-template-columns] duration-300 ease-out items-center overflow-hidden"
          style={{
            gridTemplateColumns: hovered ? "1fr" : "0fr",
            marginLeft: hovered ? 6 : 0,
          }}
        >
          <div className="min-w-0 overflow-hidden">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-[100px] cursor-pointer"
              style={{ accentColor: accent }}
              title="Volume"
            />
          </div>
        </div>
      </div>
    </>
  );
}