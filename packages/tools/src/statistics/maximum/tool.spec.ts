import { describe, expect, it } from "vitest";
import { runMaximum } from "./tool.js";
describe("Maximum Value Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMaximum({ values: [-2, 4, 1] })).toEqual({
      ok: true,
      output: { maximum: 4 },
    });
  });
  it("rejects invalid input", () => expect(runMaximum(null).ok).toBe(false));
});
