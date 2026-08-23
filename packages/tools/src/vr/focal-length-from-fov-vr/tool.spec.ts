import { describe, expect, it } from "vitest";
import { runFocalLengthFromFovVr } from "./tool.js";

describe("Focal Length From FOV VR Calculator", () => {
  it("calculates a valid result", () => {
    expect(runFocalLengthFromFovVr({ fovDeg: 90, sensorWidthMm: 16 })).toEqual({
      ok: true,
      output: { focalLengthMm: expect.closeTo(8, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFocalLengthFromFovVr(null).ok).toBe(false));

  it("rejects zero-sized geometry", () => {
    expect(runFocalLengthFromFovVr({ fovDeg: 90, sensorWidthMm: 0 }).ok).toBe(
      false,
    );
  });
});
