import { describe, expect, it } from "vitest";
import {
  calculatePostEnumerationErrorPercent,
  runPostEnumerationErrorPercent,
  postEnumerationErrorPercentExample,
} from "./tool.js";

describe("demography/post-enumeration-error-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPostEnumerationErrorPercent(postEnumerationErrorPercentExample.input),
    ).toEqual({ ok: true, output: postEnumerationErrorPercentExample.output });
  });

  it("labels an over-enumerated census", () => {
    const result = calculatePostEnumerationErrorPercent({
      dualSystemEstimate: 100000,
      censusEnumeratedCount: 103000,
    });
    expect(result.netUndercountPercent).toBe(-3);
    expect(result.coverageRatioPercent).toBe(103);
    expect(result.coverageStatus).toBe("overcount");
  });

  it("rejects non-positive estimates and negative counts", () => {
    expect(
      runPostEnumerationErrorPercent({
        dualSystemEstimate: 0,
        censusEnumeratedCount: 0,
      }).ok,
    ).toBe(false);
    expect(
      runPostEnumerationErrorPercent({
        dualSystemEstimate: 100,
        censusEnumeratedCount: -1,
      }).ok,
    ).toBe(false);
  });
});
