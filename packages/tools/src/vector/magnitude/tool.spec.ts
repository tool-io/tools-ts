import { describe, expect, it } from "vitest";
import { runMagnitude } from "./tool.js";
describe("Vector Magnitude Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMagnitude({ vector: [3, 4] })).toEqual({
      ok: true,
      output: { magnitude: 5 },
    });
  });
  it("rejects invalid input", () => expect(runMagnitude(null).ok).toBe(false));
});
