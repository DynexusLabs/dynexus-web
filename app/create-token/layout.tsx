import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const title = "Create a token";
const description =
  "Launch an Aptos fungible asset with Dynexus Forge: name, symbol, supply and logo in a single transaction.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/create-token" });

export default function CreateTokenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
