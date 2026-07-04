import { describe, expect, it } from "vitest";
import { runFractionalIntegerParts } from "./tool.js";
describe("Fractional and Integer Parts Calculator", () => {
  it("calculates a valid result", () =>
    expect(runFractionalIntegerParts({ value: 12.75 })).toEqual({
      ok: true,
      output: { integerPart: 12, fractionalPart: 0.75 },
    }));
  it("rejects invalid input", () =>
    expect(runFractionalIntegerParts(null).ok).toBe(false));
});
