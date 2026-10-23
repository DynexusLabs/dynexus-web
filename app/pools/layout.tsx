import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const title = "Liquidity pools";
const description =
  "Create Dynexus liquidity pools, add or remove liquidity, and earn swap fees on Aptos.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/pools" });

export default function PoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
