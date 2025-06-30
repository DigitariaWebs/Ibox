/**
 * Centralized color palette used throughout the app.
 * Tailwind-compatible hex values are provided so they align
 * with the design tokens in `tailwind.config.js`.
 */
export const Colors = {
  /** Primary brand color (Tailwind blue-600) */
  primary: "#2563EB",
  /** Secondary brand color (Tailwind emerald-500) */
  secondary: "#10B981",

  /** UI backgrounds */
  background: "#FFFFFF",
  surface: "#F3F4F6", // gray-100

  /** Text */
  textPrimary: "#111827", // gray-900
  textSecondary: "#6B7280", // gray-500

  /** Semantic */
  error: "#EF4444", // red-500
  warning: "#F59E0B", // amber-500
  info: "#3B82F6", // blue-500
  success: "#22C55E", // green-500
} as const satisfies Record<string, string>;

export type ColorKey = keyof typeof Colors;

/**
 * Helper that returns a Tailwind class string given a color key and optional shade.
 * Example: `twColor("primary")` returns `text-[#2563EB]`.
 */
export const twColor = (key: ColorKey, cssProp: "text" | "bg" | "border" = "text") =>
  `${cssProp}-[${Colors[key]}]`; 