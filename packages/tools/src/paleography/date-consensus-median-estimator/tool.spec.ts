import { describe, expect, it } from "vitest";
import {
  dateConsensusMedianEstimatorExample,
  runDateConsensusMedianEstimator,
} from "./tool.js";

describe("date-consensus-median-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDateConsensusMedianEstimator(
        dateConsensusMedianEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dateConsensusMedianEstimatorExample.output,
    });
  });

  it("averages the two central values for an even count", () => {
    const result = runDateConsensusMedianEstimator({
      proposedYears: [1150, 1100],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.medianYear as number).toBe(1125);
    expect(result.output.yearSpread as number).toBe(50);
  });

  it("rejects an empty proposal list", () => {
    expect(runDateConsensusMedianEstimator({ proposedYears: [] }).ok).toBe(
      false,
    );
  });
});
