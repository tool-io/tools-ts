import { describe, expect, it } from "vitest";
import { runDaltonPartialPressure } from "./tool.js";
describe("Dalton Partial Pressure", () => {
  it("calculates a valid result", () =>
    expect(
      runDaltonPartialPressure({
        moleFraction: 0.21,
        totalPressureKpa: 101.325,
      }),
    ).toEqual({
      ok: true,
      output: { partialPressureKpa: 21.27825 },
    }));
  it("rejects invalid input", () =>
    expect(
      runDaltonPartialPressure({ moleFraction: 1.5, totalPressureKpa: 101.325 })
        .ok,
    ).toBe(false));
});
