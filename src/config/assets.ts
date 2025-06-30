/**
 * Central registry of static image resources. Keeps import paths out
 * of component code for cleaner, consistent asset access.
 */
export const Icons = {
  app: require("../../assets/icon.png"),
  adaptive: require("../../assets/adaptive-icon.png"),
  favicon: require("../../assets/favicon.png"),
  splash: require("../../assets/splash-icon.png"),
} as const;

export type IconKey = keyof typeof Icons;

export const Images = {
  // Add domain-specific images here, e.g.:
  // hero: require("../../assets/images/hero.png"),
} as const;

export type ImageKey = keyof typeof Images; 