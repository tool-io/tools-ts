import { describe, expect, it } from "vitest";
import { runSolubilityMx3 } from "./tool.js";
describe("Solubility MX3 Calculator", () => {
  it("returns s=2 when Ksp=432", () => {
    const r = runSolubilityMx3({ ksp: 432 });
    if (!r.ok) throw new Error("fail");
    expect(r.output.solubilityMolL).toBeCloseTo(2, 9);
  });
  it("rejects invalid input", () =>
    expect(runSolubilityMx3(null).ok).toBe(false));
});
