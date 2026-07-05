import { describe, expect, it } from "vitest";
import { runInverse } from "./tool.js";
describe("Inverse Proportion Calculator", () => {
  it("calculates a valid result", () => {
    expect(runInverse({ firstX: 4, firstY: 6, secondX: 8 })).toEqual({
      ok: true,
      output: { secondY: 3 },
    });
  });
  it("rejects invalid input", () => expect(runInverse(null).ok).toBe(false));
});
