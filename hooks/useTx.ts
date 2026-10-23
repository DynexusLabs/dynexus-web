"use client";
import type { InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { aptos } from "@/lib/aptos";
import { fn } from "@/lib/config";

export type TxState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; hash: string }
  | { status: "error"; message: string };

/** Move abort messages look like "...Move abort in 0x..::dex: E_INSUFFICIENT_OUTPUT_AMOUNT(0xb)..." */
function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const abort = msg.match(/::(\w+): (E_[A-Z_]+)/);
  if (abort)
    return `${abort[1]}: ${abort[2].replace(/^E_/, "").replaceAll("_", " ").toLowerCase()}`;
  if (/reject/i.test(msg)) return "Transaction rejected in wallet";
  return msg.length > 160 ? `${msg.slice(0, 160)}…` : msg;
}

/** Sign, submit and confirm a DYNEXUS entry function; refreshes all queries on success. */
export function useTx() {
  const { signAndSubmitTransaction, connected } = useWallet();
  const queryClient = useQueryClient();
  const [state, setState] = useState<TxState>({ status: "idle" });

  async function submit(
    module: string,
    name: string,
    args: InputEntryFunctionData["functionArguments"],
  ): Promise<boolean> {
    if (!connected) {
      setState({ status: "error", message: "Connect a wallet first" });
      return false;
    }
    setState({ status: "pending" });
    try {
      const res = await signAndSubmitTransaction({
        data: { function: fn(module, name), functionArguments: args },
      });
      const done = await aptos.waitForTransaction({ transactionHash: res.hash });
      if (!done.success) throw new Error(done.vm_status);
      setState({ status: "success", hash: res.hash });
      await queryClient.invalidateQueries();
      return true;
    } catch (e) {
      setState({ status: "error", message: friendlyError(e) });
      return false;
    }
  }

  return { submit, state, reset: () => setState({ status: "idle" }) };
}
