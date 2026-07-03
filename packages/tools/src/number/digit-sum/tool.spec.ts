import { describe, expect, it } from "vitest";
import { runDigitSum } from "./tool.js";
describe("Digit Sum Calculator", () => {
  it("calculates a valid result", () =>
    expect(runDigitSum({ value: 1204 })).toEqual({
      ok: true,
      output: { sum: 7 },
    }));
  it("rejects invalid input", () => expect(runDigitSum(null).ok).toBe(false));
});
