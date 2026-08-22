import { describe, expect, it } from "vitest";
import { runFrustumVolume } from "./tool.js";

describe("Frustum Volume Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runFrustumVolume({ height: 9, radiusBottom: 4, radiusTop: 2 }),
    ).toEqual({
      ok: true,
      output: { volume: expect.closeTo(263.89378290154264, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runFrustumVolume(null).ok).toBe(false));
});
