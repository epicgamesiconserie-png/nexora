"use client";

import { useEffect } from "react";

export function ViewCounter({ userId }: { userId: string }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  }, [userId]);

  return null; // renders nothing
}