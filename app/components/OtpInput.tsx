"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Six-box OTP entry.
 *
 * Owns its digits as a fixed-length array and updates them functionally. That
 * matters: with a string held by the parent, fast typing made every keystroke
 * read a stale value from its closure, so the boxes clobbered each other and
 * only one filled. Sequential typing, paste, Backspace and arrows all have to
 * work here — their absence is what makes an OTP field feel broken.
 *
 * `resetKey` clears the boxes (bump it after a resend).
 */
export function OtpInput({
  onChange,
  error,
  disabled,
  length = 6,
  resetKey = 0,
}: {
  onChange: (code: string) => void;
  error?: boolean;
  disabled?: boolean;
  length?: number;
  resetKey?: number;
}) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  /* Held in a ref so the emit effect below depends only on `digits`. The
     parent passes an inline arrow, so depending on `onChange` directly would
     re-fire it on every render. */
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /* Report upward in an effect, never inside the setDigits updater — React
     runs updaters during render, so calling the parent's setState from there
     is a set-state-during-render and warns. */
  useEffect(() => {
    onChangeRef.current(digits.join(""));
  }, [digits]);

  useEffect(() => {
    setDigits(Array(length).fill(""));
    refs.current[0]?.focus();
  }, [resetKey, length]);

  const write = (i: number, digit: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
  };

  return (
    <div dir="ltr" className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={error || undefined}
          value={digits[i] ?? ""}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            write(i, d);
            if (d && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              if (digits[i]) {
                write(i, "");
              } else if (i > 0) {
                write(i - 1, "");
                refs.current[i - 1]?.focus();
              }
              e.preventDefault();
            }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!pasted) return;
            e.preventDefault();
            setDigits(Array.from({ length }, (_, k) => pasted[k] ?? ""));
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className={`snd-otp h-12 w-11 rounded-xl border text-center text-[17px] font-semibold tabular-nums outline-none transition ${
            error
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-neutral-200 bg-white text-brand-ink focus:border-brand focus:ring-2 focus:ring-brand/15"
          } ${disabled ? "opacity-60" : ""}`}
        />
      ))}
    </div>
  );
}
