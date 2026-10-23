import { INDEXER_URL } from "./config";

/** Typed client for dynexus-api. Amounts are decimal strings in base units. */

export interface ApiToken {
  address: string;
  creator: string;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  icon_uri: string | null;
  project_uri: string | null;
  burned: string;
  created_at: string;
  created_version: number;
}

export interface ApiPool {
  address: string;
  token_x: string;
  token_y: string;
  creator: string;
  reserve_x: string;
  reserve_y: string;
  lp_supply: string;
  fee_bps: number;
  platform_fee_bps: number;
  created_at: string;
  token_x_symbol: string | null;
  token_y_symbol: string | null;
  token_x_decimals: number | null;
  token_y_decimals: number | null;
  swaps_24h: number;
  volume_x_24h: string;
  volume_y_24h: string;
  has_gauge: boolean;
}

export interface ApiSwap {
  transaction_version: number;
  trader: string;
  token_in: string;
  token_out: string;
  amount_in: string;
  amount_out: string;
  ts: string;
}

export interface ApiCandle {
  start: number;
  open: number;
  high: number;
  low: number;
  close: number;
  swaps: number;
}

export interface ApiStats {
  tokens: number;
  pools: number;
  swaps_24h: number;
  traders_24h: number;
  ve_total_locked: string;
  ve_lockers: number;
  current_epoch: number;
}

export interface ApiBribe {
  pool: string;
  epoch: number;
  token: string;
  amount: string;
}

export interface ApiGauge {
  gauge: {
    pool: string;
    lp_token: string;
    total_staked: string;
    reward_rate: string;
    period_finish: number;
  };
  epoch: number;
  votes: string;
  bribes: ApiBribe[];
}

export interface ApiEvent {
  transaction_version: number;
  module: string;
  name: string;
  data: Record<string, unknown>;
  ts: string;
}

export const indexerEnabled = INDEXER_URL !== "";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${INDEXER_URL}${path}`);
  if (!res.ok) throw new Error(`Indexer ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const api = {
  stats: () => get<ApiStats>("/stats"),
  tokens: (p: { creator?: string; q?: string; limit?: number; offset?: number } = {}) =>
    get<ApiToken[]>(`/tokens${qs(p)}`),
  pools: (p: { token?: string; limit?: number } = {}) => get<ApiPool[]>(`/pools${qs(p)}`),
  pool: (address: string) => get<ApiPool | null>(`/pools/${address}`),
  swaps: (address: string, limit = 25) => get<ApiSwap[]>(`/pools/${address}/swaps${qs({ limit })}`),
  candles: (address: string, interval = 3600, limit = 48) =>
    get<ApiCandle[]>(`/pools/${address}/candles${qs({ interval, limit })}`),
  gauges: () => get<ApiGauge[]>("/gauges"),
  activity: (address: string, limit = 25) =>
    get<ApiEvent[]>(`/users/${address}/activity${qs({ limit })}`),
};
