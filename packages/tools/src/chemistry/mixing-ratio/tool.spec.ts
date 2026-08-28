import { describe, expect, it } from "vitest";
import { runMixingRatio } from "./tool.js";
describe("Mixing Ratio Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runMixingRatio({ pressureHpa: 1013.25, vaporPressureHpa: 20 }),
    ).toEqual({
      ok: true,
      output: { mixingRatioGPerKg: 12.524540649383338 },
    }));
  it("rejects invalid input", () =>
    expect(
      runMixingRatio({ pressureHpa: 1013.25, vaporPressureHpa: 1013.25 }).ok,
    ).toBe(false));
});
