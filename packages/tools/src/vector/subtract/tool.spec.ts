import { describe, expect, it } from "vitest";
import { runSubtract } from "./tool.js";
describe("Vector Subtraction Calculator", () => {
  it("calculates a valid result", () => {
    expect(runSubtract({ first: [3, 4], second: [1, 2] })).toEqual({
      ok: true,
      output: { vector: [2, 2] },
    });
  });
  it("rejects invalid input", () => expect(runSubtract(null).ok).toBe(false));
});
