import { describe, expect, it } from "vitest";
import { runTetrahedronVolume } from "./tool.js";

describe("Regular Tetrahedron Volume Calculator", () => {
  it("calculates a valid result", () => {
    expect(runTetrahedronVolume({ edge: 1 })).toEqual({
      ok: true,
      output: { volume: expect.closeTo(0.11785113019775793, 15) },
    });
  });

  it("rejects invalid input", () =>
    expect(runTetrahedronVolume(null).ok).toBe(false));
});
