import { describe, expect, it } from "vitest";
import {
  runSpousalAgeGapMedianDifference,
  spousalAgeGapMedianDifferenceExample,
} from "./tool.js";

describe("spousal-age-gap-median-difference", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSpousalAgeGapMedianDifference(
        spousalAgeGapMedianDifferenceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: spousalAgeGapMedianDifferenceExample.output,
    });
  });

  it("averages the two middle gaps for an even number of couples", () => {
    const r = runSpousalAgeGapMedianDifference({
      husbandAges: [40, 50],
      wifeAges: [30, 30],
    });
    expect(r.ok && r.output.medianAgeGap).toBe(15);
    expect(r.ok && r.output.meanAgeGap).toBe(15);
  });

  it("rejects misaligned lists", () => {
    expect(
      runSpousalAgeGapMedianDifference({
        husbandAges: [40],
        wifeAges: [30, 31],
      }).ok,
    ).toBe(false);
  });
});
