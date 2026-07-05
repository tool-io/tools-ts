import { describe, expect, it } from "vitest";
import { runParityChecker } from "./tool.js";
describe("Integer Parity Checker", () => {
  it("calculates a valid result", () =>
    expect(runParityChecker({ value: 7 })).toEqual({
      ok: true,
      output: { even: false, parity: "odd" },
    }));
  it("rejects invalid input", () =>
    expect(runParityChecker(null).ok).toBe(false));
});
