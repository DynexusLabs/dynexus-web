export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="sr-only">Loading…</span>
      <div className="h-9 w-48 animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-surface-2" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
