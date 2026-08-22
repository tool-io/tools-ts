import { describe, expect, it } from "vitest";
import {
  calculateDensityRatio,
  densityRatioExample,
  runDensityRatio,
} from "./tool.js";

describe("density ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDensityRatio(densityRatioExample.input)).toEqual({
      ok: true,
      output: densityRatioExample.output,
    });
  });

  it("is one at sea level and exceeds the pressure ratio at altitude", () => {
    expect(calculateDensityRatio({ altitudeFt: 0 })).toEqual({
      densityRatio: 1,
    });
    const sigma = calculateDensityRatio({ altitudeFt: 5000 }).densityRatio;
    const delta = 0.832048004567;
    expect(sigma).toBeGreaterThan(delta);
  });

  it("rejects negative altitudes through execution", () => {
    expect(runDensityRatio({ altitudeFt: -5 }).ok).toBe(false);
  });
});
