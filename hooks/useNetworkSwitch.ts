"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { NETWORK, NETWORK_LABEL } from "@/lib/config";

/** Wallet/app network mismatch, plus an in-wallet switch when the wallet supports aptos:changeNetwork. */
export function useNetworkSwitch() {
  const { connected, network, wallet, changeNetwork } = useWallet();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string>();

  const wrongNetwork =
    connected && !!network && network.name.toLowerCase() !== String(NETWORK).toLowerCase();
  const canSwitch = !!wallet?.features?.["aptos:changeNetwork"];

  async function switchNetwork() {
    setSwitching(true);
    setError(undefined);
    const manual = `Switch to ${NETWORK_LABEL} in ${wallet?.name ?? "your wallet"}'s settings.`;
    try {
      // A wallet can approve the request yet refuse the switch: it resolves with success: false.
      const res = await changeNetwork(NETWORK);
      if (!res.success) throw new Error(res.reason ? `${res.reason}. ${manual}` : manual);
      const actual = await wallet?.features["aptos:network"]?.network();
      if (actual && actual.name.toLowerCase() !== String(NETWORK).toLowerCase())
        throw new Error(`${wallet?.name} stayed on ${actual.name}. ${manual}`);
    } catch (e) {
      // The adapter rethrows plain strings, not Error instances.
      const msg = e instanceof Error ? e.message : String(e);
      setError(/reject/i.test(msg) ? "Network switch rejected in wallet" : msg);
    } finally {
      setSwitching(false);
    }
  }

  return { wrongNetwork, walletNetwork: network?.name, canSwitch, switching, error, switchNetwork };
}
