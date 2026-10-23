import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const title = "Tokens";
const description = "Browse every fungible asset launched with Dynexus Forge on Aptos.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/tokens" });

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return children;
}
