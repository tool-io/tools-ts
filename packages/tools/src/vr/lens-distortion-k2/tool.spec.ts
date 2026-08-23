import { describe, expect, it } from "vitest";
import { runLensDistortionK2 } from "./tool.js";

describe("Lens Distortion K2 Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runLensDistortionK2({
        idealRadius: 1,
        k1: -0.2,
        measuredRadius: 0.9,
      }),
    ).toEqual({
      ok: true,
      output: { k2: expect.closeTo(0.1, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runLensDistortionK2(null).ok).toBe(false));

  it("rejects invalid radii", () => {
    expect(
      runLensDistortionK2({ idealRadius: 0, k1: -0.2, measuredRadius: 0.5 }).ok,
    ).toBe(false);
    expect(
      runLensDistortionK2({ idealRadius: 0.5, k1: -0.2, measuredRadius: -0.1 })
        .ok,
    ).toBe(false);
  });
});
