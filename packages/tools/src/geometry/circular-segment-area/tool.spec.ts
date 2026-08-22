import { describe, expect, it } from "vitest";
import { runCircularSegmentArea } from "./tool.js";

describe("Circular Segment Area Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runCircularSegmentArea({ angleRadians: Math.PI / 2, radius: 2 }),
    ).toEqual({
      ok: true,
      output: { area: expect.closeTo(Math.PI - 2, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runCircularSegmentArea(null).ok).toBe(false));
});
