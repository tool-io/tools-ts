import { describe, expect, it } from "vitest";
import {
  humanistCenturyEstimatorExample,
  runHumanistCenturyEstimator,
} from "./tool.js";

describe("humanist-century-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHumanistCenturyEstimator(humanistCenturyEstimatorExample.input),
    ).toEqual({ ok: true, output: humanistCenturyEstimatorExample.output });
  });

  it("marks the fourteenth century as protohumanist", () => {
    const result = runHumanistCenturyEstimator({ century: 14 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.humanistPhase as string).toBe(
      "protohumanist_experiments",
    );
    expect(result.output.isFloruitCentury as boolean).toBe(false);
  });

  it("rejects non-positive centuries", () => {
    expect(runHumanistCenturyEstimator({ century: 0 }).ok).toBe(false);
    expect(runHumanistCenturyEstimator({ century: 22 }).ok).toBe(false);
  });
});
