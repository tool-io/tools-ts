import { describe, expect, it } from "vitest";
import { runProjection } from "./tool.js";
describe("Vector Projection Calculator", () => {
  it("calculates a valid result", () => {
    expect(runProjection({ vector: [2, 2], onto: [1, 0] })).toEqual({
      ok: true,
      output: { vector: [2, 0], scalar: 2 },
    });
  });
  it("rejects invalid input", () => expect(runProjection(null).ok).toBe(false));
});
