"use client";
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BeakerIcon,
  ScaleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Faucet from "@/components/dx/Faucet";
import { PairLabel, TokenAmount } from "@/components/dx/Token";
import { Notice, Panel, Stat } from "@/components/dx/ui";
import { configured, useForgeConfig, usePools } from "@/hooks/useDynexus";
import { api, indexerEnabled } from "@/lib/api";
import { fromUnits } from "@/lib/format";
import { routes, site } from "@/lib/site";

const features = [
  { icon: SparklesIcon, ...routes[3], title: "Forge" },
  { icon: ArrowsRightLeftIcon, ...routes[0], title: "Swap" },
  { icon: BeakerIcon, ...routes[1], title: "Pools" },
  { icon: ScaleIcon, ...routes[4], title: "Governance" },
];

export default function Home() {
  const { data: config } = useForgeConfig();
  const { data: pools, isLoading, error: poolsError } = usePools();
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    enabled: indexerEnabled,
    queryFn: api.stats,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
      <section className="mb-14 max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true" />
          Built with Move on Aptos
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          Forge, trade and govern <span className="whitespace-nowrap text-gradient">on Aptos</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">{site.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/swap"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-strong/25 transition-colors hover:bg-accent"
          >
            Start trading
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/create-token"
            className="inline-flex items-center rounded-xl border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Launch a token
          </Link>
        </div>
      </section>

      {!configured && (
        <Notice>Set NEXT_PUBLIC_DYNEXUS_ADDRESS to the deployed contract address.</Notice>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-2xl border border-line bg-surface/80 p-5 transition-colors hover:border-line-strong hover:bg-surface-2"
          >
            <f.icon className="h-6 w-6 text-accent" aria-hidden="true" />
            <div className="mt-4 flex items-center justify-between font-semibold text-fg">
              {f.title}
              <ArrowRightIcon
                className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-sm text-muted">{f.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Panel title="Pools" className="md:col-span-2">
          {isLoading && <p className="text-sm text-subtle">Loading…</p>}
          {poolsError && (
            <p className="text-sm text-danger">
              Could not load pools. Check your connection and retry.
            </p>
          )}
          {pools?.length === 0 && <p className="text-sm text-subtle">No pools yet.</p>}
          <div className="divide-y divide-line">
            {pools?.slice(0, 8).map((p) => (
              <Link
                key={p.address}
                href={`/pools/${p.address}`}
                className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm hover:bg-surface-2/60"
              >
                <span className="font-semibold text-fg">
                  <PairLabel x={p.tokenX} y={p.tokenY} />
                  {p.hasGauge && (
                    <span className="ml-2 rounded-md bg-accent-2/10 px-1.5 py-0.5 text-xs font-medium text-accent-2">
                      gauge
                    </span>
                  )}
                </span>
                <span className="text-muted">
                  <TokenAmount address={p.tokenX} amount={p.reserveX} /> ·{" "}
                  <TokenAmount address={p.tokenY} amount={p.reserveY} />
                </span>
                <span className="hidden text-subtle md:inline">
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
    </div>
  );
}
