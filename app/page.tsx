"use client";

/**
 * MoonTech signup — one continuous flow.
 *
 *   email → OTP → brand website → audience → ready
 *
 * The whole sequence lives here so the order is readable in one place; each
 * step is a presentational component in `components/steps.tsx`.
 */

import { useState } from "react";
import { AuthShell, AuthLogo, BackLinkRow } from "./components/AuthShell";
import {
  EmailStep,
  OtpStep,
  WebsiteStep,
  AudienceStep,
  ReadyStep,
} from "./components/steps";

type Step = "email" | "otp" | "website" | "audience" | "ready";

/** Which step each Back link returns to. Steps absent from this map show none. */
const BACK_TO: Partial<Record<Step, Step>> = {
  otp: "email",
  audience: "website",
};

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [regions, setRegions] = useState<string[]>([]);

  const back = BACK_TO[step];

  return (
    <AuthShell>
      <AuthLogo />

      {step === "email" && (
        <EmailStep email={email} setEmail={setEmail} onNext={() => setStep("otp")} />
      )}

      {step === "otp" && (
        <OtpStep email={email || "example@domain.com"} onVerified={() => setStep("website")} />
      )}

      {step === "website" && (
        <WebsiteStep site={site} setSite={setSite} onNext={() => setStep("audience")} />
      )}

      {step === "audience" && (
        <AudienceStep
          regions={regions}
          toggle={(id) =>
            setRegions((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
          }
          onFinish={() => setStep("ready")}
        />
      )}

      {step === "ready" && <ReadyStep />}

      {back && <BackLinkRow onClick={() => setStep(back)} />}
    </AuthShell>
  );
}
