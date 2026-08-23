import { describe, expect, it } from "vitest";
import { runFieldOfViewVertical } from "./tool.js";

describe("Vertical Field of View Calculator", () => {
  it("calculates a valid result for a square display", () => {
    expect(
      runFieldOfViewVertical({ aspectRatio: 1, horizontalFovDeg: 90 }),
    ).toEqual({
      ok: true,
      output: { verticalFovDeg: expect.closeTo(90, 9) },
    });
  });

  it("narrows the vertical FOV on wide displays", () => {
    expect(
      runFieldOfViewVertical({ aspectRatio: 2, horizontalFovDeg: 120 }),
    ).toEqual({
      ok: true,
      output: { verticalFovDeg: expect.closeTo(81.7867892982618, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFieldOfViewVertical(null).ok).toBe(false));

  it("rejects invalid geometry", () => {
    expect(
      runFieldOfViewVertical({ aspectRatio: 0, horizontalFovDeg: 90 }).ok,
    ).toBe(false);
    expect(
      runFieldOfViewVertical({ aspectRatio: 1, horizontalFovDeg: 180 }).ok,
    ).toBe(false);
  });
});
