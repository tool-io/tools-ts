import { describe, expect, it } from "vitest";
import {
  calculateKarupKingThirdDifferenceLookup,
  runKarupKingThirdDifferenceLookup,
  karupKingThirdDifferenceLookupExample,
} from "./tool.js";

describe("demography/karup-king-third-difference-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKarupKingThirdDifferenceLookup(
        karupKingThirdDifferenceLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: karupKingThirdDifferenceLookupExample.output,
    });
  });

  it("reproduces the target group total when all five single years are summed", () => {
    const groupedTotals = [500, 1000, 2000, 4000, 8000];
    const singles = [1, 2, 3, 4, 5].map(
      (ordinalPosition) =>
        calculateKarupKingThirdDifferenceLookup({
          groupedTotals,
          groupOrdinal: 3,
          ordinalPosition,
        }).interpolatedValue,
    );
    expect(singles.reduce((total, value) => total + value, 0)).toBeCloseTo(
      2000,
      6,
    );
    singles.forEach((value) => expect(value).toBeGreaterThan(0));
  });

  it("rejects boundary groups and bad positions", () => {
    expect(
      runKarupKingThirdDifferenceLookup({
        groupedTotals: [100, 200, 400],
        groupOrdinal: 1,
        ordinalPosition: 2,
      }).ok,
    ).toBe(false);
    expect(
      runKarupKingThirdDifferenceLookup({
        groupedTotals: [100, 200, 400],
        groupOrdinal: 2,
        ordinalPosition: 7,
      }).ok,
    ).toBe(false);
    expect(
      runKarupKingThirdDifferenceLookup({
        groupedTotals: [100, -1, 400],
        groupOrdinal: 2,
        ordinalPosition: 2,
      }).ok,
    ).toBe(false);
  });
});
