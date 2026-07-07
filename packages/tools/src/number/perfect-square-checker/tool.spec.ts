import { describe, expect, it } from "vitest";
import { runPerfectSquareChecker } from "./tool.js";
describe("Perfect Square Checker", () => {
  it("calculates a valid result", () =>
    expect(runPerfectSquareChecker({ value: 81 })).toEqual({
      ok: true,
      output: { perfectSquare: true, root: 9 },
    }));
  it("rejects invalid input", () =>
    expect(runPerfectSquareChecker(null).ok).toBe(false));
});
