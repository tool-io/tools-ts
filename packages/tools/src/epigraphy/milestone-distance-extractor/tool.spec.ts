import { describe, expect, it } from "vitest";
import {
  milestoneDistanceExtractorExample,
  runMilestoneDistanceExtractor,
} from "./tool.js";

describe("milestone-distance-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMilestoneDistanceExtractor(milestoneDistanceExtractorExample.input),
    ).toEqual({
      ok: true,
      output: milestoneDistanceExtractorExample.output,
    });
  });

  it("accepts compact and lowercase readings with subtractive numerals", () => {
    expect(runMilestoneDistanceExtractor({ distanceText: "mp xviii" })).toEqual(
      {
        ok: true,
        output: { numeral: "XVIII", miles: 18 },
      },
    );
    expect(runMilestoneDistanceExtractor({ distanceText: "M.P. XL" })).toEqual({
      ok: true,
      output: { numeral: "XL", miles: 40 },
    });
  });
  it("rejects missing MP markers and malformed numerals", () => {
    expect(runMilestoneDistanceExtractor({ distanceText: "M XII" }).ok).toBe(
      false,
    );
    expect(runMilestoneDistanceExtractor({ distanceText: "M P VXII" }).ok).toBe(
      false,
    );
  });
});
