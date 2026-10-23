import { Network } from "@aptos-labs/ts-sdk";

const networks: Record<string, Network> = {
  mainnet: Network.MAINNET,
  testnet: Network.TESTNET,
  devnet: Network.DEVNET,
  local: Network.LOCAL,
};

export const NETWORK: Network =
  networks[process.env.NEXT_PUBLIC_APTOS_NETWORK ?? "testnet"] ?? Network.TESTNET;

/** Account that published DynexusForge, DynexusSwap and DynexusCore. */
export const DYNEXUS_ADDRESS = process.env.NEXT_PUBLIC_DYNEXUS_ADDRESS ?? "";

/** Base URL of dynexus-api; empty disables indexer features and falls back to view calls. */
export const INDEXER_URL = (process.env.NEXT_PUBLIC_INDEXER_URL ?? "").replace(/\/$/, "");

export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY || undefined;

export const EXPLORER_TX = (hash: string) =>
  `https://explorer.aptoslabs.com/txn/${hash}?network=${NETWORK === Network.LOCAL ? "local" : NETWORK}`;

export const fn = (module: string, name: string) =>
  `${DYNEXUS_ADDRESS}::${module}::${name}` as `${string}::${string}::${string}`;

export const WEEK = 604_800;
export const MAX_LOCK = 208 * WEEK;
