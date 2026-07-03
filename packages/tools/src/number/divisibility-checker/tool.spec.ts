import { describe, expect, it } from "vitest";
import { runDivisibilityChecker } from "./tool.js";
describe("Divisibility Checker", () => {
  it("calculates a valid result", () =>
    expect(runDivisibilityChecker({ dividend: 42, divisor: 7 })).toEqual({
      ok: true,
      output: { divisible: true },
    }));
  it("rejects invalid input", () =>
    expect(runDivisibilityChecker({ dividend: 1, divisor: 0 }).ok).toBe(false));
});
