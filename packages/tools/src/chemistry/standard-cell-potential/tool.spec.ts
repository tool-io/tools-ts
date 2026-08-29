import { describe, expect, it } from "vitest";
import { runStandardCellPotential } from "./tool.js";
describe("Standard Cell Potential", () => {
  it("calculates a valid result", () =>
    expect(
      runStandardCellPotential({
        standardCathodeReductionVolts: 0.8,
        standardAnodeReductionVolts: -0.34,
      }),
    ).toEqual({
      ok: true,
      output: { standardCellPotentialVolts: 1.1400000000000001 },
    }));
  it("accepts negative standard potentials", () =>
    expect(
      runStandardCellPotential({
        standardCathodeReductionVolts: -0.25,
        standardAnodeReductionVolts: -0.5,
      }).ok,
    ).toBe(true));
});
