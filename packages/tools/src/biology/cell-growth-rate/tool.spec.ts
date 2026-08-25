import { describe, expect, it } from "vitest";
import { runCellGrowthRate } from "./tool.js";

describe("Specific Growth Rate", () => {
  it("calculates a valid result", () =>
    expect(
      runCellGrowthRate({
        elapsedHours: 2,
        finalCount: 200,
        initialCount: 100,
      }),
    ).toEqual({
      ok: true,
      output: { growthRatePerHour: 0.34657359027997264 },
    }));
  it("matches ln(2) for exactly one doubling", () =>
    expect(
      runCellGrowthRate({
        elapsedHours: 1,
        finalCount: 200,
        initialCount: 100,
      }),
    ).toEqual({ ok: true, output: { growthRatePerHour: 0.6931471805599453 } }));
  it("scales over long horizons", () =>
    expect(
      runCellGrowthRate({
        elapsedHours: 10,
        finalCount: 1000,
        initialCount: 10,
      }),
    ).toEqual({
      ok: true,
      output: { growthRatePerHour: 0.46051701859880917 },
    }));
  it("rejects equal counts", () => {
    const result = runCellGrowthRate({
      elapsedHours: 2,
      finalCount: 100,
      initialCount: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_growth");
  });
  it("rejects decreasing counts", () =>
    expect(
      runCellGrowthRate({
        elapsedHours: 2,
        finalCount: 50,
        initialCount: 100,
      }).ok,
    ).toBe(false));
  it("rejects non-positive counts", () => {
    const result = runCellGrowthRate({
      elapsedHours: 2,
      finalCount: 0,
      initialCount: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative elapsed time", () => {
    const result = runCellGrowthRate({
      elapsedHours: -1,
      finalCount: 200,
      initialCount: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
});
