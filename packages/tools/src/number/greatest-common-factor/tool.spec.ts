import { describe, expect, it } from "vitest";
import { runGreatestCommonFactor } from "./tool.js";
describe("Greatest Common Factor Calculator", () => {
  it("calculates a valid result", () =>
    expect(runGreatestCommonFactor({ first: 54, second: 24 })).toEqual({
      ok: true,
      output: { greatestCommonFactor: 6 },
    }));
  it("rejects invalid input", () =>
    expect(runGreatestCommonFactor(null).ok).toBe(false));
});
