"use client";
import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";

// Enhanced animated components
const LiveChart = ({ height = 40 }) => {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const generateData = () => {
      return Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: Math.random() * height,
      }));
    };

    setData(generateData());
    const interval = setInterval(() => {
      setData(generateData());
    }, 2000);

    return () => clearInterval(interval);
  }, [height]);

  const pathData = data
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x * 4} ${height - point.y}`)
    .join(" ");

  return (
    <svg width="80" height={height} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="drop-shadow-[0_0_4px_#00ffff]"
      />
      {data.map((point) => (
        <circle
          key={point.x}
          cx={point.x * 4}
          cy={height - point.y}
          r="1.5"
          fill="#00ffff"
          className="animate-pulse"
        />
      ))}
    </svg>
  );
};

type StatCardProps = { title: string; value: string; color: string; icon: string };

const StatCard = ({ title, value, color, icon }: StatCardProps) => (
  <div className="relative group">
    <div
      className={`absolute inset-0 bg-gradient-to-r from-${color}-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500`}
    ></div>
    <div
      className={`relative border border-${color}-400/50 bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 hover:border-${color}-400 transition-all duration-300 group-hover:scale-105`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <span className={`text-sm uppercase tracking-widest text-${color}-400/70`}>{title}</span>
        </div>
        <span className={`text-4xl font-bold text-${color}-400`}>{value}</span>
        <div className="w-full h-12 flex items-end justify-center">
          <LiveChart height={40} />
        </div>
      </div>
      <div
        className={`absolute top-2 right-2 w-2 h-2 bg-${color}-400 rounded-full animate-ping`}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-lg pointer-events-none"></div>
    </div>
  </div>
);

export default function Home() {
  const [activePool, _setActivePool] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const poolData = [
    {
      pair: "USDC/WETH",
      tvl: "$123.45M",
      apy: "12.4%",
      icons: ["U", "E"],
      colors: ["bg-blue-500", "bg-purple-500"],
      change: "+2.3%",
    },
    {
      pair: "APT/BTC",
      tvl: "804M",
      apy: "567%",
      icons: ["A", "B"],
      colors: ["bg-orange-500", "bg-yellow-500"],
      change: "+15.7%",
    },
    {
      pair: "DAI/SOL",
      tvl: "$567,360",
      apy: "642.791",
      icons: ["D", "S"],
      colors: ["bg-green-500", "bg-indigo-500"],
      change: "-0.8%",
    },
    {
      pair: "MOVE/USDT",
      tvl: "$15.34M",
      apy: "0.063T",
      icons: ["M", "U"],
      colors: ["bg-red-500", "bg-teal-500"],
      change: "+8.9%",
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative w-full py-24 flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"></div>

        {/* Hexagonal border decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-96 h-96 border border-cyan-400/20 rotate-12 transform scale-150"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          ></div>
        </div>

        <h1 className="relative text-7xl font-bold uppercase tracking-widest text-cyan-400 mb-6 z-10">
          <span
            className="inline-block hover:scale-105 transition-transform duration-300"
            style={{
              textShadow: "0 0 2px #00ffff",
            }}
          >
            Deploy. Liquify. Dominate.
          </span>
        </h1>
        <p className="relative text-2xl text-cyan-300/90 font-light tracking-wide mb-8 text-center max-w-2xl z-10">
          A next-gen DeFi protocol engineered for the Aptos Blockchain
        </p>

        {/* Status indicator */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Protocol Online</span>
          </div>
          <div className="w-px h-4 bg-cyan-400/30"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <span className="text-cyan-400">Real-time Data</span>
          </div>
        </div>

        {/* Animated cross lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
        </div>
      </section>

      {/* Enhanced Stats Grid */}
      <section className="relative w-full max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="TVL" value="$123.45M" color="cyan" icon="💎" />
          <StatCard title="Pools" value="84" color="teal" icon="🌊" />
          <StatCard title="Emissions" value="$567,890" color="green" icon="⚡" />
        </div>
      </section>

      {/* Enhanced Action Buttons */}
      <section className="relative w-full max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Pools", icon: "🌊", desc: "Liquidity" },
            { name: "Create", icon: "⚡", desc: "New Pool" },
            { name: "Gauge", icon: "📊", desc: "Voting" },
            { name: "Lock", icon: "🔒", desc: "Stake" },
          ].map((action, _index) => (
            <button type="button" key={action.name} className="relative group">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative border border-cyan-400/30 bg-gray-900/70 backdrop-blur-sm rounded-xl px-6 py-6 hover:border-cyan-400 hover:bg-gray-800/80 transition-all duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-cyan-400 font-medium uppercase tracking-wide text-lg">
                    {action.name}
                  </span>
                  <span className="text-cyan-400/60 text-xs">{action.desc}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Enhanced Connect Wallet */}
      <section className="relative w-full max-w-xl mx-auto px-4 py-8">
        <button
          type="button"
          className="relative group w-full"
          onClick={() => setWalletConnected(!walletConnected)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
          <div className="relative bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold py-5 px-8 rounded-xl hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 uppercase tracking-wide flex items-center justify-center space-x-3">
            <span className="text-xl">{walletConnected ? "🔗" : "🚀"}</span>
            <span>{walletConnected ? "Wallet Connected" : "Connect Wallet"}</span>
          </div>
        </button>
      </section>

      {/* Enhanced Token Pools Table */}
      <section className="relative w-full max-w-6xl mx-auto px-4 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gray-900/40 rounded-2xl blur-2xl"></div>
          <div className="relative border border-cyan-400/30 bg-gray-900/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold uppercase tracking-wide text-cyan-400">/pools</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-sm border border-cyan-400/50 px-4 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                >
                  / pos
                </button>
                <button
                  type="button"
                  className="text-sm bg-cyan-400/20 px-4 py-2 rounded-lg text-cyan-400 hover:bg-cyan-400/30 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-400/20">
                    <th className="text-left py-4 text-sm text-cyan-400/70 uppercase tracking-wider">
                      Pool
                    </th>
                    <th className="text-right py-4 text-sm text-cyan-400/70 uppercase tracking-wider">
                      TVL
                    </th>
                    <th className="text-right py-4 text-sm text-cyan-400/70 uppercase tracking-wider">
                      APY
                    </th>
                    <th className="text-right py-4 text-sm text-cyan-400/70 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="text-center py-4 text-sm text-cyan-400/70 uppercase tracking-wider">
                      Chart
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-400/10">
                  {poolData.map((pool, index) => (
                    <tr
                      key={pool.pair}
                      className={`hover:bg-cyan-400/5 transition-all duration-300 group cursor-pointer ${
                        activePool === index ? "bg-cyan-400/10" : ""
                      }`}
                      onClick={
                        () => {}
                        // setActivePool(activePool === index ? null : index)
                      }
                    >
                      <td className="py-6 flex items-center space-x-4">
                        <div className="flex -space-x-2">
                          <div
                            className={`w-10 h-10 ${pool.colors[0]} rounded-full border-2 border-gray-900 flex items-center justify-center text-sm text-white font-bold shadow-lg`}
                          >
                            {pool.icons[0]}
                          </div>
                          <div
                            className={`w-10 h-10 ${pool.colors[1]} rounded-full border-2 border-gray-900 flex items-center justify-center text-sm text-white font-bold shadow-lg`}
                          >
                            {pool.icons[1]}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-cyan-400 text-lg">{pool.pair}</span>
                          <span className="text-cyan-400/50 text-xs">Liquidity Pool</span>
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <span className="text-cyan-400 font-bold text-lg">{pool.tvl}</span>
                      </td>
                      <td className="py-6 text-right">
                        <span className="text-green-400 font-bold text-lg">{pool.apy}</span>
                      </td>
                      <td className="py-6 text-right">
                        <span
                          className={`font-bold ${
                            pool.change.startsWith("+") ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {pool.change}
                        </span>
                      </td>
                      <td className="py-6 text-center">
                        <div className="flex justify-center">
                          <LiveChart height={30} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activePool !== null && (
              <div className="mt-6 p-4 border border-cyan-400/30 rounded-lg bg-cyan-400/5">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">
                    Selected: {poolData[activePool].pair}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg hover:bg-cyan-400/30 transition-colors"
                    >
                      Add Liquidity
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-400/20 text-green-400 rounded-lg hover:bg-green-400/30 transition-colors"
                    >
                      Stake
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
