import { describe, expect, it } from "vitest";
import {
  calculateCarbon14Age,
  carbon14AgeExample,
  runCarbon14Age,
} from "./tool.js";

describe("carbon-14-age", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCarbon14Age(carbon14AgeExample.input)).toEqual({
      ok: true,
      output: carbon14AgeExample.output,
    });
  });

  it("defaults to the 5730-year half-life", () => {
    const result = calculateCarbon14Age({ fractionModern: 0.25 });
    expect(result.ageYearsBP).toBeCloseTo(2 * 5730, 9);
  });

  it("rejects non-positive fraction modern", () => {
    expect(runCarbon14Age({ fractionModern: 0 }).ok).toBe(false);
  });
});
