"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PairLabel, TokenAmount } from "@/components/dx/Token";
import TokenSelect from "@/components/dx/TokenSelect";
import {
  ActionButton,
  Field,
  inputClass,
  Notice,
  Page,
  Panel,
  Stat,
  TxStatus,
} from "@/components/dx/ui";
import {
  configured,
  useAccountAddress,
  useBalance,
  useForgeConfig,
  useMetadata,
  usePools,
  useTokens,
} from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { view } from "@/lib/aptos";
import { MAX_LOCK, WEEK } from "@/lib/config";
import { fromUnits, timeLeft, toUnits } from "@/lib/format";

const DURATIONS = [
  { label: "1 week", secs: WEEK },
  { label: "1 month", secs: 4 * WEEK },
  { label: "1 year", secs: 52 * WEEK },
  { label: "2 years", secs: 104 * WEEK },
  { label: "4 years", secs: MAX_LOCK },
];

function useEpoch() {
  return useQuery({
    queryKey: ["epoch"],
    queryFn: async () => {
      const [[current], [next]] = await Promise.all([
        view<[string]>("voter", "current_epoch"),
        view<[string]>("voter", "next_epoch_to_distribute"),
      ]);
      return { current: Number(current), nextToDistribute: Number(next) };
    },
  });
}

function useLock(user?: string) {
  return useQuery({
    queryKey: ["lock", user],
    enabled: !!user,
    queryFn: async () => {
      const [[amount, unlock], [power]] = await Promise.all([
        view<[string, string]>("voting_escrow", "get_lock", [user]),
        view<[string]>("voting_escrow", "voting_power", [user]),
      ]);
      return { amount: BigInt(amount), unlock: Number(unlock), power: BigInt(power) };
    },
  });
}

function LockPanel({ dyna }: { dyna: string }) {
  const user = useAccountAddress();
  const { data: lock } = useLock(user);
  const { data: meta } = useMetadata(dyna);
  const { data: bal } = useBalance(dyna);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(DURATIONS[2].secs);
  const { submit, state } = useTx();

  let units = 0n;
  let error = "";
  try {
    if (amount && meta) units = toUnits(amount, meta.decimals);
  } catch (e) {
    error = (e as Error).message;
  }
  if (!error && bal !== undefined && units > bal) error = "Insufficient DYNA";

  const now = Date.now() / 1000;
  const hasLock = !!lock && lock.amount > 0n;
  const expired = hasLock && lock.unlock <= now;

  return (
    <Panel title="Lock DYNA → veDYNA">
      {hasLock && (
        <div className="mb-4 space-y-1 rounded-xl border border-line bg-surface-2/60 p-3 text-sm">
          <p>
            Locked: <TokenAmount address={dyna} amount={lock.amount} />
          </p>
          <p>
            Unlocks: {new Date(lock.unlock * 1000).toLocaleDateString()}{" "}
            {expired ? "(expired)" : `(in ${timeLeft(lock.unlock)})`}
          </p>
          <p className="text-fg">
            Voting power: {meta ? fromUnits(lock.power, meta.decimals) : "…"}
          </p>
        </div>
      )}
      {expired ? (
        <ActionButton onClick={() => submit("voting_escrow", "withdraw", [])}>
          Withdraw
        </ActionButton>
      ) : (
        <>
          <Field
            id="lock-amount"
            label={hasLock ? "Add amount" : "Amount"}
            hint={bal !== undefined && meta ? `bal ${fromUnits(bal, meta.decimals)}` : undefined}
          >
            <input
              id="lock-amount"
              className={inputClass}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field id="lock-duration" label={hasLock ? "Extend to" : "Duration"}>
            <select
              id="lock-duration"
              className={inputClass}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {DURATIONS.map((d) => (
                <option key={d.secs} value={d.secs}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
          <p className="mb-4 text-xs text-subtle">
            Power = amount × remaining time / 4 years, decaying to 0 at unlock. Unlock rounds down
            to a weekly boundary.
          </p>
          {hasLock ? (
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                disabled={!user || units === 0n || !!error}
                onClick={() => submit("voting_escrow", "increase_amount", [units.toString()])}
              >
                Add
              </ActionButton>
              <ActionButton
                variant="ghost"
                disabled={!user}
                onClick={() => submit("voting_escrow", "extend_lock", [duration])}
              >
                Extend
              </ActionButton>
            </div>
          ) : (
            <ActionButton
              disabled={!user || units === 0n || !!error || state.status === "pending"}
              onClick={() => submit("voting_escrow", "create_lock", [units.toString(), duration])}
            >
              {user ? "Create lock" : "Connect wallet"}
            </ActionButton>
          )}
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </>
      )}
      <TxStatus state={state} />
    </Panel>
  );
}

function VotePanel({ epoch }: { epoch: number }) {
  const user = useAccountAddress();
  const { data: pools } = usePools();
  const { data: lock } = useLock(user);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const { submit, state } = useTx();
  const { data: gauges } = useQuery({
    queryKey: ["gauges", epoch],
    queryFn: async () => {
      const [list] = await view<[string[]]>("voter", "get_gauges");
      return Promise.all(
        list.map(async (pool) => {
          const [[votes], [mine]] = await Promise.all([
            view<[string]>("voter", "get_pool_votes", [pool, epoch]),
            user
              ? view<[string]>("voter", "get_user_pool_votes", [user, pool, epoch])
              : Promise.resolve(["0"]),
          ]);
          return { pool, votes: BigInt(votes), mine: BigInt(mine) };
        }),
      );
    },
  });
  const total = (gauges ?? []).reduce((s, g) => s + g.votes, 0n);
  const selected = Object.entries(weights).filter(([, w]) => Number(w) > 0);

  return (
    <Panel title={`Vote · epoch ${epoch}`}>
      {gauges?.length === 0 && <p className="text-sm text-subtle">No gauges yet.</p>}
      <div className="mb-4 divide-y divide-line">
        {gauges?.map((g) => {
          const pool = pools?.find((p) => p.address === g.pool);
          const share = total > 0n ? Number((g.votes * 10_000n) / total) / 100 : 0;
          return (
            <div key={g.pool} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="flex-1 text-fg">
                {pool ? <PairLabel x={pool.tokenX} y={pool.tokenY} /> : g.pool.slice(0, 10)}
              </span>
              <span className="w-20 text-right text-muted">{share}%</span>
              <input
                aria-label="Vote weight"
                className={`${inputClass} w-20`}
                inputMode="numeric"
                placeholder="0"
                value={weights[g.pool] ?? ""}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, [g.pool]: e.target.value.replace(/\D/g, "") }))
                }
              />
            </div>
          );
        })}
      </div>
      <p className="mb-4 text-xs text-subtle">
        Weights are relative (e.g. 3 and 1 = 75% / 25%). Voting again this epoch replaces your
        previous vote.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          disabled={
            !user ||
            !lock ||
            lock.power === 0n ||
            selected.length === 0 ||
            state.status === "pending"
          }
          onClick={() =>
            submit("voter", "vote", [selected.map(([p]) => p), selected.map(([, w]) => w)])
          }
        >
          {lock && lock.power === 0n ? "Lock DYNA to vote" : "Vote"}
        </ActionButton>
        <ActionButton
          variant="ghost"
          disabled={!user || !gauges?.some((g) => g.mine > 0n)}
          onClick={() => submit("voter", "reset", [])}
        >
          Reset
        </ActionButton>
      </div>
      <TxStatus state={state} />
    </Panel>
  );
}

function BribePanel({ epoch }: { epoch: number }) {
  const user = useAccountAddress();
  const { data: pools } = usePools();
  const { data: tokens } = useTokens();
  const [pool, setPool] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const { data: meta } = useMetadata(token || undefined);
  const add = useTx();
  const claim = useTx();

  const { data: gaugePools } = useQuery({
    queryKey: ["gauge-list"],
    queryFn: async () => (await view<[string[]]>("voter", "get_gauges"))[0],
  });
  /** Claimable bribes from last epoch's votes. */
  const { data: claimable } = useQuery({
    queryKey: ["claimable-bribes", user, epoch],
    enabled: !!user && epoch > 0,
    queryFn: async () => {
      const prev = epoch - 1;
      const [votedPools] = await view<[string[], string[]]>("voter", "get_user_votes", [
        user,
        prev,
      ]);
      const rows = await Promise.all(
        votedPools.map(async (p) => {
          const [toks, amts] = await view<[string[], string[]]>("bribe", "claimable", [
            user,
            p,
            prev,
          ]);
          return {
            pool: p,
            epoch: prev,
            items: toks.map((t, i) => ({ token: t, amount: BigInt(amts[i]) })),
          };
        }),
      );
      return rows.filter((r) => r.items.some((i) => i.amount > 0n));
    },
  });

  let units = 0n;
  try {
    if (amount && meta) units = toUnits(amount, meta.decimals);
  } catch {
    units = 0n;
  }

  return (
    <Panel title="Bribes">
      <Field id="bribe-pool" label="Gauge">
        <select
          id="bribe-pool"
          className={inputClass}
          value={pool}
          onChange={(e) => setPool(e.target.value)}
        >
          <option value="">Select gauge</option>
          {(gaugePools ?? []).map((g) => (
            <option key={g} value={g}>
              {g.slice(0, 10)}…
            </option>
          ))}
        </select>
      </Field>
      {pool && pools && (
        <p className="-mt-2 mb-3 text-xs text-muted">
          {(() => {
            const p = pools.find((x) => x.address === pool);
            return p ? <PairLabel x={p.tokenX} y={p.tokenY} /> : null;
          })()}
        </p>
      )}
      <Field id="bribe-token" label="Reward token">
        <TokenSelect
          id="bribe-token"
          tokens={(tokens ?? []).map((t) => t.address)}
          value={token}
          onChange={setToken}
        />
      </Field>
      <Field id="bribe-amount" label="Amount">
        <input
          id="bribe-amount"
          className={inputClass}
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>
      <ActionButton
        disabled={!user || !pool || !token || units === 0n || add.state.status === "pending"}
        onClick={() => add.submit("bribe", "add_bribe", [pool, token, units.toString()])}
      >
        Add bribe for epoch {epoch}
      </ActionButton>
      <TxStatus state={add.state} />

      <h3 className="mb-2 mt-6 text-sm font-semibold text-fg">
        Your claimable (epoch {epoch - 1})
      </h3>
      {!claimable?.length && <p className="text-sm text-subtle">Nothing to claim.</p>}
      {claimable?.map((c) => (
        <div key={c.pool} className="mb-2 flex items-center justify-between gap-2 text-sm">
          <span className="text-fg">
            {c.items.map((i) => (
              <span key={i.token} className="mr-2">
                <TokenAmount address={i.token} amount={i.amount} />
              </span>
            ))}
          </span>
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1 text-fg hover:bg-surface-2"
            onClick={() => claim.submit("bribe", "claim_bribes", [c.pool, c.epoch])}
          >
            Claim
          </button>
        </div>
      ))}
      <TxStatus state={claim.state} />
    </Panel>
  );
}

export default function GovernancePage() {
  const { data: config } = useForgeConfig();
  const { data: epoch } = useEpoch();
  const distribute = useTx();
  const { data: totalLocked } = useQuery({
    queryKey: ["total-locked"],
    queryFn: async () => BigInt((await view<[string]>("voting_escrow", "total_locked"))[0]),
  });
  const pending = epoch ? epoch.current - epoch.nextToDistribute : 0;
  const epochEnd = epoch ? (epoch.current + 1) * WEEK : 0;

  return (
    <Page
      title="Governance"
      subtitle="Lock DYNA for veDYNA, direct weekly emissions to gauges, earn bribes"
    >
      {!configured && <Notice>Contract address not configured.</Notice>}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Epoch" value={epoch?.current ?? "—"} />
        <Stat label="Epoch ends in" value={epoch ? timeLeft(epochEnd) : "—"} />
        <Stat
          label="Total locked"
          value={
            config && totalLocked !== undefined ? (
              <TokenAmount address={config.dyna} amount={totalLocked} />
            ) : (
              "—"
            )
          }
        />
        <Stat label="Undistributed epochs" value={pending} />
      </div>
      {pending > 0 && (
        <div className="mb-6 max-w-sm">
          <ActionButton
            variant="ghost"
            onClick={() => distribute.submit("voter", "distribute", [])}
          >
            Distribute emissions
          </ActionButton>
          <TxStatus state={distribute.state} />
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {config && <LockPanel dyna={config.dyna} />}
        {epoch && <VotePanel epoch={epoch.current} />}
        {epoch && <BribePanel epoch={epoch.current} />}
      </div>
    </Page>
  );
}
