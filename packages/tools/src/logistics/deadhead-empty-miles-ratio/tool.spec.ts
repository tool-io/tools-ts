import { describe, expect, it } from "vitest";
import {
  calculateDeadheadEmptyMilesRatio,
  deadheadEmptyMilesRatioExample,
  runDeadheadEmptyMilesRatio,
} from "./tool.js";

describe("deadhead-empty-miles-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDeadheadEmptyMilesRatio(deadheadEmptyMilesRatioExample.input),
    ).toEqual({
      ok: true,
      output: deadheadEmptyMilesRatioExample.output,
    });
  });

  it("handles a fully loaded period", () => {
    expect(
      runDeadheadEmptyMilesRatio({ emptyMiles: 0, totalMiles: 900 }),
    ).toEqual({ ok: true, output: { deadheadPercent: 0 } });
  });

  it("rejects zero total miles", () => {
    const result = runDeadheadEmptyMilesRatio({
      emptyMiles: 50,
      totalMiles: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "totalMiles",
    });
  });

  it("rejects non-finite and impossible empty mileage", () => {
    expect(() =>
      calculateDeadheadEmptyMilesRatio({
        emptyMiles: Number.NaN,
        totalMiles: 100,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateDeadheadEmptyMilesRatio({ emptyMiles: 101, totalMiles: 100 }),
    ).toThrow("no greater than");
  });
});
