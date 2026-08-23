import { describe, expect, it } from "vitest";
import { runFieldOfViewHorizontal } from "./tool.js";

describe("Horizontal Field of View Calculator", () => {
  it("calculates a valid result for a square display", () => {
    expect(
      runFieldOfViewHorizontal({ aspectRatio: 1, verticalFovDeg: 90 }),
    ).toEqual({
      ok: true,
      output: { horizontalFovDeg: expect.closeTo(90, 9) },
    });
  });

  it("widens the horizontal FOV on wide displays", () => {
    expect(
      runFieldOfViewHorizontal({ aspectRatio: 2, verticalFovDeg: 90 }),
    ).toEqual({
      ok: true,
      output: { horizontalFovDeg: expect.closeTo(126.86989764584402, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFieldOfViewHorizontal(null).ok).toBe(false));

  it("rejects invalid geometry", () => {
    expect(
      runFieldOfViewHorizontal({ aspectRatio: 0, verticalFovDeg: 90 }).ok,
    ).toBe(false);
    expect(
      runFieldOfViewHorizontal({ aspectRatio: 1, verticalFovDeg: 180 }).ok,
    ).toBe(false);
  });
});
