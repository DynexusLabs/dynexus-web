"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-danger">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">
        This page failed to load
      </h1>
      <p className="mt-3 text-muted">
        A network or wallet request may have failed. No transaction was sent.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg hover:bg-surface-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
