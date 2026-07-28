import { describe, expect, it } from "vitest";
import { minimumExample, runMinimum } from "./tool.js";
describe("Minimum Value Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMinimum({ values: [-2, 4, 1] })).toEqual({
      ok: true,
      output: { minimum: -2 },
    });
  });
  it("rejects invalid input", () => expect(runMinimum(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMinimum(minimumExample.input).ok).toBe(true));
});
