import { describe, expect, it } from "vitest";
import {
  concordanceDuplicateMergeDetectorExample,
  runConcordanceDuplicateMergeDetector,
} from "./tool.js";

describe("concordance-duplicate-merge-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConcordanceDuplicateMergeDetector(
        concordanceDuplicateMergeDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: concordanceDuplicateMergeDetectorExample.output,
    });
  });

  it("returns an empty result for disjoint lists", () => {
    expect(
      runConcordanceDuplicateMergeDetector({
        leftRefs: ["IG II² 1234"],
        rightRefs: ["SEG 41, 785"],
      }),
    ).toEqual({
      ok: true,
      output: { mergedDuplicates: [], duplicateCount: 0 },
    });
  });
  it("rejects blank entries", () => {
    expect(
      runConcordanceDuplicateMergeDetector({
        leftRefs: ["   "],
        rightRefs: ["x"],
      }).ok,
    ).toBe(false);
  });
});
