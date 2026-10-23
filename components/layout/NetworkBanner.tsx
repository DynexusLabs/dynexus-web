"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { NETWORK, NETWORK_LABEL } from "@/lib/config";

/** Blocks confusion before a transaction: the wallet must be on the network the app reads from. */
export default function NetworkBanner() {
  const { connected, network } = useWallet();
  const wrongNetwork =
    connected && network && network.name.toLowerCase() !== String(NETWORK).toLowerCase();
  if (!wrongNetwork) return null;
  return (
    <div role="alert" className="border-b border-danger/30 bg-danger/10">
      <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 text-sm text-danger sm:px-6">
        <ExclamationTriangleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        Your wallet is on {network?.name}. Switch it to {NETWORK_LABEL} to use Dynexus.
      </p>
    </div>
  );
}
