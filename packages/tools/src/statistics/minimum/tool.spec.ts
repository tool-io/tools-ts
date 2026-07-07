import { describe, expect, it } from "vitest";
import { runMinimum } from "./tool.js";
describe("Minimum Value Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMinimum({ values: [-2, 4, 1] })).toEqual({
      ok: true,
      output: { minimum: -2 },
    });
  });
  it("rejects invalid input", () => expect(runMinimum(null).ok).toBe(false));
});
