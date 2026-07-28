import { describe, expect, it } from "vitest";
import { midrangeExample, runMidrange } from "./tool.js";
describe("Midrange Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMidrange({ values: [1, 3, 9] })).toEqual({
      ok: true,
      output: { midrange: 5 },
    });
  });
  it("rejects invalid input", () => expect(runMidrange(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMidrange(midrangeExample.input).ok).toBe(true));
});
