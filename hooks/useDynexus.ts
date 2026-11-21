"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api, indexerEnabled } from "@/lib/api";
import {
  aptos,
  CHAIN_CONCURRENCY,
  CHAIN_LIST_CAP,
  faBalance,
  faMetadata,
  poolOnChain,
  tokenOnChain,
  view,
} from "@/lib/aptos";
import { DYNEXUS_ADDRESS } from "@/lib/config";
import { indexerLagMinutes } from "@/lib/lag";
import { mapLimited, mergeByAddress, missingAddresses } from "@/lib/merge";

export const configured = DYNEXUS_ADDRESS !== "";

/** Indexer list, or null when it is off or failing (callers then read the chain). */
async function fromIndexer<T>(load: () => Promise<T>): Promise<T | null> {
  if (!indexerEnabled) return null;
  try {
    return await load();
  } catch (e) {
    console.warn("Indexer unavailable, reading from chain", e);
    return null;
  }
}

export function useAccountAddress(): string | undefined {
  const { account } = useWallet();
  return account?.address.toString();
}

/** Forge config: DYNEXUS token, admin, creation fee, faucet settings. */
export function useForgeConfig() {
  return useQuery({
    queryKey: ["forge-config"],
    enabled: configured,
    queryFn: async () => {
      const [dyna, admin, fee, faucetPeriod, faucetAmount, totalTokens] = await view<
        [string, string, string, string, string, string]
      >("token_factory", "get_dynexus_config");
      return {
        dyna,
        admin,
        fee: BigInt(fee),
        faucetPeriod: Number(faucetPeriod),
        faucetAmount: BigInt(faucetAmount),
        totalTokens: Number(totalTokens),
      };
    },
  });
}

export function useMetadata(asset?: string) {
  return useQuery({
    queryKey: ["fa-meta", asset],
    enabled: !!asset,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => faMetadata(asset as string),
  });
}

export function useBalance(asset?: string) {
  const owner = useAccountAddress();
  return useQuery({
    queryKey: ["balance", owner, asset],
    enabled: !!owner && !!asset,
    queryFn: () => faBalance(owner as string, asset as string),
  });
}

export interface TokenRow {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  creator: string;
  iconUri: string;
}

/**
 * Factory tokens. The indexer supplies the list cheaply; the chain is asked only for
 * tokens the indexer has not seen yet, so a token created seconds ago shows up at once.
 */
export function useTokens(creator?: string) {
  return useQuery({
    queryKey: ["tokens", creator],
    enabled: configured,
    refetchInterval: 30_000,
    queryFn: async (): Promise<TokenRow[]> => {
      const indexed = await fromIndexer(async () =>
        (await api.tokens({ creator, limit: 200 })).map(
          (t): TokenRow => ({
            address: t.address,
            name: t.name ?? "",
            symbol: t.symbol ?? "?",
            decimals: t.decimals ?? 0,
            creator: t.creator,
            iconUri: t.icon_uri ?? "",
          }),
        ),
      );
      try {
        let addrs: string[];
        if (creator) {
          [addrs] = await view<[string[]]>("token_factory", "get_tokens_by_creator", [creator]);
        } else {
          const [, , , , , total] = await view<[string, string, string, string, string, string]>(
            "token_factory",
            "get_dynexus_config",
          );
          // Nothing to ask the chain when the indexer already holds every token.
          if (indexed && indexed.length >= Number(total)) return indexed;
          [addrs] = await view<[string[]]>("token_factory", "get_tokens", [
            0,
            Math.min(Number(total), CHAIN_LIST_CAP),
          ]);
        }
        const missing = indexed ? missingAddresses(addrs, indexed) : addrs;
        const rows = await mapLimited(missing, CHAIN_CONCURRENCY, tokenOnChain);
        return mergeByAddress(
          indexed ?? [],
          rows.filter((r) => r !== undefined),
        );
      } catch (e) {
        if (indexed) return indexed; // chain read failed: stale but usable
        throw e;
      }
    },
  });
}

export interface PoolRow {
  address: string;
  tokenX: string;
  tokenY: string;
  reserveX: bigint;
  reserveY: bigint;
  lpSupply: bigint;
  feeBps: number;
  platformFeeBps: number;
  swaps24h?: number;
  hasGauge?: boolean;
}

/**
 * Pools. Reserves, LP supply and fees always come from the chain (exact and instant);
 * the indexer adds what only history can give (24h swaps, gauge flag) and the cheap list.
 */
export function usePools() {
  return useQuery({
    queryKey: ["pools"],
    enabled: configured,
    refetchInterval: 10_000,
    queryFn: async (): Promise<PoolRow[]> => {
      const indexed = await fromIndexer(async () =>
        (await api.pools({ limit: 200 })).map(
          (p): PoolRow => ({
            address: p.address,
            tokenX: p.token_x,
            tokenY: p.token_y,
            reserveX: BigInt(p.reserve_x),
            reserveY: BigInt(p.reserve_y),
            lpSupply: BigInt(p.lp_supply),
            feeBps: p.fee_bps,
            platformFeeBps: p.platform_fee_bps,
            swaps24h: p.swaps_24h,
            hasGauge: p.has_gauge,
          }),
        ),
      );
      try {
        const [count] = await view<[string]>("dex", "get_pools_count");
        // Pool addresses are only needed when the indexer is missing some of them.
        const chainAddrs =
          indexed && indexed.length >= Number(count)
            ? indexed.map((p) => p.address)
            : (
                await view<[string[]]>("dex", "get_pools", [
                  0,
                  Math.min(Number(count), CHAIN_LIST_CAP),
                ])
              )[0];
        const missing = indexed ? missingAddresses(chainAddrs, indexed) : chainAddrs;
        const fresh = await mapLimited(
          [...(indexed?.map((p) => p.address) ?? []), ...missing],
          CHAIN_CONCURRENCY,
          poolOnChain,
        );
        const live = new Map(
          fresh.filter((p) => p !== undefined).map((p) => [p.address.toLowerCase(), p]),
        );
        const chainOnly = missing.flatMap((a) => {
          const p = live.get(a.toLowerCase());
          return p ? [p as PoolRow] : [];
        });
        return mergeByAddress(indexed ?? [], chainOnly, live);
      } catch (e) {
        if (indexed) return indexed; // chain read failed: stale but usable
        throw e;
      }
    },
  });
}

/** One pool's exact current state; used by the swap and pool pages. */
export function usePool(address?: string) {
  return useQuery({
    queryKey: ["pool-live", address],
    enabled: configured && !!address,
    refetchInterval: 8_000,
    queryFn: () => poolOnChain(address as string),
  });
}

/** address -> symbol for a list of assets (each lookup cached). */
export function useSymbols(addresses: string[]): Record<string, string> {
  const results = useQueries({
    queries: addresses.map((a) => ({
      queryKey: ["fa-meta", a],
      staleTime: Number.POSITIVE_INFINITY,
      queryFn: () => faMetadata(a),
    })),
  });
  const map: Record<string, string> = {};
  addresses.forEach((a, i) => {
    map[a] = results[i]?.data?.symbol ?? `${a.slice(0, 6)}…`;
  });
  return map;
}

/** Estimated minutes the indexer trails the chain head; null when off or unknown. */
export function useIndexerLag() {
  return useQuery({
    queryKey: ["indexer-lag"],
    enabled: configured && indexerEnabled,
    refetchInterval: 60_000,
    retry: false,
    queryFn: async () => {
      const [health, ledger] = await Promise.all([api.health(), aptos.getLedgerInfo()]);
      return indexerLagMinutes(Number(ledger.ledger_version), health.processed_version);
    },
  });
}
