"use client";

/**
 * The individual steps of the auth flow. Each is presentational: it takes what
 * it needs and reports upward, so `page.tsx` owns the sequence.
 */

import { useEffect, useState } from "react";
import { Check, Plus, Rocket } from "@phosphor-icons/react";
import { AuthCard, CardHeading } from "./AuthShell";
import { PrimaryButton, TextButton, EmailField, SearchField } from "./ui";
import { OtpInput } from "./OtpInput";

/** Demo only — the real flow verifies server-side. */
export const DEMO_CODE = "911324";
const RESEND_SECONDS = 60;

/* ---------------------------------------------------------------- */
/* 1 — Email                                                         */
/* ---------------------------------------------------------------- */

export function EmailStep({
  email,
  setEmail,
  onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  onNext: () => void;
}) {
  const valid = /\S+@\S+\.\S+/.test(email);
  return (
    <AuthCard>
      <CardHeading title="Let's Get Started!" subtitle="Enter your work email to sign in or create account" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onNext();
        }}
        className="space-y-5"
      >
        <EmailField value={email} onChange={setEmail} label="Email Address" />
        <PrimaryButton type="submit" disabled={!valid}>
          Send OTP
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}

/* ---------------------------------------------------------------- */
/* 2 — OTP                                                           */
/* ---------------------------------------------------------------- */

export function OtpStep({ email, onVerified }: { email: string; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "verifying" | "error">("idle");
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const full = code.length === 6;

  const verify = () => {
    setState("verifying");
    // Stand-in for the real request.
    setTimeout(() => {
      if (code === DEMO_CODE) onVerified();
      else setState("error");
    }, 900);
  };

  return (
    <AuthCard>
      <CardHeading
        title="Check Your Inbox"
        subtitle={`We have sent a 6-digit code to ${email}. Enter it below to verify your email`}
      />

      <OtpInput
        resetKey={resetKey}
        onChange={(v) => {
          setCode(v);
          if (state === "error") setState("idle");
        }}
        error={state === "error"}
        disabled={state === "verifying"}
      />

      {state === "error" && (
        <p className="mt-3 text-center text-[12.5px] font-medium text-red-600">
          Incorrect code, Please try again
        </p>
      )}

      <div className="mt-4 text-center">
        {state === "error" || left <= 0 ? (
          <TextButton
            onClick={() => {
              setLeft(RESEND_SECONDS);
              setCode("");
              setState("idle");
              setResetKey((k) => k + 1);
            }}
          >
            Resend Code
          </TextButton>
        ) : (
          <p className="text-[12.5px] text-neutral-500">
            Resend Code After{" "}
            <span className="font-semibold tabular-nums text-brand-ink">
              {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
            </span>{" "}
            Sec
          </p>
        )}
      </div>

      <PrimaryButton onClick={verify} disabled={!full} loading={state === "verifying"} className="mt-5">
        Verify
      </PrimaryButton>
    </AuthCard>
  );
}

/* ---------------------------------------------------------------- */
/* 3 — Brand website                                                 */
/* ---------------------------------------------------------------- */

/** Stand-in for the real domain lookup. */
const SUGGESTIONS = ["vogacloset.com", "vogacloset*2.com", "Vogaclosetarab.com"];

export function WebsiteStep({
  site,
  setSite,
  onNext,
}: {
  site: string;
  setSite: (v: string) => void;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const matches = site.trim()
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(site.trim().toLowerCase().slice(0, 4)))
    : [];

  return (
    <AuthCard>
      <CardHeading
        title="What's your brand website?"
        subtitle="This will appear on your dashboard and with your campaigns"
      />

      <div className="relative">
        <SearchField
          value={site}
          onChange={(v) => {
            setSite(v);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Website"
        />

        {open && matches.length > 0 && (
          <ul
            role="listbox"
            className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
          >
            {matches.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  role="option"
                  aria-selected={site === s}
                  onClick={() => {
                    setSite(s);
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2.5 text-left text-[13.5px] text-neutral-600 transition hover:bg-neutral-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PrimaryButton className="mt-5" disabled={!site.trim()} onClick={onNext}>
        Next
      </PrimaryButton>
    </AuthCard>
  );
}

/* ---------------------------------------------------------------- */
/* 4 — Audience                                                      */
/* ---------------------------------------------------------------- */

const REGIONS = [
  { id: "uae", label: "UAE", flag: "🇦🇪" },
  { id: "ksa", label: "KSA", flag: "🇸🇦" },
  { id: "qatar", label: "Qatar", flag: "🇶🇦" },
  { id: "oman", label: "Oman", flag: "🇴🇲" },
  { id: "kuwait", label: "Kuwait", flag: "🇰🇼" },
  { id: "egypt", label: "Egypt", flag: "🇪🇬" },
];

export function AudienceStep({
  regions,
  toggle,
  onFinish,
}: {
  regions: string[];
  toggle: (id: string) => void;
  onFinish: () => void;
}) {
  return (
    <AuthCard>
      <CardHeading title="Where is your audience located?" subtitle="Choose one or more target regions" />

      <div className="grid grid-cols-3 gap-2.5">
        {REGIONS.map((r) => {
          const on = regions.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(r.id)}
              className={`snd-chip relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition ${
                on ? "border-brand bg-brand/[0.04] ring-1 ring-brand/30" : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <span className="text-[22px] leading-none">{r.flag}</span>
              <span className="text-[12px] font-medium text-brand-ink">{r.label}</span>
              {on && (
                <span className="snd-chip-tick absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                  <Check size={10} weight="bold" />
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => toggle("other")}
          aria-pressed={regions.includes("other")}
          className={`snd-chip flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition ${
            regions.includes("other")
              ? "border-brand bg-brand/[0.04] ring-1 ring-brand/30"
              : "border-neutral-200 bg-white hover:border-neutral-300"
          }`}
        >
          <Plus size={20} className="text-neutral-400" />
          <span className="text-[12px] font-medium text-brand-ink">Other</span>
        </button>
      </div>

      <PrimaryButton className="mt-6" disabled={regions.length === 0} onClick={onFinish}>
        Finish
      </PrimaryButton>
    </AuthCard>
  );
}

/* ---------------------------------------------------------------- */
/* 5 — Ready                                                         */
/* ---------------------------------------------------------------- */

export function ReadyStep() {
  return (
    <AuthCard className="text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/[0.06]">
        <Rocket size={38} weight="duotone" className="snd-rocket text-brand" />
      </div>

      <h1 className="text-[19px] font-bold leading-snug tracking-tight text-brand-ink">
        Your campaign journey
        <br />
        starts here
      </h1>
      <p className="mx-auto mt-2 max-w-[30ch] text-[13px] leading-relaxed text-neutral-500">
        Create, monitor, and track your campaigns with a carefully selected group of influencers
      </p>

      <PrimaryButton className="mt-6">Create Your First Campaign</PrimaryButton>
      <div className="mt-3">
        <TextButton>Maybe Later</TextButton>
      </div>
    </AuthCard>
  );
}
