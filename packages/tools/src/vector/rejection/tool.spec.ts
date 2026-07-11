import { describe, expect, it } from "vitest";
import { runRejection } from "./tool.js";
describe("Vector Rejection Calculator", () => {
  it("calculates a valid result", () => {
    expect(runRejection({ vector: [2, 2], onto: [1, 0] })).toEqual({
      ok: true,
      output: { vector: [0, 2] },
    });
  });
  it("rejects invalid input", () => expect(runRejection(null).ok).toBe(false));
});
