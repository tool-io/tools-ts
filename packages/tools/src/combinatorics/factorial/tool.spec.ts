import { describe, expect, it } from "vitest";
import { runFactorial } from "./tool.js";
describe("Factorial Calculator", () => {
  it("calculates a valid result", () =>
    expect(runFactorial({ n: 6 })).toEqual({
      ok: true,
      output: { factorial: 720 },
    }));
  it("rejects invalid input", () => expect(runFactorial(null).ok).toBe(false));
});
