import { describe, expect, it } from "vitest";
import { runAcidDissociationFraction } from "./tool.js";

describe("Acid Dissociation Fraction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runAcidDissociationFraction({
      concentrationMolL: 0.1,
      ka: 1.8e-5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dissociationFraction).toBeCloseTo(0.01332, 4);
  });

  it("rejects invalid input", () =>
    expect(runAcidDissociationFraction(null).ok).toBe(false));
});
