import { describe, expect, it } from "vitest";
import {
  fragmentJoinConfidenceScorerExample,
  runFragmentJoinConfidenceScorer,
} from "./tool.js";

describe("fragment-join-confidence-scorer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFragmentJoinConfidenceScorer(
        fragmentJoinConfidenceScorerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: fragmentJoinConfidenceScorerExample.output,
    });
  });

  it("scores a perfect profile match with matching thickness at full confidence", () => {
    const result = runFragmentJoinConfidenceScorer({
      profileAgreementPercent: 100,
      thicknessDifferenceMm: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.joinConfidencePercent as number).toBe(100);
  });

  it("rejects a zero thickness tolerance", () => {
    expect(
      runFragmentJoinConfidenceScorer({
        profileAgreementPercent: 50,
        thicknessDifferenceMm: 1,
        maxThicknessToleranceMm: 0,
      }).ok,
    ).toBe(false);
  });
});
