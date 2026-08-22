import { describe, expect, it } from "vitest";
import { runDivisorCount } from "./tool.js";

describe("Divisor Count Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDivisorCount({ value: 12 })).toEqual({
      ok: true,
      output: { divisors: 6 },
    });
    expect(runDivisorCount({ value: 1 })).toEqual({
      ok: true,
      output: { divisors: 1 },
    });
    expect(runDivisorCount({ value: 36 })).toEqual({
      ok: true,
      output: { divisors: 9 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDivisorCount(null).ok).toBe(false));
});
