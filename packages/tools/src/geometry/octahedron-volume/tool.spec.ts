import { describe, expect, it } from "vitest";
import { runOctahedronVolume } from "./tool.js";

describe("Regular Octahedron Volume Calculator", () => {
  it("calculates a valid result", () => {
    expect(runOctahedronVolume({ edge: 3 })).toEqual({
      ok: true,
      output: { volume: expect.closeTo(12.727922061357857, 12) },
    });
  });

  it("rejects invalid input", () =>
    expect(runOctahedronVolume(null).ok).toBe(false));
});
