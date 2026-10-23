"use client";
import { useQuery } from "@tanstack/react-query";
import { useAccountAddress, useForgeConfig } from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { view } from "@/lib/aptos";
import { timeLeft } from "@/lib/format";
import { TokenAmount } from "./Token";
import { ActionButton, TxStatus } from "./ui";

export default function Faucet() {
  const user = useAccountAddress();
  const { data: config } = useForgeConfig();
  const { submit, state } = useTx();
  const { data: nextTime } = useQuery({
    queryKey: ["faucet-next", user],
    enabled: !!user,
    queryFn: async () =>
      Number((await view<[string]>("token_factory", "get_next_faucet_time", [user]))[0]),
  });
  const waiting = !!nextTime && nextTime > Date.now() / 1000;

  return (
    <div>
      <p className="mb-3 text-sm text-cyan-400/80">
        Claim{" "}
        {config && config.dyna !== "0x0" ? (
          <TokenAmount address={config.dyna} amount={config.faucetAmount} />
        ) : (
          "DYNA"
        )}{" "}
        to pay token-creation fees and try the protocol.
      </p>
      <ActionButton
        disabled={!user || waiting || state.status === "pending"}
        onClick={() => submit("token_factory", "faucet_dynexus", [])}
      >
        {!user ? "Connect wallet" : waiting ? `Next claim in ${timeLeft(nextTime)}` : "Claim DYNA"}
      </ActionButton>
      <TxStatus state={state} />
    </div>
  );
}
