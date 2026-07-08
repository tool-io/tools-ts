import { describe, expect, it } from "vitest";
import { runReverseDigits } from "./tool.js";
describe("Reverse Integer Digits Tool", () => {
  it("calculates a valid result", () =>
    expect(runReverseDigits({ value: -120 })).toEqual({
      ok: true,
      output: { reversed: -21 },
    }));
  it("rejects invalid input", () =>
    expect(runReverseDigits(null).ok).toBe(false));
});
