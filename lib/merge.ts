/**
 * Helpers for combining the indexer (cheap lists, may lag the chain) with chain reads
 * (exact and instant). Items are keyed by on-chain address.
 */

const norm = (address: string) => address.toLowerCase();

/** Addresses present on chain but missing from the indexer result. */
export function missingAddresses(chain: string[], indexed: { address: string }[]): string[] {
  const seen = new Set(indexed.map((i) => norm(i.address)));
  return chain.filter((a) => !seen.has(norm(a)));
}

/**
 * Indexer rows first (they carry history-derived fields), then rows only the chain knows
 * about. `live` overrides fields that the chain reports more accurately.
 */
export function mergeByAddress<T extends { address: string }>(
  indexed: T[],
  chainOnly: T[],
  live: Map<string, Partial<T>> = new Map(),
): T[] {
  const out = new Map<string, T>();
  for (const row of [...indexed, ...chainOnly]) {
    const key = norm(row.address);
    if (!out.has(key)) out.set(key, { ...row, ...live.get(key) });
  }
  return [...out.values()];
}

/** Run `fn` over `items` with at most `limit` in flight; keeps order, skips failures. */
export async function mapLimited<I, O>(
  items: I[],
  limit: number,
  fn: (item: I) => Promise<O>,
): Promise<(O | undefined)[]> {
  const results: (O | undefined)[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try {
        results[i] = await fn(items[i] as I);
      } catch {
        results[i] = undefined;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
