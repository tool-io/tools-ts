import { describe, expect, it } from "vitest";
import { runSquareFreeChecker } from "./tool.js";

describe("Square-Free Checker", () => {
  it("calculates a valid result", () => {
    expect(runSquareFreeChecker({ value: 30 })).toEqual({
      ok: true,
      output: { squareFree: true },
    });
    expect(runSquareFreeChecker({ value: 12 })).toEqual({
      ok: true,
      output: { squareFree: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runSquareFreeChecker(null).ok).toBe(false));
});
