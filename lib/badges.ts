export type BadgeIcon =
  | "shield" | "gem" | "check-circle" | "coins" | "gift"
  | "image" | "rocket" | "bug" | "crown" | "trophy"
  | "medal" | "sun" | "snowflake" | "sparkles" | "award" | "zap";

export type BadgeRequirement =
  | { type: "avatar" }
  | { type: "bio" }
  | { type: "socials" }
  | { type: "links" }
  | { type: "background" }
  | { type: "music" }
  | { type: "views"; count: number }
  | { type: "accountAge"; days: number }
  | { type: "manual" }; // only staff can grant

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: BadgeIcon;
  color: string;
  requirement: BadgeRequirement;
  requirementLabel: string;
};

export const BADGES: Badge[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Upload your first avatar.",
    icon: "sparkles",
    color: "#06b6d4",
    requirement: { type: "avatar" },
    requirementLabel: "Upload an avatar",
  },
  {
    id: "storyteller",
    name: "Storyteller",
    description: "Add a description to your profile.",
    icon: "award",
    color: "#eab308",
    requirement: { type: "bio" },
    requirementLabel: "Add a description",
  },
  {
    id: "connected",
    name: "Connected",
    description: "Link at least one social account.",
    icon: "rocket",
    color: "#f97316",
    requirement: { type: "socials" },
    requirementLabel: "Add a social link",
  },
  {
    id: "curator",
    name: "Curator",
    description: "Add custom links to your page.",
    icon: "image",
    color: "#14b8a6",
    requirement: { type: "links" },
    requirementLabel: "Add a custom link",
  },
  {
    id: "aesthetic",
    name: "Aesthetic",
    description: "Upload a custom background image.",
    icon: "zap",
    color: "#f43f5e",
    requirement: { type: "background" },
    requirementLabel: "Upload a background image",
  },
  {
    id: "tuned-in",
    name: "Tuned In",
    description: "Add background music to your page.",
    icon: "sparkles",
    color: "#a855f7",
    requirement: { type: "music" },
    requirementLabel: "Add background music",
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Reach 10 profile views.",
    icon: "sun",
    color: "#fb923c",
    requirement: { type: "views", count: 10 },
    requirementLabel: "Get 10 profile views",
  },
  {
    id: "popular",
    name: "Popular",
    description: "Reach 100 profile views.",
    icon: "trophy",
    color: "#fbbf24",
    requirement: { type: "views", count: 100 },
    requirementLabel: "Get 100 profile views",
  },
  {
    id: "famous",
    name: "Famous",
    description: "Reach 1,000 profile views.",
    icon: "crown",
    color: "#facc15",
    requirement: { type: "views", count: 1000 },
    requirementLabel: "Get 1,000 profile views",
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Reach 10,000 profile views.",
    icon: "crown",
    color: "#ef4444",
    requirement: { type: "views", count: 10000 },
    requirementLabel: "Get 10,000 profile views",
  },
  {
    id: "loyal",
    name: "Loyal",
    description: "Have an account for 7 days.",
    icon: "medal",
    color: "#84cc16",
    requirement: { type: "accountAge", days: 7 },
    requirementLabel: "Account age: 7 days",
  },
  {
    id: "og",
    name: "OG",
    description: "Have an account for 30 days.",
    icon: "crown",
    color: "#facc15",
    requirement: { type: "accountAge", days: 30 },
    requirementLabel: "Account age: 30 days",
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Have an account for 365 days.",
    icon: "shield",
    color: "#3b82f6",
    requirement: { type: "accountAge", days: 365 },
    requirementLabel: "Account age: 365 days",
  },
  {
    id: "staff",
    name: "Staff",
    description: "Be a member of the smokez.lol team.",
    icon: "shield",
    color: "#3b82f6",
    requirement: { type: "manual" },
    requirementLabel: "Staff only",
  },
  {
    id: "verified",
    name: "Verified",
    description: "Verified by the smokez.lol team.",
    icon: "check-circle",
    color: "#06b6d4",
    requirement: { type: "manual" },
    requirementLabel: "Verified by staff",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Purchase the premium package.",
    icon: "gem",
    color: "#a855f7",
    requirement: { type: "manual" },
    requirementLabel: "Purchase premium",
  },
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}