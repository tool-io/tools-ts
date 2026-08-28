import { describe, expect, it } from "vitest";
import { runCellPotential } from "./tool.js";
describe("Cell Potential Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runCellPotential({
        cathodeReductionVolts: 0.34,
        anodeReductionVolts: -0.76,
      }),
    ).toEqual({
      ok: true,
      output: { cellPotentialVolts: 1.1 },
    }));
  it("accepts negative potentials", () =>
    expect(
      runCellPotential({ cathodeReductionVolts: -0.5, anodeReductionVolts: -1 })
        .ok,
    ).toBe(true));
});
