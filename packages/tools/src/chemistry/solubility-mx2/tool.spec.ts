import { describe, expect, it } from "vitest";
import { runSolubilityMx2 } from "./tool.js";
describe("Solubility MX2 Calculator", () => {
  it("returns s=2 when Ksp=32", () => {
    expect(runSolubilityMx2({ ksp: 32 })).toEqual({
      ok: true,
      output: { solubilityMolL: 2 },
    });
  });
  it("rejects invalid input", () =>
    expect(runSolubilityMx2(null).ok).toBe(false));
});
