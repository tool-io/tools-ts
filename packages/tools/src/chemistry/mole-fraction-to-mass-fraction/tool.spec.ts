import { describe, expect, it } from "vitest";
import { runMoleFractionToMassFraction } from "./tool.js";

describe("Mole Fraction to Mass Fraction Converter", () => {
  it("calculates a valid result", () => {
    const result = runMoleFractionToMassFraction({
      molarMass1GMol: 18,
      molarMass2GMol: 46,
      moleFraction1: 0.71875,
      moleFraction2: 0.28125,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.massFraction1).toBeCloseTo(0.5, 9);
    expect(result.output.massFraction2).toBeCloseTo(0.5, 9);
  });

  it("rejects invalid input", () =>
    expect(runMoleFractionToMassFraction(null).ok).toBe(false));
});
