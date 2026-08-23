import { describe, expect, it } from "vitest";
import { runIpdAdjustment } from "./tool.js";

describe("IPD Adjustment Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIpdAdjustment({ defaultIpdMm: 64, userIpdMm: 67 })).toEqual({
      ok: true,
      output: { adjustmentMm: 3 },
    });
    expect(runIpdAdjustment({ defaultIpdMm: 64, userIpdMm: 60 })).toEqual({
      ok: true,
      output: { adjustmentMm: -4 },
    });
  });

  it("rejects invalid input", () =>
    expect(runIpdAdjustment(null).ok).toBe(false));

  it("rejects nonpositive interpupillary distances", () => {
    expect(runIpdAdjustment({ defaultIpdMm: 0, userIpdMm: 64 }).ok).toBe(false);
  });
});
