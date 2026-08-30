import { describe, expect, it } from "vitest";
import {
  calculateLongNowTimeframes,
  longNowTimeframeExample,
  runLongNowTimeframe,
} from "./tool.js";

describe("long-now decade century timeframes", () => {
  it("reproduces its canonical example", () => {
    expect(runLongNowTimeframe(longNowTimeframeExample.input)).toEqual({
      ok: true,
      output: longNowTimeframeExample.output,
    });
  });

  it("returns zero for an empty horizon list", () => {
    expect(calculateLongNowTimeframes({ horizonYears: [] })).toEqual({
      centuryEquivalent: 0,
      decadeCounts: [],
      totalYears: 0,
    });
  });

  it("converts fractional years to decades", () => {
    expect(
      calculateLongNowTimeframes({ horizonYears: [2.5] }).decadeCounts,
    ).toEqual([0.25]);
  });

  it("rejects a negative horizon", () => {
    expect(runLongNowTimeframe({ horizonYears: [-1] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_horizon_years", field: "horizonYears.0" }],
      },
      ok: false,
    });
  });
});
