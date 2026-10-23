/** Exact decimal <-> base-unit conversion using bigint (no float rounding). */

export function toUnits(amount: string, decimals: number): bigint {
  const clean = amount.trim();
  if (!/^\d*\.?\d*$/.test(clean) || clean === "" || clean === ".") {
    throw new Error("Enter a valid amount");
  }
  const [whole, frac = ""] = clean.split(".");
  if (frac.length > decimals) throw new Error(`Max ${decimals} decimals`);
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, "0") || "0");
}

export function fromUnits(
  units: bigint | string | number,
  decimals: number,
  maxFraction = 6,
): string {
  const v = BigInt(units);
  const neg = v < 0n;
  const abs = neg ? -v : v;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  let frac = (abs % base)
    .toString()
    .padStart(decimals, "0")
    .slice(0, maxFraction)
    .replace(/0+$/, "");
  if (decimals === 0) frac = "";
  const wholeStr = whole.toLocaleString("en-US");
  return `${neg ? "-" : ""}${wholeStr}${frac ? `.${frac}` : ""}`;
}

export const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

export function standardize(addr: string): string {
  const hex = addr.replace(/^0x/, "").toLowerCase();
  return `0x${hex.padStart(64, "0")}`;
}

export function timeLeft(unixSecs: number): string {
  const s = Math.max(0, unixSecs - Math.floor(Date.now() / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** amount * (1 - bps/10000), floored */
export const applySlippage = (amount: bigint, bps: number) =>
  (amount * BigInt(10_000 - bps)) / 10_000n;
