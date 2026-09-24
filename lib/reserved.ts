export const RESERVED = new Set([
  "admin", "administrator", "login", "signup", "register", "dashboard",
  "settings", "api", "support", "help", "about", "contact", "nexora",
]);

export const isReserved = (u: string) => RESERVED.has(u.toLowerCase());