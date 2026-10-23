"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Faucet from "@/components/dx/Faucet";
import { PairLabel, TokenAmount } from "@/components/dx/Token";
import { Notice, Page, Panel, Stat } from "@/components/dx/ui";
import { configured, useForgeConfig, usePools } from "@/hooks/useDynexus";
import { api, indexerEnabled } from "@/lib/api";
import { fromUnits } from "@/lib/format";

const actions = [
  { href: "/create-token", title: "Forge", desc: "Launch a fungible token" },
  { href: "/swap", title: "Swap", desc: "Trade with multi-hop routing" },
  { href: "/pools", title: "Pools", desc: "Provide liquidity, earn fees" },
  { href: "/governance", title: "Governance", desc: "Lock DYNA, vote, earn bribes" },
];

export default function Home() {
  const { data: config } = useForgeConfig();
  const { data: pools, isLoading } = usePools();
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    enabled: indexerEnabled,
    queryFn: api.stats,
  });

  return (
    <Page title="Dynexus" subtitle="Token factory, AMM and ve-governance on Aptos">
      {!configured && (
        <Notice>Set NEXT_PUBLIC_DYNEXUS_ADDRESS to the deployed contract address.</Notice>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Tokens" value={stats?.tokens ?? config?.totalTokens ?? "—"} />
        <Stat label="Pools" value={stats?.pools ?? pools?.length ?? "—"} />
        <Stat label="Swaps 24h" value={stats?.swaps_24h ?? "—"} />
        <Stat
          label="veDYNA locked"
          value={
            stats && config ? (
              <TokenAmount address={config.dyna} amount={stats.ve_total_locked} />
            ) : (
              "—"
            )
          }
        />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-xl border border-cyan-400/30 bg-gray-900/70 p-5 transition hover:border-cyan-300 hover:bg-gray-800/80"
          >
            <div className="text-lg font-bold uppercase text-cyan-300">{a.title}</div>
            <div className="text-xs text-cyan-400/70">{a.desc}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Panel title="Pools" className="md:col-span-2">
          {isLoading && <p className="text-sm text-cyan-400/60">Loading…</p>}
          {pools?.length === 0 && <p className="text-sm text-cyan-400/60">No pools yet.</p>}
          <div className="divide-y divide-cyan-400/10">
            {pools?.slice(0, 8).map((p) => (
              <Link
                key={p.address}
                href={`/pools/${p.address}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-cyan-400/5"
              >
                <span className="font-semibold text-cyan-200">
                  <PairLabel x={p.tokenX} y={p.tokenY} />
                  {p.hasGauge && (
                    <span className="ml-2 rounded bg-teal-500/20 px-1.5 text-xs text-teal-300">
                      gauge
                    </span>
                  )}
                </span>
                <span className="text-cyan-400/70">
                  <TokenAmount address={p.tokenX} amount={p.reserveX} /> ·{" "}
                  <TokenAmount address={p.tokenY} amount={p.reserveY} />
                </span>
                <span className="hidden text-cyan-400/50 md:inline">
                  {p.swaps24h !== undefined
                    ? `${p.swaps24h} swaps 24h`
                    : `${fromUnits(p.feeBps + p.platformFeeBps, 2)}% fee`}
                </span>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Faucet">
          <Faucet />
        </Panel>
      </div>
    </Page>
  );
}
