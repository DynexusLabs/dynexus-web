/** Testnet advances roughly 16M versions a day (~185/s); only used to phrase the lag. */
const VERSIONS_PER_SECOND = 185;
/** Below this the indexer counts as live; scheduled runs normally stay within it. */
export const LAG_NOTICE_MINUTES = 15;

/** Estimated minutes the indexer trails the chain, or null when unknown. */
export function indexerLagMinutes(
  ledgerVersion: number | null | undefined,
  processedVersion: number | null | undefined,
): number | null {
  if (ledgerVersion == null || processedVersion == null) return null;
  const behind = Math.max(0, ledgerVersion - processedVersion);
  return Math.round(behind / VERSIONS_PER_SECOND / 60);
}
