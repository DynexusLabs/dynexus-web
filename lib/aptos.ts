import { Aptos, AptosConfig, type InputViewFunctionData, type MoveValue } from "@aptos-labs/ts-sdk";
import { APTOS_API_KEY, DYNEXUS_ADDRESS, fn, NETWORK } from "./config";

export const aptos = new Aptos(
  new AptosConfig({
    network: NETWORK,
    clientConfig: APTOS_API_KEY ? { API_KEY: APTOS_API_KEY } : undefined,
  }),
);

export async function view<T extends MoveValue[]>(
  module: string,
  name: string,
  args: InputViewFunctionData["functionArguments"] = [],
): Promise<T> {
  if (!DYNEXUS_ADDRESS) throw new Error("NEXT_PUBLIC_DYNEXUS_ADDRESS is not configured");
  return (await aptos.view({
    payload: { function: fn(module, name), functionArguments: args },
  })) as T;
}

export interface FaMeta {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  iconUri: string;
}

const metaCache = new Map<string, Promise<FaMeta>>();

/** Fungible asset metadata (cached per session). Works for any FA, not only factory tokens. */
export function faMetadata(address: string): Promise<FaMeta> {
  let p = metaCache.get(address);
  if (!p) {
    p = aptos
      .getFungibleAssetMetadataByAssetType({ assetType: address })
      .then((m) => ({
        address,
        name: m.name,
        symbol: m.symbol,
        decimals: m.decimals,
        iconUri: m.icon_uri ?? "",
      }))
      .catch(async () => {
        const [name, symbol, decimals, iconUri] = await Promise.all([
          aptos.view<[string]>({
            payload: {
              function: "0x1::fungible_asset::name",
              typeArguments: ["0x1::fungible_asset::Metadata"],
              functionArguments: [address],
            },
          }),
          aptos.view<[string]>({
            payload: {
              function: "0x1::fungible_asset::symbol",
              typeArguments: ["0x1::fungible_asset::Metadata"],
              functionArguments: [address],
            },
          }),
          aptos.view<[number]>({
            payload: {
              function: "0x1::fungible_asset::decimals",
              typeArguments: ["0x1::fungible_asset::Metadata"],
              functionArguments: [address],
            },
          }),
          aptos.view<[string]>({
            payload: {
              function: "0x1::fungible_asset::icon_uri",
              typeArguments: ["0x1::fungible_asset::Metadata"],
              functionArguments: [address],
            },
          }),
        ]);
        return {
          address,
          name: name[0],
          symbol: symbol[0],
          decimals: Number(decimals[0]),
          iconUri: iconUri[0],
        };
      });
    metaCache.set(address, p);
    p.catch(() => metaCache.delete(address));
  }
  return p;
}

export async function faBalance(owner: string, asset: string): Promise<bigint> {
  const [bal] = await aptos.view<[string]>({
    payload: {
      function: "0x1::primary_fungible_store::balance",
      typeArguments: ["0x1::fungible_asset::Metadata"],
      functionArguments: [owner, asset],
    },
  });
  return BigInt(bal);
}

export interface PoolOnChain {
  address: string;
  tokenX: string;
  tokenY: string;
  reserveX: bigint;
  reserveY: bigint;
  lpSupply: bigint;
  feeBps: number;
  platformFeeBps: number;
}

/** Exact, current pool state from two view calls. */
export async function poolOnChain(address: string): Promise<PoolOnChain> {
  const [[x, y], info] = await Promise.all([
    view<[string, string, string]>("dex", "get_pool_tokens", [address]),
    view<[string, string, string, string, string, string, string]>("dex", "get_pool_info", [
      address,
    ]),
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
}

export interface TokenOnChain {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  creator: string;
  iconUri: string;
}

export async function tokenOnChain(address: string): Promise<TokenOnChain> {
  const [creator, name, symbol, decimals, , iconUri] = await view<
    [string, string, string, number, string, string, string]
  >("token_factory", "get_token_info", [address]);
  return { address, name, symbol, decimals: Number(decimals), creator, iconUri };
}

/** Upper bound for chain-side list reads so one page never fans out unboundedly. */
export const CHAIN_LIST_CAP = 200;
/** Parallel view calls per list refresh; public fullnodes rate-limit per IP. */
export const CHAIN_CONCURRENCY = 6;
