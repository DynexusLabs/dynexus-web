import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const title = "Swap";
const description =
  "Swap Aptos fungible assets on the Dynexus constant-product AMM, with automatic routing through DYNA when no direct pool exists.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/swap" });

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
