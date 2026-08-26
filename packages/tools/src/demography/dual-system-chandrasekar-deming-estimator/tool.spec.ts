import { describe, expect, it } from "vitest";
import {
  calculateDualSystemChandrasekarDemingEstimator,
  runDualSystemChandrasekarDemingEstimator,
  dualSystemChandrasekarDemingEstimatorExample,
} from "./tool.js";

describe("demography/dual-system-chandrasekar-deming-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDualSystemChandrasekarDemingEstimator(
        dualSystemChandrasekarDemingEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dualSystemChandrasekarDemingEstimatorExample.output,
    });
  });

  it("collapses to the first list total when no record is exclusive to the second list", () => {
    const result = calculateDualSystemChandrasekarDemingEstimator({
      inBothLists: 100,
      inFirstListOnly: 50,
      inSecondListOnly: 0,
    });
    expect(result.estimatedTotal).toBe(150);
    expect(result.missedByBothLists).toBe(0);
  });

  it("rejects zero overlap and negative or fractional counts", () => {
    expect(
      runDualSystemChandrasekarDemingEstimator({
        inBothLists: 0,
        inFirstListOnly: 10,
        inSecondListOnly: 10,
      }).ok,
    ).toBe(false);
    expect(
      runDualSystemChandrasekarDemingEstimator({
        inBothLists: 5.5,
        inFirstListOnly: 10,
        inSecondListOnly: 10,
      }).ok,
    ).toBe(false);
  });
});
