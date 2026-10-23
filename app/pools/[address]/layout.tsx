import type { Metadata } from "next";
import { shortAddr } from "@/lib/format";
import { pageMetadata } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}): Promise<Metadata> {
  const { address } = await params;
  const title = `Pool ${shortAddr(address)}`;
  const description = `Reserves, price history, recent swaps and liquidity actions for Dynexus pool ${address} on Aptos.`;
  return pageMetadata({ title, description, path: `/pools/${address}` });
}

export default function PoolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
