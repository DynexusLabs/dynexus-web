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
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl wrap-break-word text-sm text-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </header>
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
      className={`rounded-2xl border border-line bg-surface/80 p-5 shadow-[0_1px_0_0_rgb(255_255_255/0.03)_inset] backdrop-blur-sm sm:p-6 ${className}`}
    >
      {title && <h2 className="mb-4 text-base font-semibold text-fg">{title}</h2>}
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
        <label htmlFor={id} className="text-xs font-medium text-muted">
          {label}
        </label>
        {hint && <span className="text-xs tabular-nums text-subtle">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-fg tabular-nums placeholder:text-subtle outline-hidden transition-colors hover:border-line-strong focus:border-accent focus-visible:outline-none disabled:opacity-50";

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
      ? "bg-accent-strong text-white shadow-lg shadow-accent-strong/20 hover:bg-accent"
      : "border border-line-strong text-fg hover:bg-surface-2";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${style}`}
    >
      {children}
    </button>
  );
}

export function TxStatus({ state }: { state: TxState }) {
  if (state.status === "idle") return null;
  if (state.status === "pending")
    return (
      <p role="status" className="mt-3 text-sm text-warn">
        Waiting for wallet and network confirmation…
      </p>
    );
  if (state.status === "error")
    return (
      <p role="alert" className="mt-3 wrap-break-word text-sm text-danger">
        {state.message}
      </p>
    );
  return (
    <p role="status" className="mt-3 text-sm text-success">
      Confirmed —{" "}
      <a
        href={EXPLORER_TX(state.hash)}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        view transaction
      </a>
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/80 p-4 sm:p-5">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className="mt-1.5 truncate text-xl font-semibold tabular-nums text-fg sm:text-2xl">
        {value}
      </div>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      role="note"
      className="mb-6 rounded-xl border border-warn/30 bg-warn/10 p-4 text-sm text-warn"
    >
      {children}
    </div>
  );
}

/** Minimal dependency-free line chart for candle closes. */
export function Sparkline({ values, height = 120 }: { values: number[]; height?: number }) {
  if (values.length < 2)
    return <p className="text-sm text-subtle">Not enough swaps to chart yet.</p>;
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
      <polyline
        points={points}
        fill="none"
        stroke="#00d9ff"
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Fixed-height placeholder so Suspense fallbacks do not shift the layout on hydration. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl border border-line bg-surface/80 ${className}`}
    />
  );
}
