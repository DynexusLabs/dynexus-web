"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import WalletButton from "@/components/dx/WalletButton";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Tokens", href: "/tokens" },
  { name: "Create", href: "/create-token" },
  { name: "Swap", href: "/swap" },
  { name: "Pools", href: "/pools" },
  { name: "Governance", href: "/governance" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="relative z-40 w-full border-b-2 border-cyan-400/30 bg-black px-4 py-4 shadow-[0_0_32px_#00d9ff80] md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#00d9ff] shadow-[0_0_8px_#00d9ff80]">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="bg-gradient-to-r from-[#7f5af0] via-[#00d9ff] to-[#ff6bcb] bg-clip-text text-xl font-bold uppercase tracking-widest text-transparent">
            Dynexus
          </span>
        </Link>

        <div className="hidden items-center space-x-2 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive(item.href)
                  ? "bg-cyan-400/15 text-cyan-200"
                  : "text-cyan-400 hover:bg-cyan-400/10"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <WalletButton />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-cyan-400 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col space-y-1 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded px-3 py-2 text-sm font-semibold uppercase text-cyan-400 hover:bg-cyan-400/10"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
