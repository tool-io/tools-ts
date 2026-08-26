import { describe, expect, it } from "vitest";
import {
  calculateSpragueMultipliersOsculatoryLookup,
  runSpragueMultipliersOsculatoryLookup,
  spragueMultipliersOsculatoryLookupExample,
} from "./tool.js";

describe("demography/sprague-multipliers-osculatory-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSpragueMultipliersOsculatoryLookup(
        spragueMultipliersOsculatoryLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: spragueMultipliersOsculatoryLookupExample.output,
    });
  });

  it("reproduces the group total when all five single years are summed", () => {
    const groupedTotals = [90, 270, 450, 630, 810];
    const singles = [1, 2, 3, 4, 5].map(
      (ordinalPosition) =>
        calculateSpragueMultipliersOsculatoryLookup({
          groupedTotals,
          groupOrdinal: 3,
          ordinalPosition,
        }).interpolatedValue,
    );
    expect(singles.reduce((total, value) => total + value, 0)).toBeCloseTo(
      450,
      6,
    );
    expect(singles[2]).toBeCloseTo(
      450 * 0.2544 + 90 * 0.0064 + 270 * -0.0336 + 630 * -0.0336 + 810 * 0.0064,
      6,
    );
  });

  it("rejects boundary groups and bad positions", () => {
    expect(
      runSpragueMultipliersOsculatoryLookup({
        groupedTotals: [100, 200, 400, 800],
        groupOrdinal: 2,
        ordinalPosition: 1,
      }).ok,
    ).toBe(false);
    expect(
      runSpragueMultipliersOsculatoryLookup({
        groupedTotals: [100, 200, 400, 800, 1600],
        groupOrdinal: 3,
        ordinalPosition: 0,
      }).ok,
    ).toBe(false);
    expect(
      runSpragueMultipliersOsculatoryLookup({
        groupedTotals: [100, 200, -1, 800, 1600],
        groupOrdinal: 3,
        ordinalPosition: 1,
      }).ok,
    ).toBe(false);
  });
});
