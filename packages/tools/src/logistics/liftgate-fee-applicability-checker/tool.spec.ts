import { describe, expect, it } from "vitest";
import {
  liftgateFeeApplicabilityCheckerExample,
  runLiftgateFeeApplicabilityChecker,
} from "./tool.js";

describe("liftgate-fee-applicability-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLiftgateFeeApplicabilityChecker(
        liftgateFeeApplicabilityCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: liftgateFeeApplicabilityCheckerExample.output,
    });
  });

  it("waives the fee when a dock is present", () => {
    const result = runLiftgateFeeApplicabilityChecker({
      destinationHasLoadingDock: true,
      liftgateFeeUsd: 89,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.liftgateRequired).toBe(false);
    expect(result.output.estimatedFeeUsd as number).toBe(0);
  });
  it("rejects negative fees", () => {
    expect(
      runLiftgateFeeApplicabilityChecker({
        destinationHasLoadingDock: false,
        liftgateFeeUsd: -1,
      }).ok,
    ).toBe(false);
  });
});
