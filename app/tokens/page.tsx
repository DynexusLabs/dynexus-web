"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { inputClass, Notice, Page, Panel } from "@/components/dx/ui";
import { configured, useAccountAddress, useTokens } from "@/hooks/useDynexus";
import { indexerEnabled } from "@/lib/api";
import { shortAddr } from "@/lib/format";

export default function TokensPage() {
  const user = useAccountAddress();
  const [mine, setMine] = useState(false);
  const [search, setSearch] = useState("");
  const { data: tokens, isLoading, error } = useTokens(mine ? user : undefined);

  const term = search.trim().toLowerCase();
  const rows = (tokens ?? []).filter(
    (t) => !term || t.name.toLowerCase().includes(term) || t.symbol.toLowerCase().includes(term),
  );

  return (
    <Page
      title="Tokens"
      subtitle={`Tokens forged on Dynexus${indexerEnabled ? " · served by the indexer" : ""}`}
    >
      {!configured && <Notice>Contract address not configured.</Notice>}
      <Panel>
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
            <input
              aria-label="Search tokens"
              className={`${inputClass} pl-10`}
              placeholder="Search name or symbol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-cyan-300">
            <input
              type="checkbox"
              checked={mine}
              disabled={!user}
              onChange={(e) => setMine(e.target.checked)}
            />
            Created by me
          </label>
          <Link
            href="/create-token"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-center text-sm font-bold uppercase text-black"
          >
            Create token
          </Link>
        </div>

        {isLoading && <p className="text-sm text-cyan-400/60">Loading…</p>}
        {error && <p className="text-sm text-red-400">{(error as Error).message}</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-cyan-400/60">No tokens found.</p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {rows.map((t) => (
            <div key={t.address} className="rounded-lg border border-cyan-400/20 bg-black/40 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#00d9ff] font-bold text-white">
                  {t.iconUri ? (
                    // biome-ignore lint/performance/noImgElement: logo URLs are arbitrary user-supplied hosts
                    <img src={t.iconUri} alt="" className="h-10 w-10 object-cover" />
                  ) : (
                    t.symbol.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-semibold text-cyan-200">{t.name}</div>
                  <div className="text-xs text-cyan-400/70">{t.symbol}</div>
                </div>
              </div>
              <div className="text-xs text-cyan-400/60">
                {t.decimals} decimals · by {shortAddr(t.creator)}
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <Link
                  href={`/swap?in=${t.address}`}
                  className="rounded border border-cyan-400/30 px-2 py-1 hover:bg-cyan-400/10"
                >
                  Swap
                </Link>
                <Link
                  href={`/pools?token=${t.address}`}
                  className="rounded border border-cyan-400/30 px-2 py-1 hover:bg-cyan-400/10"
                >
                  Pools
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Page>
  );
}
