import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Page not found</h1>
      <p className="mt-3 text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent"
        >
          Go home
        </Link>
        <Link
          href="/swap"
          className="rounded-xl border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg hover:bg-surface-2"
        >
          Open swap
        </Link>
      </div>
    </div>
  );
}
