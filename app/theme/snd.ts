/**
 * Saudi National Day 2025 — seasonal theme.
 *
 * Colours are sampled from the official SND brand guideline, not invented.
 * Page refs are to that PDF so anyone can check them:
 *   p16 palette · p12 coloured backgrounds · p13 logo placement · p24-25 traits
 *
 * The Brands app store assets use the Authenticity (أصالتنا) lane — Saudi green
 * on deep teal. The Influencers app uses gold, so the two stay distinguishable.
 * Keep this file green.
 */

/** The eight palette colours (guideline p16). Each trait owns one. */
export const SND_PALETTE = {
  saudiGreen: "#008849", // primary — foundation of the visual system
  baseTeal: "#003439", // the guideline's own page ground

  vision: "#7C5D21", // رؤيتنا  — Vision 2030 + Sadu
  courage: "#607C4F", // شجاعتنا — Al-Ajrab sword
  determination: "#971A4D", // همتنا   — Tuwaiq mountain
  authenticity: "#5ABA1C", // أصالتنا — family tree + DNA   ← this lane
  generosity: "#0050AF", // كرمنا   — dallah + palm fronds
  exceptionalGiving: "#6565E0", // جودنا   — mabkharah
} as const;

export const SND_INK = {
  onDark: "#F4FBF7",
  onDarkMuted: "rgba(244,251,247,0.62)",
  mint: "#8ADCB2",
  lime: "#5ABA1C",
} as const;

/**
 * Panel gradient — identical to the store-asset screenshot panels, so the web
 * auth screen and the App Store listing read as one campaign.
 */
export const SND_GRADIENT =
  "linear-gradient(158deg, #0A7A47 0%, #00483C 44%, #002A2F 78%, #001417 100%)";

/** Interactive accent on the light form side. */
export const SND_ACCENT = {
  base: "#008849",
  hover: "#00713C",
  ring: "rgba(0,136,73,0.22)",
  soft: "#E8F5EE",
} as const;

/** Official hashtags (guideline p22). */
export const SND_HASHTAGS = ["#عزنا_بطبعنا", "#SaudiNationalDay"] as const;

/**
 * Assets. The Arabic lockup is supplied artwork with custom lettering — ship
 * the bitmap, never reset it as live text in a system font.
 */
export const SND_ASSETS = {
  lockup: "/snd/snd-lockup.png",
  tree: "/snd/snd-tree.png",
  saduTile: "/snd/snd-sadu-tile.png",
} as const;

/* ------------------------------------------------------------------ */
/* Activation                                                          */
/* ------------------------------------------------------------------ */

/**
 * The theme turns itself on for a date window and off again, so nobody has to
 * remember to ship a revert.
 *
 *   NEXT_PUBLIC_SND_THEME=on    force on
 *   NEXT_PUBLIC_SND_THEME=off   force off
 *   (unset)                     automatic — see WINDOW
 *
 * National Day is 23 September; the window opens a week before, closes two
 * days after.
 *
 * Call this on the CLIENT (inside an effect), never during server render — on
 * the server it is evaluated at build time and frozen into the static HTML, so
 * a deploy cut before the window would never switch on.
 */
const WINDOW = { startMonth: 9, startDay: 16, endMonth: 9, endDay: 25 };

export function isSndActive(now: Date = new Date()): boolean {
  const flag = process.env.NEXT_PUBLIC_SND_THEME;
  if (flag === "on") return true;
  if (flag === "off") return false;

  const m = now.getMonth() + 1;
  const d = now.getDate();
  const afterStart = m > WINDOW.startMonth || (m === WINDOW.startMonth && d >= WINDOW.startDay);
  const beforeEnd = m < WINDOW.endMonth || (m === WINDOW.endMonth && d <= WINDOW.endDay);
  return afterStart && beforeEnd;
}
