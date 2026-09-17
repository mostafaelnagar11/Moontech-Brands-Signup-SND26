"use client";

/**
 * The frame every auth screen sits in.
 *
 * Default: the production look — pale lavender ground, MoonTech logo above a
 * white card, العربية toggle top-right.
 *
 * SND window: the ground becomes the National Day field. The card stays white
 * and the form stays familiar — the guideline asks for the identity in the
 * layout, not for every control to be restyled, and a sign-in screen is the
 * wrong place to make people re-learn the UI.
 */

import { useEffect, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { isSndActive, SND_GRADIENT, SND_ASSETS, SND_INK } from "../theme/snd";
import { SndLockup, SaduBand, DiamondRow } from "./snd";

export function AuthShell({ children }: { children: React.ReactNode }) {
  /* Client-only: see the note on isSndActive — evaluating the window during
     server render would freeze it into the static HTML at build time. */
  const [snd, setSnd] = useState(false);
  useEffect(() => setSnd(isSndActive()), []);

  return (
    <div
      data-snd={snd ? "on" : undefined}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10"
      style={{ background: snd ? SND_GRADIENT : "#F7F7FB" }}
    >
      {snd && <SndBackdrop />}

      {/* العربية toggle — plain text, transparent fill, no chrome. */}
      <button
        type="button"
        style={{ background: "transparent" }}
        className={`absolute right-5 top-5 z-20 px-2 py-1 text-[13px] font-medium transition sm:right-8 sm:top-7 ${
          snd ? "text-white/85 hover:text-white" : "text-brand hover:text-brand-dark"
        }`}
      >
        العربية
      </button>

      {/* Lockup — guideline p13: corner placement for digital, never centred. */}
      {snd && (
        <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-7">
          <SndLockup width={150} />
        </div>
      )}

      <main className="relative z-10 flex w-full max-w-[380px] flex-col items-center">
        {children}
      </main>

      {snd && <SaduBand height={26} opacity={0.34} className="absolute inset-x-0 bottom-0 z-10" />}
    </div>
  );
}

/**
 * Seasonal backdrop: the Authenticity illustration (family tree + DNA — roots
 * carried across generations) plus the square-framed grid structure from the
 * guideline. Both sit well behind the card and never compete with the form.
 */
function SndBackdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(620px, 82vw)",
          aspectRatio: "1 / 1",
          backgroundImage: `url(${SND_ASSETS.tree})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          /* Low enough to stay behind the card rather than compete with it —
             this is a sign-in screen, not a poster. */
          opacity: 0.07,
        }}
      />

      {/* The grid structure (guideline p24) — a hairline rule with the corner
          keys where the grid locks. Hidden on phones, where it would crowd. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 hidden rounded-sm border sm:block"
        style={{ borderColor: "rgba(111,207,159,0.18)" }}
      >
        {(
          [
            ["-4px", "-4px", "auto", "auto"],
            ["auto", "-4px", "-4px", "auto"],
            ["-4px", "auto", "auto", "-4px"],
            ["auto", "auto", "-4px", "-4px"],
          ] as const
        ).map(([top, left, bottom, right], i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5"
            style={{ top, left, bottom, right, background: SND_INK.mint, opacity: 0.7 }}
          />
        ))}
      </div>
    </>
  );
}

/** MoonTech wordmark above the card. Reverses to white on the dark field. */
export function AuthLogo() {
  return (
    <div className="mb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="MoonTech" className="snd-logo h-7 w-auto" />
    </div>
  );
}

/** The white card every step lives in. */
export function AuthCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`w-full rounded-2xl bg-white px-7 py-8 shadow-[0_18px_50px_-24px_rgba(25,18,52,0.28)] ring-1 ring-black/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

/** Centred title + subtitle block used at the top of most cards. */
export function CardHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-[19px] font-bold tracking-tight text-brand-ink">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{subtitle}</p>}
    </div>
  );
}

/** Seasonal flourish under a card — only rendered inside the window. */
export function SndFlourish() {
  const [snd, setSnd] = useState(false);
  useEffect(() => setSnd(isSndActive()), []);
  if (!snd) return null;
  return <DiamondRow count={5} size={11} gap={9} className="mt-6 justify-center" />;
}

/**
 * Back link below the card. Sits on the page ground rather than inside the
 * card, so it needs its own colour per theme (see `.snd-back` in globals.css).
 */
export function BackLinkRow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ background: "transparent" }}
      className="snd-back mt-5 flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition hover:text-neutral-700"
    >
      <ArrowLeft size={15} weight="bold" />
      Back
    </button>
  );
}
