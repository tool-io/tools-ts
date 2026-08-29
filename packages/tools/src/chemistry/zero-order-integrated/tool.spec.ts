import { describe, expect, it } from "vitest";
import { runZeroOrderIntegrated } from "./tool.js";

describe("Zero Order Integrated Rate Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runZeroOrderIntegrated({
        initialConcentrationMolL: 1,
        rateConstantMolPerLs: 0.05,
        timeSeconds: 4,
      }),
    ).toEqual({ ok: true, output: { concentrationMolL: 0.8 } });
  });

  it("clamps to zero once the reactant is depleted", () => {
    expect(
      runZeroOrderIntegrated({
        initialConcentrationMolL: 1,
        rateConstantMolPerLs: 0.5,
        timeSeconds: 100,
      }),
    ).toEqual({ ok: true, output: { concentrationMolL: 0 } });
  });

  it("rejects invalid input", () =>
    expect(runZeroOrderIntegrated(null).ok).toBe(false));
});
