import { describe, expect, it } from "vitest";
import { runCoprimeChecker } from "./tool.js";
describe("Coprime Number Checker", () => {
  it("calculates a valid result", () =>
    expect(runCoprimeChecker({ first: 14, second: 25 })).toEqual({
      ok: true,
      output: { coprime: true, greatestCommonFactor: 1 },
    }));
  it("rejects invalid input", () =>
    expect(runCoprimeChecker(null).ok).toBe(false));
});
