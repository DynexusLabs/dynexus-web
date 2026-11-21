import { expect, test } from "bun:test";
import { mapLimited, mergeByAddress, missingAddresses } from "./merge";

type Row = { address: string; reserve: bigint; swaps?: number };

test("missingAddresses is case-insensitive", () => {
  expect(missingAddresses(["0xAB", "0xcd"], [{ address: "0xab" }])).toEqual(["0xcd"]);
});

test("mergeByAddress keeps indexer fields, applies live overrides, appends chain-only", () => {
  const indexed: Row[] = [{ address: "0xa", reserve: 1n, swaps: 7 }];
  const chainOnly: Row[] = [{ address: "0xb", reserve: 5n }];
  const live = new Map<string, Partial<Row>>([["0xa", { reserve: 9n }]]);
  expect(mergeByAddress(indexed, chainOnly, live)).toEqual([
    { address: "0xa", reserve: 9n, swaps: 7 },
    { address: "0xb", reserve: 5n },
  ]);
});

test("mergeByAddress dedupes a chain row the indexer already has", () => {
  const out = mergeByAddress<Row>(
    [{ address: "0xA", reserve: 1n }],
    [{ address: "0xa", reserve: 2n }],
  );
  expect(out).toHaveLength(1);
  expect(out[0]?.reserve).toBe(1n);
});

test("mapLimited respects the limit, keeps order and skips failures", async () => {
  let inFlight = 0;
  let peak = 0;
  const out = await mapLimited([1, 2, 3, 4, 5], 2, async (n) => {
    inFlight++;
    peak = Math.max(peak, inFlight);
    await new Promise((r) => setTimeout(r, 5));
    inFlight--;
    if (n === 3) throw new Error("boom");
    return n * 10;
  });
  expect(peak).toBeLessThanOrEqual(2);
  expect(out).toEqual([10, 20, undefined, 40, 50]);
});
