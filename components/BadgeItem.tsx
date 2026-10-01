"use client";

import { useState } from "react";
import { BadgeIcon } from "@/components/BadgeIcon";
import type { BadgeIcon as BadgeIconName } from "@/lib/badges";

export function BadgeItem({
  icon,
  name,
  color,
  monochrome,
  textColor,
}: {
  icon: BadgeIconName;
  name: string;
  color: string;
  monochrome: boolean;
  textColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  // Default: if monochrome is on → text color. Otherwise → badge's own color.
  // Hover: if monochrome is on → badge's own color (reveal). Otherwise → stays own color.
  const activeColor = monochrome
    ? hovered
      ? color
      : textColor
    : color;

  return (
    <div
      className="relative grid place-items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip — plain text, no box, forced system font, above the badge */}
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-sm"
        style={{
          color: textColor,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontWeight: 500,
          letterSpacing: "0.01em",
          textShadow:
            "0 0 8px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 75ms ease",
          zIndex: 20,
        }}
      >
        {name}
      </span>

      <div
        className="transition-transform duration-150"
        style={{
          transform: hovered ? "scale(1.35)" : "scale(1)",
          filter: `drop-shadow(0 0 5px ${activeColor}99)`,
        }}
      >
        <BadgeIcon
          icon={icon}
          className="h-6 w-6 transition-colors duration-150"
          color={activeColor}
          strokeWidth={2}
        />
      </div>
    </div>
  );
}