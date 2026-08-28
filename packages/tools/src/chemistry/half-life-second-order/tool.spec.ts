import { describe, expect, it } from "vitest";
import { runHalfLifeSecondOrder } from "./tool.js";

describe("Second Order Half-Life Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runHalfLifeSecondOrder({
        initialConcentrationMolL: 0.5,
        rateConstantK: 0.1,
      }),
    ).toEqual({ ok: true, output: { halfLifeSeconds: 20 } });
  });

  it("rejects invalid input", () =>
    expect(runHalfLifeSecondOrder(null).ok).toBe(false));
});
