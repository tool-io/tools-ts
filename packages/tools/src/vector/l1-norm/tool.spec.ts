import { describe, expect, it } from "vitest";
import { runL1Norm } from "./tool.js";
describe("Vector L1 Norm Calculator", () => {
  it("calculates a valid result", () => {
    expect(runL1Norm({ vector: [-1, 2, -3] })).toEqual({
      ok: true,
      output: { norm: 6 },
    });
  });
  it("rejects invalid input", () => expect(runL1Norm(null).ok).toBe(false));
});
