"use client";
import { useState } from "react";
import Faucet from "@/components/dx/Faucet";
import { TokenAmount } from "@/components/dx/Token";
import { ActionButton, Field, inputClass, Notice, Page, Panel, TxStatus } from "@/components/dx/ui";
import { configured, useAccountAddress, useBalance, useForgeConfig } from "@/hooks/useDynexus";
import { useTx } from "@/hooks/useTx";
import { toUnits } from "@/lib/format";

const MAX_URI = 512;

export default function CreateTokenPage() {
  const user = useAccountAddress();
  const { data: config } = useForgeConfig();
  const { data: dynaBalance } = useBalance(config?.dyna);
  const { submit, state } = useTx();
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    decimals: "8",
    supply: "",
    icon: "",
    website: "",
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const isAdmin = !!user && !!config && user === config.admin;
  const fee = config?.fee ?? 0n;
  const canPay = isAdmin || fee === 0n || (dynaBalance ?? 0n) >= fee;

  let error = "";
  let supplyUnits = 0n;
  try {
    if (!form.name.trim() || !form.symbol.trim()) error = "Name and symbol are required";
    else if (form.name.length > 32 || form.symbol.length > 32)
      error = "Name and symbol: max 32 characters";
    else if (form.icon.length > MAX_URI || form.website.length > MAX_URI)
      error = "URLs: max 512 characters";
    else if (form.supply) supplyUnits = toUnits(form.supply, Number(form.decimals));
    if (supplyUnits > 18446744073709551615n) error = "Supply exceeds u64";
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <Page
      title="Forge a token"
      subtitle="Launch a fungible asset on Aptos. You keep mint authority."
    >
      {!configured && <Notice>Contract address not configured.</Notice>}
      <div className="grid gap-6 md:grid-cols-3">
        <Panel title="Token details" className="md:col-span-2">
          <div className="grid gap-x-4 md:grid-cols-2">
            <Field id="name" label="Name">
              <input
                id="name"
                className={inputClass}
                value={form.name}
                onChange={set("name")}
                maxLength={32}
                placeholder="My Token"
              />
            </Field>
            <Field id="symbol" label="Symbol">
              <input
                id="symbol"
                className={inputClass}
                value={form.symbol}
                onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
                maxLength={32}
                placeholder="MTK"
              />
            </Field>
            <Field id="decimals" label="Decimals">
              <select
                id="decimals"
                className={inputClass}
                value={form.decimals}
                onChange={set("decimals")}
              >
                {[0, 2, 4, 6, 8].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="supply" label="Initial supply" hint="minted to you">
              <input
                id="supply"
                className={inputClass}
                value={form.supply}
                onChange={set("supply")}
                inputMode="decimal"
                placeholder="1000000"
              />
            </Field>
          </div>
          <Field id="icon" label="Icon URL">
            <input
              id="icon"
              className={inputClass}
              value={form.icon}
              onChange={set("icon")}
              placeholder="https://…/logo.png"
            />
          </Field>
          <Field id="website" label="Project URL">
            <input
              id="website"
              className={inputClass}
              value={form.website}
              onChange={set("website")}
              placeholder="https://…"
            />
          </Field>
        </Panel>

        <div className="space-y-6">
          <Panel title="Cost">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Creation fee</span>
              <span className="text-fg">
                {isAdmin ? (
                  "waived (admin)"
                ) : config ? (
                  <TokenAmount address={config.dyna} amount={fee} />
                ) : (
                  "…"
                )}
              </span>
            </div>
            {config && user && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted">Your DYNA</span>
                <span className={canPay ? "text-fg" : "text-danger"}>
                  <TokenAmount address={config.dyna} amount={dynaBalance ?? 0n} />
                </span>
              </div>
            )}
            <div className="mt-6">
              <ActionButton
                disabled={!user || !!error || !canPay || state.status === "pending"}
                onClick={() =>
                  submit("token_factory", "create_token", [
                    form.name.trim(),
                    form.symbol.trim(),
                    Number(form.decimals),
                    supplyUnits.toString(),
                    form.icon.trim(),
                    form.website.trim(),
                  ])
                }
              >
                {!user
                  ? "Connect wallet"
                  : state.status === "pending"
                    ? "Creating…"
                    : "Create token"}
              </ActionButton>
              {user && error && <p className="mt-3 text-sm text-danger">{error}</p>}
              {user && !error && !canPay && (
                <p className="mt-3 text-sm text-danger">Not enough DYNA for the fee</p>
              )}
              <TxStatus state={state} />
            </div>
          </Panel>
          {!canPay && (
            <Panel title="Need DYNA?">
              <Faucet />
            </Panel>
          )}
        </div>
      </div>
    </Page>
  );
}
