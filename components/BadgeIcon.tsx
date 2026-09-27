"use client";

import {
  Shield, Gem, CheckCircle2, Coins, Gift, Image as ImageIcon,
  Rocket, Bug, Crown, Trophy, Medal, Sun, Snowflake, Sparkles,
  Award, Zap,
} from "lucide-react";
import type { BadgeIcon as BadgeIconName } from "@/lib/badges";

const ICON_MAP: Record<BadgeIconName, React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>> = {
  shield: Shield,
  gem: Gem,
  "check-circle": CheckCircle2,
  coins: Coins,
  gift: Gift,
  image: ImageIcon,
  rocket: Rocket,
  bug: Bug,
  crown: Crown,
  trophy: Trophy,
  medal: Medal,
  sun: Sun,
  snowflake: Snowflake,
  sparkles: Sparkles,
  award: Award,
  zap: Zap,
};

export function BadgeIcon({
  icon,
  className = "h-5 w-5",
  color,
  strokeWidth = 2,
}: {
  icon: BadgeIconName;
  className?: string;
  color?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[icon] || Award;
  return <Icon className={className} style={{ color }} strokeWidth={strokeWidth} />;
}