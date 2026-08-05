import { describe, expect, it } from "vitest";
import { convertByFactors } from "./factor-conversion.js";

const units = {
  cm: { factor: 0.01, name: "Centimeter" },
  m: { factor: 1, name: "Meter" },
};

describe("factor conversion", () => {
  it("converts through a canonical base unit", () =>
    expect(convertByFactors(100, "cm", "m", "m", units)).toBe(1));
  it("preserves a value when units match", () =>
    expect(convertByFactors(3, "cm", "cm", "m", units)).toBe(3));
  it("rejects unknown units and non-finite values", () => {
    expect(convertByFactors(1, "unknown", "m", "m", units)).toBeNull();
    expect(convertByFactors(Number.NaN, "cm", "m", "m", units)).toBeNull();
  });
});
