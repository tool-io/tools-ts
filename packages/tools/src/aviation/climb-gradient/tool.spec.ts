import { describe, expect, it } from "vitest";
import { climbGradientExample, runClimbGradient } from "./tool.js";

describe("climb gradient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runClimbGradient(climbGradientExample.input)).toEqual({
      ok: true,
      output: climbGradientExample.output,
    });
  });

  it("doubles when the altitude gain doubles", () => {
    expect(
      runClimbGradient({ altitudeGainFt: 600, horizontalDistanceFt: 6000 }),
    ).toEqual({ ok: true, output: { gradientPercent: 10 } });
  });

  it("rejects zero distance through execution", () => {
    expect(
      runClimbGradient({ altitudeGainFt: 300, horizontalDistanceFt: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_distance" }] },
      ok: false,
    });
  });
});
