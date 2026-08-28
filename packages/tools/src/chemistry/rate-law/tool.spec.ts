import { describe, expect, it } from "vitest";
import { runRateLaw } from "./tool.js";
describe("Rate Law Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runRateLaw({
        rateConstantK: 0.05,
        reactantAM: 0.5,
        reactantBM: 0.25,
        orderA: 1,
        orderB: 2,
      }),
    ).toEqual({ ok: true, output: { reactionRateMPerS: 0.0015625 } }));
  it("rejects invalid input", () =>
    expect(
      runRateLaw({
        rateConstantK: -1,
        reactantAM: 0.5,
        reactantBM: 0.25,
        orderA: 1,
        orderB: 2,
      }).ok,
    ).toBe(false));
  it("rejects out-of-range order", () =>
    expect(
      runRateLaw({
        rateConstantK: 0.05,
        reactantAM: 0.5,
        reactantBM: 0.25,
        orderA: 4,
        orderB: 2,
      }).ok,
    ).toBe(false));
});
