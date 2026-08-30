import { describe, expect, it } from "vitest";
import {
  accessoryValueRatioExample,
  runAccessoryValueRatio,
  screenBoxPapersValueRatio,
} from "./tool.js";

describe("box-and-papers accessory-value ratio screen", () => {
  it("reproduces the canonical 20-percent example", () => {
    expect(runAccessoryValueRatio(accessoryValueRatioExample.input)).toEqual({
      ok: true,
      output: accessoryValueRatioExample.output,
    });
  });

  it("accepts a ratio exactly at the caller limit", () => {
    expect(
      screenBoxPapersValueRatio({
        watchValueWithoutAccessories: 1000,
        watchValueWithBoxAndPapers: 1200,
        maximumAllowedAccessoryValuePercent: 20,
      }).withinCallerPercentage,
    ).toBe(true);
  });

  it("rejects an accessory value above the limit", () => {
    expect(
      screenBoxPapersValueRatio({
        watchValueWithoutAccessories: 1000,
        watchValueWithBoxAndPapers: 1300,
        maximumAllowedAccessoryValuePercent: 20,
      }).withinCallerPercentage,
    ).toBe(false);
  });

  it("handles a zero base without division by zero", () => {
    expect(
      screenBoxPapersValueRatio({
        watchValueWithoutAccessories: 0,
        watchValueWithBoxAndPapers: 0,
        maximumAllowedAccessoryValuePercent: 20,
      }).accessoryValuePercentOfBase,
    ).toBe(0);
  });

  it("rejects a with-accessories value below the base", () => {
    expect(
      runAccessoryValueRatio({
        watchValueWithoutAccessories: 1000,
        watchValueWithBoxAndPapers: 900,
        maximumAllowedAccessoryValuePercent: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "with_accessories_value_invalid",
            field: "watchValueWithBoxAndPapers",
          },
        ],
      },
      ok: false,
    });
  });
});
