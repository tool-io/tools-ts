import { describe, expect, it } from "vitest";
import { runAbundantChecker } from "./tool.js";

describe("Abundant Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runAbundantChecker({ value: 12 })).toEqual({
      ok: true,
      output: { abundant: true },
    });
    expect(runAbundantChecker({ value: 6 })).toEqual({
      ok: true,
      output: { abundant: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runAbundantChecker(null).ok).toBe(false));
});
