import { describe, expect, it } from "vitest";
import { runHillCoefficient } from "./tool.js";

describe("Hill Coefficient Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runHillCoefficient({
        log10LigandConc1: -2,
        log10LigandConc2: -1,
        log10SaturationRatio1: -1,
        log10SaturationRatio2: 1,
      }),
    ).toEqual({ ok: true, output: { hillN: 2 } });
  });
  it("rejects invalid input", () =>
    expect(runHillCoefficient(null).ok).toBe(false));
});
