"use client";

import { useEffect } from "react";
import { useGlobalAudio } from "@/components/GlobalAudio";

export function ProfileAudioSync({
  audioUrl,
  volume = 60,
  loop = true,
}: {
  audioUrl: string | null;
  volume?: number;
  loop?: boolean;
}) {
  const { play, pause } = useGlobalAudio();

  useEffect(() => {
    if (!audioUrl) {
      pause();
      return;
    }
    play(audioUrl, { volume: volume / 100, loop });
  }, [audioUrl, volume, loop, play, pause]);

  return null;
}