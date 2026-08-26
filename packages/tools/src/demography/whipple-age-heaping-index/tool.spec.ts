import { describe, expect, it } from "vitest";
import {
  calculateWhippleAgeHeapingIndex,
  runWhippleAgeHeapingIndex,
  whippleAgeHeapingIndexExample,
} from "./tool.js";

describe("whipple-age-heaping-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWhippleAgeHeapingIndex(whippleAgeHeapingIndexExample.input),
    ).toEqual({
      ok: true,
      output: whippleAgeHeapingIndexExample.output,
    });
  });

  it("scores exactly one hundred for uniform data on the default classic window", () => {
    const r = calculateWhippleAgeHeapingIndex({
      populationBySingleAge: Array.from({ length: 40 }, () => 100),
      startAge: 23,
    });
    expect(r.whippleIndex).toBe(100);
    expect(r.qualityRating).toBe("very_accurate");
  });

  it("rejects lists that do not cover the evaluation window", () => {
    expect(
      runWhippleAgeHeapingIndex({
        populationBySingleAge: [50, 60, 70],
        startAge: 24,
      }).ok,
    ).toBe(false);
  });
});
