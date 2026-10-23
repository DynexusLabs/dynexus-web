"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";

interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  totalSupply: string;
  decimals: number;
  logoUrl?: string;
  createdAt: string;
  creator: string;
  isOwned: boolean;
  holders: number;
  volume24h: string;
  marketCap: string;
}

// Mock data for demonstration
const mockTokens: Token[] = [
  {
    id: "1",
    name: "My Awesome Token",
    symbol: "MAT",
    description: "A revolutionary token for the future of DeFi",
    totalSupply: "1000000",
    decimals: 8,
    logoUrl: "",
    createdAt: "2024-01-15",
    creator: "0x1234...5678",
    isOwned: true,
    holders: 150,
    volume24h: "12,500",
    marketCap: "500,000",
  },
  {
    id: "2",
    name: "DeFi Utility Token",
    symbol: "DUT",
    description: "Utility token for cross-chain DeFi operations",
    totalSupply: "5000000",
    decimals: 18,
    logoUrl: "",
    createdAt: "2024-01-10",
    creator: "0xabcd...efgh",
    isOwned: false,
    holders: 89,
    volume24h: "8,750",
    marketCap: "250,000",
  },
  {
    id: "3",
    name: "GameFi Coin",
    symbol: "GFC",
    description: "Gaming ecosystem token with NFT integration",
    totalSupply: "10000000",
    decimals: 9,
    logoUrl: "",
    createdAt: "2024-01-08",
    creator: "0x9876...4321",
    isOwned: true,
    holders: 230,
    volume24h: "25,400",
    marketCap: "1,200,000",
  },
];

const SKELETON_CARDS = ["s1", "s2", "s3", "s4", "s5", "s6"];
const SKELETON_STATS = ["supply", "holders", "volume", "mcap"];

const TokenCard = ({ token }: { token: Token }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="token-card"
  >
    <Card className="p-6 h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {token.logoUrl ? (
              // biome-ignore lint/performance/noImgElement: logo URLs are arbitrary user-supplied hosts
              <img src={token.logoUrl} alt={token.name} className="w-12 h-12 rounded-xl" />
            ) : (
              token.symbol.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{token.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{token.symbol}</p>
          </div>
        </div>

        {token.isOwned && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            Owned
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {token.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Supply</div>
          <div className="font-semibold">{parseInt(token.totalSupply, 10).toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Holders</div>
          <div className="font-semibold">{token.holders}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Volume</div>
          <div className="font-semibold">${token.volume24h}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
          <div className="font-semibold">${token.marketCap}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          {new Date(token.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          <UsersIcon className="w-4 h-4 mr-1" />
          {token.creator.slice(0, 6)}...{token.creator.slice(-4)}
        </span>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <EyeIcon className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ChartBarIcon className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        {token.isOwned && (
          <Button variant="ghost" size="sm">
            <PencilSquareIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {SKELETON_CARDS.map((id) => (
      <Card key={id} className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16" />
            </div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            {SKELETON_STATS.map((id) => (
              <div key={id} className="h-16 bg-gray-300 dark:bg-gray-600 rounded" />
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1" />
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default function TokensPage() {
  const { connected, account } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "owned" | "created">("all");

  useEffect(() => {
    // Simulate loading tokens
    setTimeout(() => {
      setTokens(mockTokens);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "owned" && token.isOwned) ||
      (filter === "created" && token.creator === account?.address?.toString());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Token Explorer
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover and manage fungible tokens on Dynexus
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/forge/create-token">
                <Button>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Token
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "owned" | "created")}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-4 pr-10 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="all">All Tokens</option>
                <option value="owned">My Tokens</option>
                <option value="created">Created by Me</option>
              </select>
              <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Total: {tokens.length}</span>
              <span>•</span>
              <span>Filtered: {filteredTokens.length}</span>
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredTokens.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              No tokens found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `No tokens match your search "${searchTerm}". Try adjusting your search terms.`
                : "No tokens match your current filter. Try selecting a different filter option."}
            </p>
            {!connected && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Connect your wallet to view your tokens
              </p>
            )}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </Button>
              <Link href="/forge/create-token">
                <Button>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create New Token
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TokenCard token={token} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {!loading && filteredTokens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Tokens
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
