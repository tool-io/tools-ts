import { describe, expect, it } from "vitest";
import {
  limitedAccessFeeCheckerExample,
  runLimitedAccessFeeChecker,
} from "./tool.js";

describe("limited-access-fee-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLimitedAccessFeeChecker(limitedAccessFeeCheckerExample.input),
    ).toEqual({
      ok: true,
      output: limitedAccessFeeCheckerExample.output,
    });
  });

  it("skips the fee for commercial sites", () => {
    const result = runLimitedAccessFeeChecker({
      siteType: "commercial",
      limitedAccessFeeUsd: 121.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.limitedAccessApplies).toBe(false);
    expect(result.output.estimatedFeeUsd as number).toBe(0);
  });
  it("rejects negative fees", () => {
    expect(
      runLimitedAccessFeeChecker({ siteType: "farm", limitedAccessFeeUsd: -10 })
        .ok,
    ).toBe(false);
  });
});
