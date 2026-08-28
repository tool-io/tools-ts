import { describe, expect, it } from "vitest";
import { runEquilibriumFromCellPotential } from "./tool.js";
describe("Log K From Cell Potential", () => {
  it("calculates a valid result", () =>
    expect(
      runEquilibriumFromCellPotential({
        eStandardVolts: 1.1,
        electronCount: 2,
      }),
    ).toEqual({
      ok: true,
      output: { logEquilibriumConstant: 37.16216216216216 },
    }));
  it("rejects invalid input", () =>
    expect(
      runEquilibriumFromCellPotential({ eStandardVolts: 1.1, electronCount: 0 })
        .ok,
    ).toBe(false));
});
