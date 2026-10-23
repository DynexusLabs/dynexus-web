import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const title = "Governance";
const description =
  "Lock DYNA for veDYNA voting power, direct gauge emissions, and claim bribes and rewards on Dynexus.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/governance" });

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
