import { describe, expect, it } from "vitest";
import { runHarshadChecker } from "./tool.js";

describe("Harshad Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runHarshadChecker({ value: 18 })).toEqual({
      ok: true,
      output: { harshad: true },
    });
    expect(runHarshadChecker({ value: 19 })).toEqual({
      ok: true,
      output: { harshad: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runHarshadChecker(null).ok).toBe(false));
});
