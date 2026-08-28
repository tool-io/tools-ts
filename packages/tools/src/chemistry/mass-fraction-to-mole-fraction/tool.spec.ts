import { describe, expect, it } from "vitest";
import { runMassFractionToMoleFraction } from "./tool.js";

describe("Mass Fraction to Mole Fraction Converter", () => {
  it("calculates a valid result", () => {
    const result = runMassFractionToMoleFraction({
      massFraction1: 0.5,
      massFraction2: 0.5,
      molarMass1GMol: 18,
      molarMass2GMol: 46,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.moleFraction1).toBeCloseTo(0.71875, 9);
    expect(result.output.moleFraction2).toBeCloseTo(0.28125, 9);
  });

  it("rejects invalid input", () =>
    expect(runMassFractionToMoleFraction(null).ok).toBe(false));
});
