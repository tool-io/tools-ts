import { describe, expect, it } from "vitest";
import { runBaseDissociationFraction } from "./tool.js";

describe("Base Dissociation Fraction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBaseDissociationFraction({
      concentrationMolL: 0.1,
      kb: 1.8e-5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dissociationFraction).toBeCloseTo(0.01332, 4);
  });

  it("rejects invalid input", () =>
    expect(runBaseDissociationFraction(null).ok).toBe(false));
});
