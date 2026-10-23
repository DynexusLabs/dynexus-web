"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { APTOS_API_KEY, NETWORK } from "@/lib/config";

const WalletProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: 1 } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect={true}
        optInWallets={["Petra", "Nightly", "OKX Wallet"]}
        disableTelemetry={true}
        dappConfig={{
          network: NETWORK,
          aptosApiKeys: APTOS_API_KEY ? { [NETWORK]: APTOS_API_KEY } : undefined,
        }}
        onError={(error) => {
          console.error("wallet error", error);
        }}
      >
        {children}
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
};

export default WalletProvider;
