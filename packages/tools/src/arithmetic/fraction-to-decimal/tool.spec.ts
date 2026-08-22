import { describe, expect, it } from "vitest";
import { runFractionToDecimal } from "./tool.js";

describe("Fraction to Decimal Converter", () => {
  it("calculates a valid result", () => {
    const result = runFractionToDecimal({ numerator: -1, denominator: 4 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.decimal).toBe(-0.25);
  });
  it("rejects invalid input", () =>
    expect(runFractionToDecimal(null).ok).toBe(false));
});
