"use client";

/**
 * SND ornaments.
 *
 * The MoonTech star is the real brand mark, traced from the vector in the brand
 * file. It is WIDER THAN TALL (785:541) — never force it square. It doubles as
 * the SND divider diamond, which is why a row of them reads as both MoonTech
 * and National Day at once.
 */

import { SND_ASSETS, SND_INK } from "../theme/snd";

export function MoonStar({
  size = 20,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 541) / 785}
      viewBox="0 0 785 541"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 784.9 254.1 L 784.9 285.8 C 675.1 313.9 581.2 377.4 492.4 451.7 C 468.6 471.6 448.2 497.1 427.4 521.5 C 407.2 545.4 379.8 548.6 362.3 523.7 C 308.0 446.9 235.0 399.5 161.1 353.8 C 114.2 324.8 65.6 299.4 12.0 289.7 C -8.2 286.0 3.7 267.9 1.6 256.6 C 119.1 226.3 218.6 158.7 311.3 76.4 C 329.2 60.6 344.0 40.1 359.4 20.7 C 379.5 -4.5 406.1 -7.8 424.2 17.2 C 480.5 95.2 555.6 143.2 631.4 189.8 C 679.1 219.2 728.3 244.8 785 254.3 L 784.9 254.1 Z"
        fill={color}
      />
    </svg>
  );
}

/** A hairline row of stars — the guideline's divider motif in our own mark. */
export function DiamondRow({
  count = 7,
  size = 12,
  gap = 10,
  color = SND_INK.mint,
  className = "",
}: {
  count?: number;
  size?: number;
  gap?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center ${className}`} style={{ gap }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <MoonStar key={i} size={size} color={color} />
      ))}
    </div>
  );
}

/**
 * The official `عزّنا بطبعنا` lockup.
 *
 * Bitmap on purpose: custom Arabic lettering, not type to be reset. Never
 * letter-space Arabic either — tracking breaks the joins between letterforms.
 */
export function SndLockup({ width = 170, className = "" }: { width?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SND_ASSETS.lockup}
      alt="اليوم الوطني السعودي — Saudi National Day"
      className={className}
      style={{ width, height: "auto" }}
    />
  );
}

/**
 * Sadu weave band, tiled horizontally.
 *
 * The tile is cropped from the Authenticity trait icon's own border at natural
 * scale. Scaling it non-uniformly to fill a width distorts the weave, so
 * repeat-x only.
 */
export function SaduBand({
  height = 40,
  opacity = 0.45,
  className = "",
  style,
}: {
  height?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        height,
        opacity,
        backgroundImage: `url(${SND_ASSETS.saduTile})`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        ...style,
      }}
    />
  );
}
