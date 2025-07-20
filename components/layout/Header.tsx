"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Forge", href: "/forge" },
  { name: "Pools", href: "/pools" },
  { name: "Swap", href: "/swap" },
  { name: "Tokenomics", href: "/tokenomics" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { connect, disconnect, connected, account, wallet } = useWallet();

  const handleWalletAction = (walletName: string) => {
    if (connected) {
      disconnect();
    } else {
      connect(walletName);
    }
  };

  return (
    <header className="w-full py-6 px-8 bg-black border-b-2 border-cyan-400/30 shadow-[0_0_32px_#00d9ff80]">
      <nav className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#00d9ff] shadow-[0_0_8px_#00d9ff80]">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#7f5af0] via-[#00d9ff] to-[#ff6bcb] bg-clip-text text-transparent drop-shadow-[0_0_8px_#00d9ff] gradient-text">
            Dynexus
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-semibold uppercase tracking-wide text-cyan-400 hover:text-[#7f5af0] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#00d9ff]/10"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-cyan-400 hover:text-[#7f5af0] transition-colors"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Wallet connection */}
          <Button
            size="sm"
            onClick={() => handleWalletAction(wallet?.name || "Petra")}
            className="hidden md:flex bg-gradient-to-r from-[#7f5af0] to-[#00d9ff] text-black border-2 border-[#00d9ff] shadow-lg hover:shadow-[0_0_32px_#00d9ff80] hover:border-[#ff6bcb] transition-all duration-300"
          >
            <WalletIcon className="h-4 w-4 mr-2" />
            {connected
              ? `${account?.address
                  ?.toString()
                  ?.slice(0, 6)}...${account?.address?.toString().slice(-4)}`
              : "Connect Wallet"}
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-cyan-400 hover:text-[#7f5af0]"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden py-4 border-t border-cyan-400/30 bg-black"
        >
          <div className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-semibold uppercase tracking-wide text-cyan-400 hover:text-[#7f5af0] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#00d9ff]/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              size="sm"
              onClick={() => handleWalletAction(wallet?.name || "Petra")}
              className="w-full bg-gradient-to-r from-[#7f5af0] to-[#00d9ff] text-black border-2 border-[#00d9ff] shadow-lg hover:shadow-[0_0_32px_#00d9ff80] hover:border-[#ff6bcb] transition-all duration-300"
            >
              <WalletIcon className="h-4 w-4 mr-2" />
              {connected
                ? `${account?.address
                    ?.toString()
                    ?.slice(0, 6)}...${account?.address?.toString().slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
