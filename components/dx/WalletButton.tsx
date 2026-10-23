"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { NETWORK } from "@/lib/config";
import { shortAddr } from "@/lib/format";

export default function WalletButton() {
  const { connected, account, network, wallets, notDetectedWallets, connect, disconnect } =
    useWallet();
  const [open, setOpen] = useState(false);
  const wrongNetwork =
    connected && network && network.name.toLowerCase() !== String(NETWORK).toLowerCase();

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <span className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">
            Switch wallet to {NETWORK}
          </span>
        )}
        <button
          type="button"
          onClick={disconnect}
          title="Disconnect"
          className="flex items-center gap-2 rounded-lg border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10"
        >
          <WalletIcon className="h-4 w-4" />
          {shortAddr(account?.address.toString())}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-bold uppercase text-black"
      >
        <WalletIcon className="h-4 w-4" />
        Connect
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-cyan-400/40 bg-gray-950 p-2 shadow-xl">
          {wallets.map((w) => (
            <button
              type="button"
              key={w.name}
              onClick={() => {
                connect(w.name);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-cyan-200 hover:bg-cyan-400/10"
            >
              {/* biome-ignore lint/performance/noImgElement: wallet icons are data URIs */}
              <img src={w.icon} alt="" className="h-5 w-5" />
              {w.name}
            </button>
          ))}
          {notDetectedWallets.map((w) => (
            <a
              key={w.name}
              href={w.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded px-3 py-2 text-sm text-cyan-500/60 hover:bg-cyan-400/10"
            >
              {/* biome-ignore lint/performance/noImgElement: wallet icons are data URIs */}
              <img src={w.icon} alt="" className="h-5 w-5 opacity-60" />
              Install {w.name}
            </a>
          ))}
          {wallets.length === 0 && notDetectedWallets.length === 0 && (
            <p className="px-3 py-2 text-sm text-cyan-400/60">No Aptos wallets found</p>
          )}
        </div>
      )}
    </div>
  );
}
