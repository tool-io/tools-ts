import { describe, expect, it } from "vitest";
import { runKpFromPartialPressures } from "./tool.js";

describe("Kp From Partial Pressures Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runKpFromPartialPressures({
        productCoeff: 2,
        productPressureAtm: 2,
        reactantCoeff: 1,
        reactantPressureAtm: 4,
      }),
    ).toEqual({ ok: true, output: { kp: 1 } });
  });

  it("rejects invalid input", () =>
    expect(runKpFromPartialPressures(null).ok).toBe(false));
});
