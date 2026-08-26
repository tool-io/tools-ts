import { describe, expect, it } from "vitest";
import {
  calculateMedianAgeGroupedInterpolation,
  medianAgeGroupedInterpolationExample,
  runMedianAgeGroupedInterpolation,
} from "./tool.js";

describe("median-age-grouped-interpolation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMedianAgeGroupedInterpolation(
        medianAgeGroupedInterpolationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: medianAgeGroupedInterpolationExample.output,
    });
  });

  it("lands on a group boundary when N/2 falls exactly between classes", () => {
    const r = calculateMedianAgeGroupedInterpolation({
      groupBoundaries: [0, 10, 20],
      countsByGroup: [10, 10],
    });
    expect(r.medianAge).toBe(10);
  });

  it("rejects mismatched list lengths", () => {
    expect(
      runMedianAgeGroupedInterpolation({
        groupBoundaries: [0, 10],
        countsByGroup: [1, 2],
      }).ok,
    ).toBe(false);
  });

  it("rejects decreasing boundaries", () => {
    expect(
      runMedianAgeGroupedInterpolation({
        groupBoundaries: [0, 10, 5],
        countsByGroup: [1, 2],
      }).ok,
    ).toBe(false);
  });
});
