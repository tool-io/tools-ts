import { describe, expect, it } from "vitest";
import { runSecondOrderIntegrated } from "./tool.js";

describe("Second Order Integrated Rate Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runSecondOrderIntegrated({
        initialConcentrationMolL: 2,
        rateConstantKLPerMolS: 0.25,
        timeSeconds: 1,
      }),
    ).toEqual({
      ok: true,
      output: { concentrationMolL: expect.closeTo(4 / 3, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runSecondOrderIntegrated(null).ok).toBe(false));
});
