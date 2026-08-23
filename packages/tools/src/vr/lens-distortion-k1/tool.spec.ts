import { describe, expect, it } from "vitest";
import { runLensDistortionK1 } from "./tool.js";

describe("Lens Distortion K1 Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runLensDistortionK1({ idealRadius: 1, measuredRadius: 0.8 }),
    ).toEqual({
      ok: true,
      output: { k1: -0.19999999999999996 },
    });
    expect(
      runLensDistortionK1({ idealRadius: 0.5, measuredRadius: 0.55 }),
    ).toEqual({
      ok: true,
      output: { k1: expect.closeTo(0.4, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runLensDistortionK1(null).ok).toBe(false));

  it("rejects invalid radii", () => {
    expect(
      runLensDistortionK1({ idealRadius: 0, measuredRadius: 0.5 }).ok,
    ).toBe(false);
    expect(
      runLensDistortionK1({ idealRadius: 0.5, measuredRadius: -0.1 }).ok,
    ).toBe(false);
  });
});
