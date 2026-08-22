import { describe, expect, it } from "vitest";
import {
  requiredDescentGradientExample,
  requiredDescentGradientTool,
  runRequiredDescentGradient,
} from "./tool.js";

describe("required descent gradient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRequiredDescentGradient(requiredDescentGradientExample.input),
    ).toEqual({
      ok: true,
      output: requiredDescentGradientExample.output,
    });
  });

  it("matches the three-degree rule of about 320 feet per nautical mile", () => {
    const gradient = requiredDescentGradientTool.execute({
      altitudeToLoseFt: 318.9,
      distanceNm: 1,
    });
    if (!gradient.ok) throw new Error("expected success");
    expect(gradient.output.gradientFtPerNm).toBeCloseTo(318.9, 6);
  });

  it("rejects zero distance through execution", () => {
    expect(
      requiredDescentGradientTool.execute({
        altitudeToLoseFt: 1000,
        distanceNm: 0,
      }).ok,
    ).toBe(false);
  });
});
