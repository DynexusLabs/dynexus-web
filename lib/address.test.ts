import { expect, test } from "bun:test";
import { normalizeAddress, sameAddress } from "./address";

const short = "0x50590a0c06ef08452db35927d150e9612cebcda4135c9c9dab4256be4b24ac4";
const full = "0x050590a0c06ef08452db35927d150e9612cebcda4135c9c9dab4256be4b24ac4";

test("short and padded spellings of one address are equal", () => {
  expect(sameAddress(short, full)).toBe(true);
  expect(normalizeAddress(short)).toBe(full);
});

test("case and a bare 0x1 style address normalise", () => {
  expect(sameAddress(full.toUpperCase().replace("0X", "0x"), full)).toBe(true);
  expect(normalizeAddress("0x1")).toBe(`0x${"0".repeat(63)}1`);
});

test("different addresses and missing values are not equal", () => {
  expect(sameAddress(short, "0x1")).toBe(false);
  expect(sameAddress(undefined, full)).toBe(false);
  expect(sameAddress(full, null)).toBe(false);
});
