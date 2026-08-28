import { describe, expect, it } from "vitest";
import { runKcFromConcentrations } from "./tool.js";

describe("Kc From Concentrations Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runKcFromConcentrations({
        productCoeff: 1,
        productConcentrationMolL: 2,
        reactantCoeff: 1,
        reactantConcentrationMolL: 4,
      }),
    ).toEqual({ ok: true, output: { kc: 0.5 } });
  });

  it("rejects invalid input", () =>
    expect(runKcFromConcentrations(null).ok).toBe(false));
});
