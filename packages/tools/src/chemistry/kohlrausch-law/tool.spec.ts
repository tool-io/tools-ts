import { describe, expect, it } from "vitest";
import { runKohlrauschLaw } from "./tool.js";

describe("Kohlrausch Law Calculator", () => {
  it("calculates a valid result", () => {
    const result = runKohlrauschLaw({
      cationConductivitySCm2Mol: 1,
      cationCoeff: 1,
      anionConductivitySCm2Mol: 1,
      anionCoeff: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.limitingMolarConductivitySCm2Mol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runKohlrauschLaw(null).ok).toBe(false));
});
