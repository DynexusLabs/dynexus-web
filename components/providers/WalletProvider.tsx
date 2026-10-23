"use client";

import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import type { PropsWithChildren } from "react";

const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      optInWallets={["Petra"]}
      disableTelemetry={true}
      dappConfig={{
        network: Network.DEVNET,
        aptosApiKeys: {
          devnet: process.env.NEXT_PUBLIC_APTOS_DEVNET_API_KEY || "",
        },
      }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletProvider;
