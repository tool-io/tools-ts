import { describe, expect, it } from "vitest";
import {
  calculatePressureRatio,
  pressureRatioExample,
  runPressureRatio,
} from "./tool.js";

describe("pressure ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPressureRatio(pressureRatioExample.input)).toEqual({
      ok: true,
      output: pressureRatioExample.output,
    });
  });

  it("is one at sea level and decays above the tropopause", () => {
    expect(calculatePressureRatio({ altitudeFt: 0 })).toEqual({
      pressureRatio: 1,
    });
    const tropopause = calculatePressureRatio({
      altitudeFt: 36089.24,
    }).pressureRatio;
    const higher = calculatePressureRatio({ altitudeFt: 40000 }).pressureRatio;
    expect(higher).toBeLessThan(tropopause);
  });

  it("rejects negative altitudes through execution", () => {
    expect(runPressureRatio({ altitudeFt: -1 }).ok).toBe(false);
  });
});
