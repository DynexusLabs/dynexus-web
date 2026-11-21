/**
 * Aptos addresses have several valid spellings: the chain's view functions return them without
 * leading zeros (0x5059…) while the indexer returns the full 64-digit form (0x0505…). Compare
 * them only through these helpers.
 */
export function normalizeAddress(address: string): string {
  return `0x${address.replace(/^0x/i, "").toLowerCase().padStart(64, "0")}`;
}

export function sameAddress(a?: string | null, b?: string | null): boolean {
  return !!a && !!b && normalizeAddress(a) === normalizeAddress(b);
}
