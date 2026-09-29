import { BADGES, type Badge } from "@/lib/badges";

export type BadgeContext = {
  avatarUrl?: string | null;
  bio?: string | null;
  backgroundUrl?: string | null;
  audioUrl?: string | null;
  views?: number | null;
  createdAt?: Date | string | null;
  socialsCount: number;
  linksCount: number;
  isAdmin: boolean;
  isPremium: boolean;
};

/**
 * Compute which badges the user currently *qualifies* for, based on live data.
 * Pure function — does not touch the database.
 */
export function computeEarnedBadges(ctx: BadgeContext): string[] {
  const earned: string[] = [];

  if (ctx.avatarUrl) earned.push("starter");
  if (ctx.bio && ctx.bio.length > 0) earned.push("storyteller");
  if (ctx.socialsCount > 0) earned.push("connected");
  if (ctx.linksCount > 0) earned.push("curator");
  if (ctx.backgroundUrl) earned.push("aesthetic");
  if (ctx.audioUrl) earned.push("tuned-in");

  const views = ctx.views ?? 0;
  if (views >= 10) earned.push("rising-star");
  if (views >= 100) earned.push("popular");
  if (views >= 1000) earned.push("famous");
  if (views >= 10000) earned.push("legendary");

  if (ctx.createdAt) {
    const days = Math.floor(
      (Date.now() - new Date(ctx.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days >= 7) earned.push("loyal");
    if (days >= 30) earned.push("og");
    if (days >= 365) earned.push("veteran");
  }

  if (ctx.isAdmin) earned.push("staff");
  if (ctx.isPremium) earned.push("premium");

  return earned;
}

/**
 * Merge newly-earned badges into the persisted unlocked list.
 * Never removes anything — once unlocked, always unlocked.
 */
export function mergeUnlocked(stored: string[], earned: string[]): string[] {
  const set = new Set(stored);
  for (const id of earned) set.add(id);
  return BADGES.filter((b: Badge) => set.has(b.id)).map((b) => b.id);
}