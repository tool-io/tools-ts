import { describe, expect, it } from "vitest";
import { runPerfectNumberChecker } from "./tool.js";

describe("Perfect Number Checker", () => {
  it("calculates a valid result", () => {
    expect(runPerfectNumberChecker({ value: 28 })).toEqual({
      ok: true,
      output: { perfect: true },
    });
    expect(runPerfectNumberChecker({ value: 6 })).toEqual({
      ok: true,
      output: { perfect: true },
    });
    expect(runPerfectNumberChecker({ value: 12 })).toEqual({
      ok: true,
      output: { perfect: false },
    });
    expect(runPerfectNumberChecker({ value: 1 })).toEqual({
      ok: true,
      output: { perfect: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runPerfectNumberChecker(null).ok).toBe(false));
});
