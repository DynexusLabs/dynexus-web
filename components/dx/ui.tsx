"use client";
import type { ReactNode } from "react";
import type { TxState } from "@/hooks/useTx";
import { EXPLORER_TX } from "@/lib/config";

export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest text-cyan-300">{title}</h1>
      {subtitle && <p className="mb-8 text-sm text-cyan-400/70">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-cyan-400/30 bg-gray-900/80 p-6 backdrop-blur-sm ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-cyan-300">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs uppercase tracking-wide text-cyan-400/80">
          {label}
        </label>
        {hint && <span className="text-xs text-cyan-400/60">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-cyan-400/30 bg-black/60 px-3 py-2 text-cyan-100 placeholder-cyan-700 outline-hidden focus:border-cyan-300";

export function ActionButton({
  children,
  disabled,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant?: "primary" | "ghost";
}) {
  const style =
    variant === "primary"
      ? "bg-linear-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-400 hover:to-teal-400"
      : "border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg px-4 py-3 font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${style}`}
    >
      {children}
    </button>
  );
}

export function TxStatus({ state }: { state: TxState }) {
  if (state.status === "idle") return null;
  if (state.status === "pending")
    return <p className="mt-3 text-sm text-yellow-300">Waiting for confirmation…</p>;
  if (state.status === "error")
    return <p className="mt-3 wrap-break-word text-sm text-red-400">{state.message}</p>;
  return (
    <p className="mt-3 text-sm text-green-400">
      Confirmed —{" "}
      <a href={EXPLORER_TX(state.hash)} target="_blank" rel="noreferrer" className="underline">
        view transaction
      </a>
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-cyan-400/30 bg-gray-900/80 p-4">
      <div className="text-xs uppercase tracking-wide text-cyan-400/70">{label}</div>
      <div className="mt-1 text-2xl font-bold text-cyan-200">{value}</div>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border border-yellow-400/40 bg-yellow-400/10 p-4 text-sm text-yellow-200">
      {children}
    </div>
  );
}

/** Minimal dependency-free line chart for candle closes. */
export function Sparkline({ values, height = 120 }: { values: number[]; height?: number }) {
  if (values.length < 2)
    return <p className="text-sm text-cyan-400/60">Not enough swaps to chart yet.</p>;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 600;
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * w},${height - ((v - min) / span) * (height - 8) - 4}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="h-32 w-full" role="img" aria-label="Price chart">
      <title>Price chart</title>
      <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2" />
    </svg>
  );
}
