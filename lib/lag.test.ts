import { expect, test } from "bun:test";
import { indexerLagMinutes } from "./lag";

test("unknown versions give null", () => {
  expect(indexerLagMinutes(undefined, 1)).toBeNull();
  expect(indexerLagMinutes(1, null)).toBeNull();
});

test("caught up and ahead-of-chain give zero", () => {
  expect(indexerLagMinutes(1000, 1000)).toBe(0);
  expect(indexerLagMinutes(1000, 2000)).toBe(0);
});

test("converts versions behind to minutes", () => {
  expect(indexerLagMinutes(185 * 60 * 10, 0)).toBe(10);
});
