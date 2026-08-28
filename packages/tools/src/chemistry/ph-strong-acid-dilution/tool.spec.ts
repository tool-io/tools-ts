import { describe, expect, it } from "vitest";
import { runPhStrongAcidDilution } from "./tool.js";
describe("pH Strong Acid Dilution Calculator", () => {
  it("0.01 M diluted 10x gives pH 3", () => {
    const r = runPhStrongAcidDilution({
      dilutionFactor: 10,
      initialConcentrationMolL: 0.01,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.ph).toBeCloseTo(3, 9);
  });
  it("rejects invalid input", () =>
    expect(runPhStrongAcidDilution(null).ok).toBe(false));
});
