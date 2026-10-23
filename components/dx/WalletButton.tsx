"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  ArrowPathIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNetworkSwitch } from "@/hooks/useNetworkSwitch";
import { EXPLORER_ACCOUNT, NETWORK_LABEL } from "@/lib/config";
import { shortAddr } from "@/lib/format";

const menuItem =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-fg hover:bg-surface-2";

/** Closes a popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export default function WalletButton() {
  const { connected, account, wallet, network, wallets, notDetectedWallets, connect, disconnect } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss(open, close);
  const address = account?.address.toString();
  const { wrongNetwork, canSwitch, switching, switchNetwork } = useNetworkSwitch();

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the address stays visible.
    }
  };

  return (
    <div ref={ref} className="relative">
      {connected ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2 ${
            wrongNetwork ? "border-danger/50" : "border-line-strong"
          }`}
        >
          {wallet?.icon ? (
            // biome-ignore lint/performance/noImgElement: wallet icons are data URIs
            <img src={wallet.icon} alt="" className="h-4 w-4" />
          ) : (
            <WalletIcon className="h-4 w-4" />
          )}
          <span className="font-mono">{shortAddr(address)}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-xl bg-accent-strong px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-strong/20 transition-colors hover:bg-accent"
        >
          <WalletIcon className="h-4 w-4" aria-hidden="true" />
          Connect
        </button>
      )}

      {open && connected && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/50"
        >
          <div className="px-3 pb-2 pt-1">
            <p className="text-xs text-subtle">
              {wallet?.name} · {network?.name ?? NETWORK_LABEL}
            </p>
            <p className="mt-0.5 break-all font-mono text-xs text-muted">{address}</p>
          </div>
          {wrongNetwork && canSwitch && (
            <button
              type="button"
              role="menuitem"
              onClick={switchNetwork}
              disabled={switching}
              className={`${menuItem} text-danger disabled:opacity-60`}
            >
              <ArrowPathIcon className="h-4 w-4" />
              {switching ? "Check your wallet…" : `Switch to ${NETWORK_LABEL}`}
            </button>
          )}
          <button type="button" role="menuitem" onClick={copy} className={menuItem}>
            {copied ? (
              <CheckIcon className="h-4 w-4 text-success" />
            ) : (
              <DocumentDuplicateIcon className="h-4 w-4 text-muted" />
            )}
            {copied ? "Copied" : "Copy address"}
          </button>
          {address && (
            <a
              role="menuitem"
              href={EXPLORER_ACCOUNT(address)}
              target="_blank"
              rel="noopener noreferrer"
              className={menuItem}
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-muted" />
              View on explorer
            </a>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              disconnect();
            }}
            className={`${menuItem} text-danger`}
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      )}

      {open && !connected && (
        <div
          role="dialog"
          aria-label="Connect a wallet"
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/50"
        >
          <p className="px-3 pb-2 pt-1 text-xs text-subtle">
            Connect an Aptos wallet on {NETWORK_LABEL}
          </p>
          {wallets.map((w) => (
            <button
              type="button"
              key={w.name}
              onClick={() => {
                connect(w.name);
                setOpen(false);
              }}
              className={menuItem}
            >
              {/* biome-ignore lint/performance/noImgElement: wallet icons are data URIs */}
              <img src={w.icon} alt="" className="h-6 w-6 rounded-md" />
              <span className="flex-1">{w.name}</span>
              <span className="text-xs text-success">Detected</span>
            </button>
          ))}
          {notDetectedWallets.map((w) => (
            <a
              key={w.name}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${menuItem} text-muted`}
            >
              {/* biome-ignore lint/performance/noImgElement: wallet icons are data URIs */}
              <img src={w.icon} alt="" className="h-6 w-6 rounded-md opacity-60" />
              <span className="flex-1">{w.name}</span>
              <span className="text-xs text-subtle">Install</span>
            </a>
          ))}
          {wallets.length === 0 && notDetectedWallets.length === 0 && (
            <p className="px-3 py-2 text-sm text-subtle">No Aptos wallets found</p>
          )}
        </div>
      )}
    </div>
  );
}
