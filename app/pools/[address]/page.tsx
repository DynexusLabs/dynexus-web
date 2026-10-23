"use client";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { PairLabel, TokenAmount, TokenSymbol } from "@/components/dx/Token";
import {
  ActionButton,
  Field,
  inputClass,
  Page,
  Panel,
  Sparkline,
  Stat,
  TxStatus,
} from "@/components/dx/ui";
import { useAccountAddress, useBalance, useMetadata, usePools } from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { api, indexerEnabled } from "@/lib/api";
import { view } from "@/lib/aptos";
import { applySlippage, fromUnits, shortAddr, toUnits } from "@/lib/format";

const SLIPPAGE_BPS = 100;
const deadline = () => Math.floor(Date.now() / 1000) + 300;

function AddLiquidity({ x, y, rx, ry }: { x: string; y: string; rx: bigint; ry: bigint }) {
  const user = useAccountAddress();
  const { data: mx } = useMetadata(x);
  const { data: my } = useMetadata(y);
  const { data: bx } = useBalance(x);
  const { data: by } = useBalance(y);
  const [amountX, setAmountX] = useState("");
  const { submit, state } = useTx();

  let ux = 0n;
  let error = "";
  try {
    if (amountX && mx) ux = toUnits(amountX, mx.decimals);
  } catch (e) {
    error = (e as Error).message;
  }
  // Pool ratio decides the other side; add 1 unit of headroom for rounding.
  const uy = rx > 0n ? (ux * ry) / rx + 1n : 0n;
  if (!error && bx !== undefined && ux > bx) error = "Insufficient balance";
  if (!error && by !== undefined && uy > by) error = "Insufficient balance of second token";

  return (
    <Panel title="Add liquidity">
      <Field
        id="ax"
        label={mx ? `Amount ${mx.symbol}` : "Amount"}
        hint={bx !== undefined && mx ? `bal ${fromUnits(bx, mx.decimals)}` : undefined}
      >
        <input
          id="ax"
          className={inputClass}
          inputMode="decimal"
          value={amountX}
          onChange={(e) => setAmountX(e.target.value)}
        />
      </Field>
      <p className="mb-4 text-sm text-muted">
        Requires ≈ {my ? <TokenAmount address={y} amount={uy} /> : "…"}
      </p>
      <ActionButton
        disabled={!user || ux === 0n || !!error || state.status === "pending"}
        onClick={() =>
          submit("dex", "add_liquidity", [
            x,
            y,
            ux.toString(),
            uy.toString(),
            applySlippage(ux, SLIPPAGE_BPS).toString(),
            applySlippage(uy - 1n, SLIPPAGE_BPS).toString(),
            deadline(),
          ])
        }
      >
        {user ? "Add liquidity" : "Connect wallet"}
      </ActionButton>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <TxStatus state={state} />
    </Panel>
  );
}

function RemoveLiquidity({ pool, x, y, lp }: { pool: string; x: string; y: string; lp: string }) {
  const user = useAccountAddress();
  const { data: lpBal } = useBalance(lp);
  const [pct, setPct] = useState(50);
  const { submit, state } = useTx();
  const amount = lpBal ? (lpBal * BigInt(pct)) / 100n : 0n;
  const { data: value } = useQuery({
    queryKey: ["lp-value", pool, amount.toString()],
    enabled: amount > 0n,
    queryFn: async () => {
      const [ox, oy] = await view<[string, string]>("dex", "calculate_lp_value", [
        pool,
        amount.toString(),
      ]);
      return [BigInt(ox), BigInt(oy)] as const;
    },
  });
  // calculate_lp_value returns pool order (sorted), which matches x/y here.
  return (
    <Panel title="Remove liquidity">
      <p className="mb-2 text-sm text-muted">
        Your LP: {lpBal !== undefined ? lpBal.toString() : "…"} units
      </p>
      <input
        aria-label="Percent to remove"
        type="range"
        min={1}
        max={100}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        className="w-full"
      />
      <p className="mb-4 text-sm text-fg">
        {pct}% →{" "}
        {value ? (
          <>
            <TokenAmount address={x} amount={value[0]} /> +{" "}
            <TokenAmount address={y} amount={value[1]} />
          </>
        ) : (
          "—"
        )}
      </p>
      <ActionButton
        disabled={!user || amount === 0n || !value || state.status === "pending"}
        onClick={() =>
          value &&
          submit("dex", "remove_liquidity", [
            x,
            y,
            amount.toString(),
            applySlippage(value[0], SLIPPAGE_BPS).toString(),
            applySlippage(value[1], SLIPPAGE_BPS).toString(),
            deadline(),
          ])
        }
      >
        {user ? "Remove" : "Connect wallet"}
      </ActionButton>
      <TxStatus state={state} />
    </Panel>
  );
}

function GaugeStake({ pool, lp }: { pool: string; lp: string }) {
  const user = useAccountAddress();
  const { data: lpBal } = useBalance(lp);
  const { submit, state } = useTx();
  const { data } = useQuery({
    queryKey: ["gauge", pool, user],
    queryFn: async () => {
      const [lpToken, total, rate, finish] = await view<[string, string, string, string]>(
        "gauge",
        "get_gauge_info",
        [pool],
      );
      const [staked] = user ? await view<[string]>("gauge", "staked", [user, pool]) : ["0"];
      const [earned] = user ? await view<[string]>("gauge", "earned", [user, pool]) : ["0"];
      return {
        lpToken,
        total: BigInt(total),
        rate: BigInt(rate),
        finish: Number(finish),
        staked: BigInt(staked),
        earned: BigInt(earned),
      };
    },
  });
  const { data: dyna } = useQuery({
    queryKey: ["forge-dyna"],
    queryFn: async () => (await view<[string]>("token_factory", "get_dynexus_config"))[0],
  });
  if (!data) return null;
  return (
    <Panel title="Gauge">
      <div className="mb-4 space-y-1 text-sm text-muted">
        <p>Total staked: {data.total.toString()} LP</p>
        <p>Your stake: {data.staked.toString()} LP</p>
        <p>
          Emission rate: {dyna ? <TokenAmount address={dyna} amount={data.rate * 86400n} /> : "…"} /
          day
        </p>
        <p className="text-fg">
          Earned: {dyna ? <TokenAmount address={dyna} amount={data.earned} /> : "…"}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ActionButton
          disabled={!user || !lpBal}
          onClick={() => submit("gauge", "stake", [pool, (lpBal ?? 0n).toString()])}
        >
          Stake all
        </ActionButton>
        <ActionButton
          variant="ghost"
          disabled={!user || data.staked === 0n}
          onClick={() => submit("gauge", "unstake", [pool, data.staked.toString()])}
        >
          Unstake
        </ActionButton>
        <ActionButton
          variant="ghost"
          disabled={!user || data.earned === 0n}
          onClick={() => submit("gauge", "claim_rewards", [pool])}
        >
          Claim
        </ActionButton>
      </div>
      <TxStatus state={state} />
    </Panel>
  );
}

export default function PoolPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const { data: pools } = usePools();
  const pool = pools?.find((p) => p.address === address);
  const candles = useQuery({
    queryKey: ["candles", address],
    enabled: indexerEnabled,
    queryFn: () => api.candles(address),
  });
  const swaps = useQuery({
    queryKey: ["swaps", address],
    enabled: indexerEnabled,
    queryFn: () => api.swaps(address),
  });
  const { data: hasGauge } = useQuery({
    queryKey: ["has-gauge", address],
    queryFn: async () => (await view<[boolean]>("gauge", "gauge_exists", [address]))[0],
  });

  if (!pool) {
    return (
      <Page title="Pool">
        <p className="text-subtle">{pools ? "Pool not found." : "Loading…"}</p>
      </Page>
    );
  }
  const price = pool.reserveX > 0n ? Number(pool.reserveY) / Number(pool.reserveX) : 0;

  return (
    <Page title="Pool" subtitle={address}>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-fg">
        <PairLabel x={pool.tokenX} y={pool.tokenY} />
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat
          label="Reserve A"
          value={<TokenAmount address={pool.tokenX} amount={pool.reserveX} />}
        />
        <Stat
          label="Reserve B"
          value={<TokenAmount address={pool.tokenY} amount={pool.reserveY} />}
        />
        <Stat label="Fee" value={`${(pool.feeBps + pool.platformFeeBps) / 100}%`} />
        <Stat label="Swaps 24h" value={pool.swaps24h ?? "—"} />
      </div>

      {indexerEnabled && (
        <Panel title="Price (B per A, raw units)" className="mb-6">
          <Sparkline values={(candles.data ?? []).map((c) => c.close)} />
          <p className="text-xs text-subtle">Spot ≈ {price.toPrecision(6)}</p>
        </Panel>
      )}

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <AddLiquidity x={pool.tokenX} y={pool.tokenY} rx={pool.reserveX} ry={pool.reserveY} />
        <RemoveLiquidity pool={address} x={pool.tokenX} y={pool.tokenY} lp={address} />
      </div>
      {hasGauge && (
        <div className="mb-6">
          <GaugeStake pool={address} lp={address} />
        </div>
      )}

      {indexerEnabled && (
        <Panel title="Recent swaps">
          {swaps.data?.length === 0 && <p className="text-sm text-subtle">No swaps yet.</p>}
          <div className="divide-y divide-line text-sm">
            {swaps.data?.map((s) => (
              <div
                key={`${s.transaction_version}-${s.trader}`}
                className="flex justify-between py-2"
              >
                <span className="text-muted">{shortAddr(s.trader)}</span>
                <span className="text-fg">
                  <TokenAmount address={s.token_in} amount={s.amount_in} /> →{" "}
                  <TokenAmount address={s.token_out} amount={s.amount_out} />
                </span>
                <span className="hidden text-subtle md:inline">
                  {new Date(s.ts).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">
            Token in: <TokenSymbol address={pool.tokenX} /> / <TokenSymbol address={pool.tokenY} />
          </p>
        </Panel>
      )}
    </Page>
  );
}
