import { describe, expect, it } from "vitest";
import { runArmstrongChecker } from "./tool.js";

describe("Armstrong Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runArmstrongChecker({ value: 153 })).toEqual({
      ok: true,
      output: { armstrong: true },
    });
    expect(runArmstrongChecker({ value: 154 })).toEqual({
      ok: true,
      output: { armstrong: false },
    });
  });

  it("accepts single-digit numbers", () => {
    expect(runArmstrongChecker({ value: 5 })).toEqual({
      ok: true,
      output: { armstrong: true },
    });
  });

  it("rejects invalid input", () =>
    expect(runArmstrongChecker(null).ok).toBe(false));
});
