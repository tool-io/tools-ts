import { describe, expect, it } from "vitest";
import { runDoubleFactorial } from "./tool.js";
describe("Double Factorial Calculator", () => {
  it("calculates a valid result", () =>
    expect(runDoubleFactorial({ n: 7 })).toEqual({
      ok: true,
      output: { doubleFactorial: 105 },
    }));
  it("rejects invalid input", () =>
    expect(runDoubleFactorial(null).ok).toBe(false));
});
