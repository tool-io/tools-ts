import { describe, expect, it } from "vitest";
import { runEllipsoidVolume } from "./tool.js";

describe("Ellipsoid Volume Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEllipsoidVolume({ semiAxisA: 2, semiAxisB: 3, semiAxisC: 4 }),
    ).toEqual({
      ok: true,
      output: { volume: expect.closeTo(100.53096491487338, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runEllipsoidVolume(null).ok).toBe(false));
});
