"use client";

/**
 * Shared auth controls. Brand purple by default; the `.snd-*` hooks let the
 * seasonal stylesheet swap the accent without touching component logic.
 */

import { ArrowLeft, CircleNotch, MagnifyingGlass } from "@phosphor-icons/react";

export function PrimaryButton({
  children,
  loading,
  className = "",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  const off = disabled || loading;
  return (
    <button
      {...props}
      disabled={off}
      className={`snd-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all ${
        off
          ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
          : "bg-brand text-white shadow-[0_10px_24px_-12px_rgba(77,47,176,0.8)] hover:bg-brand-dark active:scale-[0.99]"
      } ${className}`}
    >
      {loading ? <CircleNotch size={17} weight="bold" className="animate-spin" /> : children}
    </button>
  );
}

export function TextButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="snd-link text-[13px] font-semibold text-brand transition hover:text-brand-dark"
    >
      {children}
    </button>
  );
}

export function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="snd-back mt-5 flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition hover:text-neutral-700"
    >
      <ArrowLeft size={15} weight="bold" />
      Back
    </button>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  onFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onFocus?: () => void;
}) {
  return (
    <div className="snd-field relative flex items-center rounded-xl border border-neutral-200 bg-white px-3.5 py-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
      <GlobeDot />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-brand-ink placeholder:text-neutral-400"
      />
      <MagnifyingGlass size={16} className="shrink-0 text-neutral-400" />
    </div>
  );
}

export function EmailField({
  value,
  onChange,
  label = "Work Email",
  placeholder = "you@company.com",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="snd-field w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-[14px] text-brand-ink outline-none transition placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

function GlobeDot() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2.5 h-4 w-4 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  );
}
