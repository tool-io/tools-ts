import { describe, expect, it } from "vitest";
import { runFirstOrderIntegrated } from "./tool.js";

describe("First Order Integrated Rate Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runFirstOrderIntegrated({
        initialConcentrationMolL: 1,
        rateConstantPerS: Math.LN2,
        timeSeconds: 1,
      }),
    ).toEqual({
      ok: true,
      output: { concentrationMolL: expect.closeTo(0.5, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFirstOrderIntegrated(null).ok).toBe(false));
});
