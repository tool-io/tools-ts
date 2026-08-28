import { describe, expect, it } from "vitest";
import { runEquilibriumQp } from "./tool.js";

describe("Equilibrium Qp Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEquilibriumQp({
        productCoeff: 1,
        productPressureAtm: 3,
        reactantCoeff: 1,
        reactantPressureAtm: 6,
      }),
    ).toEqual({ ok: true, output: { qp: 0.5 } });
  });

  it("rejects invalid input", () =>
    expect(runEquilibriumQp(null).ok).toBe(false));
});
