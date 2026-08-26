import { describe, expect, it } from "vitest";
import {
  calculateWantedVsActualFertilityGap,
  runWantedVsActualFertilityGap,
  wantedVsActualFertilityGapExample,
} from "./tool.js";

describe("demography/wanted-vs-actual-fertility-gap", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWantedVsActualFertilityGap(wantedVsActualFertilityGapExample.input),
    ).toEqual({
      ok: true,
      output: wantedVsActualFertilityGapExample.output,
    });
  });

  it("reports a negative gap below wanted fertility", () => {
    const result = calculateWantedVsActualFertilityGap({
      actualTfr: 1.5,
      wantedTfr: 2.0,
    });
    expect(result.fertilityGap).toBeCloseTo(-0.5, 12);
    expect(result.unwantedSharePercent).toBeLessThan(0);
  });

  it("rejects zero or negative fertility rates", () => {
    expect(
      runWantedVsActualFertilityGap({ actualTfr: 0, wantedTfr: 2 }).ok,
    ).toBe(false);
    expect(
      runWantedVsActualFertilityGap({ actualTfr: 2, wantedTfr: -1 }).ok,
    ).toBe(false);
  });
});
