"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";
import { NETWORK_LABEL } from "@/lib/config";

/** Blocks confusion before a transaction: the wallet must be on the network the app reads from. */
export default function NetworkBanner() {
  const { wallet } = useWallet();
  const { wrongNetwork, walletNetwork, canSwitch, switching, error, switchNetwork } =
    useNetworkSwitch();
  if (!wrongNetwork) return null;
  return (
    <div role="alert" className="border-b border-danger/30 bg-danger/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 text-sm text-danger sm:px-6">
        <ExclamationTriangleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          Your wallet is on {walletNetwork}. Switch it to {NETWORK_LABEL} to use Dynexus.
          {!canSwitch && ` Change the network in ${wallet?.name ?? "your wallet"}'s settings.`}
          {error && <span className="block text-xs opacity-80">{error}</span>}
        </p>
        {canSwitch && (
          <button
            type="button"
            onClick={switchNetwork}
            disabled={switching}
            className="rounded-lg border border-danger/40 bg-danger/15 px-3 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger/25 disabled:opacity-60"
          >
            {switching ? "Check your wallet…" : `Switch to ${NETWORK_LABEL}`}
          </button>
        )}
      </div>
    </div>
  );
}
