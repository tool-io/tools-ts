import { describe, expect, it } from "vitest";
import {
  calculateLotkaIntrinsicGrowthRateR,
  runLotkaIntrinsicGrowthRateR,
  lotkaIntrinsicGrowthRateRExample,
} from "./tool.js";

describe("demography/lotka-intrinsic-growth-rate-r", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLotkaIntrinsicGrowthRateR(lotkaIntrinsicGrowthRateRExample.input),
    ).toEqual({
      ok: true,
      output: lotkaIntrinsicGrowthRateRExample.output,
    });
  });

  it("returns zero growth only at replacement", () => {
    const result = calculateLotkaIntrinsicGrowthRateR({
      asfr: [0, 1, 0],
      personYearsLx: [0, 1, 0],
      startingAge: 27.5,
      classWidth: 5,
    });
    expect(result.netReproductionRate).toBe(1);
    expect(Math.abs(result.intrinsicGrowthRate)).toBeLessThan(1e-12);
  });

  it("rejects zero-fertility schedules and misaligned lists", () => {
    expect(
      runLotkaIntrinsicGrowthRateR({ asfr: [0, 0], personYearsLx: [4.9, 4.85] })
        .ok,
    ).toBe(false);
    expect(
      runLotkaIntrinsicGrowthRateR({ asfr: [0.1], personYearsLx: [4.9, 4.85] })
        .ok,
    ).toBe(false);
  });
});
