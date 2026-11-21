"use client";
import { useIndexerLag } from "@/hooks/useDynexus";
import { LAG_NOTICE_MINUTES } from "@/lib/lag";

/** History and totals come from the indexer; say so when it trails the chain noticeably. */
export default function IndexerStatus() {
  const { data: lag } = useIndexerLag();
  if (lag == null || lag < LAG_NOTICE_MINUTES) return null;
  return (
    <div role="status" className="border-b border-line bg-surface">
      <p className="mx-auto max-w-6xl px-4 py-1.5 text-xs text-subtle sm:px-6">
        History and totals are about {lag} min behind the chain. Balances, reserves and your own
        transactions are live.
      </p>
    </div>
  );
}
