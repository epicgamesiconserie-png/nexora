// Map of platform key -> list of accepted hostnames.
// If a platform is not listed here, no domain check is performed
// (used for wallet addresses and any future platforms).
//
// To add a new platform: add the key here with its accepted domains.
// To disable validation for a platform: remove its entry.

export const PLATFORM_HOSTS: Record<string, string[]> = {
  youtube:     ["youtube.com", "youtu.be", "m.youtube.com", "www.youtube.com", "www.youtu.be"],
  twitch:      ["twitch.tv", "m.twitch.tv", "www.twitch.tv"],
  tiktok:      ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"],
  discord:     ["discord.gg", "discord.com", "www.discord.com", "www.discord.gg"],
  facebook:    ["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com", "www.fb.com"],
  spotify:     ["spotify.com", "open.spotify.com", "play.spotify.com"],
  instagram:   ["instagram.com", "www.instagram.com"],
  x:           ["x.com", "www.x.com", "twitter.com", "www.twitter.com", "m.twitter.com"],
  telegram:    ["t.me", "telegram.me", "telegram.org", "www.telegram.org"],
  paypal:      ["paypal.com", "www.paypal.com", "paypal.me", "www.paypal.me"],
  roblox:      ["roblox.com", "www.roblox.com", "web.roblox.com"],
  github:      ["github.com", "www.github.com", "gist.github.com"],
  cashapp:     ["cash.app", "www.cash.app"],
  venmo:       ["venmo.com", "www.venmo.com", "account.venmo.com"],
  playstation: ["playstation.com", "www.playstation.com", "psnprofiles.com", "www.psnprofiles.com"],
  xbox:        ["xbox.com", "www.xbox.com", "account.xbox.com"],
  applemusic:  ["music.apple.com", "itunes.apple.com"],
  onlyfans:    ["onlyfans.com", "www.onlyfans.com"],
  steam:       ["steamcommunity.com", "www.steamcommunity.com", "store.steampowered.com"],
  kick:        ["kick.com", "www.kick.com"],
  // bitcoin / ltc / solana intentionally not listed → no host check,
  // they're wallet addresses, not URLs.
};

/**
 * Returns the hostname of a URL, or null if the URL can't be parsed.
 * Also rejects non-http(s) protocols (javascript:, data:, etc.).
 */
function getHostname(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Check whether the given URL belongs to the given platform.
 * Returns:
 *   - true  if the URL is valid AND matches the platform
 *   - true  if the platform has no host rules (wallet addresses, unknown platforms)
 *   - false if the URL is invalid OR belongs to a different platform
 */
export function urlMatchesPlatform(platform: string, url: string): boolean {
  const allowed = PLATFORM_HOSTS[platform];

  // No rules for this platform → accept anything that parses as http(s).
  if (!allowed) {
    return getHostname(url) !== null;
  }

  const host = getHostname(url);
  if (!host) return false;

  // Accept either the exact host, or a subdomain of an allowed host.
  // e.g. "www.youtube.com" matches "youtube.com" as a subdomain.
  return allowed.some((h) => {
    const cleanAllowed = h.replace(/^www\./, "");
    return host === cleanAllowed || host.endsWith("." + cleanAllowed);
  });
}

/**
 * Friendly display name for error messages.
 */
export function platformLabel(platform: string): string {
  const names: Record<string, string> = {
    youtube: "YouTube", twitch: "Twitch", tiktok: "TikTok", discord: "Discord",
    facebook: "Facebook", spotify: "Spotify", instagram: "Instagram",
    x: "X (Twitter)", telegram: "Telegram", paypal: "PayPal", roblox: "Roblox",
    github: "GitHub", cashapp: "CashApp", venmo: "Venmo", playstation: "PlayStation",
    xbox: "Xbox", applemusic: "Apple Music", onlyfans: "OnlyFans", steam: "Steam",
    kick: "Kick", bitcoin: "Bitcoin", ltc: "Litecoin", solana: "Solana",
  };
  return names[platform] || platform;
}