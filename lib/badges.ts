export type BadgeIcon =
  | "shield" | "gem" | "check-circle" | "coins" | "gift"
  | "image" | "rocket" | "bug" | "crown" | "trophy"
  | "medal" | "sun" | "snowflake" | "sparkles" | "award" | "zap";

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: BadgeIcon;
  color: string;
  requirement: string;
};

export const BADGES: Badge[] = [
  { id: "staff",          name: "Staff",          description: "Be a part of the smokez.lol staff team.",    icon: "shield",       color: "#3b82f6", requirement: "Staff only" },
  { id: "helper",         name: "Helper",         description: "Be active and help users in the community.", icon: "award",        color: "#eab308", requirement: "Community" },
  { id: "premium",        name: "Premium",        description: "Purchase the premium package.",              icon: "gem",          color: "#a855f7", requirement: "Purchase" },
  { id: "verified",       name: "Verified",       description: "Purchase or be a known content creator.",    icon: "check-circle", color: "#06b6d4", requirement: "Unlock" },
  { id: "donor",          name: "Donor",          description: "Donate at least £5 to smokez.lol.",          icon: "coins",        color: "#22c55e", requirement: "Donate" },
  { id: "gifter",         name: "Gifter",         description: "Gift a smokez.lol product to another user.", icon: "gift",         color: "#eab308", requirement: "Gift" },
  { id: "image-host",     name: "Image Host",     description: "Purchase the Image Host.",                   icon: "image",        color: "#14b8a6", requirement: "Purchase" },
  { id: "domain-legend",  name: "Domain Legend",  description: "Add a public custom domain.",               icon: "zap",          color: "#f43f5e", requirement: "Add Domain" },
  { id: "server-booster", name: "Server Booster", description: "Boost the smokez.lol Discord server.",      icon: "rocket",       color: "#f97316", requirement: "Boost" },
  { id: "bug-hunter",     name: "Bug Hunter",     description: "Report a bug to the smokez.lol team.",      icon: "bug",          color: "#84cc16", requirement: "Report" },
  { id: "og",             name: "OG",             description: "Be an early supporter of smokez.lol.",      icon: "crown",        color: "#facc15", requirement: "Early supporter" },
  { id: "the-million",    name: "The Million",    description: "Celebration badge for 1M users.",           icon: "sparkles",     color: "#ec4899", requirement: "Milestone" },
  { id: "summer-2026",    name: "Summer 2026",    description: "Exclusive badge from the 2026 summer sale.", icon: "sun",          color: "#fb923c", requirement: "Event" },
  { id: "christmas-2025", name: "Christmas 2025", description: "Exclusive badge from the 2025 winter sale.", icon: "snowflake",    color: "#38bdf8", requirement: "Event" },
  { id: "easter-2026",    name: "Easter 2026",    description: "Exclusive badge from the 2026 easter sale.", icon: "sparkles",     color: "#a78bfa", requirement: "Event" },
  { id: "winner",         name: "Winner",         description: "Win a smokez.lol event.",                    icon: "trophy",       color: "#fbbf24", requirement: "Event win" },
  { id: "second-place",   name: "Second Place",   description: "Get second place in a smokez.lol event.",   icon: "medal",        color: "#cbd5e1", requirement: "Event" },
  { id: "third-place",    name: "Third Place",    description: "Get third place in a smokez.lol event.",    icon: "medal",        color: "#d97706", requirement: "Event" },
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}