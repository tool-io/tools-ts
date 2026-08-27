import { describe, expect, it } from "vitest";
import { mohrCircleRadiusExample, runMohrCircleRadius } from "./tool.js";

describe("mohr-circle-radius", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMohrCircleRadius(mohrCircleRadiusExample.input)).toEqual({
      ok: true,
      output: mohrCircleRadiusExample.output,
    });
  });

  it("gives a zero radius for hydrostatic stress", () => {
    const result = runMohrCircleRadius({ sigma1MPa: 80, sigma3MPa: 80 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.radiusMPa as number).toBe(0);
  });

  it("rejects sigma_3 greater than sigma_1", () => {
    expect(runMohrCircleRadius({ sigma1MPa: 40, sigma3MPa: 120 }).ok).toBe(
      false,
    );
  });
});
