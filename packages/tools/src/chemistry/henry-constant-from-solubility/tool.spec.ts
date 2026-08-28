import { describe, expect, it } from "vitest";
import { runHenryConstantFromSolubility } from "./tool.js";

describe("Henry Constant From Solubility Calculator", () => {
  it("calculates a valid result", () => {
    const result = runHenryConstantFromSolubility({
      concentrationMolL: 0.001,
      partialPressureAtm: 0.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.henryConstantAtmLPerMol).toBeCloseTo(500, 9);
  });

  it("rejects invalid input", () =>
    expect(runHenryConstantFromSolubility(null).ok).toBe(false));
});
