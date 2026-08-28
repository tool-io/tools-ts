import { describe, expect, it } from "vitest";
import { runPotentiometryNernstSlope } from "./tool.js";
describe("Nernst Slope Check", () => {
  it("calculates a valid result", () =>
    expect(
      runPotentiometryNernstSlope({ measuredSlopeMV: 58.5, ionChargeInt: 1 }),
    ).toEqual({
      ok: true,
      output: {
        deviationPercent: 1.1156186612576007,
        expectedSlopeMV: 59.16,
      },
    }));
  it("rejects invalid input", () =>
    expect(
      runPotentiometryNernstSlope({ measuredSlopeMV: 58.5, ionChargeInt: 4 })
        .ok,
    ).toBe(false));
});
