"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { PairLabel, TokenAmount } from "@/components/dx/Token";
import TokenSelect from "@/components/dx/TokenSelect";
import {
  ActionButton,
  Field,
  inputClass,
  Notice,
  Page,
  Panel,
  Skeleton,
  TxStatus,
} from "@/components/dx/ui";
import {
  configured,
  useAccountAddress,
  useMetadata,
  usePools,
  useTokens,
} from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { toUnits } from "@/lib/format";

function CreatePool({ tokens }: { tokens: string[] }) {
  const user = useAccountAddress();
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [ax, setAx] = useState("");
  const [ay, setAy] = useState("");
  const { data: mx } = useMetadata(x || undefined);
  const { data: my } = useMetadata(y || undefined);
  const { submit, state } = useTx();

  let error = "";
  let ux = 0n;
  let uy = 0n;
  try {
    if (x && y && x === y) error = "Pick two different tokens";
    if (ax && mx) ux = toUnits(ax, mx.decimals);
    if (ay && my) uy = toUnits(ay, my.decimals);
    if ((ux > 0n && ux < 1000n) || (uy > 0n && uy < 1000n))
      error = "Each side needs at least 1000 base units";
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <Panel title="Create pool">
      <Field id="px" label="Token A">
        <TokenSelect id="px" tokens={tokens} value={x} onChange={setX} />
      </Field>
      <Field id="pax" label="Amount A">
        <input
          id="pax"
          className={inputClass}
          inputMode="decimal"
          value={ax}
          onChange={(e) => setAx(e.target.value)}
        />
      </Field>
      <Field id="py" label="Token B">
        <TokenSelect id="py" tokens={tokens} value={y} onChange={setY} />
      </Field>
      <Field id="pay" label="Amount B">
        <input
          id="pay"
          className={inputClass}
          inputMode="decimal"
          value={ay}
          onChange={(e) => setAy(e.target.value)}
        />
      </Field>
      <p className="mb-4 text-xs text-subtle">
        The amounts set the initial price. 1000 LP units stay locked in the pool forever.
      </p>
      <ActionButton
        disabled={
          !user || !x || !y || ux === 0n || uy === 0n || !!error || state.status === "pending"
        }
        onClick={() => submit("dex", "create_pool", [x, y, ux.toString(), uy.toString()])}
      >
        {user ? "Create pool" : "Connect wallet"}
      </ActionButton>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <TxStatus state={state} />
    </Panel>
  );
}

function PoolsList() {
  const params = useSearchParams();
  const filter = params.get("token");
  const { data: pools, isLoading, error: poolsError } = usePools();
  const { data: factoryTokens } = useTokens();
  const tokens = useMemo(
    () => [
      ...new Set([
        ...(factoryTokens ?? []).map((t) => t.address),
        ...(pools ?? []).flatMap((p) => [p.tokenX, p.tokenY]),
      ]),
    ],
    [factoryTokens, pools],
  );
  const rows = (pools ?? []).filter((p) => !filter || p.tokenX === filter || p.tokenY === filter);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Panel title="All pools" className="md:col-span-2">
        {isLoading && <p className="text-sm text-subtle">Loading…</p>}
        {poolsError && (
          <p role="alert" className="text-sm text-danger">
            Could not load pools: {(poolsError as Error).message}
          </p>
        )}
        {pools && rows.length === 0 && (
          <p className="text-sm text-subtle">
            {filter ? "No pools for this token yet." : "No pools yet — create the first one."}
          </p>
        )}
        <table className="w-full text-sm">
          <thead className="text-left text-xs font-medium text-subtle">
            <tr>
              <th className="py-2">Pair</th>
              <th>Reserves</th>
              <th className="hidden md:table-cell">Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((p) => (
              <tr key={p.address} className="hover:bg-surface-2/60">
                <td className="py-3">
                  <Link
                    href={`/pools/${p.address}`}
                    className="font-semibold text-fg underline-offset-4 hover:underline"
                  >
                    <PairLabel x={p.tokenX} y={p.tokenY} />
                  </Link>
                  {p.hasGauge && (
                    <span className="ml-2 rounded-md bg-accent-2/10 px-1.5 py-0.5 text-xs font-medium text-accent-2">
                      gauge
                    </span>
                  )}
                </td>
                <td className="text-muted">
                  <TokenAmount address={p.tokenX} amount={p.reserveX} />
                  <br />
                  <TokenAmount address={p.tokenY} amount={p.reserveY} />
                </td>
                <td className="hidden text-subtle md:table-cell">
                  {(p.feeBps + p.platformFeeBps) / 100}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <CreatePool tokens={tokens} />
    </div>
  );
}

export default function PoolsPage() {
  return (
    <Page
      title="Pools"
      subtitle="Provide liquidity and earn swap fees; stake LP in gauges for DYNA emissions"
    >
      {!configured && <Notice>Contract address not configured.</Notice>}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <PoolsList />
      </Suspense>
    </Page>
  );
}
