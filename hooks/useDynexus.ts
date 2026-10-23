"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api, indexerEnabled } from "@/lib/api";
import { faBalance, faMetadata, view } from "@/lib/aptos";
import { DYNEXUS_ADDRESS } from "@/lib/config";

export const configured = DYNEXUS_ADDRESS !== "";

/** Indexer first when configured; on any indexer failure read the chain instead. */
async function indexerOr<T>(fromIndexer: () => Promise<T>, fromChain: () => Promise<T>) {
  if (indexerEnabled) {
    try {
      return await fromIndexer();
    } catch (e) {
      console.warn("Indexer unavailable, reading from chain", e);
    }
  }
  return fromChain();
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

/** Factory tokens: one indexer request, or (no indexer) paginated view calls. */
export function useTokens(creator?: string) {
  return useQuery({
    queryKey: ["tokens", creator],
    enabled: configured,
    queryFn: (): Promise<TokenRow[]> =>
      indexerOr(
        async () =>
          (await api.tokens({ creator, limit: 200 })).map((t) => ({
            address: t.address,
            name: t.name ?? "",
            symbol: t.symbol ?? "?",
            decimals: t.decimals ?? 0,
            creator: t.creator,
            iconUri: t.icon_uri ?? "",
          })),
        async () => {
          const [addrs] = creator
            ? await view<[string[]]>("token_factory", "get_tokens_by_creator", [creator])
            : await view<[string[]]>("token_factory", "get_tokens", [0, 100]);
          return Promise.all(
            addrs.map(async (address) => {
              const [c, name, symbol, decimals, , iconUri] = await view<
                [string, string, string, number, string, string, string]
              >("token_factory", "get_token_info", [address]);
              return { address, name, symbol, decimals: Number(decimals), creator: c, iconUri };
            }),
          );
        },
      ),
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

export function usePools() {
  return useQuery({
    queryKey: ["pools"],
    enabled: configured,
    queryFn: (): Promise<PoolRow[]> =>
      indexerOr(
        async () =>
          (await api.pools({ limit: 200 })).map((p) => ({
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
          })),
        async () => {
          const [addrs] = await view<[string[]]>("dex", "get_pools", [0, 100]);
          return Promise.all(
            addrs.map(async (address) => {
              const [[x, y], info] = await Promise.all([
                view<[string, string, string]>("dex", "get_pool_tokens", [address]),
                view<[string, string, string, string, string, string, string]>(
                  "dex",
                  "get_pool_info",
                  [address],
                ),
              ]);
              return {
                address,
                tokenX: x,
                tokenY: y,
                reserveX: BigInt(info[1]),
                reserveY: BigInt(info[2]),
                lpSupply: BigInt(info[3]),
                feeBps: Number(info[4]),
                platformFeeBps: Number(info[5]),
              };
            }),
          );
        },
      ),
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
