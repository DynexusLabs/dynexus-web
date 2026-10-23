"use client";
import { useMetadata } from "@/hooks/useDynexus";
import { fromUnits, shortAddr } from "@/lib/format";

export function TokenSymbol({ address }: { address: string }) {
  const { data } = useMetadata(address);
  return <span title={address}>{data?.symbol ?? shortAddr(address)}</span>;
}

export function TokenAmount({ address, amount }: { address: string; amount: bigint | string }) {
  const { data } = useMetadata(address);
  if (!data) return <span>…</span>;
  return (
    <span>
      {fromUnits(amount, data.decimals)} {data.symbol}
    </span>
  );
}

export function PairLabel({ x, y }: { x: string; y: string }) {
  return (
    <span>
      <TokenSymbol address={x} /> / <TokenSymbol address={y} />
    </span>
  );
}
