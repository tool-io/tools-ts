import { describe, expect, it } from "vitest";
import { runSolubilityProductQuotient } from "./tool.js";

describe("Solubility Product Quotient Calculator", () => {
  it("classifies a saturated solution", () => {
    const result = runSolubilityProductQuotient({
      anionCoeff: 2,
      cationCoeff: 1,
      cationConcentrationMolL: 1,
      anionConcentrationMolL: 1,
      ksp: 4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.quotient).toBe(1);
    expect(result.output.state).toBe("unsaturated");
  });

  it("rejects invalid input", () =>
    expect(runSolubilityProductQuotient(null).ok).toBe(false));
});
