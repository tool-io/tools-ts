import { describe, expect, it } from "vitest";
import {
  calculateOneWayAnova,
  oneWayAnovaExample,
  runOneWayAnova,
} from "./tool.js";

describe("One-Way ANOVA F-Ratio Calculator", () => {
  it("calculates the F-ratio and degrees of freedom", () => {
    const result = calculateOneWayAnova([
      [5, 6, 7],
      [8, 9, 10],
      [4, 5, 6],
    ]);
    expect(result).toMatchObject({
      betweenDegreesOfFreedom: 2,
      fRatio: 13,
      groupMeans: [6, 9, 5],
      withinDegreesOfFreedom: 6,
    });
  });

  it("rejects insufficient and non-finite groups", () => {
    expect(calculateOneWayAnova([[1, 2]])).toBeNull();
    expect(calculateOneWayAnova([[1], [2]])).toBeNull();
    expect(
      calculateOneWayAnova([
        [1, 2],
        [3, Number.NaN],
      ]),
    ).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runOneWayAnova(oneWayAnovaExample.input).ok).toBe(true));
});
