import { describe, expect, it } from "vitest";
import { runHalfLifeZeroOrder } from "./tool.js";

describe("Zero Order Half-Life Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runHalfLifeZeroOrder({
        initialConcentrationMolL: 1,
        rateConstantKMolPerLs: 0.05,
      }),
    ).toEqual({ ok: true, output: { halfLifeSeconds: 10 } });
  });

  it("rejects invalid input", () =>
    expect(runHalfLifeZeroOrder(null).ok).toBe(false));
});
