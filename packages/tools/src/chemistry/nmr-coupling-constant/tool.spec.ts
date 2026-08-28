import { describe, expect, it } from "vitest";
import { runNmrCouplingConstant } from "./tool.js";
describe("Coupling Constant Hz", () => {
  it("calculates a valid result", () =>
    expect(runNmrCouplingConstant({ peakOneHz: 500, peakTwoHz: 494 })).toEqual({
      ok: true,
      output: { couplingConstantHz: 6 },
    }));
  it("rejects invalid input", () =>
    expect(runNmrCouplingConstant({ peakOneHz: 500, peakTwoHz: 500 }).ok).toBe(
      false,
    ));
});
