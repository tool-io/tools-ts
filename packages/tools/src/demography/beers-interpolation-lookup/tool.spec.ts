import { describe, expect, it } from "vitest";
import {
  calculateBeersInterpolationLookup,
  runBeersInterpolationLookup,
  beersInterpolationLookupExample,
} from "./tool.js";

describe("demography/beers-interpolation-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBeersInterpolationLookup(beersInterpolationLookupExample.input),
    ).toEqual({ ok: true, output: beersInterpolationLookupExample.output });
  });

  it("reproduces the group total when all five single years are summed", () => {
    const groupedTotals = [120, 340, 560, 780, 900];
    const singles = [1, 2, 3, 4, 5].map(
      (ordinalPosition) =>
        calculateBeersInterpolationLookup({
          groupedTotals,
          groupOrdinal: 3,
          ordinalPosition,
          method: "ordinary",
        }).interpolatedValue,
    );
    const sum = singles.reduce((total, value) => total + value, 0);
    expect(sum).toBeCloseTo(560, 6);
    singles.forEach((value) => expect(value).toBeGreaterThanOrEqual(-1e-9));
    const modifiedRows = [1, 2, 3, 4, 5].map((ordinalPosition) =>
      calculateBeersInterpolationLookup({
        groupedTotals,
        groupOrdinal: 3,
        ordinalPosition,
        method: "modified",
      }).multipliers.reduce((total, value) => total + value, 0),
    );
    modifiedRows.forEach((rowSum) => expect(rowSum).toBeCloseTo(0.2, 12));
  });

  it("rejects boundary groups and bad positions", () => {
    expect(
      runBeersInterpolationLookup({
        groupedTotals: [100, 200, 400, 800, 1600],
        groupOrdinal: 2,
        ordinalPosition: 1,
      }).ok,
    ).toBe(false);
    expect(
      runBeersInterpolationLookup({
        groupedTotals: [100, 200, 400, 800, 1600],
        groupOrdinal: 3,
        ordinalPosition: 6,
      }).ok,
    ).toBe(false);
    expect(
      runBeersInterpolationLookup({
        groupedTotals: [100, 200, -1, 800, 1600],
        groupOrdinal: 3,
        ordinalPosition: 1,
      }).ok,
    ).toBe(false);
  });
});
