import { describe, expect, it } from "vitest";
import { runPyramidVolume } from "./tool.js";

describe("Square Pyramid Volume Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPyramidVolume({ baseEdge: 6, height: 10 })).toEqual({
      ok: true,
      output: { volume: 120 },
    });
  });

  it("rejects invalid input", () =>
    expect(runPyramidVolume(null).ok).toBe(false));
});
