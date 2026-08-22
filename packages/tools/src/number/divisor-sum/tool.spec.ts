import { describe, expect, it } from "vitest";
import { runDivisorSum } from "./tool.js";

describe("Divisor Sum Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDivisorSum({ value: 12 })).toEqual({
      ok: true,
      output: { sum: 28 },
    });
    expect(runDivisorSum({ value: 1 })).toEqual({
      ok: true,
      output: { sum: 1 },
    });
    expect(runDivisorSum({ value: 7 })).toEqual({
      ok: true,
      output: { sum: 8 },
    });
  });

  it("rejects invalid input", () => expect(runDivisorSum(null).ok).toBe(false));
});
