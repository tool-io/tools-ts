import { describe, expect, it } from "vitest";
import { runFovFromFocalLengthVr } from "./tool.js";

describe("FOV From Focal Length VR Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runFovFromFocalLengthVr({ focalLengthMm: 8, sensorWidthMm: 16 }),
    ).toEqual({
      ok: true,
      output: { fovDeg: expect.closeTo(90, 9) },
    });
  });

  it("narrows the FOV as focal length grows", () => {
    expect(
      runFovFromFocalLengthVr({ focalLengthMm: 16, sensorWidthMm: 16 }),
    ).toEqual({
      ok: true,
      output: { fovDeg: expect.closeTo(53.13010235415598, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFovFromFocalLengthVr(null).ok).toBe(false));

  it("rejects zero-sized geometry", () => {
    expect(
      runFovFromFocalLengthVr({ focalLengthMm: 8, sensorWidthMm: 0 }).ok,
    ).toBe(false);
  });
});
