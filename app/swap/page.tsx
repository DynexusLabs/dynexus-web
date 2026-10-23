"use client";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { TokenAmount, TokenSymbol } from "@/components/dx/Token";
import TokenSelect from "@/components/dx/TokenSelect";
import { ActionButton, Field, inputClass, Notice, Page, Panel, TxStatus } from "@/components/dx/ui";
import {
  configured,
  useAccountAddress,
  useBalance,
  useForgeConfig,
  useMetadata,
  usePools,
} from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { view } from "@/lib/aptos";
import { applySlippage, toUnits } from "@/lib/format";

const SLIPPAGES = [10, 50, 100, 300]; // bps

function useDebounced<T>(value: T, ms = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function SwapForm() {
  const params = useSearchParams();
  const user = useAccountAddress();
  const { data: pools } = usePools();
  const { data: config } = useForgeConfig();
  const [tokenIn, setTokenIn] = useState(params.get("in") ?? "");
  const [tokenOut, setTokenOut] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(50);
  const { submit, state } = useTx();

  const tokens = useMemo(
    () => [...new Set((pools ?? []).flatMap((p) => [p.tokenX, p.tokenY]))],
    [pools],
  );
  const { data: metaIn } = useMetadata(tokenIn || undefined);
  const { data: balIn } = useBalance(tokenIn || undefined);

  /** Direct pool if it exists, else a 2-hop route through DYNA. */
  const path = useMemo(() => {
    if (!tokenIn || !tokenOut || tokenIn === tokenOut || !pools) return null;
    const has = (a: string, b: string) =>
      pools.some((p) => (p.tokenX === a && p.tokenY === b) || (p.tokenX === b && p.tokenY === a));
    if (has(tokenIn, tokenOut)) return [tokenIn, tokenOut];
    const hub = config?.dyna;
    if (hub && hub !== tokenIn && hub !== tokenOut && has(tokenIn, hub) && has(hub, tokenOut)) {
      return [tokenIn, hub, tokenOut];
    }
    return null;
  }, [tokenIn, tokenOut, pools, config]);

  let amountUnits = 0n;
  let inputError = "";
  try {
    if (amount && metaIn) amountUnits = toUnits(amount, metaIn.decimals);
  } catch (e) {
    inputError = (e as Error).message;
  }
  const debouncedUnits = useDebounced(amountUnits);

  const quote = useQuery({
    queryKey: ["quote", path, debouncedUnits.toString()],
    enabled: !!path && debouncedUnits > 0n,
    queryFn: async () => {
      const [out] = await view<[string]>("dex", "quote_route", [path, debouncedUnits.toString()]);
      return BigInt(out);
    },
    retry: false,
  });

  const minOut = quote.data ? applySlippage(quote.data, slippage) : 0n;
  const insufficient = balIn !== undefined && amountUnits > balIn;

  const onSwap = () => {
    if (!path) return;
    const deadline = Math.floor(Date.now() / 1000) + 300;
    if (path.length === 2) {
      submit("dex", "swap", [
        path[0],
        path[1],
        amountUnits.toString(),
        minOut.toString(),
        deadline,
      ]);
    } else {
      submit("dex", "swap_exact_in_route", [
        path,
        amountUnits.toString(),
        minOut.toString(),
        deadline,
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Panel>
        <Field
          id="tokenIn"
          label="From"
          hint={
            tokenIn && balIn !== undefined ? (
              <>
                Balance: <TokenAmount address={tokenIn} amount={balIn} />
              </>
            ) : undefined
          }
        >
          <TokenSelect id="tokenIn" tokens={tokens} value={tokenIn} onChange={setTokenIn} />
        </Field>
        <Field id="amount" label="Amount">
          <input
            id="amount"
            className={inputClass}
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>
        <div className="my-2 flex justify-center">
          <button
            type="button"
            aria-label="Flip tokens"
            onClick={() => {
              setTokenIn(tokenOut);
              setTokenOut(tokenIn);
            }}
            className="rounded-full border border-cyan-400/40 p-2 text-cyan-300 hover:bg-cyan-400/10"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
          </button>
        </div>
        <Field id="tokenOut" label="To">
          <TokenSelect id="tokenOut" tokens={tokens} value={tokenOut} onChange={setTokenOut} />
        </Field>

        <div className="mb-4 flex items-center gap-2 text-xs text-cyan-400/70">
          Slippage
          {SLIPPAGES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSlippage(s)}
              className={`rounded px-2 py-1 ${slippage === s ? "bg-cyan-400/20 text-cyan-200" : "hover:bg-cyan-400/10"}`}
            >
              {s / 100}%
            </button>
          ))}
        </div>

        <div className="mb-4 space-y-1 rounded-lg bg-black/40 p-3 text-sm">
          {tokenIn && tokenOut && !path && (
            <p className="text-red-400">No pool or DYNA route for this pair</p>
          )}
          {path && path.length === 3 && (
            <p className="text-cyan-400/70">
              Route: <TokenSymbol address={path[0]} /> → <TokenSymbol address={path[1]} /> →{" "}
              <TokenSymbol address={path[2]} />
            </p>
          )}
          {quote.isFetching && <p className="text-cyan-400/60">Quoting…</p>}
          {quote.error && (
            <p className="text-red-400">Quote failed (input may exceed 10% of pool reserves)</p>
          )}
          {quote.data !== undefined && tokenOut && (
            <>
              <p className="text-cyan-200">
                You receive ≈ <TokenAmount address={tokenOut} amount={quote.data} />
              </p>
              <p className="text-cyan-400/60">
                Minimum after slippage: <TokenAmount address={tokenOut} amount={minOut} />
              </p>
            </>
          )}
        </div>

        <ActionButton
          disabled={
            !user ||
            !path ||
            amountUnits === 0n ||
            !!inputError ||
            insufficient ||
            !quote.data ||
            state.status === "pending"
          }
          onClick={onSwap}
        >
          {!user
            ? "Connect wallet"
            : insufficient
              ? "Insufficient balance"
              : state.status === "pending"
                ? "Swapping…"
                : "Swap"}
        </ActionButton>
        {inputError && <p className="mt-3 text-sm text-red-400">{inputError}</p>}
        <TxStatus state={state} />
      </Panel>
    </div>
  );
}

export default function SwapPage() {
  return (
    <Page
      title="Swap"
      subtitle="Constant-product AMM · routes through DYNA when no direct pool exists"
    >
      {!configured && <Notice>Contract address not configured.</Notice>}
      <Suspense>
        <SwapForm />
      </Suspense>
    </Page>
  );
}
